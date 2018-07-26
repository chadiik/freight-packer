
import Input from '../utils/cik/input/Input';
import Quality from '../utils/cik/Quality';
import Controller from '../scene/Controller';
import Renderer from '../scene/Renderer';
import Camera from '../scene/Camera';
import HUDView from './HUDView';
import UX from '../UX';
import Utils from '../utils/cik/Utils';

class SceneSetup {
    /**
     * 
     * @param {HTMLDivElement} containerDiv 
     * @param {UX} ux 
     */
    constructor(containerDiv, ux){
        this.domElement = containerDiv;
        this.ux = ux;
    }

    Init(){
        
        var quality = new Quality().Common(2);

        var units = this.ux.params.units;
        var controllerParams = {};
        this.sceneController = new Controller(controllerParams);

        var rendererParams = {clearColor: 0xafafaf, renderSizeMul: 1};
        Object.assign(rendererParams, quality);
        this.sceneRenderer = new Renderer(rendererParams);
        this.domElement.appendChild(this.sceneRenderer.renderer.domElement);

        /** @type {import('./Camera').CameraParams} */
        var cameraParams = {fov: 30, aspect: 1, near: 1 * units, far: 3000 * units};
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
            var hudParams = {ux: this.ux};
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
            fillLights: true,
            gridHelper: true,
        }

        // Initial camera move
		this.cameraController.position.x = 100 * units;
		this.cameraController.position.y = 40 * units;
        this.cameraController.position.z = 100 * units;
        this.cameraController.SetTarget(new THREE.Vector3());

        // Fill lights
        if(setupParams.fillLights){
            this.DefaultLights(this.sceneController);
            if(this.ux.params.hud){
                this.DefaultLights(this.hud);
            }
        }

        // Env
        if(setupParams.gridHelper){
            var gridHelper = new THREE.GridHelper(200 * units, 20);
            this.sceneController.AddDefault(gridHelper);
        }

        if(this.ux.params.configure){
            this.Configure();
        }

        return new Promise((resolve, reject) => {
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
                    hud.cameraController.Update();

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

    DefaultLights(controller){

        var units = this.ux.params.units;

        var ambient = new THREE.AmbientLight( 0x404040 );

        var directionalLight = new THREE.DirectionalLight(0xfeeedd);
        directionalLight.position.set(7 * units, 15 * units, 30 * units);
        
        controller.ambientContainer.add(ambient);
        controller.ambientContainer.add(directionalLight);
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
            var onGUIChanged = function(){
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
            var rotationProperties = Config.Unroll('#hudCam.rotation', 'x', 'y', 'z');
            var rotationControllers = Config.Controller.Multiple(rotationProperties, 0, 2 * Math.PI, 2 * Math.PI / 360);
            smart.Config(null, control, onGUIChanged, 
                'toggleOrbitOwner',
                'print',
                'hudCam.camera.fov', 
                ...Config.Unroll('#hudCam.position', 'x', 'y', 'z'), 
                ...rotationControllers
            );

            this.input.keyboard.on('s', function(){
                smart.Show();
            });


            console.log('HUDView config', smart.config.gui.list || smart);
        }
    }
}

export default SceneSetup;