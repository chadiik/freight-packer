import Signaler from "../../../api/utils/cik/Signaler";

const signals = {
    start: 'start',
    complete: 'complete'
};

class WizardStep extends Signaler {
    /**
     * 
     * @param {string} key 
     * @param {Object} data 
     */
    constructor(key, data){
        super();

        /**
         * @type {string}
         */
        this.key = key;

        /**
         * @type {Object}
         */
        this.data = data || {};
    }

    Start(dataPass){
        this.Dispatch(signals.start);
    }

    Complete(data){
        this.Dispose();
        this.Dispatch(signals.complete, data);
    }

    Dispose(){

    }

    static get signals(){
        return signals;
    }
}

export default WizardStep;