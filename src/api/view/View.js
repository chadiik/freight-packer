import CargoListView from "./CargoListView";
import Packer from "../packer/Packer";
import CargoList from "../packer/CargoList";
import PackingSpaceView from "./PackingSpaceView";
import PackingSpace from "../packer/PackingSpace";
import SceneSetup from "../view/SceneSetup";
import Utils3D from "../utils/cik/Utils3D";
import Utils from "../utils/cik/Utils";
import PackResultView from "./PackResultView";
import UpdateComponent from "../utils/cik/input/UpdateComponent";
import Container from "../packer/container/Container";

/**
 * @typedef {Object} ViewParams
 * @property {import('../UX').default} ux
 * @property {Object} cargoListView
 * @property {import('../utils/cik/Utils3D').IPoint} cargoListView.bottomLeft
 * @property {import('./CargoListView').CargoListViewParams} cargoListView.params
 * @property {Object} packResultView
 * @property {import('./PackResultView').PackResultViewParams} packResultView.params
 */

 /** @type {ViewParams} */
const defaultParams = {
    ux: undefined,
    cargoListView: {
        bottomLeft: { x: 100, y: 100 },
        params: {}
    },
    packResultView: {
        params: {}
    }
};

var tempVec = new THREE.Vector3();

class View {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {SceneSetup} sceneSetup 
     * @param {ViewParams} params 
     */
    constructor(packer, sceneSetup, params){
        this.sceneSetup = sceneSetup;
        this.params = Utils.AssignUndefined(params, defaultParams);

        var scope = this;

        // Fill lights
        if(true){
            let lights = this.sceneSetup.DefaultLights(this.sceneSetup.sceneController, true, false);

            let dl = lights.filter(light => light instanceof THREE.DirectionalLight)[0];
            let dlData = {"color":"0xfeeedd","intensity":1,"castShadow":true,"shadow.bias":0.001,"shadow.radius":1,"shadow.mapSize.x":2048,"shadow.mapSize.y":2048,"shadow.camera.left":-400,"shadow.camera.top":400,"shadow.camera.right":400,"shadow.camera.bottom":-400,"shadow.camera.near":1,"shadow.camera.far":1000};
            let Config = require('../utils/cik/config/Config').default;
            Config.Load(dl, dlData);

            if(this.sceneSetup.ux.params.hud){
                this.sceneSetup.DefaultLights(this.sceneSetup.hud);
            }
        }

        // Packing space
        this.packingSpaceView = new PackingSpaceView();
        this.sceneSetup.sceneController.AddDefault(this.packingSpaceView.view);
        /** @param {Container} container */
        function onContainerAdded(container){
            /** @type {THREE.Box3} */
            let box3;
            container.volumes.forEach(volume => {
                if(box3 === undefined)
                    box3 = volume.box3;
                else
                    box3.union(volume.box3);
            });
            scope.sceneSetup.cameraController.Frame(box3, .7);
            scope.packingSpaceView.Add(container);
        }
        packer.packingSpace.On(PackingSpace.signals.containerAdded, onContainerAdded);

        // Cargo list
        this.params.cargoListView.params.ux = this.params.ux;
        this.cargoListView = new CargoListView(this.params.cargoListView.params);
        var onCargoGroupAdded = this.cargoListView.Add.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.groupAdded, onCargoGroupAdded);
        var onCargoRemoved = this.cargoListView.Remove.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.groupRemoved, onCargoRemoved);

        // Cargo list display
        if(this.params.ux.params.hud){    
            this.sceneSetup.hud.Add(this.cargoListView.templatesView);
            this.HUDSetup();
        }

        // Packing result
        this.params.packResultView.params.ux = this.params.ux;
        this.packResultView = new PackResultView(this.cargoListView, this.packingSpaceView, this.params.packResultView.params);
        this.sceneSetup.sceneController.AddDefault(this.packResultView.view);

        var onPackUpdate = this.packResultView.DisplayPackingResult.bind(this.packResultView);
        packer.On(Packer.signals.packUpdate, onPackUpdate);

        var updateComponent = new UpdateComponent(true, 1/30, this.Update.bind(this));
        this.sceneSetup.input.updateComponents.push(updateComponent);

        if(this.params.ux.params.configure){
            this.Configure();
        }
    }

    /** @param {Number} now */
    Update(now){
        this.packResultView.Update();
    }

    HUDSetup(){
        var units = this.params.ux.params.units;
        var input = this.sceneSetup.input;
        var hud = this.sceneSetup.hud;
        var clv = this.cargoListView;
        var scope = this;

        var cargoListViewRect = new Utils3D.Rect(0, 0, 150, input.screen.height);
        var clvRectIgnore = cargoListViewRect.Clone();
        clvRectIgnore.Offset(input.screen.left, input.screen.top);

        var min = -1, max = 1;
        var v = new THREE.Vector3(),
            viewportPointA = new THREE.Vector2(),
            viewportPointB = new THREE.Vector2();
        var dragOffset = 0;

        // 
        
        /**
         * @param {import('./CargoListView').SortResult} sortResult
         */
        function onSort(sortResult){
            if(sortResult.cargoes > 0){
                Utils3D.Project(v.set(0, sortResult.min, 0), hud.cameraController.camera, input.screen, viewportPointA);
                Utils3D.Project(v.set(0, sortResult.max, 0), hud.cameraController.camera, input.screen, viewportPointB);
                
                var distance = viewportPointA.sub(viewportPointB).length();
                var ratio = .8 / distance;
                var s = Math.max(.6, Math.pow(Math.min(1, clv.templatesView.scale.length() * ratio), .9));
                clv.templatesView.scale.set(s, s, s);
                clv.templatesView.updateMatrixWorld();
            }

            min = v.set(0, sortResult.min, 0).applyMatrix4(clv.templatesView.matrixWorld).y;
            max = v.set(0, sortResult.max, 0).applyMatrix4(clv.templatesView.matrixWorld).y;
        }
        this.cargoListView.On(CargoListView.signals.sort, onSort);

        /**
         * @param {import('../utils/cik/input/Input').DragEvent} dragEvent 
         */
        function onDrag(dragEvent){
            let start = cargoListViewRect.ContainsPoint(dragEvent.sx, dragEvent.sy);
            let current = cargoListViewRect.ContainsPoint(dragEvent.x, dragEvent.y);
            if(start && current){
                let offset = dragEvent.dy * .5 * units;
                let clvMin = min + offset,
                    clvMax = max + offset;
                Utils3D.Project(v.set(0, clvMin, 0), hud.cameraController.camera, input.screen, viewportPointA);
                Utils3D.Project(v.set(0, clvMax, 0), hud.cameraController.camera, input.screen, viewportPointB);
                //console.log(viewportPointA, viewportPointB);
                if( (offset > 0 && viewportPointA.y < -.7)
                    || 
                    (offset < 0 && viewportPointB.y > .8)
                ){
                    dragOffset += offset;
                    min += offset;
                    max += offset;
                    clv.templatesView.position.y += offset;
                }
            }
        }
        input.onDrag.push(onDrag);

        this.sceneSetup.cameraController.orbitControls.ignoredAreas.push(
            clvRectIgnore
        );

        /**
         * @param {import('../utils/cik/input/Input').IScreen} screen 
         */
        function onScreenResize(screen){

            cargoListViewRect.bottom = screen.height;
            clvRectIgnore.Copy(cargoListViewRect);
            clvRectIgnore.Offset(screen.left, screen.top);

            var bottomLeft = scope.params.cargoListView.bottomLeft; // offset in pixels
            tempVec.set(bottomLeft.x, bottomLeft.y); // viewport point in pixels

            Utils3D.ToNDC(tempVec, screen); // NDC point
            Utils3D.Unproject(tempVec, hud.cameraController.camera, tempVec, 'z'); // worldPos on z plane
            tempVec.y += dragOffset;
            clv.templatesView.position.copy(tempVec); // set view position

            clv.templatesView.updateMatrixWorld(true);

            clv.Sort();
        }
        
        input.onResize.push(onScreenResize);
        onScreenResize(input.screen);
    }

    Configure(){

        var Smart = require('../utils/cik/config/Smart').default;
        var Config = require('../utils/cik/config/Config').default;
        var Control3D = require('../utils/cik/config/Control3D').default;

        var scope = this;
        var input = this.sceneSetup.input;

        if(this.params.ux.params.hud){
            var hudControl3D = Control3D.Request('hud');

            Config.MakeShortcut('Configure', 'Show HUDControl3D', function(){
                hudControl3D.Toggle(scope.cargoListView.templatesView);
            });
        }
    }
}

export default View;