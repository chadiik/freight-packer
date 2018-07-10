
import Input from '../utils/cik/input/Input';
import Quality from '../utils/cik/Quality';
import Controller from './Controller';
import Renderer from './Renderer';
import Camera from './Camera';

class SceneSetup {
    constructor(containerDiv){
        this.domElement = containerDiv;
    }

    Init(){
        
        var quality = new Quality().Common(2);

        var units = 1;
        var controllerParams = {units: units};
        this.sceneController = new Controller(controllerParams);

        var cameraParams = {fov: 65, aspect: 1, near: 0.01 * units, far: 1000 * units, id: 'app'};
        this.cameraController = new Camera(cameraParams);
        this.cameraController.OrbitControls(this.domElement);

        var rendererParams = {clearColor: 0xafafaf, renderSizeMul: 1};
        Object.assign(rendererParams, quality);
        this.sceneRenderer = new Renderer(rendererParams);
        this.domElement.appendChild(this.sceneRenderer.renderer.domElement);
        this.sceneRenderer.UseCamera(this.cameraController.camera);

        this.input = new Input(this.domElement);
        this.input.camera = this.cameraController.camera;
        this.input.onResize.push(this.sceneRenderer.ReconfigureViewport.bind(this.sceneRenderer));

        // Comeplete setup
        var setupParams = {
            fillLights: true,
            gridHelper: true,

        }

        // Initial camera move
		this.cameraController.position.x = 100 * units;
		this.cameraController.position.y = 40 * units;
        this.cameraController.position.z = -100 * units;
        this.cameraController.SetTarget(new THREE.Vector3());

        // Fill lights
        if(setupParams.fillLights){
            this.DefaultLights(this.sceneController);
        }

        // Env
        if(setupParams.gridHelper){
            var gridHelper = new THREE.GridHelper(200 * units, 20);
            this.sceneController.AddDefault(gridHelper);
        }

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    Start(){
        if(this.Update === undefined){
            var scope = this;
            this.Update = function(timestamp){
                scope.animationFrameID = requestAnimationFrame(scope.Update);

                scope.input.Update();
                scope.cameraController.Update();
                scope.sceneRenderer.Render(scope.sceneController.scene);

            };
        }

        this.Update();
    }

    Pause(){
        if(this.animationFrameID){
            cancelAnimationFrame(this.animationFrameID);
        }
    }

    Stop(){
        if(this.animationFrameID){
            cancelAnimationFrame(this.animationFrameID);
        }
        this.input.Dispose();
        this.sceneRenderer.Dispose();
    }

    DefaultLights(){

        var units = this.sceneController.params.units;

        var ambient = new THREE.AmbientLight( 0x404040 );

        var directionalLight = new THREE.DirectionalLight(0xfeeedd);
        directionalLight.position.set(7 * units, 15 * units, 30 * units);
        
        this.sceneController.ambientContainer.add(ambient);
        this.sceneController.ambientContainer.add(directionalLight);
    }
}

export default SceneSetup;