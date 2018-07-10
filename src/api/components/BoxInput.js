
import Logger from '../utils/cik/Logger';
import Signaler from '../utils/cik/Signaler';

class Entry {
    constructor(width, length, height){
        this.Set(width, length, height);
        this.active = false;
    }

    Set(width, length, height){
        this.width = width;
        this.length = length;
        this.height = height;
    }
}

var completed = 'completed';

class BoxInput extends Signaler {

    constructor(){
        super();
        
        this.entry = new Entry();
    }

    Update(width, length, height){
        this.entry.Set(width, length, height);
        this.entry.active = true;
        Logger.Trace('entry updated', this.entry);
    }

    Abort(){
        this.entry.active = false;
        Logger.Trace('entry deleted');
    }

    Complete(){
        if( this.entry.active ){
            this.Dispatch(completed, this.entry);
            this.entry.active = false;
        }
        return this.entry;
    }
}

export default BoxInput;