
import Input from '../utils/cik/input/Input';
import Quality from '../utils/cik/Quality';
import Controller from '../scene/Controller';
import Renderer from '../scene/Renderer';
import Camera from '../scene/Camera';
import HUDView from './HUDView';
import UX from '../UX';
import Utils from '../utils/cik/Utils';
import Signaler from '../utils/cik/Signaler';

const signals = {
    init: 'init',
    started: 'started',
    paused: 'paused',
    stopped: 'stopped'
};

class SceneSetup extends Signaler {
    /**
     * 
     * @param {HTMLDivElement} containerDiv 
     * @param {UX} ux 
     */
    constructor(containerDiv, ux){
        super();
        
        this.domElement = containerDiv;
        this.ux = ux;
    }

    Init(){
        
        var quality = new Quality().Common(2);

        var units = this.ux.params.units;
        var controllerParams = {};
        this.sceneController = new Controller(controllerParams);

        /** @type {import('../scene/Renderer').RendererParams} */
        var rendererParams = {clearColor: this.ux.params.backgroundColor};
        Object.assign(rendererParams, quality);
        this.sceneRenderer = new Renderer(rendererParams);
        this.sceneRenderer.renderer.toneMappingExposure = 1.6;
        this.domElement.appendChild(this.sceneRenderer.renderer.domElement);

        /** @type {import('./Camera').CameraParams} */
        var cameraParams = {fov: this.ux.params.fov, aspect: 1, near: 1 * units, far: 6000 * units};
        this.cameraController = new Camera(cameraParams);
        this.cameraController.OrbitControls(this.sceneRenderer.renderer.domElement);

        this.input = new Input(this.domElement);
        this.input.camera = this.cameraController.camera;

        var sceneRendererRef = this.sceneRenderer;
        var appCameraRef = this.cameraController.camera;
        this.input.onResize.push(function(screen){
            sceneRendererRef.ReconfigureViewport(screen, appCameraRef);
        });

        // hud
        if(this.ux.params.hud){
            /** @type {import('../view/HUDView').HUDViewParams} */
            var hudParams = {ux: this.ux, sceneSetup: this, container: this.sceneRenderer.renderer.domElement};
            /** @type {import('./Camera').CameraParams} */
            var hudCameraParams = Utils.AssignUndefined({fov: 15}, cameraParams);
            this.hud = new HUDView(hudParams, hudCameraParams);
            var hudCameraRef = this.hud.cameraController.camera;
            this.input.onResize.push(function(screen){
                sceneRendererRef.AdjustCamera(screen, hudCameraRef);
            });

            this.sceneRenderer.renderer.autoClear = false;
        }
        // /hud

        // Comeplete setup
        var setupParams = {
            gridHelper: false,
        }

        // Initial camera move
		this.cameraController.position.x = 100 * units;
		this.cameraController.position.y = 100 * units;
        this.cameraController.position.z = 100 * units;
        this.cameraController.SetTarget(new THREE.Vector3());

        // Env
        if(setupParams.gridHelper){
            var gridHelper = new THREE.GridHelper(200 * units, 20);
            this.sceneController.AddDefault(gridHelper);
        }

        if(this.ux.params.configure){
            this.Configure();
        }

        var scope = this;
        return new Promise((resolve, reject) => {
            scope.Dispatch(signals.init);
            resolve();
        });
    }

    Start(){
        if(this.Update === undefined){
            let scope = this;
            let sceneRenderer = this.sceneRenderer;
            let scene1 = this.sceneController.scene,
                camera1 = this.cameraController.camera;
                
            if(this.ux.params.hud){
                let hud = this.hud;
                let scene2 = hud.scene,
                    camera2 = hud.cameraController.camera;
            
                this.Update = function(timestamp){
                    scope.animationFrameID = requestAnimationFrame(scope.Update);

                    scope.input.Update();
                    scope.cameraController.Update();
                    hud.Update(timestamp);

                    sceneRenderer.renderer.clear();
                    sceneRenderer.Render(scene1, camera1);
                    sceneRenderer.renderer.clearDepth();
                    sceneRenderer.Render(scene2, camera2);
                };
            }
            else{
                this.Update = function(timestamp){
                    scope.animationFrameID = requestAnimationFrame(scope.Update);

                    scope.input.Update();
                    scope.cameraController.Update();

                    sceneRenderer.Render(scene1, camera1);
                };
            }
        }

        this.Update();
        this.input.screenNeedsUpdate = true;
        this.input.cameraNeedsUpdate = true;

        this.Dispatch(signals.started);
    }

    Pause(){
        if(this.animationFrameID){
            cancelAnimationFrame(this.animationFrameID);
        }

        this.Dispatch(signals.paused);
    }

    Stop(){
        if(this.animationFrameID){
            cancelAnimationFrame(this.animationFrameID);
        }
        this.input.Dispose();
        this.sceneRenderer.Dispose();

        this.Dispatch(signals.stopped);
    }

    static get signals(){
        return signals;
    }

