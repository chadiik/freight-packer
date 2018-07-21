import Controller from "../scene/Controller";
import Camera from "../scene/Camera";
import Transform from "../scene/Transform";

// -11.3, 23.9, 215.5
const defaultCamTRS = new Transform( new THREE.Vector3(0, 80, 400), new THREE.Euler(-0.1, 0, 0) );

class HUDView extends Controller {
    constructor(params, cameraParams){
        super(params);

        var units = this.params.units;

        this.cameraController = new Camera(cameraParams);

        this.cameraTransform = defaultCamTRS.Clone();
        this.cameraTransform.position.multiplyScalar(units);
        this.cameraTransform.Apply(this.cameraController);
        this.cameraController.camera.updateMatrixWorld();

        var gridHelper = new THREE.GridHelper(100 * units, 20);
        this.AddDefault(gridHelper);
    }
}

export default HUDView;