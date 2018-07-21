import Cargo from "../packer/Cargo";
import Logger from "../utils/cik/Logger";
import BoxEntry from "../components/box/BoxEntry";
import CargoBoxView from "./CargoBoxView";
import CargoView from "./CargoView";
import FreightPacker from "../../FreightPacker";
import Debug from "../debug/Debug";
import Signaler from "../utils/cik/Signaler";

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

class CargoListView extends Signaler {
    constructor(){
        super();

        this.view = new THREE.Object3D();

        /**
         * @type {Map<Cargo, CargoView>}
         */
        this.cargoViews = new Map();
    }

    /**
     * 
     * @param {Cargo} cargo 
     */
    Add(cargo){
        Logger.Log('Adding cargo #' + this.cargoViews.size + ': ' + cargo.ToString() + ' to view', cargo);
        var cargoView;
        switch(cargo.entry.type){
            case 'BoxEntry': {
                /**
                 * @type {BoxEntry}
                 */
                let boxEntry = cargo.entry;
                cargoView = new CargoBoxView(cargo);
                
                break;
            }

            default :
                cargoView = CargoView.Dummy(cargo);
                Logger.Warn('cargo.entry.type not supported by viewer,', cargo);
                break;
        }

        this.cargoViews.set(cargo, cargoView);
        this.view.add(cargoView.view);

        this.Sort();
    }

    /**
     * 
     * @param {Cargo} cargo 
     */
    Remove(cargo){
        var cargoView = this.cargoViews.get(cargo);
        if(cargoView){
            this.cargoViews.delete(cargo);
            this.view.remove(cargoView.view);

            this.Sort();
        }
    }

    /**
     * @param {Map<Cargo, CargoView>} cargoViews 
     * @returns {Number}
     */
    Sort(){

        this.SortMapBySize();

        var units = FreightPacker.instance.params.ux.units;

        this.view.scale.set(1, 1, 1);
        this.view.updateMatrixWorld(true);
        const worldToLocal = new THREE.Matrix4().getInverse(this.view.matrixWorld);
        const padding = 3 * units,
            start = 0;

        var i = 0,
            offset = 0;
            
        /**
         * @type {SortResult}
         */
        var result = {min: start, max: start, cargoes: 0};
        
        var list = this.cargoViews.values(),
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
         * @param {[Cargo, CargoListView]} a 
         * @param {[Cargo, CargoListView]} b 
         */
        function sort(a, b){
            return -a[0].entry.dimensions.Compare(b[0].entry.dimensions);
        }

        var list = [...this.cargoViews.entries()];
        list.sort(sort);
        this.cargoViews = new Map(list);
        return;

        this.cargoViews.clear();
        list.forEach(entry => {
            this.cargoViews.set(entry[0], entry[1]);
        });
    }

    static get signals(){
        return signals;
    }
}

export default CargoListView;