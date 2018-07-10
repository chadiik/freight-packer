import Cargo from "../packer/Cargo";
import Logger from "../utils/cik/Logger";

class CargoListView {
    constructor(){
        this.view = new THREE.Object3D();
    }

    /**
     * 
     * @param {Cargo} cargo 
     */
    Add(cargo){
        Logger.Trace('Adding cargo: ' + cargo.ToString() + ' to view', cargo);
    }

    /**
     * 
     * @param {Cargo} cargo 
     */
    Remove(cargo){

    }
}

export default CargoListView;