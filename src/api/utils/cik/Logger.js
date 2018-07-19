import Utils from "./Utils";

const logType = {
    tracing: 0,
    standard: 1,
    warning: 2
};

const defaultPrintFilter = {
    0: true,
    1: true,
    2: true
};

var messages = [];

class Message {
    constructor(type, ...args){
        this.type = type;
        var content = [];
        args.forEach(arg => {
            if(typeof arg === 'string'){
                content.push(arg);
            }
            else{
                try{
                    var json = JSON.parse(JSON.stringify(arg));
                    content.push(json);
                }
                catch(err){
                    content.push(err);
                }
            }
        });
    }

    ToString(){

    }
}

class Logger {

    static set active(value){
        this._active = value;
    }

    static set toConsole(value){
        this._toConsole = value;
    }

    static set traceToConsole(value){
        this._traceToConsole = value;
    }

    static AddLog(message){
        messages.push(message);
    }

    static Trace(...args){
        if(this._active){
            var message = new Message(logType.tracing, ...args);
            this.AddLog(message);
            if(this._toConsole || this._traceToConsole){
                console.groupCollapsed(...args);
                console.trace('stack');
                console.groupEnd();
            }
        }
    }

    static Log(...args){
        if(this._active){
            var message = new Message(logType.standard, ...args);
            this.AddLog(message);
            if(this._toConsole){
                console.log(...args);
            }
        }
    }

    static Warn(...args){
        if(this._active){
            var message = new Message(logType.warning, ...args);
            this.AddLog(message);
            if(this._toConsole) console.warn(...args);
        }
    }

    static Print(filter){
        Utils.AssignUndefined(filter, defaultPrintFilter);

        var output = 'Log:\n';
        messages.forEach(message => {
            if(filter[message.type]){
                output += message.ToString() + '\n';
            }
        });

        return output;
    }
}

Logger.active = true;

export default Logger;