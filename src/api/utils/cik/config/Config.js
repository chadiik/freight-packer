import Utils from "../Utils";

class Controller {
    constructor(property, min, max, step, onChange){
        this.property = property;
        this.min = min;
        this.max = max;
        this.step = step;
        this.onChange = onChange;
    }

    /**
     * @returns {Array<Controller>}
     */
    static Multiple(properties, min, max, step, onChange){
        var controllers = [];
        properties.forEach(property => {
            controllers.push(new Controller(property, min, max, step, onChange));
        });
        return controllers;
    }
}

function createKeyInfo(obj, key){
    var isFolderGrouped = key[0] == "#";
    if(isFolderGrouped)
        key = key.substr(1);
    
    key = key.split('.');
    var folder = isFolderGrouped ? key.slice(0, key.length - 1).join('.') : undefined;
    while (key.length > 1) obj = obj[key.shift()];
    return {
        id: (folder ? folder + '.' : '') + key[0],
        folder: folder,
        owner: obj,
        key: key[0]
    };
}

function getKey(obj, key){
    return key.split('.').reduce(function(a, b){
        return a && a[b];
    }, obj);
}

function setKey(obj, key, val){
    key = key.split('.');
    while (key.length > 1) obj = obj[key.shift()];
    return obj[key.shift()] = val;
}

function download(data, filename, type) {
    // https://stackoverflow.com/a/30832210/1712403
    var file = new Blob([data], {type: (type || 'text/plain')});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

const defaultEditParams = {
    save: true, debug: true
};

var debug = new Map();

class Config {
    constructor(target){
        if(!Config.debug) 
            Config.debug = debug;
        debug.set(target, this);

        this.target = target;
        this.keys = [];
    }

    Track(...args){
        var keys = this.keys;
        args.forEach(key => {
            keys.push(key);
        });
    }

    Snapshot(ignoreKeys){
        var data = {};
        var target = this.target;
        this.keys.forEach(key => {
            var isController = key instanceof Controller;
            var keyInfo = createKeyInfo(target, isController ? key.property : key);
            var keyValue = keyInfo.owner[keyInfo.key];
            if(typeof keyValue !== 'function'){
                data[keyInfo.id] = keyValue;
            }
            else if(ignoreKeys !== undefined){
                var warn = true;
                ignoreKeys.forEach(ignoredKey => {
                    if(ignoredKey === keyInfo.id){
                        warn = false;
                    }
                });
                if(warn) console.log('Config.Snapshot warning: "' + keyInfo.id + '" changes will be lost');
            }
        });
        return data;
    }

    Save(){
        if(this.Update){
            this.Update();
            this.data = this.Snapshot();
        }
    }

    Edit(guiChanged, label, gui, params){

        params = Utils.AssignUndefined(params, defaultEditParams);

        var controllers = [];
        var target = this.target;
        if(gui === undefined) {
            
            gui = new (window.dat || require("./datGUIConsole").default).GUI({
                autoPlace: true
            });
        }
        else if(label){
            gui = gui.addFolder(label);
        }

        if(this.editing === undefined){
            this.editing = {};
 
            this.Update = function(){
                require("./datGUIExtensions");
                
                gui.updateAll();
                guiChanged();
            };
 
            gui.add(this, 'Update');
        }

        this.keys.forEach(key => {
            var isController = key instanceof Controller;
            var keyInfo = createKeyInfo(target, isController ? key.property : key);
            if(this.editing[keyInfo.id] !== true){
                var folder = gui;
                if(keyInfo.folder){
                    require("./datGUIExtensions");

                    if(gui.find)
                        folder = gui.find(keyInfo.folder);
                    else
                        console.warn('gui extensions not found!');
                        
                    if(!folder)
                        folder = gui.addFolder(keyInfo.folder);
                }
                var addFunction = keyInfo.owner[keyInfo.key].isColor ? folder.addColor : folder.add;
                controllers.push(
                    ( isController && key.min !== undefined ? 
                        addFunction.call(folder, 
                            keyInfo.owner, keyInfo.key, key.min, key.max, key.step
                        ) :
                        addFunction.call(folder, 
                            keyInfo.owner, keyInfo.key
                        )
                    ) .onChange(key.onChange === undefined ? guiChanged : 
                        (function(){
                            key.onChange.call(keyInfo.owner);
                            guiChanged();
                        })
                    )
                );
                this.editing[keyInfo.id] = true;
            }
        });

        var scope = this;
        var editor = {
            Save: function(){
                scope.Save();
                var filename = label !== undefined ? (label + (label.indexOf('.json') === -1 ? '.json' : '')) : 'config.json';
                download(scope.data, filename);
            },

            Debug: function(){
                console.log(scope.target);
            }
        }
        if(params.save){
            if(this.defaultsFolder === undefined) this.defaultsFolder = gui.addFolder('...');
            if(this.editing['editor.Save'] !== true){
                this.defaultsFolder.add(editor, 'Save');
                this.editing['editor.Save'] = true;
            }
        }
        if(params.debug){
            if(this.defaultsFolder === undefined) this.defaultsFolder = gui.addFolder('...');
            if(this.editing['editor.Debug'] !== true){
                this.defaultsFolder.add(editor, 'Debug');
                this.editing['editor.Debug'] = true;
            }
        }

        this.gui = gui;
    }

    toJSON(){
        if(this.data === undefined) console.warn(this.target, 'is being saved with undefined data.');
        return this.data;
    }

    static Unroll(property, ...subProperties){
        var unrolled = [];
        subProperties.forEach(subProperty => {
            unrolled.push(property + '.' + subProperty);
        });
        return unrolled;
    }

    static Load(target, data){
        var keys = Object.keys(data);
        keys.forEach(key => {
            setKey(target, key, data[key]);
        });
    }
}

Config.Controller = Controller;

export default Config;