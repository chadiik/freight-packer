import Utils from "../Utils";

const serializeModes = {
    none: 'none',
    json: 'json'
};

/**
 * @typedef ConfigParams
 * @property {Boolean} debug
 * @property {Boolean} save
 * @property {serializeModes} serializeMode
 */


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
    
    var propertyPath = key;
    
    key = key.split('.');
    var folder = isFolderGrouped ? key.slice(0, key.length - 1).join('.') : undefined;
    while (key.length > 1) obj = obj[key.shift()];
    return {
        id: (folder ? folder + '.' : '') + key[0],
        folder: folder,
        owner: obj,
        key: key[0],
        propertyPath: propertyPath
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
    var endKey = key.shift();
    if(obj[endKey].setHex){
        obj[endKey].setHex(val);
    }
    else{
        obj[endKey] = val;
    }
    return obj[endKey];
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

/** 
 * @typedef GUI
 * @property {HTMLElement} domElement
 */

class Shortcut{
    /**
     * @param {string} label 
     */
    constructor(label){
        this.label = label;

        ///** @type {Map<string, GUI>} */
        //this.folders = new Map();

        this.controller = {};
    }

    Add(label, target){
        label = label.replace(new RegExp(' ', 'g'), '_');
        this.controller[label] = target;
        Config.shortcutsGUI.add(this.controller, label);
        //console.log('added ' + label + ' shortcut to ' + this.label);
    }
}

/** @type {GUI} */
var shortcutsGUI;

/** @type {Map<string, Shortcut>} */
var shortcuts = new Map();

/** @type {Map<Object, Config>} */
var instances = new Map();


class Config {
    constructor(target){
        if(!Config.debug) 
            Config.debug = instances;
        instances.set(target, this);

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

    Serialize(){
        var data = {};
        this.keys.forEach(key => {
            let isController = key instanceof Controller;
            let keyInfo = createKeyInfo(this.target, isController ? key.property : key);
            let keyValue = keyInfo.owner[keyInfo.key];
            if(typeof keyValue !== 'function'){
                var saveValue = keyInfo.owner[keyInfo.key].isColor ? '0x' + Number.parseInt(keyValue.toJSON()).toString(16) : keyValue;
                data[keyInfo.propertyPath] = saveValue;
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

    /**
     * 
     * @param {Function} guiChanged 
     * @param {string} label 
     * @param {string} gui - or a dat.GUI object
     * @param {ConfigParams} params 
     */
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
            },

            Serialize: function(){
                if(scope.Update){
                    scope.Update();
                    var data = scope.Serialize();
                    var json = JSON.stringify(data);
                    console.log(data, json);
                }
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

        switch(params.serializeMode){
            default: break;
            case serializeModes.json:
                if(this.defaultsFolder === undefined) this.defaultsFolder = gui.addFolder('...');
                if(this.editing['editor.Serialize'] !== true){
                    this.defaultsFolder.add(editor, 'Serialize');
                    this.editing['editor.Serialize'] = true;
                }
                break;
        }

        this.gui = gui;
    }

    toJSON(){
        if(this.data === undefined) console.warn(this.target, 'is being saved with undefined data.');
        return this.data;
    }

    static get serializeModes(){
        return serializeModes;
    }

    static get shortcuts(){
        return shortcuts;
    }

    static get shortcutsGUI(){
        if(shortcutsGUI === undefined) shortcutsGUI = new (window.dat || require("./datGUIConsole").default).GUI({
            autoPlace: false
        });
        return shortcutsGUI;
    }

    /**
     * 
     * @param {string} property - #property marks a folder
     * @param {Array<string>} subProperties 
     * @returns returns the subProperties full paths
     */
    static Unroll(property, ...subProperties){
        var unrolled = [];
        subProperties.forEach(subProperty => {
            unrolled.push(property + '.' + subProperty);
        });
        return unrolled;
    }

    /**
     * @param {*} target 
     * @param {*} data 
     */
    static Load(target, data){
        var keys = Object.keys(data);
        keys.forEach(key => {
            setKey(target, key, data[key]);
        });

        if(instances.has(target) && instances.get(target).Update)
            instances.get(target).Update();
    }

    /**
     * @param {string} category
     * @param {string} label 
     * @param {Function} target 
     */
    static MakeShortcut(category, label, target){
        if(shortcuts.has(category) === false) shortcuts.set(category, new Shortcut(category));
        var shortcut = shortcuts.get(category);
        shortcut.Add(label, target);
    }
}

Config.Controller = Controller;

export default Config;