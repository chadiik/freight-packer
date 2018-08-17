
/** SignalerCallback 
 * @callback SignalerCallback
 * @param {Array<*>} args
 */

const _signals = Symbol('signals');
const _dispatches = Symbol('dispatches');

class LightDispatcher {
    constructor(){
        this[_signals] = {};
        this[_dispatches] = {};
    }

    /** @param {string} event @param {SignalerCallback} callback */
    On(event, callback){
        if(this[_signals][event] === undefined){
            this[_signals][event] = [];
        }
        this[_signals][event].push(callback);
    }

    /** @param {string} event @param {SignalerCallback} callback */
    Off(event, callback){
        var callbacks = this[_signals][event];
        if(callbacks){
            var index = callbacks.indexOf(callback);
            if(index != -1){
                callbacks.splice(index, 1);
            }
        }
    }

    /** @param {string} event @param {Array<*>} [args] */
    Dispatch(event, ...args){
        this[_dispatches][event] = args;
        var callbacks = this[_signals][event];
        if(callbacks){
            for(var i = 0, len = callbacks.length; i < len; i++){
                callbacks[i](...args);
            }
        }
    }

}

export default LightDispatcher;