
class Signaler {
    constructor(){
        this.signals = {};
    }

    On(event, callback){
        if(this.signals[event] === undefined){
            this.signals[event] = [];
        }
        this.signals[event].push(callback);
    }

    Dispatch(event, ...args){
        var callbacks = this.signals[event];
        if(callbacks){
            for(var i = 0, len = callbacks.length; i < len; i++){
                callbacks[i](...args);
            }
        }
    }

}

export default Signaler;