    DefaultLights(controller, configure, helpers){

        var units = this.ux.params.units;

        var ambientLight = new THREE.AmbientLight( 0x404040 );

        var directionalLight = new THREE.DirectionalLight(0xfeeedd);
        directionalLight.position.set(300 * units, 300 * units, 125 * units);
        
        controller.ambientContainer.add(ambientLight);
        controller.ambientContainer.add(directionalLight);

        var directionalLightComplem = new THREE.DirectionalLight(0xfeeedd);
        directionalLightComplem.position.set(-200 * units, 175 * units, 125 * units);
        
        controller.ambientContainer.add(directionalLightComplem);

        if(this.ux.params.configure && configure){
            let Smart = require('../utils/cik/config/Smart').default;
            let Config = require('../utils/cik/config/Config').default;
            let Control3D = require('../utils/cik/config/Control3D').default;

            let dl = directionalLight;
            let smart = new Smart(dl, 'Directional light');
            smart.MakeShortcut('Configure');
            
            let lightController = ['color', 'intensity', 'castShadow'];
            let shadowControllers = ['shadow.bias', 'shadow.radius', 'shadow.mapSize.x', 'shadow.mapSize.y'];
            //let sc = dl.shadow.camera as THREE.OrthographicCamera;
            let shadowCameraControllers = Config.Unroll('#shadow.camera', 'left', 'top', 'right', 'bottom', 'near', 'far');

            let dlHelper, dlCameraHelper;
            if(helpers){
                dlHelper = new THREE.DirectionalLightHelper(dl, 5);
                this.sceneController.AddDefault(dlHelper);
                dlCameraHelper = new THREE.CameraHelper(dl.shadow.camera);
                this.sceneController.AddDefault(dlCameraHelper);
            }

            let sceneRenderer = this.sceneRenderer;
            global.sceneRenderer = sceneRenderer;
            let mapSize = dl.shadow.mapSize.clone();
            function onGUIChanged(){
                dl.shadow.camera.updateProjectionMatrix();
                sceneRenderer.UpdateShadowMaps();
                if(dl.shadow.map){
                    if(dl.shadow.mapSize.manhattanDistanceTo(mapSize) > 0.0001){
                        mapSize.copy(dl.shadow.mapSize);
                        dl.shadow.map.dispose();
                        dl.shadow.map = null;
                    }
                }

                if(helpers){
                    dlHelper.update();
                    dlCameraHelper.update();
                }
            }

            smart.Config('Directional light + shadow', dl, onGUIChanged, Smart.serializeModes.json,
                ...lightController,
                ...shadowControllers,
                ...shadowCameraControllers
            );
        }

        return [ambientLight, directionalLight, directionalLightComplem];
    }

    Configure(){

        var Smart = require('../utils/cik/config/Smart').default;
        var Config = require('../utils/cik/config/Config').default;
        var Control3D = require('../utils/cik/config/Control3D').default;

        var scope = this;

        var appControl3D = Control3D.Configure('app', this.cameraController.camera, this.sceneRenderer.renderer.domElement);
        this.sceneController.AddDefault(appControl3D.control);

        if(this.ux.params.hud){
            var hudControl3D = Control3D.Configure('hud', this.hud.cameraController.camera, this.sceneRenderer.renderer.domElement);
            this.hud.AddDefault(hudControl3D.control);

            var hud = this.hud;
            function onGUIChanged(){
                console.log('Camera changed');
            }

            var toggle = false;
            var control = {
                toggleOrbitOwner: function(){
                    if(toggle){
                        if(!hud.cameraController.orbitControls){
                            hud.cameraController.OrbitControls(scope.sceneRenderer.renderer.domElement);
                        }
                        scope.cameraController.Hold();
                        hud.cameraController.Release();
                    }
                    else{
                        scope.cameraController.Release();
                        hud.cameraController.Hold();
                    }
                    toggle = !toggle;
                },
                hudCam: hud.cameraController,
                print: function(){
                    smart.config.Update();
                    console.group('hudCam properties');
                    console.log('position', Utils.VecToString(hud.cameraController.position, 1));
                    console.log('rotation', Utils.VecToString(hud.cameraController.rotation, 3));
                    console.groupEnd();
                }
            };

            control.toggleOrbitOwner();
            
            var smart = new Smart(this, 'HUDView');
            smart.MakeShortcut('Configure');
            var rotationProperties = Config.Unroll('#hudCam.rotation', 'x', 'y', 'z');
            var rotationControllers = Config.Controller.Multiple(rotationProperties, 0, 2 * Math.PI, 2 * Math.PI / 360);
            smart.Config(null, control, onGUIChanged, Smart.serializeModes.none,
                'toggleOrbitOwner',
                'print',
                'hudCam.camera.fov', 
                ...Config.Unroll('#hudCam.position', 'x', 'y', 'z'), 
                ...rotationControllers
            );

            console.log('HUDView config', smart.config.gui.list || smart);
        }
    }
}

export default SceneSetup;