import Signaler from "../utils/cik/Signaler";
import CargoEntry from "../components/common/CargoEntry";
import CargoGroup from "./CargoGroup";

const stringType = 'string';

const signals = {
    groupAdded: 'groupAdded',
    groupRemoved: 'groupRemoved'
};

class CargoList extends Signaler{
    constructor(){
        super();

        /** @type {Map<string, CargoGroup>} */
        this.groups = new Map();
    }

    /** Adds a new CargoGroup
     * @param {CargoEntry} entry 
     */
    Add(entry){
        var group = new CargoGroup(entry);

        this.groups.set(entry.uid, group);
        this.Dispatch(signals.groupAdded, group);
    }

    /** Removes the CargoGroup using its uid
     * @param {string} uid 
     */
    Remove(uid){
        var group = this.groups.get(uid);
        if(group){
            this.groups.delete(uid);
            this.Dispatch(signals.groupRemoved, group);
        }
    }

    static get signals(){
        return signals;
    }
}

export default CargoList;