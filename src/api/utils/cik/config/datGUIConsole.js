
// dat.GUI console mirroring
// Access with >> dat.list

import Utils from "../Utils";

var defaultGUIParams = {publish: true, key: ''};

var dat = {
    guis: [],

    controllers: {
        Controller: function(target, key){

            this.label = key;

            var onChangeCallback;
            this.onChange = function(callback){
                onChangeCallback = callback;
            };

            let valueProp = {
                get: function(){
                    return target[key];
                },
                set: function(value){
                    target[key] = value;
                    if(onChangeCallback)
                        onChangeCallback();
                }
            };
            Object.defineProperty(this, 'value', valueProp);

            Object.defineProperties(this, {
                list: {
                    get: (function(){
                        let isFunction = typeof target[key] === 'function';
                        if(isFunction){
                            return function(){
                                return {
                                    get: function(){
                                        target[key]();
                                        return target[key];
                                    }
                                };
                            };
                        }
                        else{
                            return function(){
                                return valueProp;
                            };
                        }
                    })()
                }
            });

            this.step = function(){return this;};
            this.listen = function(){return this;};
            this.updateDisplay = function(){return this;};
        }
    },

    GUI: function(params){
        this.i = 0;
        this.data = {};
        this.__controllers = [];
        this.__folders = [];

        params = Utils.AssignUndefined(params, defaultGUIParams);

        this.label = params.label;

        if(params.publish)
            dat.guis.push(this);

        this.add = function(target, key){
            let controller = new dat.controllers.Controller(target, key);
            this.__controllers.push(controller);
            let isFunction = typeof target[key] === 'function';
            this.data[(this.i++).toString() + ') ' + controller.label + (isFunction ? '()' : '')] = controller;
            return controller;
        };

        this.addFolder = function(label){
            let folder = new dat.GUI({publish: false, key: label});
            this.__folders.push(folder);
            this.data[(this.i++).toString() + ') >> ' + label] = folder;
            return folder;
        };

        this.open = function(){return this;};

        Object.defineProperties(this, {
            domElement: {
                get: function(){
                    return document.createElement('div');
                }
            },
            list: {
                get: function(){
                    let result = {};
                    let keys = Object.keys(this.data);
                    let data = this.data;
                    for(var iKey = 0; iKey < keys.length; iKey++){
                        let key = keys[iKey];
                        let listProp = data[key].list;
                        Object.defineProperty(result, key, listProp.get ? 
                            listProp :
                            {
                                get: function(){
                                    return listProp;
                                }
                            }
                        );
                    }
                    return result;
                }
            }
        });

        this.destroy = function(){
            var index = dat.guis.indexOf(this);
            if(index !== -1)
                dat.guis.splice(index, 1);
        };
    }
};

Object.defineProperties(dat, {
    list: {
        get: function(){
            let result = [];
            for(var i = 0; i < this.guis.length; i++){
                result[i] = this.guis[i].list;
            }
            return result;
        }
    }
});

export default dat;