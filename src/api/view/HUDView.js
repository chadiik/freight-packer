import Controller from "../scene/Controller";
import Camera from "../scene/Camera";
import Transform from "../scene/Transform";
import Utils from "../utils/cik/Utils";
import EntryInputView, { EntryInputViewParams } from "./EntryInputView";
import CargoEntry from "../components/common/CargoEntry";
import SceneSetup from "./SceneSetup";

/**
 * @typedef {Object} HUDViewParams
 * @property {import('../UX').default} ux
 * @property {SceneSetup} sceneSetup
 * @property {HTMLElement} container
 */

/** @type {HUDViewParams} */
const defaultParams = {};

// -11.3, 23.9, 215.5
const defaultCamTRS = new Transform( new THREE.Vector3(0, 100, 800), new THREE.Euler(0, Math.PI, 0) );

class HUDView extends Controller {
    /**
     * @param {HUDViewParams} params 
     * @param {import('../scene/Camera').CameraParams} cameraParams 
     */
    constructor(params, cameraParams){
        super(params);

        this.params = Utils.AssignUndefined(params, defaultParams);

        let units = this.params.ux.params.units;

        this.cameraController = new Camera(cameraParams);

        this.cameraTransform = defaultCamTRS.Clone();
        this.cameraTransform.position.multiplyScalar(units);
        this.cameraTransform.Apply(this.cameraController);
        this.cameraController.camera.updateMatrixWorld();
        this.cameraController.OrbitControls(this.params.container);
        this.cameraController.SetTarget(new THREE.Vector3());
        this.cameraController.Hold();

        //var gridHelper = new THREE.GridHelper(100 * units, 20);
        //this.AddDefault(gridHelper);

        /** @type {EntryInputViewParams} */
        let entryInputViewParams = {ux: this.params.ux, sceneSetup: this.params.sceneSetup, scaleFigure: this.params.ux.params.scaleRefFigure};
        this.entryInputView = new EntryInputView(entryInputViewParams);
        this.AddDefault(this.entryInputView.view);

        this.lastUpdateTime = 0;

        this.params.sceneSetup.input.onMouseUp.push(this.OnMouseUp.bind(this));
    }

    OnMouseUp(){
        if(this.entryInputView.previewing){
            this.entryInputView.Preview(false);
        }
    }

    /**
     * @param {CargoEntry} entry 
     */
    Preview(entry){
        this.entryInputView.Preview(entry);
    }

    /** @param {Number} now */
    Update(now){
        let deltaTime = now - this.lastUpdateTime;
        this.lastUpdateTime = now;
        this.cameraController.Update();
        
        this.entryInputView.Update(now, deltaTime);
    }
}

export default HUDView;