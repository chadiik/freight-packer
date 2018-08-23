import Logger from "../utils/cik/Logger";
import CargoBoxView from "./CargoBoxView";
import CargoView from "./CargoView";
import Signaler from "../utils/cik/Signaler";
import CargoGroup from "../packer/CargoGroup";
import Utils from "../utils/cik/Utils";
import CargoEntry from "../components/common/CargoEntry";
import FloatingShelf from "./components/FloatingShelf";
import Asset from "../components/assets/Asset";
import BoxEntry from "../components/box/BoxEntry";
import TextLabelView from "./components/TextLabelView";
import RaycastGroup, { RaycastCallback } from "../utils/cik/input/RaycastGroup";
import Outline from "./components/Outline";
import Tween from "../utils/cik/Tween";

/**
 * @typedef {Object} CargoListViewParams
 * @property {import('../UX').default} ux
 * @property {Number} outlineOffset
 */

/**
 * @typedef SortResult
 * @property {Number} min
 * @property {Number} max
 * @property {Number} cargoes
 */

const typeofString = 'string';
const epsilon = Math.pow(2, -52);

const _selectedEntryUID = Symbol('seUID');

/** @type {Map<CargoView, TextLabelView>} */
var labels = new Map();

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

const signals = {
    sort: 'sort',
    select: 'select',
    deselect: 'deselect',
    interact: 'interact'
};

/** @type {CargoListViewParams} */
const defaultParams = {
    outlineOffset: 4
};

class CargoListView extends Signaler {
    /**
     * @param {CargoListViewParams} params 
     */
    constructor(params){
        super();

        this.params = Utils.AssignUndefined(params, defaultParams);

        this.view = new THREE.Object3D();
        this.templatesView = new THREE.Object3D();
        this.view.add(this.templatesView);

        /** @type {Map<CargoGroup, CargoView>} */
        this.cargoTemplateViews = new Map();

        let units = this.params.ux.params.units;

        // Shelf
        /** @type {import('./components/FloatingShelf').FloatingShelfParams} */
        let fsParams = {padding: new THREE.Vector3(10 * units, (this.params.outlineOffset + 1) * units, 10 * units), colorHex: Asset.ColorTemplates('Containers').Apply(0x000000)};
        this.floatingShelf = new FloatingShelf(this.templatesView, fsParams);
        this.view.add(this.floatingShelf.view);

        // Interaction
        this.raycastGroupItems = [];
        this.raycastGroup = new RaycastGroup(this.raycastGroupItems, this.OnInteract.bind(this), 
            /** @param {CargoView} item */
            function(item){
                return item.view;
            },
            false,
            true);

        this.outline = new Outline({color: 0xffffff, opacity: 1, offsetFactor: this.params.outlineOffset * units});
        this.view.add(this.outline.view);

        // Transition
        this.slidingAnimation = {
            enabled: false,
            position: Tween.Combo.RequestN(Tween.functions.ease.easeOutCubic, .5, 0, 0),
            originalPosition: new THREE.Vector3(0, 0, 0)
        };

        let scope = this;
        function onAnimationComplete(){
            scope.slidingAnimation.enabled = false;
        }
        this.slidingAnimation.position.onComplete = onAnimationComplete;

        this.slidingAnimation.position.Hook(this.view.position, 'y');
    }

    /**
     * @param {CargoGroup} group 
     */
    Add(group){
        let units = this.params.ux.params.units;

        let templateCargoView;
        switch(group.entry.type){
            case 'BoxEntry': {
                templateCargoView = new CargoBoxView(group.entry);

                let ticketParams = { width: 50 * units, height: 20 * units };

                const height = 96;
                let width = Math.floor( ticketParams.width / ticketParams.height * height );
                /** @type {import('./TextLabelView').TLVParams} */
                let tlvParams = { font: '64px sans-serif', backColor: 'rgb(0, 0, 0)', fontColor: 'rgb(255, 255, 255)', 
                    textAlign: 'left', sidePadding: 30, width: width, height: height
                };

                let labelView = new TextLabelView(tlvParams);
                labelView.view.rotateY( 90 * Math.PI / 180 );
                labelView.view.rotateX( -90 * Math.PI / 180 );
                labelView.view.scale.y = ticketParams.height;
                labelView.view.scale.x = ticketParams.width;
                /** @type {BoxEntry} */
                let boxEntry = group.entry;
                labelView.view.position.z = ticketParams.width / 2;
                this.view.add(labelView.view);

                labelView.UpdateText(boxEntry.quantity);

                labels.set(templateCargoView, labelView);
                
                break;
            }

            default :
                templateCargoView = CargoView.Dummy(group.entry);
                Logger.Warn('group.entry.type not supported by viewer,', group);
                break;
        }

        this.cargoTemplateViews.set(group, templateCargoView);
        this.templatesView.add(templateCargoView.view);

        this.raycastGroupItems.push(templateCargoView);
        this.raycastGroup.UpdateItems(this.raycastGroupItems);

        this.Sort();
        this.floatingShelf.Update();
    }

    /**
     * @param {CargoGroup} group 
     */
    UpdateGroup(group){
        let templateCargoView = this.cargoTemplateViews.get(group);
        templateCargoView.ReflectEntry();

        this.Sort();
        this.floatingShelf.Update();

        if(this[_selectedEntryUID] === group.entry.uid) this.SetOutline(templateCargoView);
    }

