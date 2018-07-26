import Logger from "../utils/cik/Logger";
import CargoBoxView from "./CargoBoxView";
import CargoView from "./CargoView";
import Signaler from "../utils/cik/Signaler";
import CargoGroup from "../packer/CargoGroup";
import Utils from "../utils/cik/Utils";
import CargoEntry from "../components/common/CargoEntry";

/**
 * @typedef {Object} CargoListViewParams
 * @property {import('../UX').default} ux
 */

/**
 * @typedef SortResult
 * @property {Number} min
 * @property {Number} max
 * @property {Number} cargoes
 */

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

const signals = {
    sort: 'sort'
};

/** @type {CargoListViewParams} */
const defaultParams = {};

class CargoListView extends Signaler {
    /**
     * @param {CargoListViewParams} params 
     */
    constructor(params){
        super();

        this.params = Utils.AssignUndefined(params, defaultParams);

        this.view;
        this.templatesView = new THREE.Object3D();

        /**
         * @type {Map<CargoGroup, CargoView>}
         */
        this.cargoTemplateViews = new Map();
    }

    /**
     * 
     * @param {CargoGroup} group 
     */
    Add(group){
        //Logger.Log('Adding cargo group #' + this.cargoTemplateViews.size + ': ' + group.ToString() + ' to view', group);
        var templateCargoView;
        switch(group.entry.type){
            case 'BoxEntry': {
                templateCargoView = new CargoBoxView(group.entry);
                
                break;
            }

            default :
                templateCargoView = CargoView.Dummy(group.entry);
                Logger.Warn('group.entry.type not supported by viewer,', group);
                break;
        }

        this.cargoTemplateViews.set(group, templateCargoView);
        this.templatesView.add(templateCargoView.view);

        this.Sort();
    }

    /**
     * 
     * @param {CargoGroup} group 
     */
    Remove(group){
        var templateCargoView = this.cargoTemplateViews.get(group);
        if(templateCargoView){
            this.cargoTemplateViews.delete(group);
            this.templatesView.remove(templateCargoView.view);

            this.Sort();
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
     * @param {Map<CargoGroup, CargoView>} cargoViews 
     * @returns {Number}
     */
    Sort(){

        this.SortMapBySize();

        var units = this.params.ux.params.units;

        this.templatesView.scale.set(1, 1, 1);
        this.templatesView.updateMatrixWorld(true);
        const worldToLocal = new THREE.Matrix4().getInverse(this.templatesView.matrixWorld);
        const padding = 3 * units,
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

            cargoView.value.position.set(0, start, 0);

            tempBox.setFromObject(cargoView.value.view);
            tempBox.applyMatrix4(worldToLocal);

            tempBox.getSize(tempVec);
            var halfSize = tempVec.y / 2;
            if(i > 0)
                offset += halfSize;

            cargoView.value.position.set(0, start + offset, 0);

            offset += halfSize + padding;

            i++;
        }

        //result.min = tempVec.set(0, result.min, 0).applyMatrix4(this.view.matrixWorld).y;
        //result.max = tempVec.set(0, offset, 0).applyMatrix4(this.view.matrixWorld).y;
        result.min = start;
        result.max = offset;
        result.cargoes = i;
        this.Dispatch(signals.sort, result);

        //for(var [cargo, cargoView] of cargoViews){}
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

        this.cargoTemplateViews.clear();
        list.forEach(entry => {
            this.cargoTemplateViews.set(entry[0], entry[1]);
        });
    }

    static get signals(){
        return signals;
    }
}

export default CargoListView;