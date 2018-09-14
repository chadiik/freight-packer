import UX from "../UX";
import Camera from "../scene/Camera";
import Utils from "../utils/cik/Utils";
import CargoListView from "./CargoListView";
import NaNRecovery from "../utils/cik/NaNRecovery";

/** @typedef OrthoviewsNavigatorParams @property {UX} ux @property {Number} transitionDuration */
/** @type {OrthoviewsNavigatorParams} */
const defaultParams = {
    transitionDuration: 1
};

const orthoviews = {
    home: 'home',
    top: 'top',
    front: 'front',
    side: 'side'
};

var tempBox3 = new THREE.Box3(),
    tempVec3 = new THREE.Vector3(),
    tempCamOffset = new THREE.Vector3();

/** @type {import('../scene/Camera').FrameCoords} */
var tempCoords = {position: new THREE.Vector3(), center: new THREE.Vector3()};

const _cargoListView = Symbol('cargoListView'),
    _boundingView = Symbol('boundingView'),
    _recovery = Symbol('recovery');

class OrthoviewsNavigator{
    /** @param {Camera} cameraController @param {OrthoviewsNavigatorParams} params */
    constructor(cameraController, params){
        
        this.params = Utils.AssignUndefined(params, defaultParams);
        this.cameraController = cameraController;

        this.nanRecovery = new NaNRecovery(this.cameraController, 'position.x', 'position.y', 'position.z', 'rotation.x', 'rotation.y', 'rotation.z', 'camera.fov');

        const Smart = require('../utils/cik/config/Smart').default;

        let scope = this;
        let smart = new Smart(this.cameraController.camera, 'FOV');
        smart.MakeShortcut('Configure');
        function onChange(){
            scope.cameraController.camera.updateProjectionMatrix();
        }
        smart.Config(null, this.cameraController.camera, onChange, Smart.serializeModes.none,
            'fov'
        );
    }

    /** @param {THREE.Object3D} boundingView */
    set boundingView(value){
        this[_boundingView] = value;
    }

    get boundingView(){ return this[_boundingView]; }

    /** @param {CargoListView} value */
    set cargoListView(value){
        this[_cargoListView] = value;
    }

    get cargoListView(){ return this[_cargoListView]; }

    /** @param {orthoviews} viewType @param {Boolean} [changeFOV] true by default */
    Navigate(viewType, changeFOV){

        let neededRecovery = this.nanRecovery.AssertUpdateRecover();
        console.log('Navigating to: ' + viewType + (neededRecovery ? ', recovered from NaN.' : '.'));

        const duration = 1;

        var distanceMultiplier = .3;
        if(changeFOV === undefined) changeFOV = true;
        var fov = changeFOV ? 8 : this.params.ux.params.fov;
        var slideDown = true;

        tempBox3.setFromObject(this.boundingView);
        
        let orientation = tempCamOffset;
        switch(viewType){
            case orthoviews.home:  
                orientation.set(1, -1, 1);
                fov = this.params.ux.params.fov;
                distanceMultiplier = .5;
                break;

            case orthoviews.top:
                orientation.set(0.01, -1, 0);
                distanceMultiplier = .3;
                break;

            case orthoviews.front:
                this.cargoListView.SlideUp(tempBox3.max.y + 40 * this.params.ux.params.units, duration);
                distanceMultiplier = .2;
                slideDown = false;
                orientation.set(0, 0, 1);
                break;

            case orthoviews.side:
                distanceMultiplier = .3;
                orientation.set(1, 0, 0);
                break;
        }

        if(slideDown) this.cargoListView.SlideDown(duration);

        this.cameraController.TransitionToFOV(duration * 1.5, fov);

        let endCoords = this.cameraController.CalcFrameCoords(tempBox3, distanceMultiplier, orientation, fov);
        this.cameraController.TransitionFromToCoords(this.params.transitionDuration, undefined, endCoords);
    }

    static get orthoviews(){
        return orthoviews;
    }
}

export default OrthoviewsNavigator;