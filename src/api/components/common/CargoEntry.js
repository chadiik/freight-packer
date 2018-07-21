import TextField from "./TextField";
import Logger from "../../utils/cik/Logger";

class CargoEntry {
    constructor(){
        this.type = 'CargoEntry';

        this.active = false;
        this.properties = {};

        /**
         * @type {Map<string, TextField>}
         */
        this.descriptions = new Map();
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