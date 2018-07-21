import CargoListView from "./CargoListView";
import Packer from "../packer/Packer";
import CargoList from "../packer/CargoList";
import PackingSpaceView from "./PackingSpaceView";
import PackingSpace from "../packer/PackingSpace";
import SceneSetup from "../scene/SceneSetup";
import Utils3D from "../utils/cik/Utils3D";
import Utils from "../utils/cik/Utils";
import Debug from "../debug/Debug";
import FreightPacker from "../../FreightPacker";

const defaultParams = {

    cargoListView: {
        bottomLeft: { x: 100, y: 100 }
    }
};

var tempVec = new THREE.Vector3();

class View {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {SceneSetup} sceneSetup 
     */
    constructor(packer, sceneSetup, params){
        this.sceneSetup = sceneSetup;
        this.params = Utils.AssignUndefined(params, defaultParams);

        this.packingSpaceView = new PackingSpaceView();
        this.sceneSetup.sceneController.AddDefault(this.packingSpaceView.view);

        var onContainerAdded = this.packingSpaceView.Add.bind(this.packingSpaceView);
        packer.packingSpace.On(PackingSpace.signals.containerAdded, onContainerAdded);

        this.cargoListView = new CargoListView();
        this.sceneSetup.hud.Add(this.cargoListView.templatesView);

        this.HUDSetup();

        var onCargoGroupAdded = this.cargoListView.Add.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.groupAdded, onCargoGroupAdded);
        var onCargoRemoved = this.cargoListView.Remove.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.groupRemoved, onCargoRemoved);

        if(FreightPacker.instance.ux.params.configure){
            this.Configure();
        }
    }

    HUDSetup(){
        var units = FreightPacker.instance.ux.params.units;
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

        var hudControl3D = Control3D.Request('hud');

        var scope = this;
        var input = this.sceneSetup.input;
        input.keyboard.on('s', function(){
            hudControl3D.Toggle(scope.cargoListView.templatesView);
        });
    }
}

export default View;