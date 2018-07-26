import Utils from "./Utils";

const logType = {
    trace: 0,
    normal: 1,
    warn: 2
};

const logTypeLabel = {
    0: 'Trace',
    1: 'Log',
    2: 'Warn'
};

const defaultPrintFilter = {
    0: true,
    1: true,
    2: true
};

var programStartTime = Date.now();
var messages = [];
var warnOnce = {};

class Message {
    constructor(type, ...args){
        this.type = type;
        this.timestamp = Date.now();
        this.content = [];
        args.forEach(arg => {
            if(typeof arg === 'string'){
                this.content.push(arg);
            }
            else{
                try{
                    var json = JSON.stringify(arg).substr(0, 2000);
                    this.content.push(json);
                }
                catch(err){
                    this.content.push('  parse error: ' + err);
                }
            }
        });
    }

    ToString(){
        return ((this.timestamp - programStartTime) / 1000).toFixed(2) + ' ' + logTypeLabel[this.type];
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
            var message = new Message(logType.trace, ...args);
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
            var message = new Message(logType.normal, ...args);
            this.AddLog(message);
            if(this._toConsole){
                console.log(...args);
            }
        }
    }

    static Warn(...args){
        if(this._active){
            var message = new Message(logType.warn, ...args);
            this.AddLog(message);
            if(this._toConsole) console.warn(...args);
        }
    }

    static LogOnce(id, ...args){
        if(this._active && !warnOnce[id]){
            warnOnce[id] = true;
            Logger.Log(...args);
        }
    }

    static WarnOnce(id, ...args){
        if(this._active && !warnOnce[id]){
            warnOnce[id] = true;
            Logger.Warn(...args);
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