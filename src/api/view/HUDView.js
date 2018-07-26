import Controller from "../scene/Controller";
import Camera from "../scene/Camera";
import Transform from "../scene/Transform";
import Utils from "../utils/cik/Utils";

/**
 * @typedef {Object} HUDViewParams
 * @property {import('../UX').default} ux
 */

/** @type {HUDViewParams} */
const defaultParams = {};

// -11.3, 23.9, 215.5
const defaultCamTRS = new Transform( new THREE.Vector3(0, 80, 400), new THREE.Euler(-0.1, 0, 0) );

class HUDView extends Controller {
    /**
     * @param {HUDViewParams} params 
     * @param {import('../scene/Camera').CameraParams} cameraParams 
     */
    constructor(params, cameraParams){
        super(params);

        this.params = Utils.AssignUndefined(params, defaultParams);

        var units = this.params.ux.params.units;

        this.cameraController = new Camera(cameraParams);

        this.cameraTransform = defaultCamTRS.Clone();
        this.cameraTransform.position.multiplyScalar(units);
        this.cameraTransform.Apply(this.cameraController);
        this.cameraController.camera.updateMatrixWorld();

        //var gridHelper = new THREE.GridHelper(100 * units, 20);
        //this.AddDefault(gridHelper);
    }
}

export default HUDView;