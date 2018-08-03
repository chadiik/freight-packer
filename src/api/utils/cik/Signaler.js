
class Signaler {
    constructor(){
        this.signals = {};
        this.dispatches = {};
    }

    BackListen(event, callback){
        var args = this.dispatches[event];
        if(args){
            callback(...args);
        }
    }

    On(event, callback){
        if(this.signals[event] === undefined){
            this.signals[event] = [];
        }
        this.signals[event].push(callback);
    }

    Off(event, callback){
        var callbacks = this.signals[event];
        if(callbacks){
            var index = callbacks.indexOf(callback);
            if(index != -1){
                callbacks.splice(index, 1);
            }
        }
    }

    Dispatch(event, ...args){
        this.dispatches[event] = args;
        var callbacks = this.signals[event];
        if(callbacks){
            for(var i = 0, len = callbacks.length; i < len; i++){
                callbacks[i](...args);
            }
        }
    }

}

export default Signaler;