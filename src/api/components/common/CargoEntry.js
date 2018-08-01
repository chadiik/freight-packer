import TextField from "./TextField";
import Logger from "../../utils/cik/Logger";

const _weight = Symbol('weight');

class CargoEntry {
    constructor(){
        this.type = 'CargoEntry';

        this.quantity = 0;
        this.properties = {};
        this.uid = '';
        this[_weight] = 0;

        /**
         * @type {Map<string, TextField>}
         */
        this.descriptions = new Map();
    }

    /** @returns {Number} */
    get weight(){ return this[_weight]; }
    set weight(value){ this[_weight] = value; }

    /**
     * @param {string} [uid] - You'll rarely need to provide this
     */
    SetUID(uid){
        this.uid = uid || THREE.Math.generateUUID();
        return this.uid;
    }

    Copy(entry){
        Logger.Warn('CargoEntry.Copy is not implemented');
    }

    Clone(){
        Logger.Warn('CargoEntry.Clone is not implemented');
    }

    ToString(){
        
    }
}

export default CargoEntry;