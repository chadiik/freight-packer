import Tween from "../utils/cik/Tween";
import Signaler from "../utils/cik/Signaler";

require('../../min-dependencies/lib/three/controls/OrbitControls');

const epsilon = Math.pow(2, -52);

/**
 * @typedef {Object} CameraParams
 * @property {Number} fov
 * @property {Number} aspect
 * @property {Number} near
 * @property {Number} far
 */

/** @typedef FrameCoords @property {THREE.Vector3} position @property {THREE.Vector3} center */

/** @type {FrameCoords} */
var tempCoords = {};
/** @type {FrameCoords} */
var ownCoords = {position: new THREE.Vector3(), center: new THREE.Vector3()};

var tempVec3 = new THREE.Vector3(),
    tempVec3_b = new THREE.Vector3();

const signals = {
    change: 'change',
    userChange: 'userChange'
};

class Camera extends Signaler {
    /**
     * @param {CameraParams} params 
     */
    constructor(params){
        super();

        this.params = params;

        this.camera = new THREE.PerspectiveCamera(this.params.fov, this.params.aspect, this.params.near, this.params.far);
        this.camera.name = 'UserCamera';

        this.changed = false;

        this.dollyAnimation = {
            enabled: false,
            position: Tween.Combo.RequestN(Tween.functions.ease.easeInOutQuad, .5, 0, 0, 0, 0, 0, 0),
            lookAt: Tween.Combo.RequestN(Tween.functions.ease.easeInOutQuad, .5, 0, 0, 0, 0, 0, 0)
        };

        let scope = this;
        function onDollyAnimationComplete(){
            scope.dollyAnimation.enabled = false;
        }
        this.dollyAnimation.position.onComplete = onDollyAnimationComplete;
        this.dollyAnimation.lookAt.onComplete = onDollyAnimationComplete;

        this.dollyAnimation.position.Hook(this.position, 'x', 'y', 'z');

        this.fovAnimation = {
            enabled: false,
            fov: new Tween(Tween.functions.ease.easeInOutQuad, 0, 0, 0)
        };

        function onFOVAnimationComplete(){
            scope.fovAnimation.enabled = false;
        }
        this.fovAnimation.fov.onComplete = onFOVAnimationComplete;
        this.fovAnimation.fov.Hook(this.camera, 'fov');
    }

    get position(){ return this.camera.position; }
    set position(value){ this.camera.position.copy(value); this.changed = true; }
    get rotation(){ return this.camera.rotation; }
    set rotation(value){ this.camera.rotation.copy(value); this.changed = true; }

    FirstPersonControls(container, params){
        if(this.fpsControls === undefined && container !== undefined){
            this.fpsControls = new App.Navigation.FirstPerson(this.camera, container);

            this.fpsControls.Hold = function(){
                this.enabled = false;
            };
            this.fpsControls.Release = function(){
                this.enabled = true;
            };
        }
        
        if(this.fpsControls !== undefined){
            if(params !== undefined){
                this.fpsControls.speed.set(params.speedX, params.speedY);
                this.fpsControls.damping = params.damping;
                this.fpsControls.momentum = params.momentum;
                this.fpsControls.limitPhi = params.limitPhi;
                this.fpsControls.moveSpeed = params.moveSpeed;
                this.fpsControls.keyControls = true;
            }

            this.controls = this.fpsControls;
        }
    }

    OrbitControls(container, params){
        if(this.orbitControls === undefined && container !== undefined){

            var lookTarget = new THREE.Vector3();
            this.camera.getWorldDirection(lookTarget);
            lookTarget.multiplyScalar(200).add(this.camera.position);

            /** @type {THREE.EventDispatcher} */
            this.orbitControls = new THREE.OrbitControls(this.camera, container);
            this.orbitControls.target.copy(lookTarget);

            this.dollyAnimation.lookAt.Hook(this.orbitControls.target, 'x', 'y', 'z');

            let scope = this;
            this.orbitControls.addEventListener('change', function(e){
                scope.changed = true;
            });
            this.orbitControls.addEventListener('start', function(e){
                scope.Dispatch(signals.userChange);
            });
            
            this.orbitControls.Update = function(){
                if(this.enabled){
                    if(this.object.position.distanceTo(this.target) < 50){
                        var v = new THREE.Vector3().subVectors(this.target, this.object.position).multiplyScalar(.5);
                        this.target.add(v);
                    }
                    this.update();
                }
            };
            this.orbitControls.Hold = function(){
                this.saveState();
                this.enabled = false;
            };
            this.orbitControls.Release = function(){
                this.reset();
                this.enabled = true;
            };
        }

        
        params = params || {
            maxDistance: 9000.0 * /*units*/1,
            maxPolarAngle: Math.PI * 0.895
        }
        if(params !== undefined){
            this.orbitControls.maxDistance = params.maxDistance;
            this.orbitControls.maxPolarAngle = params.maxPolarAngle;
            this.orbitControls.autoRotate = false;
        }

        this.controls = this.orbitControls;
    }

