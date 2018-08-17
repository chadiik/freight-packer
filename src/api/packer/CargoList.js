import Signaler from "../utils/cik/Signaler";
import CargoEntry from "../components/common/CargoEntry";
import CargoGroup from "./CargoGroup";
import BoxEntry from "../components/box/BoxEntry";

const stringType = 'string';

const signals = {
    groupAdded: 'groupAdded',
    groupRemoved: 'groupRemoved',
    groupModified: 'groupModified'
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

    /** Adds a new CargoGroup
     * @param {CargoEntry} entry 
     */
    Modify(entry){
        var group = this.groups.get(entry.uid);
        this.Dispatch(signals.groupModified, group);
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

    /** @param {string} entryUID @returns {BoxEntry} the entry if it exists */
    GetEntry(entryUID){
        if(this.groups.has(entryUID)) return this.groups.get(entryUID).entry;
    }

    get ready(){
        return this.groups.size > 0;
    }

    static get signals(){
        return signals;
    }
}

export default CargoList;