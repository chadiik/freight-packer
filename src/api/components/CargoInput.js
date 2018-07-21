
import Logger from '../utils/cik/Logger';
import Signaler from '../utils/cik/Signaler';
import BoxEntry from './box/BoxEntry';

const signals = {
    updated: 'updated',
    aborted: 'aborted',
    completed: 'completed'
};

/**
 * Cubic volumes entry
 */
class CargoInput extends Signaler {

    constructor(){
        super();
        
        /** Do not modify directly, use CargoInput.Update instead
         * @ignore
         */
        this.entry = new BoxEntry();
    }

    /** Creates a new BoxEntry, required for inputs */
    CreateBoxEntry(){
        return new BoxEntry();
    }

    /** Shows/updates entry 3D display
     * @param {BoxEntry} entry 
     * @returns {Boolean}
     */
    Show(entry){
        if(BoxEntry.Assert(entry)){
            try{
                this.Dispatch(signals.updated, entry);
                return true;
            }
            catch(error){
                Logger.Warn('Error in Cargo.Input.Show, error/entry:', error, entry);
            }

            return false;
        }

        Logger.Warn('BoxEntry.Assert failed in Cargo.Input.Show, entry:', entry);
        return false;
    }

    /** Hides entry 3D display */
    Hide(){
        this.Dispatch(signals.aborted);
    }

    /** Adds a new entry and obtain its uid
     * @param {BoxEntry} entry
     * @returns {Number|Boolean} uid or false if error
     */
    Add(entry){
        if(BoxEntry.Assert(entry)){
            try{
                var commitedEntry = entry.Clone();
                var uid = commitedEntry.SetUID();

                this.Dispatch(signals.completed, commitedEntry);
                return uid;
            }
            catch(error){
                Logger.Warn('Error in Cargo.Input.Add, error/entry:', error, entry);
            }

            return false;
        }

        Logger.Warn('BoxEntry.Assert failed in Cargo.Input.Add, entry:', entry);
        return false;
    }

    static get signals(){
        return signals;
    }
}

export default CargoInput;