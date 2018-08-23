import Logger from '../utils/cik/Logger';
import BoxEntry from './box/BoxEntry';
import Dimensions from './box/Dimensions';
import LightDispatcher from './LightDispatcher';
import App from '../App';
import CargoList from '../packer/CargoList';
import CargoBoxView from '../view/CargoBoxView';
import Pool from '../utils/cik/Pool';

const epsilon = Math.pow(2, -52);
const numberType = 'number';

const _cargoList = Symbol('cargoList');

function poolNewFN(){
    return new BoxEntry();
}
/** @param {BoxEntry} boxEntry */
function poolResetFN(boxEntry){
    return boxEntry;
}
var boxEntryPool = new Pool(poolNewFN, poolResetFN);

const signals = {
    show: 'show',
    hide: 'hide',
    insert: 'insert',
    modify: 'modify',
    remove: 'remove'
};

/** Renews entry: modify uid and color
 * @param {BoxEntry} boxEntry */
function renewBoxEntry(boxEntry){
    boxEntry.SetUID();
    boxEntry.Description('color', CargoBoxView.GetNextColor().getHex());
}

/**
 * @typedef {Object} CargoInputParams
 * @property {import('../UX').default} ux
 */

/**
 * Cubic volumes entry
 */
class CargoInput extends LightDispatcher {

    /**
     * @param {CargoInputParams} params 
     */
    constructor(params){
        super();

        this.params = params;
    }

    /** @ignore ignore */
    _Bind(value){
        /** @type {App} */
        let app = value;

        this[_cargoList] = app.packer.cargoList;
    }

    /** Creates a new BoxEntry, required for inputs. (Can be reused) */
    CreateBoxEntry(){
        let boxEntry = new BoxEntry();
        renewBoxEntry(boxEntry);
        return boxEntry;
    }

    /** @param {string} entryUID @returns {BoxEntry} a copy of the entry if it exists */
    GetEntry(entryUID){
        /** @type {CargoList} */
        let cargoList = this[_cargoList];
        let entry = cargoList.GetEntry(entryUID);
        let entryMirror = boxEntryPool.Request();
        entryMirror.Copy(entry);
        return entry;
    }

    /** @returns {Array<BoxEntry>} an array of copies of all entries */
    GetEntries(){
        /** @type {CargoList} */
        let cargoList = this[_cargoList];
        let entries = [];
        cargoList.groups.forEach(value => {
            let entryMirror = boxEntryPool.Request();
            entryMirror.Copy(value.entry);
            entries.push(entryMirror);
        });

        return entries;
    }

    /**
     * Return BoxEntry objects to object pool (less memory usage)
     * @param {BoxEntry | Array<BoxEntry>} objects 
     */
    Recycle(objects){
        if(objects instanceof Array){
            objects.forEach( (object) => {
                if(object instanceof BoxEntry) boxEntryPool.Return(object);
            });
        }
        else if(objects instanceof BoxEntry){
            boxEntryPool.Return(objects);
        }
    }

    /** Shows/updates entry 3D display
     * @param {BoxEntry} entry 
     * @returns {Boolean}
     */
    Show(entry){
        if(BoxEntry.Assert(entry)){
            try{
                this.Dispatch(signals.show, entry);
                return true;
            }
            catch(error){
                Logger.Warn('Error in CargoInput.Show, error/entry:', error, entry);
            }

            return false;
        }

        Logger.Warn('BoxEntry.Assert failed in CargoInput.Show, entry:', entry);
        return false;
    }

    /** Hides entry 3D display */
    Hide(){
        this.Dispatch(signals.hide);
    }

    /** Adds a new entry and obtain its uid
     * @param {BoxEntry} entry
     * @returns {Number|Boolean} uid or false if error
     */
    Add(entry){
        if(BoxEntry.Assert(entry)){

            if( Dimensions.IsVolume(entry.dimensions.Abs()) === false ){
                Logger.Warn('CargoInput.Add, entry rejected, dimensions != Volume:', entry.dimensions);
                return false;
            }

            try{
                let commitedEntry = entry.Clone();
                let uid = commitedEntry.SetUID();
                
                renewBoxEntry(entry);

                this.Dispatch(signals.insert, commitedEntry);
                return uid;
            }
            catch(error){
                Logger.Warn('Error in CargoInput.Add, error/entry:', error, entry);
            }

            return false;
        }

        Logger.Warn('BoxEntry.Assert failed in CargoInput.Add, entry:', entry);
        return false;
    }

    /** Modify an existing BoxEntry, referenced by its uid, using a modifed template
     * @param {string} entryUID
     * @param {BoxEntry} boxEntry
     * @returns {Boolean} success
     */
    Modify(entryUID, boxEntry){
        let existing = this.GetEntry(entryUID);
        if(!existing){
            Logger.Warn('CargoInput.Modify, entry not found for:', entryUID);
            return false;
        }

        if(BoxEntry.Assert(boxEntry)){

            if( Dimensions.IsVolume(boxEntry.dimensions.Abs()) === false ){
                Logger.Warn('CargoInput.Modify, entry rejected, dimensions != Volume:', boxEntry);
                return false;
            }

            try{
                existing.Copy(boxEntry);

                this.Dispatch(signals.modify, existing);
                return true;
            }
            catch(error){
                Logger.Warn('Error in CargoInput.Modify, error/entry:', error, boxEntry);
            }

            return false;
        }

        Logger.Warn('BoxEntry.Assert failed in CargoInput.Modify, entry:', boxEntry);
        return false;
    }

    /** Removes an existing box entry
     * @param {string} entryUID
     * @returns {Boolean} success
     */
    Remove(entryUID){
        
        /** @type {CargoList} */
        let cargoList = this[_cargoList];
        let existing = cargoList.GetEntry(entryUID);
        
        if(!existing){
            Logger.Warn('CargoInput.Remove, entry not found for:', entryUID);
            return false;
        }

        this.Dispatch(signals.remove, existing);
        return true;
    }

    /** Enumeration of dispatched types */
    static get signals(){
        return signals;
    }
}

CargoInput.BoxEntry = BoxEntry;

export default CargoInput;