    /**
     * @param {CargoGroup} group 
     */
    Remove(group){
        var templateCargoView = this.cargoTemplateViews.get(group);
        if(templateCargoView){

            let raycastGroupIndex = this.raycastGroupItems.indexOf(templateCargoView);
            if(raycastGroupIndex !== -1) this.raycastGroupItems.splice(raycastGroupIndex, 1);
            this.raycastGroup.UpdateItems(this.raycastGroupItems);

            this.cargoTemplateViews.delete(group);
            this.templatesView.remove(templateCargoView.view);

            if(this[_selectedEntryUID] === group.entry.uid) this.outline.box = false;

            this.Sort();
        }
    }

    /**
     * RaycastCallback
     * @param {CargoView} cargoView
     * @param {THREE.Intersection} intersection
     */
    OnInteract(cargoView, intersection){
        this.Dispatch(signals.interact, cargoView.entry);
    }

    /** @param {CargoView} cargoView */
    Select(entryUID){

        this[_selectedEntryUID] = entryUID;

        if(!entryUID){
            this.outline.box = false;
            this.Dispatch(signals.deselect);
        }
        else{
            let cargoView = this.GetTemplate(entryUID);
            this.SetOutline(cargoView);
            this.Dispatch(signals.select, cargoView.entry);
        }
    }

    /** @param {CargoView} target */
    SetOutline(target){
        this.outline.box = target instanceof CargoBoxView ? target.mesh : target.view;
    }

    SlideUp(targetY, duration){
        let deltaY = targetY - this.view.position.y;
        if(Math.abs(deltaY) < epsilon) return;

        this.slidingAnimation.position.SetDurations(duration);
        this.slidingAnimation.position.SetStartValues(this.view.position.y);
        this.slidingAnimation.position.SetDeltas(deltaY);
        this.slidingAnimation.position.Restart();
        this.slidingAnimation.enabled = true;
    }

    SlideDown(duration){
        let deltaY = this.slidingAnimation.originalPosition.y - this.view.position.y;
        if(Math.abs(deltaY) < epsilon) return;

        this.slidingAnimation.position.SetDurations(duration);
        this.slidingAnimation.position.SetStartValues(this.view.position.y);
        this.slidingAnimation.position.SetDeltas(deltaY);
        this.slidingAnimation.position.Restart();
        this.slidingAnimation.enabled = true;
    }

    Update(){
        if(this.slidingAnimation.enabled){
            this.slidingAnimation.position.Update();
        }
    }

    /**
     * 
     * @param {CargoGroup|CargoEntry|string|Number} id 
     */
    GetTemplate(id){
        var group;
        if(id instanceof CargoGroup){
            group = id;
        }
        else if(id instanceof CargoEntry){
            for(var cargoGroup of this.cargoTemplateViews.keys()){
                if(cargoGroup.entry === id) group = cargoGroup;
            }
        }
        else{
            for(var cargoGroup of this.cargoTemplateViews.keys()){
                if(cargoGroup.entry.uid === id) group = cargoGroup;
            }
        }

        return this.cargoTemplateViews.get(group);
    }

    /**
     * @param {CargoView} cargoView 
     * @param {string} value 
     * @param {string} textColor css
     */
    UpdateLabel(cargoView, value, textColor){
        let textLabelView = labels.get(cargoView);
        if(textLabelView){
            if(textColor) textLabelView.params.fontColor = textColor;
            textLabelView.UpdateText(value);
        }
    }

    /**
     * @param {Map<CargoGroup, CargoView>} cargoViews 
     * @returns {Number}
     */
    Sort(){

        this.SortMapBySize();

        var units = this.params.ux.params.units;

        this.view.updateMatrixWorld(true);
        const worldToLocal = new THREE.Matrix4().getInverse(this.templatesView.matrixWorld);
        const padding = 5 * units,
            start = 0;

        var i = 0,
            offset = 0;
            
        /**
         * @type {SortResult}
         */
        var result = {min: start, max: start, cargoes: 0};
        
        var list = this.cargoTemplateViews.values(),
            cargoView;
        while( ( cargoView = list.next() ).done === false ){

            cargoView.value.position.set(start, 0, 0);

            tempBox.setFromObject(cargoView.value.view);
            tempBox.applyMatrix4(worldToLocal);

            tempBox.getSize(tempVec);
            var halfSize = tempVec.x / 2;
            if(i > 0)
                offset += halfSize;

            cargoView.value.position.set(start + offset, tempVec.y / 2 + padding, -tempVec.z / 2);

            let labelView = labels.get(cargoView.value);
            labelView.view.position.x = cargoView.value.position.x;
            labelView.view.position.y = padding + 1 * units;

            offset += halfSize + padding;

            i++;
        }

        result.min = start;
        result.max = offset;
        result.cargoes = i;
        this.Dispatch(signals.sort, result);
    }

    SortMapBySize(){
        /**
         * 
         * @param {[CargoGroup, CargoListView]} a 
         * @param {[CargoGroup, CargoListView]} b 
         */
        function sort(a, b){
            return -a[0].entry.dimensions.Compare(b[0].entry.dimensions);
        }

        var list = [...this.cargoTemplateViews.entries()];
        list.sort(sort);
        this.cargoTemplateViews = new Map(list);
        return;
    }

    static get signals(){
        return signals;
    }
}

export default CargoListView;