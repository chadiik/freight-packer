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

    /** @param {string} key @param {string} [value] ommit value param to get description content instead of setting it */
    Description(key, value){
        let d = this.descriptions.get(key);
        if(d){
            if(value === undefined) return d.content;

            d.content = value;
        }
        else{
            if(value === undefined) return false;

            d = new TextField(key, value);
            this.descriptions.set(key, d);
        }
    }

    /** @param {string} key */
    DeleteDescription(key){
        if( this.descriptions.has(key) ) this.descriptions.delete(key);
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