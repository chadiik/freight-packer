
/**
 * @typedef {Object} CameraParams
 * @property {Number} fov
 * @property {Number} aspect
 * @property {Number} near
 * @property {Number} far
 */

class Camera {
    /**
     * @param {CameraParams} params 
     */
    constructor(params){
        this.params = params;

        this.camera = new THREE.PerspectiveCamera(this.params.fov, this.params.aspect, this.params.near, this.params.far);
        this.camera.name = 'UserCamera';
    }

    get position(){ return this.camera.position; }
    set position(value){ this.camera.position.copy(value); }
    get rotation(){ return this.camera.rotation; }
    set rotation(value){ this.camera.rotation.copy(value); }

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

            this.orbitControls = new THREE.OrbitControls(this.camera, container);
            this.orbitControls.target = lookTarget;
            
            var scope = this;
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
                this.enabled = false;
            };
            this.orbitControls.Release = function(){
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

    SetTarget(position){
        if(this.controls instanceof THREE.OrbitControls){
            this.controls.target.copy(position);
        }
        else {
            console.warn('SetTarget not implemented for control type:', this.controls);
        }
    }

    Update(){
        if(this.controls !== undefined){
            this.controls.Update();
        }
    }

    Hold(){
        if(this.controls !== undefined && this.controls.Hold){
            this.controls.Hold();
        }
    }

    Release(){
        if(this.controls !== undefined && this.controls.Release){
            this.controls.Release();
        }
    }

    /**
     * @returns {Boolean}
     */
    get enabled(){
        return this.controls.enabled;
    }
}

export default Camera;