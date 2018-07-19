import Cargo from "../packer/Cargo";
import Logger from "../utils/cik/Logger";
import BoxEntry from "../components/box/BoxEntry";
import CargoBoxView from "./CargoBoxView";
import CargoView from "./CargoView";


class CargoListView {
    constructor(){
        this.view = new THREE.Object3D();

        /**
         * @type {WeakMap<Cargo, CargoView>}
         */
        this.cargoViews = new WeakMap();
    }

    /**
     * 
     * @param {Cargo} cargo 
     */
    Add(cargo){
        Logger.Trace('Adding cargo: ' + cargo.ToString() + ' to view', cargo);
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
    }

    /**
     * 
     * @param {Cargo} cargo 
     */
    Remove(cargo){
        var cargoView = this.cargoViews.get(cargo);
        this.view.remove(cargoView.view);
    }
}

export default CargoListView;