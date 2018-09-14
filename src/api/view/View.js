import CargoListView from "./CargoListView";
import Packer from "../packer/Packer";
import CargoList from "../packer/CargoList";
import PackingSpaceView from "./PackingSpaceView";
import PackingSpace from "../packer/PackingSpace";
import SceneSetup from "../view/SceneSetup";
import Utils from "../utils/cik/Utils";
import PackResultView from "./PackResultView";
import UpdateComponent from "../utils/cik/input/UpdateComponent";
import Container from "../packer/container/Container";
import BoxEntry from "../components/box/BoxEntry";
import DomUI from "./dom/DomUI";
import OrthoviewsNavigator from "./OrthoviewsNavigator";
import Camera from "../scene/Camera";

/**
 * @typedef {Object} ViewParams
 * @property {import('../UX').default} ux
 * @property {Number} transitionDuration
 * @property {Object} cargoListView
 * @property {Number} cargoListView.paddingZ
 * @property {Number} cargoListView.paddingY
 * @property {import('./CargoListView').CargoListViewParams} cargoListView.params
 * @property {Object} packResultView
 * @property {import('./PackResultView').PackResultViewParams} packResultView.params
 */

 /** @type {ViewParams} */
const defaultParams = {
    ux: undefined,
    transitionDuration: 1.5,
    cargoListView: {
        paddingZ: 120,
        paddingY: 40,
        params: {}
    },
    packResultView: {
        params: {
            animationDuration: 1
        }
    }
};

var tempBox3 = new THREE.Box3();
var tempVec = new THREE.Vector3();