    ToggleControls(){
        this.Hold();

        if(this.controls === this.orbitControls){
            if(this.fpsControls){
                this.fpsControls.LerpRotation(this.camera, 1);
                this.FirstPersonControls();
            }
        }
        else{
            if(this.orbitControls){
                this.OrbitControls();

                // target
                var maxDistance = 100;

                var point = new THREE.Vector3(0, 0, -1);
                var quat = new THREE.Quaternion();
                point.applyQuaternion(this.camera.getWorldQuaternion(quat)).normalize().multiplyScalar(maxDistance * .5).add(this.camera.position);

                this.SetTarget(point);
            }
        }

        this.Release();
    }

    /** @param {THREE.Vector3} position */
    SetTarget(position){
        if(this.controls instanceof THREE.OrbitControls){
            this.controls.target.copy(position);
            this.changed = true;
        }
        else {
            console.warn('SetTarget not implemented for control type:', this.controls);
        }
    }

    /** @returns {THREE.Vector3} */
    GetTarget(){
        if(this.controls instanceof THREE.OrbitControls){
            return this.controls.target;
        }
        else {
            console.warn('GetTarget not implemented for control type:', this.controls);
        }
    }

    Update(){
        if(this.dollyAnimation.enabled){
            this.dollyAnimation.position.Update();
            this.dollyAnimation.lookAt.Update();
            this.changed = true;
        }

        if(this.fovAnimation.enabled){
            this.fovAnimation.fov.Update();
            this.camera.updateProjectionMatrix();
            this.changed = true;
        }

        if(this.controls !== undefined){
            this.controls.Update();
        }
    }

    Hold(){
        if(this.enabled && this.controls !== undefined && this.controls.Hold){
            this.controls.Hold();
        }
    }

    Release(){
        if(!this.enabled && this.controls !== undefined && this.controls.Release){
            this.controls.Release();
        }
    }

    /**
     * @param {THREE.Box3} box3 
     * @param {Number} [distanceMultiplier]
     * @param {THREE.Vector3} [orientation]
     * @param {Number} [fov] fov in degrees
     * @returns {FrameCoords}
     */
    CalcFrameCoords(box3, distanceMultiplier, orientation, fov){
       if(distanceMultiplier === undefined) distanceMultiplier = .75;

       fov = (fov || this.camera.fov) * (Math.PI / 180);

       let extent = tempVec3;
       box3.getSize(extent);
       let frameSize = Math.max(extent.x, extent.y, extent.z, 1);
       let distance = Math.abs(frameSize / Math.sin(fov / 2)) * distanceMultiplier;
       
       let center = tempVec3_b;
       box3.getCenter(center);
       
       let position = tempVec3;
       orientation = orientation ? orientation : position.subVectors(this.camera.position, center); 
       position.copy(orientation).normalize().multiplyScalar(distance).add(center);
       position.y = Math.abs(position.y);

       tempCoords.position = position;
       tempCoords.center = center;
       return tempCoords;
    }

    /**
     * @param {THREE.Box3} box3 
     * @param {Number} [distanceMultiplier]
     */
    Frame(box3, distanceMultiplier){
        let coords = this.CalcFrameCoords(box3, distanceMultiplier);

        this.camera.position.copy(coords.position);
        this.SetTarget(coords.center);
    }

    /**
     * @param {Number} duration
     * @param {THREE.Box3} box3 
     * @param {Number} [distanceMultiplier]
     */
    TransitionToFrame(duration, box3, distanceMultiplier){
        let endCoords = this.CalcFrameCoords(box3, distanceMultiplier);
        this.TransitionFromToCoords(duration, undefined, endCoords);
    }

    /**
     * @param {Number} duration
     * @param {FrameCoords} startCoords 
     * @param {FrameCoords} endCoords 
     */
    TransitionFromToCoords(duration, startCoords, endCoords){

        if(!startCoords){
            startCoords = ownCoords;
            startCoords.position.copy(this.position);
            startCoords.center.copy(this.orbitControls.target);
        }

        this.dollyAnimation.position.SetDurations(duration, duration, duration);
        this.dollyAnimation.lookAt.SetDurations(duration, duration, duration);

        let p = startCoords.position;
        this.dollyAnimation.position.SetStartValues(p.x, p.y, p.z);
        let tp = endCoords.position;
        this.dollyAnimation.position.SetDeltas(tp.x - p.x, tp.y - p.y, tp.z - p.z);

        p = startCoords.center;
        this.dollyAnimation.lookAt.SetStartValues(p.x, p.y, p.z);
        tp = endCoords.center;
        this.dollyAnimation.lookAt.SetDeltas(tp.x - p.x, tp.y - p.y, tp.z - p.z);

        this.dollyAnimation.position.Restart();
        this.dollyAnimation.lookAt.Restart();
        this.dollyAnimation.enabled = true;
    }

    /** @param {Number} duration @param {Number} fov */
    TransitionToFOV(duration, fov){
        let deltaFOV = fov - this.camera.fov;
        if(Math.abs(deltaFOV) < epsilon) return;

        this.fovAnimation.fov.duration = duration;
        this.fovAnimation.fov.startValue = this.camera.fov;
        this.fovAnimation.fov.delta = deltaFOV;
        this.fovAnimation.fov.Restart();
        this.fovAnimation.enabled = true;
    }

    /**
     * @returns {Boolean}
     */
    get enabled(){
        return this.controls && this.controls.enabled;
    }

    static get signals(){
        return signals;
    }
}

export default Camera;