
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

    CreateBoxEntry(){
        return new BoxEntry();
    }

    /**
     * Updates the current entry
     * @param {BoxEntry} entry 
     */
    Update(entry){
        this.entry.Copy(entry);
        this.entry.active = true;
        this.Dispatch(signals.updated, this.entry);
    }

    Abort(){
        this.entry.active = false;
        this.entry.Reset();
        this.Dispatch(signals.aborted);
    }

    /**
     * Add entry
     * @param {BoxEntry} entry 
     */
    Complete(entry){
        this.entry.Copy(entry);
        this.Dispatch(signals.completed, this.entry);
        this.entry.Reset();
        return this.entry;
    }

    static get signals(){
        return signals;
    }
}

export default CargoInput;