class View {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {DomUI} domUI; 
     * @param {SceneSetup} sceneSetup 
     * @param {ViewParams} params 
     */
    constructor(packer, sceneSetup, domUI, params){

        this.sceneSetup = sceneSetup;
        this.params = Utils.AssignUndefined(params, defaultParams);

        this.domUI = domUI;
        this.domUI.CreateOrthoViewsIcons();
        this.domUI.On(DomUI.signals.orthoViewSelected, this.OnOrthoViewSelected.bind(this));

        var scope = this;
        var units = this.params.ux.params.units;

        // Fill lights
        if(true){
            let lights = this.sceneSetup.DefaultLights(this.sceneSetup.sceneController, true, true);

            let dl = lights.filter(light => light instanceof THREE.DirectionalLight)[0];
            let dlData = {"color":"0xfceeee","intensity":1,"castShadow":true,"shadow.bias":0.00001,"shadow.radius":4,"shadow.mapSize.x":4096,"shadow.mapSize.y":4096,"shadow.camera.left":-400,"shadow.camera.top":300,"shadow.camera.right":400,"shadow.camera.bottom":-300,"shadow.camera.near":20,"shadow.camera.far":800};
            let Config = require('../utils/cik/config/Config').default;
            Config.Load(dl, dlData);

            if(this.sceneSetup.ux.params.hud){
                this.sceneSetup.DefaultLights(this.sceneSetup.hud);
            }

            let dlComp = lights.filter(light => light instanceof THREE.DirectionalLight)[1];
            dlComp.castShadow = true;
        }

        let orthoviewsNavParams = {ux: this.params.ux};
        this.orthoviewsNavigator = new OrthoviewsNavigator(this.sceneSetup.cameraController, orthoviewsNavParams);

        // Packing space
        this.packingSpaceView = new PackingSpaceView();
        this.sceneSetup.sceneController.AddDefault(this.packingSpaceView.view);
        /** @param {Container} container */
        function onContainerAdded(container){
            scope.packingSpaceView.Add(container);

            tempBox3.setFromObject(scope.packingSpaceView.view);
            tempBox3.getSize(tempVec);

            /** @type {THREE.Box3} */
            let box3 = container.combinedVolume.box3;
            scope.sceneSetup.cameraController.TransitionToFrame(scope.params.transitionDuration, tempBox3);

            let containerSize = Math.max(tempVec.x, tempVec.y, tempVec.z);
            scope.cargoListView.view.position.z = containerSize / 2 + scope.params.cargoListView.paddingZ * units;
            scope.cargoListView.view.position.y = scope.params.cargoListView.paddingY * units;
        }
        packer.packingSpace.On(PackingSpace.signals.containerAdded, onContainerAdded);

        // Cargo list
        this.params.cargoListView.params.ux = this.params.ux;
        this.cargoListView = new CargoListView(this.params.cargoListView.params);

        this.sceneSetup.input.AddRaycastGroup('OnClick', 'cargoListView', this.cargoListView.raycastGroup);

        this.sceneSetup.sceneController.AddDefault(this.cargoListView.view);

        function onCargoListViewChanged(){
            tempBox3.setFromObject(scope.cargoListView.view);
            tempBox3.getCenter(tempVec);
            let listViewCenterX = tempVec.x;
            scope.cargoListView.view.getWorldPosition(tempVec);
            let offsetX = listViewCenterX - tempVec.x;

            /** @type {THREE.Box3} */
            let box3 = tempBox3;
            scope.sceneSetup.cameraController.TransitionToFrame(scope.params.transitionDuration, box3, .7);

            tempBox3.setFromObject(scope.packingSpaceView.view);
            tempBox3.getCenter(tempVec);
            let centerX = tempVec.x;

            scope.cargoListView.view.position.x = centerX - offsetX;
        }
        function onCargoGroupAdded(group){
            scope.cargoListView.Add(group);
            onCargoListViewChanged();
        }
        packer.cargoList.On(CargoList.signals.groupAdded, onCargoGroupAdded);
        function onCargoGroupRemoved(group){
            scope.cargoListView.Remove(group);
            onCargoListViewChanged();
        }
        packer.cargoList.On(CargoList.signals.groupRemoved, onCargoGroupRemoved);
        function onCargoGroupModified(group){
            scope.cargoListView.UpdateGroup(group);
            onCargoListViewChanged();
        }
        packer.cargoList.On(CargoList.signals.groupModified, onCargoGroupModified);

        // Packing result
        this.params.packResultView.params.ux = this.params.ux;
        this.packResultView = new PackResultView(this.cargoListView, this.packingSpaceView, this.params.packResultView.params);
        this.sceneSetup.sceneController.AddDefault(this.packResultView.view);

        /** @param {Packer.PackingResult} packingResult */
        async function onPackUpdate(packingResult){
            scope.orthoviewsNavigator.Navigate(OrthoviewsNavigator.orthoviews.home, false);
            await scope.packResultView.DisplayPackingResult(packingResult);
        }
        packer.On(Packer.signals.packUpdate, onPackUpdate);

        var updateComponent = new UpdateComponent(true, 1/30, this.Update.bind(this));
        this.sceneSetup.input.updateComponents.push(updateComponent);

        this.orthoviewsNavigator.boundingView = this.packingSpaceView.view;
        this.orthoviewsNavigator.cargoListView = this.cargoListView;

        if(this.params.ux.params.hud){
            this.HUDSetup();
        }

        if(this.params.ux.params.configure){
            this.Configure();
        }
    }

    /** @param {Number} now */
    Update(now){
        this.packResultView.Update();
        this.cargoListView.Update();
    }

    HUDSetup(){
        var units = this.params.ux.params.units;
        var input = this.sceneSetup.input;
        var hud = this.sceneSetup.hud;
        var scope = this;


    }

    ClearPackingResults(){
        this.packResultView.Clear();
    }

    /** @param {DomUI.orthoviews} viewType */
    OnOrthoViewSelected(viewType){
        switch(viewType){
            case DomUI.orthoviews.home:     this.orthoviewsNavigator.Navigate(OrthoviewsNavigator.orthoviews.home);     break;
            case DomUI.orthoviews.top:      this.orthoviewsNavigator.Navigate(OrthoviewsNavigator.orthoviews.top);      break;
            case DomUI.orthoviews.front:    this.orthoviewsNavigator.Navigate(OrthoviewsNavigator.orthoviews.front);    break;
            case DomUI.orthoviews.side:     this.orthoviewsNavigator.Navigate(OrthoviewsNavigator.orthoviews.side);     break;
        }
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
                hudControl3D.Toggle(scope.cargoListView.view);
            });
        }
    }
}

export default View;