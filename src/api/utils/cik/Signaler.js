
/** SignalerCallback 
 * @callback SignalerCallback
 * @param {Array<*>} args
 */

class Signaler {
    constructor(){
        /** @type {Array<SignalerCallback>} */
        this.signals = {};
        /** @type {Array<string>} */
        this.dispatches = {};
    }

    /** @param {string} event @param {SignalerCallback} callback */
    OnIncludingPrior(event, callback){
        let args = this.dispatches[event];
        if(args){
            callback(...args);
        }
        else{
            this.On(event, callback);
        }
    }

    /** @param {string} event @param {SignalerCallback} callback */
    On(event, callback){
        if(this.signals[event] === undefined){
            this.signals[event] = [];
        }
        this.signals[event].push(callback);
    }

    /** @param {string} event @param {SignalerCallback} callback */
    Once(event, callback){
        if(this.signals[event] === undefined){
            this.signals[event] = [];
        }
        let eventCallbacks = this.signals[event];
        let once;
        once = function(...args){
            eventCallbacks.splice(eventCallbacks.indexOf(once), 1);
            callback(...args);
        };
        eventCallbacks.push(once);
    }

    /** @param {string} event @param {SignalerCallback} callback */
    Off(event, callback){
        let callbacks = this.signals[event];
        if(callbacks){
            let index = callbacks.indexOf(callback);
            if(index != -1){
                callbacks.splice(index, 1);
            }
        }
    }

    /** @param {string} event @param {Array<*>} [args] */
    Dispatch(event, ...args){
        this.dispatches[event] = args;
        let callbacks = this.signals[event];
        if(callbacks){
            for(let i = 0, len = callbacks.length; i < len; i++){
                callbacks[i](...args);
            }
        }
    }

}

export default Signaler;