import Logger from '../utils/cik/Logger';
import BoxEntry from './box/BoxEntry';
import Dimensions from './box/Dimensions';
import LightDispatcher from './LightDispatcher';
import App from '../App';
import CargoList from '../packer/CargoList';

const epsilon = Math.pow(2, -52);
const numberType = 'number';

const _cargoList = Symbol('cargoList');

const signals = {
    update: 'update',
    abort: 'abort',
    insert: 'insert',
    modify: 'modify',
    remove: 'remove'
};

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
        return new BoxEntry();
    }

    /** @param {string} entryUID @returns {BoxEntry} the entry if it exists */
    GetEntry(entryUID){
        /** @type {CargoList} */
        let cargoList = this[_cargoList];
        let entry = cargoList.GetEntry(entryUID);
        return entry;
    }

    /** @returns {Array<BoxEntry>} all entries or an empty array */
    GetEntries(){
        /** @type {CargoList} */
        let cargoList = this[_cargoList];
        let entries = [];
        cargoList.groups.forEach(value => entries.push(value.entry));

        return entries;
    }

    /** Shows/updates entry 3D display
     * @param {BoxEntry} entry 
     * @returns {Boolean}
     */
    Show(entry){
        if(BoxEntry.Assert(entry)){
            try{
                this.Dispatch(signals.update, entry);
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
        this.Dispatch(signals.abort);
    }

    /** Adds a new entry and obtain its uid
     * @param {BoxEntry} entry
     * @returns {Number|Boolean} uid or false if error
     */
    Add(entry){
        if(BoxEntry.Assert(entry)){

            if( Dimensions.IsVolume(entry.dimensions.Abs()) === false ){
                Logger.Warn('CargoInput.Add, entry rejected, dimensions != Volume:', entry);
                return false;
            }

            try{
                let commitedEntry = entry.Clone();
                let uid = commitedEntry.SetUID();

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

    /** Modify an existing box entry
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

    static get signals(){
        return signals;
    }
}

CargoInput.BoxEntry = BoxEntry;

export default CargoInput;