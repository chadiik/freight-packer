/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var trimVariableRegex = new RegExp(/(?:\d|_|-)+$/);
var twopi = 2 * Math.PI;
var goldenRatio = (1 + Math.sqrt(5)) / 2;
var goldenRatioConjugate = goldenRatio - 1;

var Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'Redefine',
        value: function Redefine(object, constructor) {
            var classProperties = object;
            var instanceProperties = object.prototype;

            var def = constructor(instanceProperties);

            Object.assign(def, classProperties);
            Object.assign(def.prototype, instanceProperties);
            Object.defineProperties(def, Object.getOwnPropertyDescriptors(classProperties));
            Object.defineProperties(def.prototype, Object.getOwnPropertyDescriptors(instanceProperties));

            return def;
        }

        /**
         * @template T
         * @param {T} target 
         * @param {Object} source 
         * @returns {T}
         */

    }, {
        key: 'AssignUndefined',
        value: function AssignUndefined(target, source) {
            if (target === undefined) {
                target = {};
                Object.assign(target, source);
                return target;
            }

            var keys = Object.keys(source);
            keys.forEach(function (key) {
                if (target[key] === undefined) target[key] = source[key];
            });
            return target;
        }
    }, {
        key: 'Snapshot',
        value: function Snapshot(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }, {
        key: 'GetRectOffset',
        value: function GetRectOffset(element) {
            var style = window.getComputedStyle(element),
                marginLeft = parseFloat(style.marginLeft),
                marginTop = parseFloat(style.marginTop),
                paddingLeft = parseFloat(style.paddingLeft),
                paddingTop = parseFloat(style.paddingTop);
            return { x: marginLeft + paddingLeft, y: marginTop + paddingTop };
        }
    }, {
        key: 'TrimVariable',
        value: function TrimVariable(input) {
            return input.replace(trimVariableRegex, '');
        }
    }, {
        key: 'LimitString',
        value: function LimitString(str, length) {
            if (str.length > length) str = str.substring(str.length - length);
            return str;
        }
    }, {
        key: 'LoopIndex',
        value: function LoopIndex(i, len) {
            i = i % len;
            if (i < 0) i = len + i;
            return i;
        }
    }, {
        key: 'FastCircleLoop',
        value: function FastCircleLoop(divisions, callback) {
            // ref: http://iquilezles.org/www/articles/sincos/sincos.htm
            var da = twopi / divisions;
            var a = Math.cos(da);
            var b = Math.sin(da);
            var cos = 1;
            var sin = 0;
            for (var i = 0; i < divisions; i++) {
                var nc = a * cos - b * sin;
                var ns = b * cos + a * sin;
                cos = nc;
                sin = ns;
                callback(cos, sin);
            }
        }
    }, {
        key: 'ColorPaletteAsVec3',
        value: function ColorPaletteAsVec3(t, a, b, c, d, color) {
            // ref: http://iquilezles.org/www/articles/palettes/palettes.htm
            // return a + b * cos( 6.28318 * ( c * t + d ) );
            color = color || new THREE.Color();
            var r = a.x + b.x * Math.cos(twopi * (c.x * t + d.x)),
                g = a.y + b.y * Math.cos(twopi * (c.y * t + d.y)),
                b = a.z + b.z * Math.cos(twopi * (c.z * t + d.z));
            return color.set(r, g, b);
        }

        /**
         * Returns the next value [0, 1] in the golden series
         * @param {Number} base 
         */

    }, {
        key: 'GoldenSeries',
        value: function GoldenSeries(base) {
            return (base + goldenRatioConjugate) % 1;
        }
    }, {
        key: 'VecToString',
        value: function VecToString(vector, fixed) {
            fixed = fixed || 8;
            return vector.x.toFixed(fixed) + ', ' + vector.y.toFixed(fixed) + (vector.z !== undefined ? ', ' + vector.z.toFixed(fixed) + (vector.w !== undefined ? ', ' + vector.w.toFixed(fixed) : '') : '');
        }
    }]);

    return Utils;
}();

/* harmony default export */ __webpack_exports__["default"] = (Utils);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(0);

// dat.GUI console mirroring
// Access with >> dat.list



var defaultGUIParams = { publish: true, key: '' };

var dat = {
    guis: [],

    controllers: {
        Controller: function Controller(target, key) {

            this.label = key;

            var onChangeCallback;
            this.onChange = function (callback) {
                onChangeCallback = callback;
            };

            var valueProp = {
                get: function get() {
                    return target[key];
                },
                set: function set(value) {
                    target[key] = value;
                    if (onChangeCallback) onChangeCallback();
                }
            };
            Object.defineProperty(this, 'value', valueProp);

            Object.defineProperties(this, {
                list: {
                    get: function () {
                        var isFunction = typeof target[key] === 'function';
                        if (isFunction) {
                            return function () {
                                return {
                                    get: function get() {
                                        target[key]();
                                        return target[key];
                                    }
                                };
                            };
                        } else {
                            return function () {
                                return valueProp;
                            };
                        }
                    }()
                }
            });

            this.step = function () {
                return this;
            };
            this.listen = function () {
                return this;
            };
            this.updateDisplay = function () {
                return this;
            };
        }
    },

    GUI: function GUI(params) {
        this.i = 0;
        this.data = {};
        this.__controllers = [];
        this.__folders = [];

        params = __WEBPACK_IMPORTED_MODULE_0__Utils__["default"].AssignUndefined(params, defaultGUIParams);

        this.label = params.label;

        if (params.publish) dat.guis.push(this);

        this.add = function (target, key) {
            var controller = new dat.controllers.Controller(target, key);
            this.__controllers.push(controller);
            var isFunction = typeof target[key] === 'function';
            this.data[(this.i++).toString() + ') ' + controller.label + (isFunction ? '()' : '')] = controller;
            return controller;
        };

        this.addFolder = function (label) {
            var folder = new dat.GUI({ publish: false, key: label });
            this.__folders.push(folder);
            this.data[(this.i++).toString() + ') >> ' + label] = folder;
            return folder;
        };

        this.open = function () {
            return this;
        };

        Object.defineProperties(this, {
            domElement: {
                get: function get() {
                    return document.createElement('div');
                }
            },
            list: {
                get: function get() {
                    var result = {};
                    var keys = Object.keys(this.data);
                    var data = this.data;

                    var _loop = function _loop() {
                        var key = keys[iKey];
                        var listProp = data[key].list;
                        Object.defineProperty(result, key, listProp.get ? listProp : {
                            get: function get() {
                                return listProp;
                            }
                        });
                    };

                    for (var iKey = 0; iKey < keys.length; iKey++) {
                        _loop();
                    }
                    return result;
                }
            }
        });

        this.destroy = function () {
            var index = dat.guis.indexOf(this);
            if (index !== -1) dat.guis.splice(index, 1);
        };
    }
};

Object.defineProperties(dat, {
    list: {
        get: function get() {
            var result = [];
            for (var i = 0; i < this.guis.length; i++) {
                result[i] = this.guis[i].list;
            }
            return result;
        }
    }
});

/* harmony default export */ __webpack_exports__["default"] = (dat);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Signaler = function () {
    function Signaler() {
        _classCallCheck(this, Signaler);

        this.signals = {};
    }

    _createClass(Signaler, [{
        key: "On",
        value: function On(event, callback) {
            if (this.signals[event] === undefined) {
                this.signals[event] = [];
            }
            this.signals[event].push(callback);
        }
    }, {
        key: "Off",
        value: function Off(event, callback) {
            var callbacks = this.signals[event];
            if (callbacks) {
                var index = callbacks.indexOf(callback);
                if (index != -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }, {
        key: "Dispatch",
        value: function Dispatch(event) {
            var callbacks = this.signals[event];
            if (callbacks) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                for (var i = 0, len = callbacks.length; i < len; i++) {
                    callbacks[i].apply(callbacks, args);
                }
            }
        }
    }]);

    return Signaler;
}();

/* harmony default export */ __webpack_exports__["default"] = (Signaler);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var logType = {
    trace: 0,
    normal: 1,
    warn: 2
};

var logTypeLabel = {
    0: 'Trace',
    1: 'Log',
    2: 'Warn'
};

var defaultPrintFilter = {
    0: true,
    1: true,
    2: true
};

var programStartTime = Date.now();
var messages = [];
var warnOnce = {};

var Message = function () {
    function Message(type) {
        var _this = this;

        _classCallCheck(this, Message);

        this.type = type;
        this.timestamp = Date.now();
        this.content = [];

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        args.forEach(function (arg) {
            if (typeof arg === 'string') {
                _this.content.push(arg);
            } else {
                try {
                    var json = JSON.stringify(arg).substr(0, 2000);
                    _this.content.push(json);
                } catch (err) {
                    _this.content.push('  parse error: ' + err);
                }
            }
        });
    }

    _createClass(Message, [{
        key: 'ToString',
        value: function ToString() {
            return ((this.timestamp - programStartTime) / 1000).toFixed(2) + ' ' + logTypeLabel[this.type];
        }
    }]);

    return Message;
}();

var Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);
    }

    _createClass(Logger, null, [{
        key: 'AddLog',
        value: function AddLog(message) {
            messages.push(message);
        }
    }, {
        key: 'Trace',
        value: function Trace() {
            if (this._active) {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                var message = new (Function.prototype.bind.apply(Message, [null].concat([logType.trace], args)))();
                this.AddLog(message);
                if (this._toConsole || this._traceToConsole) {
                    var _console;

                    (_console = console).groupCollapsed.apply(_console, args);
                    console.trace('stack');
                    console.groupEnd();
                }
            }
        }
    }, {
        key: 'Log',
        value: function Log() {
            if (this._active) {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                var message = new (Function.prototype.bind.apply(Message, [null].concat([logType.normal], args)))();
                this.AddLog(message);
                if (this._toConsole) {
                    var _console2;

                    (_console2 = console).log.apply(_console2, args);
                }
            }
        }
    }, {
        key: 'Warn',
        value: function Warn() {
            if (this._active) {
                var _console3;

                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                var message = new (Function.prototype.bind.apply(Message, [null].concat([logType.warn], args)))();
                this.AddLog(message);
                if (this._toConsole) (_console3 = console).warn.apply(_console3, args);
            }
        }
    }, {
        key: 'LogOnce',
        value: function LogOnce(id) {
            if (this._active && !warnOnce[id]) {
                warnOnce[id] = true;

                for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                    args[_key5 - 1] = arguments[_key5];
                }

                Logger.Log.apply(Logger, args);
            }
        }
    }, {
        key: 'WarnOnce',
        value: function WarnOnce(id) {
            if (this._active && !warnOnce[id]) {
                warnOnce[id] = true;

                for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                    args[_key6 - 1] = arguments[_key6];
                }

                Logger.Warn.apply(Logger, args);
            }
        }
    }, {
        key: 'Print',
        value: function Print(filter) {
            __WEBPACK_IMPORTED_MODULE_0__Utils__["default"].AssignUndefined(filter, defaultPrintFilter);

            var output = 'Log:\n';
            messages.forEach(function (message) {
                if (filter[message.type]) {
                    output += message.ToString() + '\n';
                }
            });

            return output;
        }
    }, {
        key: 'active',
        set: function set(value) {
            this._active = value;
        }
    }, {
        key: 'toConsole',
        set: function set(value) {
            this._toConsole = value;
        }
    }, {
        key: 'traceToConsole',
        set: function set(value) {
            this._traceToConsole = value;
        }
    }]);

    return Logger;
}();

Logger.active = true;

/* harmony default export */ __webpack_exports__["a"] = (Logger);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var serializeModes = {
    none: 'none',
    json: 'json'
};

/**
 * @typedef ConfigParams
 * @property {Boolean} debug
 * @property {Boolean} save
 * @property {serializeModes} serializeMode
 */

var Controller = function () {
    function Controller(property, min, max, step, onChange) {
        _classCallCheck(this, Controller);

        this.property = property;
        this.min = min;
        this.max = max;
        this.step = step;
        this.onChange = onChange;
    }

    /**
     * @returns {Array<Controller>}
     */


    _createClass(Controller, null, [{
        key: 'Multiple',
        value: function Multiple(properties, min, max, step, onChange) {
            var controllers = [];
            properties.forEach(function (property) {
                controllers.push(new Controller(property, min, max, step, onChange));
            });
            return controllers;
        }
    }]);

    return Controller;
}();

function createKeyInfo(obj, key) {
    var isFolderGrouped = key[0] == "#";
    if (isFolderGrouped) key = key.substr(1);

    var propertyPath = key;

    key = key.split('.');
    var folder = isFolderGrouped ? key.slice(0, key.length - 1).join('.') : undefined;
    while (key.length > 1) {
        obj = obj[key.shift()];
    }return {
        id: (folder ? folder + '.' : '') + key[0],
        folder: folder,
        owner: obj,
        key: key[0],
        propertyPath: propertyPath
    };
}

function getKey(obj, key) {
    return key.split('.').reduce(function (a, b) {
        return a && a[b];
    }, obj);
}

function setKey(obj, key, val) {
    key = key.split('.');
    while (key.length > 1) {
        obj = obj[key.shift()];
    }var endKey = key.shift();
    if (obj[endKey].isColor) {
        obj[endKey].setHex(val);
    } else {
        obj[endKey] = val;
    }
    return obj[endKey];
}

function download(data, filename, type) {
    // https://stackoverflow.com/a/30832210/1712403
    var file = new Blob([data], { type: type || 'text/plain' });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);else {
        // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

var defaultEditParams = {
    save: true, debug: true
};

/** 
 * @typedef GUI
 * @property {HTMLElement} domElement
 */

var Shortcut = function () {
    /**
     * @param {string} label 
     */
    function Shortcut(label) {
        _classCallCheck(this, Shortcut);

        this.label = label;

        ///** @type {Map<string, GUI>} */
        //this.folders = new Map();

        this.controller = {};
    }

    _createClass(Shortcut, [{
        key: 'Add',
        value: function Add(label, target) {
            label = label.replace(new RegExp(' ', 'g'), '_');
            this.controller[label] = target;
            Config.shortcutsGUI.add(this.controller, label);
            console.log('added ' + label + ' shortcut to ' + this.label);
        }
    }]);

    return Shortcut;
}();

/** @type {GUI} */


var shortcutsGUI;

/** @type {Map<string, Shortcut>} */
var shortcuts = new Map();

/** @type {Map<Object, Config>} */
var instances = new Map();

var Config = function () {
    function Config(target) {
        _classCallCheck(this, Config);

        if (!Config.debug) Config.debug = instances;
        instances.set(target, this);

        this.target = target;
        this.keys = [];
    }

    _createClass(Config, [{
        key: 'Track',
        value: function Track() {
            var keys = this.keys;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (key) {
                keys.push(key);
            });
        }
    }, {
        key: 'Snapshot',
        value: function Snapshot(ignoreKeys) {
            var data = {};
            var target = this.target;
            this.keys.forEach(function (key) {
                var isController = key instanceof Controller;
                var keyInfo = createKeyInfo(target, isController ? key.property : key);
                var keyValue = keyInfo.owner[keyInfo.key];
                if (typeof keyValue !== 'function') {
                    data[keyInfo.id] = keyValue;
                } else if (ignoreKeys !== undefined) {
                    var warn = true;
                    ignoreKeys.forEach(function (ignoredKey) {
                        if (ignoredKey === keyInfo.id) {
                            warn = false;
                        }
                    });
                    if (warn) console.log('Config.Snapshot warning: "' + keyInfo.id + '" changes will be lost');
                }
            });
            return data;
        }
    }, {
        key: 'Serialize',
        value: function Serialize() {
            var _this = this;

            var data = {};
            this.keys.forEach(function (key) {
                var isController = key instanceof Controller;
                var keyInfo = createKeyInfo(_this.target, isController ? key.property : key);
                var keyValue = keyInfo.owner[keyInfo.key];
                if (typeof keyValue !== 'function') {
                    var saveValue = keyInfo.owner[keyInfo.key].isColor ? '0x' + Number.parseInt(keyValue.toJSON()).toString(16) : keyValue;
                    data[keyInfo.propertyPath] = saveValue;
                }
            });
            return data;
        }
    }, {
        key: 'Save',
        value: function Save() {
            if (this.Update) {
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

    }, {
        key: 'Edit',
        value: function Edit(guiChanged, label, gui, params) {
            var _this2 = this;

            params = __WEBPACK_IMPORTED_MODULE_0__Utils__["default"].AssignUndefined(params, defaultEditParams);

            var controllers = [];
            var target = this.target;
            if (gui === undefined) {

                gui = new (window.dat || __webpack_require__(1).default).GUI({
                    autoPlace: true
                });
            } else if (label) {
                gui = gui.addFolder(label);
            }

            if (this.editing === undefined) {
                this.editing = {};

                this.Update = function () {
                    __webpack_require__(26);

                    gui.updateAll();
                    guiChanged();
                };

                gui.add(this, 'Update');
            }

            this.keys.forEach(function (key) {
                var isController = key instanceof Controller;
                var keyInfo = createKeyInfo(target, isController ? key.property : key);
                if (_this2.editing[keyInfo.id] !== true) {
                    var folder = gui;
                    if (keyInfo.folder) {
                        __webpack_require__(26);

                        if (gui.find) folder = gui.find(keyInfo.folder);else console.warn('gui extensions not found!');

                        if (!folder) folder = gui.addFolder(keyInfo.folder);
                    }
                    var addFunction = keyInfo.owner[keyInfo.key].isColor ? folder.addColor : folder.add;
                    controllers.push((isController && key.min !== undefined ? addFunction.call(folder, keyInfo.owner, keyInfo.key, key.min, key.max, key.step) : addFunction.call(folder, keyInfo.owner, keyInfo.key)).onChange(key.onChange === undefined ? guiChanged : function () {
                        key.onChange.call(keyInfo.owner);
                        guiChanged();
                    }));
                    _this2.editing[keyInfo.id] = true;
                }
            });

            var scope = this;
            var editor = {
                Save: function Save() {
                    scope.Save();
                    var filename = label !== undefined ? label + (label.indexOf('.json') === -1 ? '.json' : '') : 'config.json';
                    download(scope.data, filename);
                },

                Debug: function Debug() {
                    console.log(scope.target);
                },

                Serialize: function Serialize() {
                    if (scope.Update) {
                        scope.Update();
                        var data = scope.Serialize();
                        var json = JSON.stringify(data);
                        console.log(data, json);
                    }
                }
            };
            if (params.save) {
                if (this.defaultsFolder === undefined) this.defaultsFolder = gui.addFolder('...');
                if (this.editing['editor.Save'] !== true) {
                    this.defaultsFolder.add(editor, 'Save');
                    this.editing['editor.Save'] = true;
                }
            }
            if (params.debug) {
                if (this.defaultsFolder === undefined) this.defaultsFolder = gui.addFolder('...');
                if (this.editing['editor.Debug'] !== true) {
                    this.defaultsFolder.add(editor, 'Debug');
                    this.editing['editor.Debug'] = true;
                }
            }

            switch (params.serializeMode) {
                default:
                    break;
                case serializeModes.json:
                    if (this.defaultsFolder === undefined) this.defaultsFolder = gui.addFolder('...');
                    if (this.editing['editor.Serialize'] !== true) {
                        this.defaultsFolder.add(editor, 'Serialize');
                        this.editing['editor.Serialize'] = true;
                    }
                    break;
            }

            this.gui = gui;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            if (this.data === undefined) console.warn(this.target, 'is being saved with undefined data.');
            return this.data;
        }
    }], [{
        key: 'Unroll',


        /**
         * 
         * @param {string} property - #property marks a folder
         * @param {Array<string>} subProperties 
         * @returns returns the subProperties full paths
         */
        value: function Unroll(property) {
            var unrolled = [];

            for (var _len2 = arguments.length, subProperties = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                subProperties[_key2 - 1] = arguments[_key2];
            }

            subProperties.forEach(function (subProperty) {
                unrolled.push(property + '.' + subProperty);
            });
            return unrolled;
        }

        /**
         * @param {*} target 
         * @param {*} data 
         */

    }, {
        key: 'Load',
        value: function Load(target, data) {
            var keys = Object.keys(data);
            keys.forEach(function (key) {
                setKey(target, key, data[key]);
            });

            if (instances.has(target) && instances.get(target).Update) instances.get(target).Update();
        }

        /**
         * @param {string} category
         * @param {string} label 
         * @param {Function} target 
         */

    }, {
        key: 'MakeShortcut',
        value: function MakeShortcut(category, label, target) {
            if (shortcuts.has(category) === false) shortcuts.set(category, new Shortcut(category));
            var shortcut = shortcuts.get(category);
            shortcut.Add(label, target);
        }
    }, {
        key: 'serializeModes',
        get: function get() {
            return serializeModes;
        }
    }, {
        key: 'shortcuts',
        get: function get() {
            return shortcuts;
        }
    }, {
        key: 'shortcutsGUI',
        get: function get() {
            if (shortcutsGUI === undefined) shortcutsGUI = new (window.dat || __webpack_require__(1).default).GUI({
                autoPlace: false
            });
            return shortcutsGUI;
        }
    }]);

    return Config;
}();

Config.Controller = Controller;

/* harmony default export */ __webpack_exports__["default"] = (Config);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__TextField__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var _weight = Symbol('weight');

var CargoEntry = function () {
    function CargoEntry() {
        _classCallCheck(this, CargoEntry);

        this.type = 'CargoEntry';

        this.quantity = 0;
        this.properties = {};
        this.uid = '';
        this[_weight] = 0;

        /**
         * @type {Map<string, TextField>}
         */
        this.descriptions = new Map();
    }

    /** @returns {Number} */


    _createClass(CargoEntry, [{
        key: "SetUID",


        /**
         * @param {string} [uid] - You'll rarely need to provide this
         */
        value: function SetUID(uid) {
            this.uid = uid || THREE.Math.generateUUID();
            return this.uid;
        }
    }, {
        key: "Copy",
        value: function Copy(entry) {
            __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__["a" /* default */].Warn('CargoEntry.Copy is not implemented');
        }
    }, {
        key: "Clone",
        value: function Clone() {
            __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__["a" /* default */].Warn('CargoEntry.Clone is not implemented');
        }
    }, {
        key: "ToString",
        value: function ToString() {}
    }, {
        key: "weight",
        get: function get() {
            return this[_weight];
        },
        set: function set(value) {
            this[_weight] = value;
        }
    }]);

    return CargoEntry;
}();

/* harmony default export */ __webpack_exports__["a"] = (CargoEntry);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ContainingVolume__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var type = 'Container';

var Container = function () {
    function Container() {
        _classCallCheck(this, Container);

        /**
         * Containing volumes array
         * @type {Array<ContainingVolume>}
         */
        this.volumes = [];

        __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__["a" /* default */].WarnOnce('Container.constructor', 'weight, label not implemented');
    }

    _createClass(Container, [{
        key: "Add",
        value: function Add(volume) {
            this.volumes.push(volume);
        }
    }, {
        key: "toJSON",
        value: function toJSON() {
            return {
                type: type,
                volumes: this.volumes
            };
        }
    }, {
        key: "ToString",
        value: function ToString() {
            var result = type + '[';
            for (var i = 0, numVolumes = this.volumes.length; i < numVolumes; i++) {
                result += this.volumes[i].ToString() + (i < numVolumes - 1 ? ', ' : ']');
            }
            return result;
        }
    }, {
        key: "volume",
        get: function get() {
            var index = this.volumes.length - 1;
            return this.volumes[index];
        }
    }], [{
        key: "FromJSON",
        value: function FromJSON(data) {
            if (data.type !== type) console.warn('Data supplied is not: ' + type);

            var container = new Container();
            for (var i = 0, numVolumes = data.volumes.length; i < numVolumes; i++) {
                var containingVolume = __WEBPACK_IMPORTED_MODULE_0__ContainingVolume__["a" /* default */].FromJSON(data.volumes[i]);
                container.Add(containingVolume);
            }

            return container;
        }
    }]);

    return Container;
}();

/* harmony default export */ __webpack_exports__["a"] = (Container);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoList__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PackingSpace__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__afit_AFit__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_box_BoxEntry__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_cik_Signaler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__container_ContainingVolume__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_box_Dimensions__ = __webpack_require__(9);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }











function almost(n1, n2) {
    return Math.abs(n1 - n2) < .01;
}

/**
 * @typedef {Object} PackerParams
 * @property {import('../UX').default} ux
 */

///** @typedef {import('./afit/AFit').PackingResult} PackingResult */

var PackedCargo =
/**
 * @param {BoxEntry} entry 
 * @param {ContainingVolume} containingVolume 
 * @param {THREE.Vector3} position 
 */
function PackedCargo(entry, containingVolume, position, orientation) {
    _classCallCheck(this, PackedCargo);

    this.entry = entry;
    this.containingVolume = containingVolume;
    this.position = position;
    this.orientation = orientation;
};

var PackingResult = function PackingResult() {
    _classCallCheck(this, PackingResult);

    /** @type {Array<PackedCargo>} */
    this.packed = [];
};

function sumOfVolumes(items) {
    var sum = 0;
    for (var i = 0, len = items.length; i < len; i++) {
        sum += items[i].Volume;
    }return sum;
}

var _afit = Symbol('afit');
var defaultParams = {};
var signals = {
    packUpdate: 'packUpdate'
};

var Packer = function (_Signaler) {
    _inherits(Packer, _Signaler);

    /**
     * @param {PackerParams} params 
     */
    function Packer(params) {
        _classCallCheck(this, Packer);

        var _this = _possibleConstructorReturn(this, (Packer.__proto__ || Object.getPrototypeOf(Packer)).call(this));

        _this.params = __WEBPACK_IMPORTED_MODULE_4__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);

        _this[_afit] = new __WEBPACK_IMPORTED_MODULE_2__afit_AFit__["a" /* default */]();

        _this.packingSpace = new __WEBPACK_IMPORTED_MODULE_1__PackingSpace__["a" /* default */]();
        _this.cargoList = new __WEBPACK_IMPORTED_MODULE_0__CargoList__["a" /* default */]();
        return _this;
    }

    _createClass(Packer, [{
        key: "Solve",
        value: function Solve(arg) {
            if (arg === 'sim') this.SolveSim();else if (arg === 'brb') this.SolveBRB();else this.SolveAFit();
        }
    }, {
        key: "SolveAFit",
        value: function SolveAFit() {
            /** @type {AFit} */
            var afit = this[_afit];

            var Container = __webpack_require__(17).default;
            var Item = __webpack_require__(18).default;

            var containingVolume = this.packingSpace.current.volume;
            console.warn('Currently solves for 1 ContainingVolume', containingVolume);

            var d = containingVolume.dimensions;
            var container = new Container(containingVolume.uid, d.width, d.length, d.height);

            /** @type {Array<Box>} */
            var items = [];
            var entries = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.cargoList.groups.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var group = _step.value;

                    /** @type {BoxEntry} */
                    var entry = group.entry;
                    entries[entry.uid] = entry;
                    d = entry.dimensions;
                    var item = new Item(entry.uid, d.width, d.length, d.height, entry.quantity);
                    items.push(item);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Solving', items, ' in ', container);

            var startTime = performance.now();
            var result = afit.Solve(container, items);
            result.PackTimeInMilliseconds = Math.ceil(performance.now() - startTime);

            var containerVolume = container.Length * container.Width * container.Height;
            var itemVolumePacked = sumOfVolumes(result.PackedItems);
            var itemVolumeUnpacked = sumOfVolumes(result.UnpackedItems);

            result.PercentContainerVolumePacked = Math.floor(itemVolumePacked / containerVolume * 100 * 100) / 100;
            result.PercentItemVolumePacked = Math.floor(itemVolumePacked / (itemVolumePacked + itemVolumeUnpacked) * 100 * 100) / 100;

            var packingResult = new PackingResult();
            result.PackedItems.forEach(function (packedItem) {
                if (packedItem.IsPacked) {
                    var entry = entries[packedItem.ID];
                    var position = new THREE.Vector3(packedItem.CoordX + packedItem.PackDimX / 2, packedItem.CoordY + packedItem.PackDimY / 2, packedItem.CoordZ + packedItem.PackDimZ / 2);
                    var orientation = Item.ResolveOrientation(packedItem);
                    var packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                    packingResult.packed.push(packedCargo);
                }
            });

            this.Dispatch(signals.packUpdate, packingResult);
        }
    }, {
        key: "SolveCLP",
        value: function SolveCLP() {

            var CLPSolver = __webpack_require__(30);

            var containingVolume = this.packingSpace.current.volume;
            console.warn('Currently solves for 1 ContainingVolume', containingVolume);

            var d = containingVolume.dimensions;
            /** @type {CLPSolver.ContainerData} */
            var container = {
                length: d.length, width: d.width, height: d.height,
                mandatory: 0, weightCapacity: d.volume / 1000, cost: 1,
                quantity: 1
            };

            /** @type {Array<CLPSolver.ItemData>} */
            var items = [];
            var entries = {};
            /** @type {Array<Dimensions>} */
            var dimensions = [];
            var itemType = 1;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.cargoList.groups.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var group = _step2.value;

                    /** @type {BoxEntry} */
                    var entry = group.entry;
                    entries[itemType++] = entry;
                    dimensions.push(entry.dimensions);
                    d = entry.dimensions;

                    /** @type {CLPSolver.ItemData} */
                    var item = {
                        length: d.length, width: d.width, height: d.height,
                        xyRotatable: true, yzRotatable: true, mandatory: 1, profit: 0, weight: d.volume / 1000,
                        quantity: entry.quantity
                    };
                    items.push(item);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            console.log('entries:', entries);

            __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Solving', items, ' in ', container);

            var scope = this;

            function findEntry(w, l, h) {
                var matches = 0,
                    matched = -1;
                var volume = w * l * h;
                for (var i = 0; i < dimensions.length; i++) {
                    if (almost(volume, dimensions[i].volume)) {
                        matched = i;
                        matches++;
                    }
                }

                if (matches === 1) {
                    return entries[matched + 1];
                }

                return undefined;
            }

            /** @param {CLPSolver.SolutionData} solution */
            function onSolution(solution) {
                console.log(solution);
                var packedItems = solution.container.filter(function (container) {
                    return container !== null;
                })[0].items;
                var packingResult = new PackingResult();
                packedItems.forEach(function (packedItem) {
                    if (packedItem && packedItem.item_type !== 0) {
                        var w = packedItem.opposite_x - packedItem.origin_x,
                            h = packedItem.opposite_y - packedItem.origin_y,
                            l = packedItem.opposite_z - packedItem.origin_z;
                        var entry = entries[packedItem.item_type];
                        var position = new THREE.Vector3(packedItem.origin_x + w / 2, packedItem.origin_y + h / 2, packedItem.origin_z + l / 2);
                        var orientation = CLPSolver.ContainerItem.ResolveOrientation(packedItem.rotation);
                        var packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                        packedCargo.solution = packedItem;
                        packingResult.packed.push(packedCargo);
                    }
                });
                scope.Dispatch(signals.packUpdate, packingResult);
            }

            /** @type {CLPSolver.SolverOptions} */
            var solverOptions = {
                itemSortCriterion: 1,
                showProgress: false,
                cpuTimeLimit: 10
            };

            CLPSolver.signaler.On(CLPSolver.signals.solution, onSolution);
            CLPSolver.Execute(solverOptions, items, [container]);
        }
    }, {
        key: "SolveAAS",
        value: function SolveAAS() {
            var packedItems = [{ id: "1003", position: { x: 0, y: 0, z: 0 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1004", position: { x: 60, y: 0, z: 0 }, dimensions: { width: 30, depth: 20, height: 40 } }, { id: "1004", position: { x: 60, y: 20, z: 60 }, dimensions: { width: 20, depth: 30, height: 40 } }, { id: "1004", position: { x: 80, y: 20, z: 60 }, dimensions: { width: 20, depth: 30, height: 40 } }, { id: "1003", position: { x: 0, y: 60, z: 60 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1004", position: { x: 60, y: 60, z: 60 }, dimensions: { width: 30, depth: 20, height: 40 } }, { id: "1005", position: { x: 60, y: 80, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 80, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1003", position: { x: 0, y: 120, z: 60 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1005", position: { x: 60, y: 120, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 150, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 120, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 150, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1003", position: { x: 0, y: 180, z: 60 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1005", position: { x: 60, y: 180, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 60, y: 200, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 200, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1003", position: { x: 0, y: 240, z: 60 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1005", position: { x: 60, y: 240, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 270, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 240, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 270, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1003", position: { x: 0, y: 300, z: 60 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1005", position: { x: 60, y: 300, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 60, y: 320, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 320, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1003", position: { x: 0, y: 360, z: 60 }, dimensions: { width: 60, depth: 60, height: 60 } }, { id: "1005", position: { x: 0, y: 420, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 0, y: 440, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 0, y: 470, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 0, y: 500, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 0, y: 530, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 0, y: 550, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 30, y: 420, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 30, y: 440, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 30, y: 470, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 30, y: 500, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 30, y: 530, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 30, y: 550, z: 60 }, dimensions: { width: 30, depth: 20, height: 30 } }, { id: "1005", position: { x: 60, y: 360, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 390, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 420, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 450, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 480, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 510, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 60, y: 540, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 360, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 390, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 420, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 450, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 480, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 510, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 80, y: 540, z: 60 }, dimensions: { width: 20, depth: 30, height: 30 } }, { id: "1005", position: { x: 0, y: 0, z: 60 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 30, z: 60 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 60, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 90, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 120, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 150, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 180, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 210, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 240, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 270, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 300, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 330, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 360, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 390, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 420, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 450, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 480, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 510, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 540, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 0, z: 60 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 30, z: 60 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 60, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 90, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 120, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 150, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 180, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 210, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 240, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 270, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 300, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 330, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 360, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 390, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 420, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 450, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 480, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 510, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 540, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 0, z: 60 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 30, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 60, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 90, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 120, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 150, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 180, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 210, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 240, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 270, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 300, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 330, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 360, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 390, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 420, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 450, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 480, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 510, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 540, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 0, z: 80 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 30, z: 80 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 60, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 90, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 120, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 150, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 180, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 210, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 240, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 270, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 300, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 330, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 360, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 390, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 420, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 450, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 480, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 510, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 0, y: 540, z: 20 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 30, y: 0, z: 80 }, dimensions: { width: 30, depth: 30, height: 20 } }, { id: "1005", position: { x: 60, y: 0, z: 80 }, dimensions: { width: 30, depth: 30, height: 20 } }];

            var containingVolume = this.packingSpace.current.volume;
            console.warn('Currently solves for 1 ContainingVolume', containingVolume);

            var entries = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.cargoList.groups.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var group = _step3.value;

                    /** @type {BoxEntry} */
                    var entry = group.entry;
                    entries[entry.label] = entry;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var AASOrientation = __webpack_require__(54);

            console.log('entries:', entries);

            var scope = this;
            var packingResult = new PackingResult();
            packedItems.forEach(function (packedItem) {
                var w = packedItem.dimensions.width,
                    h = packedItem.dimensions.height,
                    l = packedItem.dimensions.depth;
                /** @type {BoxEntry} */
                var entry = entries[packedItem.id];
                var position = new THREE.Vector3(packedItem.position.x + w / 2, packedItem.position.z + h / 2, packedItem.position.y + l / 2);
                var orientation = AASOrientation.resolve(w, l, h, entry.dimensions);
                var packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                packedCargo.solution = packedItem;
                packingResult.packed.push(packedCargo);
            });
            scope.Dispatch(signals.packUpdate, packingResult);
        }
    }, {
        key: "SolveSim",
        value: function SolveSim() {
            var Bin = __webpack_require__(32).default;
            var Item = __webpack_require__(33).default;
            var SimPacker = __webpack_require__(55).default;

            var containingVolume = this.packingSpace.current.volume;
            console.warn('Currently solves for 1 ContainingVolume', containingVolume);

            var d = containingVolume.dimensions;
            var bin = new Bin(containingVolume.uid, d.width, d.height, d.length, containingVolume.weightCapacity);

            /** @type {Array<Box>} */
            var items = [];
            var entries = {};
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.cargoList.groups.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var group = _step4.value;

                    /** @type {BoxEntry} */
                    var entry = group.entry;
                    entries[entry.uid] = entry;
                    d = entry.dimensions;
                    for (var iQtt = 0; iQtt < entry.quantity; iQtt++) {
                        var item = new Item(entry.uid, d.width, d.height, d.length, entry.weight);
                        items.push(item);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Solving', items, ' in ', bin);

            var startTime = performance.now();
            var simPacker = new SimPacker([bin], items).pack();
            /** @type {Array<Box>} */
            var packedItems = simPacker.bins[0].items;
            __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Solved in ' + Math.ceil(performance.now() - startTime) + ':', packedItems);

            var packingResult = new PackingResult();
            packedItems.forEach(function (packedItem) {
                var entry = entries[packedItem.name];

                var d = packedItem.getDimension();
                var position = new THREE.Vector3(packedItem.position[0] + d[0] / 2, packedItem.position[1] + d[1] / 2, packedItem.position[2] + d[2] / 2);

                var orientation = packedItem.getRotationTypeString();

                var packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                packingResult.packed.push(packedCargo);
            });

            this.Dispatch(signals.packUpdate, packingResult);
        }
    }, {
        key: "SolveBRB",
        value: function SolveBRB() {

            var BRB = __webpack_require__(56);

            var containingVolume = this.packingSpace.current.volume;
            console.warn('Currently solves for 1 ContainingVolume', containingVolume);

            var d = containingVolume.dimensions;

            /** @type {import('./brb/BRB').Container} */
            var container = {
                dimensions: [d.width, d.height, d.length],
                weight: containingVolume.weightCapacity
            };

            /** @type {Array<import('./brb/BRB').Item>} */
            var items = [];
            var entries = {};
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.cargoList.groups.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var group = _step5.value;

                    /** @type {BoxEntry} */
                    var entry = group.entry;
                    entries[entry.uid] = entry;
                    d = entry.dimensions;
                    for (var iQtt = 0; iQtt < entry.quantity; iQtt++) {
                        /** @type {import('./brb/BRB').Item} */
                        var item = {
                            id: entry.uid,
                            dimensions: [d.width, d.height, d.length],
                            weight: entry.weight
                        };
                        items.push(item);
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Solving', items, ' in ', container);

            var startTime = performance.now();
            var result = BRB.pack(container, items);

            if (result.failed) {
                console.log('BRB packing failed: ' + result.failed);
                return;
            }

            __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Solved in ' + Math.ceil(performance.now() - startTime) + ':', result);

            var packingResult = new PackingResult();
            var iPackings = 0;
            /** @param {import('./brb/BRB').Placement} placement */
            function collectPlacements(placement) {
                /** @type {BoxEntry} */
                var entry = entries[placement.id];

                var containerOffset = iPackings * containingVolume.dimensions.width;
                var p = placement.position;
                var d = placement.dimensions;
                var position = new THREE.Vector3(p[0] + d[0] / 2, p[1] + d[1] / 2, p[2] + d[2] / 2);
                position.set(position.z, position.y, position.x);
                position.x += containerOffset;
                var packedDimensions = d;
                packedDimensions = [d[2], d[1], d[0]];

                var ed = entry.dimensions;
                var orientation = BRB.resolveOrientation(packedDimensions, [ed.width, ed.height, ed.length]);

                var packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                packingResult.packed.push(packedCargo);
            }

            /** @param {import('./brb/BRB').Packing} packing */
            function collectPackings(packing) {
                packing.placements.forEach(collectPlacements);
                iPackings++;
            }
            result.packings.forEach(collectPackings);

            this.Dispatch(signals.packUpdate, packingResult);
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return Packer;
}(__WEBPACK_IMPORTED_MODULE_5__utils_cik_Signaler__["default"]);

Packer.PackingResult = PackingResult;

/* harmony default export */ __webpack_exports__["a"] = (Packer);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Volume__ = __webpack_require__(52);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var type = 'ContainingVolume';

var ContainingVolume = function (_Volume) {
    _inherits(ContainingVolume, _Volume);

    function ContainingVolume() {
        _classCallCheck(this, ContainingVolume);

        var _this = _possibleConstructorReturn(this, (ContainingVolume.__proto__ || Object.getPrototypeOf(ContainingVolume)).call(this));

        _this.SetUID();
        return _this;
    }

    _createClass(ContainingVolume, [{
        key: 'SetUID',


        /**
         * @param {string} [uid] - You'll rarely need to provide this
         */
        value: function SetUID(uid) {
            this.uid = uid || THREE.Math.generateUUID();
            return this.uid;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var json = _get(ContainingVolume.prototype.__proto__ || Object.getPrototypeOf(ContainingVolume.prototype), 'toJSON', this).call(this);
            json.type = type;
            return json;
        }
    }, {
        key: 'ToString',
        value: function ToString() {
            return _get(ContainingVolume.prototype.__proto__ || Object.getPrototypeOf(ContainingVolume.prototype), 'ToString', this).call(this);
        }
    }, {
        key: 'weightCapacity',
        get: function get() {
            return this.dimensions.volume / 1000;
        }
    }], [{
        key: 'FromJSON',
        value: function FromJSON(data) {
            if (data.type !== type) console.warn('Data supplied is not: ' + type);

            var containingVolume = new ContainingVolume();
            __WEBPACK_IMPORTED_MODULE_0__Volume__["a" /* default */].FromJSON(data, containingVolume);

            return containingVolume;
        }
    }]);

    return ContainingVolume;
}(__WEBPACK_IMPORTED_MODULE_0__Volume__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ContainingVolume);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var type = 'Dimensions';
var _vec3 = Symbol('vec3');

var epsilon = Math.pow(2, -52);
var numberType = 'number';

var Dimensions = function () {
    /**
     * @param {Number} width 
     * @param {Number} length 
     * @param {Number} height 
     */
    function Dimensions(width, length, height) {
        _classCallCheck(this, Dimensions);

        if (width === undefined) width = 0;
        if (length === undefined) length = 0;
        if (height === undefined) height = 0;

        this.Set(width, length, height);
        this[_vec3] = new THREE.Vector3();
    }

    /**
     * @param {Number} width 
     * @param {Number} length 
     * @param {Number} height 
     */


    _createClass(Dimensions, [{
        key: 'Set',
        value: function Set(width, length, height) {
            this.width = width;
            this.length = length;
            this.height = height;
        }

        /**
         * Returns a THREE.Vector3 representation of the dimensions
         * Beware of ordering: x=width, y=height and z=length
         * @returns {THREE.Vector3}
         */

    }, {
        key: 'Abs',
        value: function Abs() {
            if (this.width < 0) this.width = -this.width;
            if (this.length < 0) this.length = -this.length;
            if (this.height < 0) this.height = -this.height;
            return this;
        }
    }, {
        key: 'Compare',
        value: function Compare(dimensions) {
            var d = this.volume - dimensions.volume;
            if (d < -epsilon) return -1;
            if (d > epsilon) return 1;
            return 0;
        }
    }, {
        key: 'Copy',
        value: function Copy(dimensions) {
            this.Set(dimensions.width, dimensions.length, dimensions.height);
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var dimensions = new Dimensions(this.width, this.length, this.height);
            return dimensions;
        }
    }, {
        key: 'ToString',
        value: function ToString() {
            return this.width.toFixed(2) + 'x' + this.length.toFixed(2) + 'x' + this.height.toFixed(2);
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                type: type,
                width: this.width,
                length: this.length,
                height: this.height
            };
        }
    }, {
        key: 'vec3',
        get: function get() {
            return this[_vec3].set(this.width, this.height, this.length);
        }
    }, {
        key: 'volume',
        get: function get() {
            return this.width * this.height * this.length;
        }
    }], [{
        key: 'IsVolume',
        value: function IsVolume(dimensions) {
            return Dimensions.Assert(dimensions) && dimensions.width > epsilon && dimensions.length > epsilon && dimensions.height > epsilon;
        }
    }, {
        key: 'FromJSON',
        value: function FromJSON(data) {
            if (data.type !== type) console.warn('Data supplied is not: ' + type);

            var dimensions = new Dimensions(data.width, data.length, data.height);
            return dimensions;
        }
    }, {
        key: 'Assert',
        value: function Assert(dimensions) {
            return dimensions instanceof Dimensions && _typeof(dimensions.width) === numberType && _typeof(dimensions.length) === numberType && _typeof(dimensions.height) === numberType;
        }
    }]);

    return Dimensions;
}();

/* harmony default export */ __webpack_exports__["a"] = (Dimensions);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PackingProperty__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Dimensions__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_TextField__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_CargoEntry__ = __webpack_require__(5);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






/**
 * @typedef {Object} BoxEntryProperties
 * @property {SupportsStacking} stacking
 * @property {RotationConstraint} rotation
 * @property {TranslationConstraint} translation
 */

var numEntries = 0;
function getDefaultLabel() {
    return 'Box ' + numEntries.toString();
}

var epsilon = Math.pow(2, -52);
var numberType = 'number';

var BoxEntry = function (_CargoEntry) {
    _inherits(BoxEntry, _CargoEntry);

    function BoxEntry() {
        _classCallCheck(this, BoxEntry);

        numEntries++;

        var _this = _possibleConstructorReturn(this, (BoxEntry.__proto__ || Object.getPrototypeOf(BoxEntry)).call(this));

        _this.type = 'BoxEntry';

        _this.dimensions = new __WEBPACK_IMPORTED_MODULE_1__Dimensions__["a" /* default */](0, 0, 0);

        _this.weight = 0;
        _this.quantity = 1;

        /**
         * @type {BoxEntryProperties}
         */
        _this.properties;

        _this.properties.stacking = new __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["b" /* SupportsStacking */]();
        _this.properties.rotation = new __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["a" /* RotationConstraint */]();
        _this.properties.translation = new __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["c" /* TranslationConstraint */]();

        _this.descriptions.set('label', new __WEBPACK_IMPORTED_MODULE_2__common_TextField__["a" /* default */]('label', getDefaultLabel()));
        return _this;
    }

    _createClass(BoxEntry, [{
        key: "Reset",
        value: function Reset() {
            this.weight = 0;
            this.quantity = 1;

            this.properties.stacking.Reset();
            this.properties.rotation.Reset();
            this.properties.translation.Reset();

            var label = this.descriptions.get('label');
            label.content = __WEBPACK_IMPORTED_MODULE_2__common_TextField__["a" /* default */].defaultContent;
            this.descriptions.clear();
            this.descriptions.set('label', label);
        }

        /**
         * @param {BoxEntry} entry 
         */

    }, {
        key: "Copy",
        value: function Copy(entry) {
            this.dimensions.Copy(entry.dimensions);
            this.weight = entry.weight;
            this.quantity = entry.quantity;

            this.properties.stacking.Copy(entry.properties.stacking);
            this.properties.rotation.Copy(entry.properties.rotation);
            this.properties.translation.Copy(entry.properties.translation);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = entry.descriptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var key = _ref2[0];
                    var field = _ref2[1];

                    var own = this.descriptions.get(key);
                    if (own) own.Copy(field);else this.descriptions.set(key, field.Clone());
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "Clone",
        value: function Clone() {
            var entry = new BoxEntry();

            entry.dimensions = this.dimensions.Clone();

            entry.weight = this.weight;
            entry.quantity = this.quantity;

            entry.properties.stacking = this.properties.stacking.Clone();
            entry.properties.rotation = this.properties.rotation.Clone();
            entry.properties.translation = this.properties.translation.Clone();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.descriptions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ref3 = _step2.value;

                    var _ref4 = _slicedToArray(_ref3, 2);

                    var key = _ref4[0];
                    var field = _ref4[1];

                    entry.descriptions.set(key, field.Clone());
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return entry;
        }
    }, {
        key: "ToString",
        value: function ToString() {
            return '\'' + this.descriptions.get('label').content + '\': ' + this.dimensions.ToString();
        }

        /**
         * @param {BoxEntry} entry 
         */

    }, {
        key: "weight",
        set: function set(value) {
            return _get(BoxEntry.prototype.__proto__ || Object.getPrototypeOf(BoxEntry.prototype), "weight", this);
        },
        get: function get() {
            return this.dimensions.volume / 1000;
        }

        /**
         * @returns {string}
         */

    }, {
        key: "label",
        get: function get() {
            var field = this.descriptions.get('label');
            return field ? field.content : undefined;
        },
        set: function set(value) {
            var field = this.descriptions.get('label');
            if (field) field.content = value;else this.descriptions.set('label', new __WEBPACK_IMPORTED_MODULE_2__common_TextField__["a" /* default */]('label', value));
        }
    }], [{
        key: "Assert",
        value: function Assert(entry) {
            return entry instanceof BoxEntry && __WEBPACK_IMPORTED_MODULE_1__Dimensions__["a" /* default */].Assert(entry.dimensions) && entry.properties && entry.descriptions && entry.weight !== undefined && entry.quantity !== undefined && _typeof(entry.weight) === numberType && _typeof(entry.quantity) === numberType && __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["b" /* SupportsStacking */].Assert(entry.properties.stacking) && __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["a" /* RotationConstraint */].Assert(entry.properties.rotation) && __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["c" /* TranslationConstraint */].Assert(entry.properties.translation);
        }
    }]);

    return BoxEntry;
}(__WEBPACK_IMPORTED_MODULE_3__common_CargoEntry__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (BoxEntry);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_input_Input__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_Controller__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scene_Renderer__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scene_Camera__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HUDView__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__UX__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_cik_Signaler__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











var signals = {
    init: 'init',
    started: 'started',
    paused: 'paused',
    stopped: 'stopped'
};

var SceneSetup = function (_Signaler) {
    _inherits(SceneSetup, _Signaler);

    /**
     * 
     * @param {HTMLDivElement} containerDiv 
     * @param {UX} ux 
     */
    function SceneSetup(containerDiv, ux) {
        _classCallCheck(this, SceneSetup);

        var _this = _possibleConstructorReturn(this, (SceneSetup.__proto__ || Object.getPrototypeOf(SceneSetup)).call(this));

        _this.domElement = containerDiv;
        _this.ux = ux;
        return _this;
    }

    _createClass(SceneSetup, [{
        key: 'Init',
        value: function Init() {

            var quality = new __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__["a" /* default */]().Common(2);

            var units = this.ux.params.units;
            var controllerParams = {};
            this.sceneController = new __WEBPACK_IMPORTED_MODULE_2__scene_Controller__["a" /* default */](controllerParams);

            /** @type {import('../scene/Renderer').RendererParams} */
            var rendererParams = {};
            Object.assign(rendererParams, quality);
            this.sceneRenderer = new __WEBPACK_IMPORTED_MODULE_3__scene_Renderer__["a" /* default */](rendererParams);
            this.domElement.appendChild(this.sceneRenderer.renderer.domElement);

            /** @type {import('./Camera').CameraParams} */
            var cameraParams = { fov: 30, aspect: 1, near: 1 * units, far: 3000 * units };
            this.cameraController = new __WEBPACK_IMPORTED_MODULE_4__scene_Camera__["a" /* default */](cameraParams);
            this.cameraController.OrbitControls(this.sceneRenderer.renderer.domElement);

            this.input = new __WEBPACK_IMPORTED_MODULE_0__utils_cik_input_Input__["a" /* default */](this.domElement);
            this.input.camera = this.cameraController.camera;

            var sceneRendererRef = this.sceneRenderer;
            var appCameraRef = this.cameraController.camera;
            this.input.onResize.push(function (screen) {
                sceneRendererRef.ReconfigureViewport(screen, appCameraRef);
            });

            // hud
            if (this.ux.params.hud) {
                /** @type {import('../view/HUDView').HUDViewParams} */
                var hudParams = { ux: this.ux };
                /** @type {import('./Camera').CameraParams} */
                var hudCameraParams = __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["default"].AssignUndefined({ fov: 15 }, cameraParams);
                this.hud = new __WEBPACK_IMPORTED_MODULE_5__HUDView__["a" /* default */](hudParams, hudCameraParams);
                var hudCameraRef = this.hud.cameraController.camera;
                this.input.onResize.push(function (screen) {
                    sceneRendererRef.AdjustCamera(screen, hudCameraRef);
                });

                this.sceneRenderer.renderer.autoClear = false;
            }
            // /hud

            // Comeplete setup
            var setupParams = {
                gridHelper: true

                // Initial camera move
            };this.cameraController.position.x = 100 * units;
            this.cameraController.position.y = 40 * units;
            this.cameraController.position.z = 100 * units;
            this.cameraController.SetTarget(new THREE.Vector3());

            // Env
            if (setupParams.gridHelper) {
                var gridHelper = new THREE.GridHelper(200 * units, 20);
                this.sceneController.AddDefault(gridHelper);
            }

            if (this.ux.params.configure) {
                this.Configure();
            }

            var scope = this;
            return new Promise(function (resolve, reject) {
                scope.Dispatch(signals.init);
                resolve();
            });
        }
    }, {
        key: 'Start',
        value: function Start() {
            if (this.Update === undefined) {
                var scope = this;
                var sceneRenderer = this.sceneRenderer;
                var scene1 = this.sceneController.scene,
                    camera1 = this.cameraController.camera;

                if (this.ux.params.hud) {
                    var hud = this.hud;
                    var scene2 = hud.scene,
                        camera2 = hud.cameraController.camera;

                    this.Update = function (timestamp) {
                        scope.animationFrameID = requestAnimationFrame(scope.Update);

                        scope.input.Update();
                        scope.cameraController.Update();
                        hud.cameraController.Update();

                        sceneRenderer.renderer.clear();
                        sceneRenderer.Render(scene1, camera1);
                        sceneRenderer.renderer.clearDepth();
                        sceneRenderer.Render(scene2, camera2);
                    };
                } else {
                    this.Update = function (timestamp) {
                        scope.animationFrameID = requestAnimationFrame(scope.Update);

                        scope.input.Update();
                        scope.cameraController.Update();

                        sceneRenderer.Render(scene1, camera1);
                    };
                }
            }

            this.Update();
            this.input.screenNeedsUpdate = true;
            this.input.cameraNeedsUpdate = true;

            this.Dispatch(signals.started);
        }
    }, {
        key: 'Pause',
        value: function Pause() {
            if (this.animationFrameID) {
                cancelAnimationFrame(this.animationFrameID);
            }

            this.Dispatch(signals.paused);
        }
    }, {
        key: 'Stop',
        value: function Stop() {
            if (this.animationFrameID) {
                cancelAnimationFrame(this.animationFrameID);
            }
            this.input.Dispose();
            this.sceneRenderer.Dispose();

            this.Dispatch(signals.stopped);
        }
    }, {
        key: 'DefaultLights',
        value: function DefaultLights(controller, configure, helpers) {

            var units = this.ux.params.units;

            var ambientLight = new THREE.AmbientLight(0x404040);

            var directionalLight = new THREE.DirectionalLight(0xfeeedd);
            directionalLight.position.set(300 * units, 175 * units, 125 * units);

            controller.ambientContainer.add(ambientLight);
            controller.ambientContainer.add(directionalLight);

            if (this.ux.params.configure && configure) {
                var onGUIChanged = function onGUIChanged() {
                    dl.shadow.camera.updateProjectionMatrix();

                    if (helpers) {
                        dlHelper.update();
                        dlCameraHelper.update();
                    }
                };

                var Smart = __webpack_require__(13).default;
                var Config = __webpack_require__(4).default;
                var Control3D = __webpack_require__(14).default;

                var dl = directionalLight;
                var _smart = new Smart(dl, 'Directional light');
                _smart.MakeShortcut('Configure');

                var lightController = ['color', 'intensity', 'castShadow'];
                var shadowControllers = ['shadow.bias', 'shadow.radius', 'shadow.mapSize.x', 'shadow.mapSize.y'];
                //let sc = dl.shadow.camera as THREE.OrthographicCamera;
                var shadowCameraControllers = Config.Unroll('#shadow.camera', 'left', 'top', 'right', 'bottom', 'near', 'far');

                var dlHelper = void 0,
                    dlCameraHelper = void 0;
                if (helpers) {
                    dlHelper = new THREE.DirectionalLightHelper(dl, 5);
                    this.sceneController.AddDefault(dlHelper);
                    dlCameraHelper = new THREE.CameraHelper(dl.shadow.camera);
                    this.sceneController.AddDefault(dlCameraHelper);
                }

                _smart.Config.apply(_smart, ['Directional light + shadow', dl, onGUIChanged, Smart.serializeModes.json].concat(lightController, shadowControllers, _toConsumableArray(shadowCameraControllers)));
            }

            return [ambientLight, directionalLight];
        }
    }, {
        key: 'Configure',
        value: function Configure() {

            var Smart = __webpack_require__(13).default;
            var Config = __webpack_require__(4).default;
            var Control3D = __webpack_require__(14).default;

            var scope = this;

            var appControl3D = Control3D.Configure('app', this.cameraController.camera, this.sceneRenderer.renderer.domElement);
            this.sceneController.AddDefault(appControl3D.control);

            if (this.ux.params.hud) {
                var onGUIChanged = function onGUIChanged() {
                    console.log('Camera changed');
                };

                var hudControl3D = Control3D.Configure('hud', this.hud.cameraController.camera, this.sceneRenderer.renderer.domElement);
                this.hud.AddDefault(hudControl3D.control);

                var hud = this.hud;


                var toggle = false;
                var control = {
                    toggleOrbitOwner: function toggleOrbitOwner() {
                        if (toggle) {
                            if (!hud.cameraController.orbitControls) {
                                hud.cameraController.OrbitControls(scope.sceneRenderer.renderer.domElement);
                            }
                            scope.cameraController.Hold();
                            hud.cameraController.Release();
                        } else {
                            scope.cameraController.Release();
                            hud.cameraController.Hold();
                        }
                        toggle = !toggle;
                    },
                    hudCam: hud.cameraController,
                    print: function print() {
                        smart.config.Update();
                        console.group('hudCam properties');
                        console.log('position', __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["default"].VecToString(hud.cameraController.position, 1));
                        console.log('rotation', __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["default"].VecToString(hud.cameraController.rotation, 3));
                        console.groupEnd();
                    }
                };

                control.toggleOrbitOwner();

                var smart = new Smart(this, 'HUDView');
                smart.MakeShortcut('Configure');
                var rotationProperties = Config.Unroll('#hudCam.rotation', 'x', 'y', 'z');
                var rotationControllers = Config.Controller.Multiple(rotationProperties, 0, 2 * Math.PI, 2 * Math.PI / 360);
                smart.Config.apply(smart, [null, control, onGUIChanged, Smart.serializeModes.none, 'toggleOrbitOwner', 'print', 'hudCam.camera.fov'].concat(_toConsumableArray(Config.Unroll('#hudCam.position', 'x', 'y', 'z')), _toConsumableArray(rotationControllers)));

                console.log('HUDView config', smart.config.gui.list || smart);
            }
        }
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return SceneSetup;
}(__WEBPACK_IMPORTED_MODULE_8__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (SceneSetup);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__ = __webpack_require__(0);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * @typedef UXParams
 * @property {Boolean} hud - Create a hud controller (Scene, camera, loop, etc.)
 * @property {Boolean} configure - Execute helpers that allow configuration
 * @property {Number} units - Conversion to unit employed, default=1 for inches, for meters: units=0.0254
 */
var defaultParams = {
    hud: true,
    configure: false,
    units: 1
};

var UX =
/**
 * 
 * @param {UXParams} params 
 */
function UX(params) {
    _classCallCheck(this, UX);

    this.params = __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);
};

/* harmony default export */ __webpack_exports__["a"] = (UX);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UIUtils__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Config__ = __webpack_require__(4);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



//import dat from "./datGUIConsole";

var serializeModes = __WEBPACK_IMPORTED_MODULE_1__Config__["default"].serializeModes;

var current = undefined,
    onFocus = [],
    onFocusLost = [];

var Smart = function () {
    /**
     * @param {*} target 
     * @param {string} label 
     */
    function Smart(target, label) {
        _classCallCheck(this, Smart);

        this.target = target;
        this.label = label;

        var scope = this;

        this.gui = new (window.dat || __webpack_require__(1).default).GUI({ autoPlace: false });
        this.draggable = new __WEBPACK_IMPORTED_MODULE_0__UIUtils__["a" /* Draggable */](this.label, 250);
        this.draggable.Add(this.gui.domElement);
        this.draggable.closeBtn.onclick = function () {
            scope.Hide();
        };

        var ui = __WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].Add(this.draggable);
        this.draggable.Hide();

        this.onFocus = [];
        this.onFocusLost = [];
    }

    _createClass(Smart, [{
        key: "Delete",
        value: function Delete() {
            this.Hide();
            this.draggable.Delete();
            this.gui.destroy();
            this.onFocus.length = this.onFocusLost.length = 0;
        }
    }, {
        key: "UpdateGUI",
        value: function UpdateGUI() {
            Smart.UpdateGUI(this.gui);
        }
    }, {
        key: "Hide",
        value: function Hide() {
            this.visible = false;
            this.draggable.Hide();
            Smart.SetCurrent(undefined);
        }
    }, {
        key: "Show",
        value: function Show() {
            if (current !== undefined) {
                if (current === this) return;

                var oldPos = current.draggable.GetPosition();
                this.draggable.SetPosition(oldPos.x, oldPos.y);

                current.Hide();
            }
            this.visible = true;
            this.draggable.Show();
            __WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].AddStyle(this.draggable.domElement, __WEBPACK_IMPORTED_MODULE_0__UIUtils__["c" /* styles */].UIWiggleAnim);
            Smart.SetCurrent(this);

            this.UpdateGUI();
        }

        /**
         * 
         * @param {string} folderName 
         * @param {*} target 
         * @param {Function} guiChanged 
         * @param {serializeModes} serializeMode
         * @param {Array<string|Config.Controller>} args 
         */

    }, {
        key: "Config",
        value: function Config(folderName, target, guiChanged, serializeMode) {
            var _config;

            this.config = new __WEBPACK_IMPORTED_MODULE_1__Config__["default"](target);

            for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
                args[_key - 4] = arguments[_key];
            }

            (_config = this.config).Track.apply(_config, args);
            this.config.Edit(guiChanged, folderName, this.gui, { serializeMode: serializeMode, save: false });
            return this.config.gui;
        }

        /**
         * @param {string} category 
         */

    }, {
        key: "MakeShortcut",
        value: function MakeShortcut(category) {
            Smart.MakeShortcut(category, this);
        }
    }], [{
        key: "MakeShortcut",


        /**
         * @param {string} category 
         * @param {Smart} target 
         */
        value: function MakeShortcut(category, target) {
            __WEBPACK_IMPORTED_MODULE_1__Config__["default"].MakeShortcut(category, target.label, function () {
                if (target.visible) {
                    target.Hide();
                } else {
                    target.Show();
                }
            });
        }
    }, {
        key: "SetCurrent",
        value: function SetCurrent(current) {
            var iFocus;
            if (current !== undefined) {
                for (iFocus = 0; iFocus < onFocusLost.length; iFocus++) {
                    onFocusLost[iFocus](current);
                }
                for (iFocus = 0; iFocus < current.onFocusLost.length; iFocus++) {
                    current.onFocusLost[iFocus]();
                }
            }

            current = current;

            if (current !== undefined) {
                for (iFocus = 0; iFocus < onFocus.length; iFocus++) {
                    onFocus[iFocus](current);
                }
                for (iFocus = 0; iFocus < current.onFocus.length; iFocus++) {
                    current.onFocus[iFocus]();
                }
            }
        }
    }, {
        key: "UpdateGUI",
        value: function UpdateGUI(gui) {
            for (var i in gui.__controllers) {
                gui.__controllers[i].updateDisplay();
            }

            var folders = Object.values(gui.__folders);
            for (i = 0; i < folders.length; i++) {
                this.UpdateGUI(folders[i]);
            }
        }
    }, {
        key: "serializeModes",
        get: function get() {
            return serializeModes;
        }
    }]);

    return Smart;
}();

/* harmony default export */ __webpack_exports__["default"] = (Smart);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var spaces = {
    world: 'world',
    local: 'local'
};

var modes = {
    translate: 'translate',
    rotate: 'rotate',
    scale: 'scale'
};

/**
 * @type {Object<Control3D>}
 */
var defaultControls = {};

var Control3D = function () {

    /**
     * @param {THREE.Camera} camera 
     * @param {HTMLElement} domElement 
     */
    function Control3D(camera, domElement) {
        _classCallCheck(this, Control3D);

        this.camera = camera;
        this.control = new THREE.TransformControls(this.camera, domElement);
        this.control.addEventListener('change', this.Update.bind(this));

        this.control.traverse(function (child) {
            child.renderOrder = 2;
        });

        this.visible = false;
    }

    _createClass(Control3D, [{
        key: 'Attach',
        value: function Attach(target) {
            this.control.attach(target);
        }
    }, {
        key: 'Detach',
        value: function Detach() {
            this.control.detach();
        }
    }, {
        key: 'Toggle',
        value: function Toggle(target) {
            if (this.control.object) {
                this.control.detach();
            } else {
                this.control.attach(target);
            }
        }
    }, {
        key: 'Update',
        value: function Update() {
            this.control.update();
        }
    }, {
        key: 'visible',
        get: function get() {
            return this.control.visible;
        },
        set: function set(value) {
            this.control.visible = value;
            if (value === false) {
                this.Detach();
            }
        }
    }, {
        key: 'space',
        get: function get() {
            return this.control.space;
        },
        set: function set(value) {
            this.control.space = value;
        }

        // translate || rotate || scale

    }, {
        key: 'mode',
        set: function set(value) {
            this.control.setMode(value);
        }
    }], [{
        key: 'Configure',


        /**
         * @param {string} id 
         * @param {THREE.Camera} camera 
         * @param {HTMLElement} domElement 
         * @returns {Control3D}
         */
        value: function Configure(id, camera, domElement) {
            var control = new Control3D(camera, domElement);
            defaultControls[id] = control;
            return control;
        }

        /**
         * @returns {Control3D}
         */

    }, {
        key: 'Request',
        value: function Request(id) {
            return defaultControls[id];
        }
    }, {
        key: 'spaces',
        get: function get() {
            return spaces;
        }
    }, {
        key: 'modes',
        get: function get() {
            return modes;
        }
    }]);

    return Control3D;
}();

/* harmony default export */ __webpack_exports__["default"] = (Control3D);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_common_CargoEntry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Cargo__ = __webpack_require__(51);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var CargoGroup = function () {
    /**
     * 
     * @param {CargoEntry} entry
     */
    function CargoGroup(entry) {
        _classCallCheck(this, CargoGroup);

        this.entry = entry;
        this.cargoes = [];

        this.template = new __WEBPACK_IMPORTED_MODULE_1__Cargo__["a" /* default */](this);
        this.quantity = this.entry.quantity;
    }

    _createClass(CargoGroup, [{
        key: "ToString",
        value: function ToString() {
            var output = 'CargoGroup(' + this.quantity + ' x ' + this.entry.ToString() + ')';

            return output;
        }
    }, {
        key: "quantity",
        get: function get() {
            return this.cargoes.length;
        },
        set: function set(value) {
            var currentQuantity = this.cargoes.length;
            if (value < currentQuantity) {
                this.cargoes.length = value;
                this.entry.quantity = value;
            } else if (value > currentQuantity) {
                for (var i = currentQuantity; i < value; i++) {
                    this.cargoes[i] = this.template.Clone();
                }
            }
        }
    }]);

    return CargoGroup;
}();

/* harmony default export */ __webpack_exports__["a"] = (CargoGroup);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__container_Container__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var signals = {
    containerAdded: 'containerAdded'
};

var _currentIndex = Symbol('currentIndex');

var PackingSpace = function (_Signaler) {
    _inherits(PackingSpace, _Signaler);

    function PackingSpace() {
        _classCallCheck(this, PackingSpace);

        var _this = _possibleConstructorReturn(this, (PackingSpace.__proto__ || Object.getPrototypeOf(PackingSpace)).call(this));

        _this[_currentIndex] = -1;

        /**
         * @type {Container}
         */
        _this.containers = [];
        return _this;
    }

    _createClass(PackingSpace, [{
        key: "AddContainer",
        value: function AddContainer(container) {
            this.containers.push(container);
            this[_currentIndex]++;

            this.Dispatch(signals.containerAdded, container);
        }

        /**
         * @returns {Container}
         */

    }, {
        key: "current",
        get: function get() {
            var currentIndex = this[_currentIndex];
            if (currentIndex != -1) {
                return this.containers[currentIndex];
            }
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return PackingSpace;
}(__WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (PackingSpace);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container =
/**
 * @param {Object} id 
 * @param {Number} width 
 * @param {Number} length 
 * @param {Number} height 
 */
function Container(id, width, length, height) {
    _classCallCheck(this, Container);

    this.ID = id;

    this.Width = length || 0;
    this.Length = width || 0;
    this.Height = height || 0;
};

/* harmony default export */ __webpack_exports__["default"] = (Container);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function almost(n1, n2) {
    return Math.abs(n1 - n2) < .01;
}

var Item = function () {
    /**
     * @param {Object} id 
     * @param {Number} dim1 
     * @param {Number} dim2 
     * @param {Number} dim3 
     * @param {Number} quantity 
     */
    function Item(id, dim1, dim2, dim3, quantity) {
        _classCallCheck(this, Item);

        this.ID = id;
        this.IsPacked = false;
        this.Dim1 = dim2;
        this.Dim2 = dim1;
        this.Dim3 = dim3;
        this.CoordX = 0;
        this.CoordY = 0;
        this.CoordZ = 0;
        this.Quantity = quantity;
        this.PackDimX = 0;
        this.PackDimY = 0;
        this.PackDimZ = 0;
        this.Volume = this.Dim1 * this.Dim2 * this.Dim3;
    }

    /** 
     * @param {Item} item
     * @returns {string} - axis order (xyz, xzy, yxz, yzx, zxy or zyx)
     */


    _createClass(Item, null, [{
        key: 'ResolveOrientation',
        value: function ResolveOrientation(item) {
            var w = item.Dim1,
                l = item.Dim2,
                h = item.Dim3;

            if (almost(item.PackDimX, w)) {
                // x
                if (almost(item.PackDimY, h)) {
                    // y
                    return 'xyz';
                } else if (almost(item.PackDimY, l)) {
                    // z
                    return 'xzy';
                }
            } else if (almost(item.PackDimX, h)) {
                // y
                if (almost(item.PackDimY, w)) {
                    // x
                    return 'yxz';
                } else if (almost(item.PackDimY, l)) {
                    // z
                    return 'yzx';
                }
            } else if (almost(item.PackDimX, l)) {
                // z
                if (almost(item.PackDimY, w)) {
                    // x
                    return 'zxy';
                } else if (almost(item.PackDimY, h)) {
                    // y
                    return 'zyx';
                }
            }

            return 'xyz';
        }
    }]);

    return Item;
}();

/* harmony default export */ __webpack_exports__["default"] = (Item);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_common_CargoEntry__ = __webpack_require__(5);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var dummyGeometry = new THREE.SphereBufferGeometry(1, 4, 4);
var dummyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: .5 });

var _entry = Symbol('entry');

var CargoView = function () {
    /**
     * @param {CargoEntry} entry 
     */
    function CargoView(entry) {
        _classCallCheck(this, CargoView);

        this[_entry] = entry;

        /**
         * @type {THREE.Mesh}
         */
        this.mesh;

        /**
         * @type {THREE.Object3D}
         */
        this.view;
    }

    /** @returns {CargoEntry} */


    _createClass(CargoView, [{
        key: "entry",
        get: function get() {
            return this[_entry];
        },
        set: function set(value) {
            this[_entry] = value;
        }
    }, {
        key: "position",
        get: function get() {
            return this.view.position;
        },
        set: function set(value) {
            this.view.position.copy(value);
        }

        /**
         * @param {CargoEntry} entry 
         */

    }], [{
        key: "Dummy",
        value: function Dummy(entry) {
            var cargoView = new CargoView(entry);
            cargoView.view = new THREE.Mesh(dummyGeometry, dummyMaterial);
            return cargoView;
        }
    }]);

    return CargoView;
}();

/* harmony default export */ __webpack_exports__["a"] = (CargoView);

/***/ }),
/* 20 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__view_SceneSetup__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__packer_Packer__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__view_View__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_CargoInput__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_PackingSpaceInput__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__UX__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }









/**
 * @typedef AppComponents
 * @property {CargoInput} cargoInput
 * @property {PackingSpaceInput} packingSpaceInput
 */

var App = function () {

        /**
         * 
         * @param {HTMLDivElement} containerDiv
         * @param {UX} ux
         * @param {AppComponents} components 
         */
        function App(containerDiv, ux, components) {
                _classCallCheck(this, App);

                this.ux = ux;
                this.components = components;

                /** @type {import('./packer/Packer').PackerParams} */
                var packerParams = { ux: this.ux };
                this.packer = new __WEBPACK_IMPORTED_MODULE_1__packer_Packer__["a" /* default */](packerParams);

                this.sceneSetup = new __WEBPACK_IMPORTED_MODULE_0__view_SceneSetup__["default"](containerDiv, this.ux);
                this.sceneSetup.Init().then(this.Start.bind(this));
        }

        _createClass(App, [{
                key: 'Start',
                value: function Start() {
                        var packer = this.packer;

                        /** @type {import('./view/View').ViewParams} */
                        var viewParams = { ux: this.ux };
                        this.view = new __WEBPACK_IMPORTED_MODULE_2__view_View__["a" /* default */](packer, this.sceneSetup, viewParams);
                        this.sceneSetup.Start();

                        this.components.cargoInput.On(__WEBPACK_IMPORTED_MODULE_3__components_CargoInput__["a" /* default */].signals.completed, function (boxEntry) {
                                packer.cargoList.Add(boxEntry);
                        });

                        this.components.packingSpaceInput.On(__WEBPACK_IMPORTED_MODULE_4__components_PackingSpaceInput__["a" /* default */].signals.containerLoaded, function (container) {
                                packer.packingSpace.AddContainer(container);
                        });

                        /** @param {import('./packer/Packer').PackingResult} packingResult */
                        function onPackUpdate(packingResult) {
                                __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].Log('Packing result', packingResult);
                        }

                        packer.On(__WEBPACK_IMPORTED_MODULE_1__packer_Packer__["a" /* default */].signals.packUpdate, onPackUpdate);
                }
        }]);

        return App;
}();

/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
const _callback = Symbol('callback');
/** @returns {function} /
get callback(){ return this[_callback]; }
set callback(value){
    this[_callback] = value;
}
*/

var UpdateComponent = function () {
    /**
     * 
     * @param {Boolean} active 
     * @param {Number} interval 
     * @param {function(Number)} callback
     */
    function UpdateComponent(active, interval, callback) {
        _classCallCheck(this, UpdateComponent);

        this.active = active === undefined ? false : active;
        this.interval = interval === undefined ? 1 / 30 : interval;
        this.callback = callback;
        this.lastUpdateTime = 0;
    }

    /**
     * @param {Number} now 
     */


    _createClass(UpdateComponent, [{
        key: "Update",
        value: function Update(now) {
            this.lastUpdateTime = now;
            this.callback(now);
        }
    }]);

    return UpdateComponent;
}();

/* harmony default export */ __webpack_exports__["a"] = (UpdateComponent);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
    function Controller(params) {
        _classCallCheck(this, Controller);

        this.params = params;

        // Containers
        this.itemsContainer = new THREE.Object3D();
        this.itemsContainer.name = "itemsContainer";
        this.miscContainer = new THREE.Object3D();
        this.miscContainer.name = "miscContainer";
        this.ambientContainer = new THREE.Object3D();
        this.ambientContainer.name = "ambientContainer";
        this.defaults = new THREE.Object3D();
        this.defaults.name = "defaults";

        // Scene
        this.scene = new THREE.Scene();

        // Setup rest
        this.scene.add(this.itemsContainer);
        this.scene.add(this.miscContainer);
        this.scene.add(this.ambientContainer);
        this.scene.add(this.defaults);
    }

    _createClass(Controller, [{
        key: "Add",
        value: function Add(object, container) {
            if (container === undefined) container = this.miscContainer;
            container.add(object);
        }
    }, {
        key: "AddDefault",
        value: function AddDefault(object) {
            this.defaults.add(object);
        }
    }, {
        key: "Remove",
        value: function Remove(object) {
            if (typeof object === 'string') {
                var objName = object;
                object = this.itemsContainer.getObjectByName(objName);
                if (object === undefined) object = this.miscContainer.getObjectByName(objName);
                if (object === undefined) return;
            }
            this.itemsContainer.remove(object);
            this.miscContainer.remove(object);
        }
    }]);

    return Controller;
}();

/* harmony default export */ __webpack_exports__["a"] = (Controller);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tempVec3 = new THREE.Vector3(),
    tempVec3_b = new THREE.Vector3();

/**
 * @typedef {Object} CameraParams
 * @property {Number} fov
 * @property {Number} aspect
 * @property {Number} near
 * @property {Number} far
 */

var Camera = function () {
    /**
     * @param {CameraParams} params 
     */
    function Camera(params) {
        _classCallCheck(this, Camera);

        this.params = params;

        this.camera = new THREE.PerspectiveCamera(this.params.fov, this.params.aspect, this.params.near, this.params.far);
        this.camera.name = 'UserCamera';
    }

    _createClass(Camera, [{
        key: 'FirstPersonControls',
        value: function FirstPersonControls(container, params) {
            if (this.fpsControls === undefined && container !== undefined) {
                this.fpsControls = new App.Navigation.FirstPerson(this.camera, container);

                this.fpsControls.Hold = function () {
                    this.enabled = false;
                };
                this.fpsControls.Release = function () {
                    this.enabled = true;
                };
            }

            if (this.fpsControls !== undefined) {
                if (params !== undefined) {
                    this.fpsControls.speed.set(params.speedX, params.speedY);
                    this.fpsControls.damping = params.damping;
                    this.fpsControls.momentum = params.momentum;
                    this.fpsControls.limitPhi = params.limitPhi;
                    this.fpsControls.moveSpeed = params.moveSpeed;
                    this.fpsControls.keyControls = true;
                }

                this.controls = this.fpsControls;
            }
        }
    }, {
        key: 'OrbitControls',
        value: function OrbitControls(container, params) {
            if (this.orbitControls === undefined && container !== undefined) {

                var lookTarget = new THREE.Vector3();
                this.camera.getWorldDirection(lookTarget);
                lookTarget.multiplyScalar(200).add(this.camera.position);

                this.orbitControls = new THREE.OrbitControls(this.camera, container);
                this.orbitControls.target.copy(lookTarget);

                var scope = this;
                this.orbitControls.Update = function () {
                    if (this.enabled) {
                        if (this.object.position.distanceTo(this.target) < 50) {
                            var v = new THREE.Vector3().subVectors(this.target, this.object.position).multiplyScalar(.5);
                            this.target.add(v);
                        }
                        this.update();
                    }
                };
                this.orbitControls.Hold = function () {
                    this.enabled = false;
                };
                this.orbitControls.Release = function () {
                    this.enabled = true;
                };
            }

            params = params || {
                maxDistance: 9000.0 * /*units*/1,
                maxPolarAngle: Math.PI * 0.895
            };
            if (params !== undefined) {
                this.orbitControls.maxDistance = params.maxDistance;
                this.orbitControls.maxPolarAngle = params.maxPolarAngle;
                this.orbitControls.autoRotate = false;
            }

            this.controls = this.orbitControls;
        }
    }, {
        key: 'ToggleControls',
        value: function ToggleControls() {
            this.Hold();

            if (this.controls === this.orbitControls) {
                if (this.fpsControls) {
                    this.fpsControls.LerpRotation(this.camera, 1);
                    this.FirstPersonControls();
                }
            } else {
                if (this.orbitControls) {
                    this.OrbitControls();

                    // target
                    var maxDistance = 100;

                    var point = new THREE.Vector3(0, 0, -1);
                    var quat = new THREE.Quaternion();
                    point.applyQuaternion(this.camera.getWorldQuaternion(quat)).normalize().multiplyScalar(maxDistance * .5).add(this.camera.position);

                    this.SetTarget(point);
                }
            }

            this.Release();
        }
    }, {
        key: 'SetTarget',
        value: function SetTarget(position) {
            if (this.controls instanceof THREE.OrbitControls) {
                this.controls.target.copy(position);
            } else {
                console.warn('SetTarget not implemented for control type:', this.controls);
            }
        }
    }, {
        key: 'Update',
        value: function Update() {
            if (this.controls !== undefined) {
                this.controls.Update();
            }
        }
    }, {
        key: 'Hold',
        value: function Hold() {
            if (this.controls !== undefined && this.controls.Hold) {
                this.controls.Hold();
            }
        }
    }, {
        key: 'Release',
        value: function Release() {
            if (this.controls !== undefined && this.controls.Release) {
                this.controls.Release();
            }
        }

        /**
         * @param {THREE.Box3} box3 
         * @param {Number} [distanceMultiplier]
         */

    }, {
        key: 'Frame',
        value: function Frame(box3, distanceMultiplier) {
            if (distanceMultiplier === undefined) distanceMultiplier = .75;

            var fov = this.camera.fov * (Math.PI / 180);

            var extent = tempVec3;
            box3.getSize(extent);
            var frameSize = Math.max(extent.x, extent.y, extent.z);
            var distance = Math.abs(frameSize / Math.sin(fov / 2)) * distanceMultiplier;

            var center = tempVec3_b;
            box3.getCenter(center);

            var position = tempVec3;
            position.subVectors(this.camera.position, center).normalize().multiplyScalar(distance).add(center);

            this.camera.position.copy(position);
            this.SetTarget(center);
        }

        /**
         * @returns {Boolean}
         */

    }, {
        key: 'position',
        get: function get() {
            return this.camera.position;
        },
        set: function set(value) {
            this.camera.position.copy(value);
        }
    }, {
        key: 'rotation',
        get: function get() {
            return this.camera.rotation;
        },
        set: function set(value) {
            this.camera.rotation.copy(value);
        }
    }, {
        key: 'enabled',
        get: function get() {
            return this.controls.enabled;
        }
    }]);

    return Camera;
}();

/* harmony default export */ __webpack_exports__["a"] = (Camera);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return styles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Draggable; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function stopPropagation(e) {
    e.stopPropagation();
}

var stylesheet;

function createCSS(css) {
    if (stylesheet === undefined) {
        stylesheet = document.createElement('style');
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
    if (css instanceof Array) css = css.join('\n');

    stylesheet.innerHTML += css + '\n';
}

createCSS(['@keyframes wiggle {', '    20% { transform: rotate(5deg); }', '    50% { transform: rotate(0deg); }', '    75% { transform: rotate(-5deg); }', '   100% { transform: rotate(0deg); }', '}']);

var styles = {
    UIFitContent: 'display: inline-block; padding-bottom: 1em;',
    UIHideMenu: 'display: none !important;',

    UIDraggable: 'position: absolute; -webkit-user-select: none; -moz-user-select: none; -o-user-select: none; \
                -ms-user-select: none; -khtml-user-select: none; user-select: none; z-index: 1; padding: 4px;',
    UIDHeader: 'color: #ffffff; display: inline-block; word-wrap: break-word; font-family: Monospace; font-size: 1.2em; height: 100%; width: 100%;',
    UIDCloseButton: 'background-color: rgb(19, 19, 19); border: none; color: white; padding: 8px 2px; text-align: center; \
                text-decoration: none; margin-left: -38px; margin-right: 10px; font-family: Monospace; font-size: small; cursor: pointer;',
    UIWiggleAnim: 'display: inline-block; animation: wiggle .15s;'

};

var Element = function () {

    /**
     * @property {HTMLElement} domElement
     */

    function Element() {
        _classCallCheck(this, Element);

        /**
         * @type {HTMLElement}
         */
        this._domElement;
    }

    _createClass(Element, [{
        key: 'EnableChildInput',
        value: function EnableChildInput() {
            if (this._domElement) {
                this._domElement.removeEventListener('mousedown', stopPropagation);
                this._domElement.removeEventListener('mouseup', stopPropagation);
            }
        }
    }, {
        key: 'Hide',
        value: function Hide() {
            Element.AddStyle(this.domElement, styles.UIHideMenu);
        }
    }, {
        key: 'Show',
        value: function Show() {
            Element.RemoveStyle(this.domElement, styles.UIHideMenu);
        }
    }, {
        key: 'Remove',
        value: function Remove() {
            if (this._domElement) {
                this._domElement.removeEventListener('mousedown', stopPropagation);
                this._domElement.removeEventListener('mouseup', stopPropagation);

                this._domElement.remove();
                delete this._domElement;
            }
        }
    }, {
        key: 'domElement',
        set: function set(value) {
            if (this._domElement) {
                this._domElement.removeEventListener('mousedown', stopPropagation);
                this._domElement.removeEventListener('mouseup', stopPropagation);
            }

            this._domElement = value;

            this._domElement.addEventListener('mousedown', stopPropagation);
            this._domElement.addEventListener('mouseup', stopPropagation);
        },
        get: function get() {
            return this._domElement;
        }
    }, {
        key: 'opacity',
        get: function get() {
            return parseFloat(this.domElement.style.opacity);
        },
        set: function set(value) {
            this.domElement.style.opacity = value;
        }
    }], [{
        key: '_Span',
        value: function _Span(text, attributes) {
            return {
                type: 'span',
                label: text,
                attributes: attributes
            };
        }
    }, {
        key: 'Span',
        value: function Span(text, attributes) {
            var _span = this._Span(text, attributes);
            return crel(_span.type, _span.attributes, _span.label);
        }

        /**
         * 
         * @param {HTMLElement} element 
         * @param {string} style 
         */

    }, {
        key: 'AddStyle',
        value: function AddStyle(element, style) {
            var eStyle = element.style.cssText;
            var index = eStyle.indexOf(style);
            if (index === -1) {
                element.style.cssText += style;
            }
        }

        /**
         * 
         * @param {HTMLElement} element 
         * @param {string} style 
         */

    }, {
        key: 'RemoveStyle',
        value: function RemoveStyle(element, style) {
            element.style.cssText = element.style.cssText.replace(style, '');
        }
    }, {
        key: 'Add',
        value: function Add(element) {
            document.body.appendChild(element.domElement);
        }
    }, {
        key: 'CreateCSS',
        get: function get() {
            return createCSS;
        }
    }]);

    return Element;
}();

var widths = {
    small: 162,
    medium: 242,
    large: 362
};

var Draggable = function (_Element) {
    _inherits(Draggable, _Element);

    function Draggable(title, width) {
        _classCallCheck(this, Draggable);

        var _this = _possibleConstructorReturn(this, (Draggable.__proto__ || Object.getPrototypeOf(Draggable)).call(this));

        var dom;

        var move = function move(xpos, ypos) {
            dom.style.left = xpos + 'px';
            dom.style.top = ypos + 'px';
        };

        var diffX = 0,
            diffY = 0;
        var eWi = 0,
            eHe = 0,
            cWi = 0,
            cHe = 0;

        var onMouseMove = function onMouseMove(evt) {
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                aX = posX - diffX,
                aY = posY - diffY;
            if (aX < 0) aX = 0;
            if (aY < 0) aY = 0;
            if (aX + eWi > cWi) aX = cWi - eWi;
            if (aY + eHe > cHe) aY = cHe - eHe;
            move(aX, aY);
        };

        var startMoving = function startMoving(evt) {
            var p = dom.parentNode;
            var container = p !== undefined && p !== null ? p : window;
            container = document.body;
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                divTop = dom.style.top,
                divLeft = dom.style.left;

            eWi = parseInt(dom.style.width);
            eHe = parseInt(dom.style.height);
            cWi = parseInt(container.style.width);
            cHe = parseInt(container.style.height);

            container.style.cursor = 'move';
            divTop = divTop.replace('px', '');
            divLeft = divLeft.replace('px', '');
            diffX = posX - divLeft;
            diffY = posY - divTop;
            document.addEventListener('mousemove', onMouseMove);
        };

        var stopMoving = function stopMoving() {
            var p = dom.parentNode;
            var container = p !== undefined && p !== null ? p : window;
            container = document.body;
            container.style.cursor = 'default';
            document.removeEventListener('mousemove', onMouseMove);
        };

        if (width === undefined) width = widths.medium;
        var left = 60 + Math.floor(Math.random() * 160),
            top = 60 + Math.floor(Math.random() * 60);
        var domStyle = 'left:' + left + 'px; top:' + top + 'px; width:' + width + 'px; background-color: rgba(0, 0, 0, .8);' + styles.UIFitContent + styles.UIDraggable;
        dom = crel('div', { style: domStyle });
        var head = crel('div', { style: 'display: flex;' });
        dom.appendChild(head);
        var header = crel('div', { onmousedown: startMoving, onmouseup: stopMoving, style: styles.UIDHeader }, title);

        var scope = _this;
        var close = function close() {
            scope.Close();
        };
        var closeBtn = crel('button', { onclick: close, style: styles.UIDCloseButton }, 'Close');
        head.appendChild(closeBtn);
        head.appendChild(header);

        dom.closeBtn = closeBtn;

        _this.domElement = dom;
        _this.EnableChildInput();
        _this.closeBtn = closeBtn;
        return _this;
    }

    _createClass(Draggable, [{
        key: 'Close',
        value: function Close() {
            this.domElement.remove();
        }
    }, {
        key: 'Add',
        value: function Add(elt) {
            this.domElement.appendChild(elt);
        }
    }, {
        key: 'GetPosition',
        value: function GetPosition() {
            var style = window.getComputedStyle(this.domElement),
                left = parseFloat(style.left),
                top = parseFloat(style.top);

            return { x: left, y: top };
        }
    }, {
        key: 'SetPosition',
        value: function SetPosition(x, y) {
            this.domElement.style.left = x + 'px';
            this.domElement.style.top = y + 'px';
        }
    }], [{
        key: 'widths',
        get: function get() {
            return widths;
        }
    }]);

    return Draggable;
}(Element);



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UIUtils__ = __webpack_require__(25);


__WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].CreateCSS(['.tooltip .tooltiptext {', '    visibility: hidden;', '    position: absolute;', '    width: 120px;', '    background-color: #111;', '    color: #fff;', '    text-align: center;', '    padding: 2px 0;', '    border-radius: 2px;', '    z-index: 1;', '    opacity: 0;', '    transition: opacity .6s;', '}', '.tooltip-top {', '    bottom: 125%;', '    left: 50%;', '    margin-left: -60px;', '}', '.tooltip:hover .tooltiptext {', '    visibility: visible;', '    opacity: 1;', '}']);

var styles = {
    datDisabled: 'color: #606060 !important; cursor: not-allowed !important;'
};

Object.defineProperty((window.dat || __webpack_require__(1).default).GUI.prototype, 'onGUIEvent', {
    get: function get() {
        if (!this._onGUIEvent) this._onGUIEvent = [];
        return this._onGUIEvent;
    }
});

// update all

(window.dat || __webpack_require__(1).default).GUI.prototype.updateAll = function () {
    var gui = this;
    for (var i in gui.__controllers) {
        var controller = gui.__controllers[i];
        controller.updateDisplay();
    }

    var folders = Object.values(gui.__folders);
    for (i = 0; i < folders.length; i++) {
        folders[i].updateAll();
    }
};

// find

(window.dat || __webpack_require__(1).default).GUI.prototype.find = function (object, property) {
    var gui = this,
        controller,
        i;

    if (property) {
        // 2 arguments
        for (i = 0; i < gui.__controllers.length; i++) {
            controller = gui.__controllers[i];
            if (controller.object == object && controller.property == property) return controller;
        }

        var folders = Object.values(gui.__folders);
        for (i = 0; i < folders.length; i++) {
            controller = folders[i].find(object, property);
            if (controller) return controller;
        }
    } else {
        property = object; // 1 argument

        var folderKeys = Object.keys(gui.__folders);
        for (i = 0; i < folderKeys.length; i++) {
            var folderName = folderKeys[i];
            var folder = gui.__folders[folderName];
            if (folderName === property) return folder;
        }
    }
    return undefined;
};

// On open event
//if(_this.opening !== undefined) _this.opening = _this.closed; // chadiik
Object.defineProperty((window.dat || __webpack_require__(1).default).GUI.prototype, 'opening', {
    get: function get() {
        return !this.closed;
    },

    set: function set(value) {
        for (var i = 0; i < this.onGUIEvent.length; i++) {
            this.onGUIEvent[i](value ? 'open' : 'close');
        }
    }
});

// Disabled
function blockEvent(event) {
    event.stopPropagation();
}

Object.defineProperty((window.dat || __webpack_require__(1).default).controllers.Controller.prototype, "disabled", {
    get: function get() {
        return this.domElement.hasAttribute("disabled");
    },

    set: function set(value) {
        if (value) {
            this.domElement.setAttribute("disabled", "disabled");
            this.domElement.addEventListener("click", blockEvent, true);
            __WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].AddStyle(this.domElement.parentElement.parentElement, styles.datDisabled);
        } else {
            this.domElement.removeAttribute("disabled");
            this.domElement.removeEventListener("click", blockEvent, true);
            __WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].RemoveStyle(this.domElement.parentElement.parentElement, styles.datDisabled);
        }
    },

    enumerable: true
});

(window.dat || __webpack_require__(1).default).GUI.prototype.enable = function (object, property, value) {
    var controller = this.find(object, property);
    controller.disabled = !value;
};

// Tooltip

Object.defineProperty((window.dat || __webpack_require__(1).default).controllers.Controller.prototype, "tooltip", {
    get: function get() {
        return this._tooltip.innerHTML;
    },

    set: function set(value) {
        if (value) {
            if (this._tooltip === undefined) {
                this._tooltip = crel('span', { class: 'tooltiptext' });

                /**
                 * @type {HTMLElement}
                 */
                var container = this.domElement.parentElement.parentElement;
                container.classList.add('tooltip');
                container.appendChild(this._tooltip);
            }
            this._tooltip.innerHTML = value;
        }
    },

    enumerable: true
});

(window.dat || __webpack_require__(1).default).GUI.prototype.setTooltip = function (object, property, value) {
    var controller = this.find(object, property);
    controller.tooltip = value;
};

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Signaler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_common_CargoEntry__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CargoGroup__ = __webpack_require__(15);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var stringType = 'string';

var signals = {
    groupAdded: 'groupAdded',
    groupRemoved: 'groupRemoved'
};

var CargoList = function (_Signaler) {
    _inherits(CargoList, _Signaler);

    function CargoList() {
        _classCallCheck(this, CargoList);

        /** @type {Map<string, CargoGroup>} */
        var _this = _possibleConstructorReturn(this, (CargoList.__proto__ || Object.getPrototypeOf(CargoList)).call(this));

        _this.groups = new Map();
        return _this;
    }

    /** Adds a new CargoGroup
     * @param {CargoEntry} entry 
     */


    _createClass(CargoList, [{
        key: "Add",
        value: function Add(entry) {
            var group = new __WEBPACK_IMPORTED_MODULE_2__CargoGroup__["a" /* default */](entry);

            this.groups.set(entry.uid, group);
            this.Dispatch(signals.groupAdded, group);
        }

        /** Removes the CargoGroup using its uid
         * @param {string} uid 
         */

    }, {
        key: "Remove",
        value: function Remove(uid) {
            var group = this.groups.get(uid);
            if (group) {
                this.groups.delete(uid);
                this.Dispatch(signals.groupRemoved, group);
            }
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return CargoList;
}(__WEBPACK_IMPORTED_MODULE_0__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (CargoList);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextField = function () {
    /**
     * @param {string} label 
     * @param {string} content 
     */
    function TextField(label, content) {
        _classCallCheck(this, TextField);

        /**
         * @type {string}
         */
        this.label = label;
        /**
         * @type {string}
         */
        this.content = content;
    }

    /**
     * @param {TextField} field 
     */


    _createClass(TextField, [{
        key: 'Copy',
        value: function Copy(field) {
            this.label = field.label;
            this.content = field.content;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var field = new TextField(this.label, this.content);
            return field;
        }
    }], [{
        key: 'defaultContent',
        get: function get() {
            return '-';
        }
    }]);

    return TextField;
}();

/* harmony default export */ __webpack_exports__["a"] = (TextField);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Container__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Item__ = __webpack_require__(18);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var epsilon = Math.pow(2, -52);

/**
 * From the master's thesis:
 * "The double linked list we use keeps the topology of the edge of the 
 * current layer under construction. We keep the x and z coordinates of 
 * each gap's right corner. The program looks at those gaps and tries to 
 * fill them with boxes one at a time while trying to keep the edge of the
 * layer even" (p. 3-7).
 */

var ScrapPad = function ScrapPad() {
	_classCallCheck(this, ScrapPad);

	/** The x coordinate of the gap's right corner. */
	this.CumX = 0;
	/** The z coordinate of the gap's right corner. */
	this.CumZ = 0;

	/** The following entry.
  * @type {ScrapPad}
  */
	this.Post;

	/** The previous entry.
  * @type {ScrapPad}
  */
	this.Pre;
};

/**
 * A list that stores all the different lengths of all item dimensions.
 * From the master's thesis:
 * "Each Layerdim value in this array represents a different layer thickness
 * value with which each iteration can start packing. Before starting iterations,
 * all different lengths of all box dimensions along with evaluation values are
 * stored in this array" (p. 3-6).
 */


var Layer = function () {
	function Layer(layerEval) {
		_classCallCheck(this, Layer);

		this.LayerDim = 0;
		this.LayerEval = layerEval !== undefined ? layerEval : 0;
	}

	/**
  * @param {Layer} l1 
  * @param {Layer} l2 
  */


	_createClass(Layer, null, [{
		key: "SortByEval",
		value: function SortByEval(l1, l2) {
			return l1.LayerEval - l2.LayerEval;
		}
	}]);

	return Layer;
}();

/**
 * @typedef PackingResult
 * @property {Container} Container
 * @property {Boolean} IsCompletePack
 * @property {Array<Item>} PackedItems
 * @property {Number} PercentContainerVolumePacked
 * @property {Number} PercentItemVolumePacked
 * @property {Array<Item>} UnpackedItems
 * @property {Number} PackTimeInMilliseconds
 */

var PackingResult = function PackingResult() {
	_classCallCheck(this, PackingResult);

	/** @type {Container} */
	this.Container;
	this.IsCompletePack = false;
	/** @type {Array<Item>} */
	this.PackedItems = [];
	this.PercentContainerVolumePacked = 0;
	this.PercentItemVolumePacked = 0;
	/** @type {Array<Item>} */
	this.UnpackedItems = [];
	this.PackTimeInMilliseconds = Number.MAX_SAFE_INTEGER;
};

/** @type {Array<Item>} */


var itemsToPack = [];
/** @type {Array<Item>} */
var itemsPackedInOrder;
/** @type {Array<Layer>} */
var layers;

/** @type {ScrapPad} */
var scrapfirst;
/** @type {ScrapPad} */
var smallestZ;
/** @type {ScrapPad} */
var trash;

var evened = false;
var hundredPercentPacked = false;
var layerDone = false;
var packing = false;
var packingBest = false;
var quit = false;

var bboxi = 0;
var bestIteration = 0;
var bestVariant = 0;
var boxi = 0;
var cboxi = 0;
var layerListLen = 0;
var packedItemCount = 0;
var x = 0;

var bbfx = 0;
var bbfy = 0;
var bbfz = 0;
var bboxx = 0;
var bboxy = 0;
var bboxz = 0;
var bfx = 0;
var bfy = 0;
var bfz = 0;
var boxx = 0;
var boxy = 0;
var boxz = 0;
var cboxx = 0;
var cboxy = 0;
var cboxz = 0;
var layerinlayer = 0;
var layerThickness = 0;
var lilz = 0;
var packedVolume = 0;
var packedy = 0;
var prelayer = 0;
var prepackedy = 0;
var preremainpy = 0;
var px = 0;
var py = 0;
var pz = 0;
var remainpy = 0;
var remainpz = 0;
var itemsToPackCount = 0;
var totalItemVolume = 0;
var totalContainerVolume = 0;

/**
 * Current port by chadiik (2018)
 * A 3D bin packing algorithm originally ported from https://github.com/davidmchapman/3DContainerPacking
 * which itself was ported from https://github.com/keremdemirer/3dbinpackingjs,
 * which itself was a JavaScript port of https://github.com/wknechtel/3d-bin-pack/, which is a C reconstruction 
 * of a novel algorithm developed in a U.S. Air Force master's thesis by Erhan Baltacioglu in 2001.
 */

var AFit = function () {
	function AFit() {
		_classCallCheck(this, AFit);
	}

	/**
  * Runs the algorithm
  * @param {Container} container 
  * @param {Array<Item>} items 
  * @returns {PackingResult}
  */


	_createClass(AFit, [{
		key: "Solve",
		value: function Solve(container, items) {
			this.Initialize(container, items);
			this.ExecuteIterations(container);
			this.Report(container);

			var result = new PackingResult();
			result.Container = container;

			for (var i = 1; i <= itemsToPackCount; i++) {
				itemsToPack[i].Quantity = 1;

				if (!itemsToPack[i].IsPacked) {
					result.UnpackedItems.push(itemsToPack[i]);
				}
			}

			result.PackedItems = itemsPackedInOrder;

			if (result.UnpackedItems.length == 0) {
				result.IsCompletePack = true;
			}

			return result;
		}

		/**
   * Analyzes each unpacked box to find the best fitting one to the empty space given.
   * @param {Number} hmx 
   * @param {Number} hy 
   * @param {Number} hmy 
   * @param {Number} hz 
   * @param {Number} hmz 
   * @param {Number} dim1 
   * @param {Number} dim2 
   * @param {Number} dim3 
   */

	}, {
		key: "AnalyzeBox",
		value: function AnalyzeBox(hmx, hy, hmy, hz, hmz, dim1, dim2, dim3) {
			if (dim1 <= hmx && dim2 <= hmy && dim3 <= hmz) {
				if (dim2 <= hy) {
					if (hy - dim2 < bfy) {
						boxx = dim1;
						boxy = dim2;
						boxz = dim3;
						bfx = hmx - dim1;
						bfy = hy - dim2;
						bfz = Math.abs(hz - dim3);
						boxi = x;
					} else if (hy - dim2 == bfy && hmx - dim1 < bfx) {
						boxx = dim1;
						boxy = dim2;
						boxz = dim3;
						bfx = hmx - dim1;
						bfy = hy - dim2;
						bfz = Math.abs(hz - dim3);
						boxi = x;
					} else if (hy - dim2 == bfy && hmx - dim1 == bfx && Math.abs(hz - dim3) < bfz) {
						boxx = dim1;
						boxy = dim2;
						boxz = dim3;
						bfx = hmx - dim1;
						bfy = hy - dim2;
						bfz = Math.abs(hz - dim3);
						boxi = x;
					}
				} else {
					if (dim2 - hy < bbfy) {
						bboxx = dim1;
						bboxy = dim2;
						bboxz = dim3;
						bbfx = hmx - dim1;
						bbfy = dim2 - hy;
						bbfz = Math.abs(hz - dim3);
						bboxi = x;
					} else if (dim2 - hy == bbfy && hmx - dim1 < bbfx) {
						bboxx = dim1;
						bboxy = dim2;
						bboxz = dim3;
						bbfx = hmx - dim1;
						bbfy = dim2 - hy;
						bbfz = Math.abs(hz - dim3);
						bboxi = x;
					} else if (dim2 - hy == bbfy && hmx - dim1 == bbfx && Math.abs(hz - dim3) < bbfz) {
						bboxx = dim1;
						bboxy = dim2;
						bboxz = dim3;
						bbfx = hmx - dim1;
						bbfy = dim2 - hy;
						bbfz = Math.abs(hz - dim3);
						bboxi = x;
					}
				}
			}
		}

		/**
   * After finding each box, the candidate boxes and the condition of the layer are examined.
   */

	}, {
		key: "CheckFound",
		value: function CheckFound() {
			evened = false;

			if (boxi != 0) {
				cboxi = boxi;
				cboxx = boxx;
				cboxy = boxy;
				cboxz = boxz;
			} else {
				if (bboxi > 0 && (layerinlayer != 0 || !smallestZ.Pre && !smallestZ.Post)) {
					if (layerinlayer == 0) {
						prelayer = layerThickness;
						lilz = smallestZ.CumZ;
					}

					cboxi = bboxi;
					cboxx = bboxx;
					cboxy = bboxy;
					cboxz = bboxz;
					layerinlayer = layerinlayer + bboxy - layerThickness;
					layerThickness = bboxy;
				} else {
					if (!smallestZ.Pre && !smallestZ.Post) {
						layerDone = true;
					} else {
						evened = true;

						if (!smallestZ.Pre) {
							trash = smallestZ.Post;
							smallestZ.CumX = smallestZ.Post.CumX;
							smallestZ.CumZ = smallestZ.Post.CumZ;
							smallestZ.Post = smallestZ.Post.Post;
							if (smallestZ.Post) {
								smallestZ.Post.Pre = smallestZ;
							}
						} else if (!smallestZ.Post) {
							smallestZ.Pre.Post = undefined;
							smallestZ.Pre.CumX = smallestZ.CumX;
						} else {
							if (smallestZ.Pre.CumZ == smallestZ.Post.CumZ) {
								smallestZ.Pre.Post = smallestZ.Post.Post;

								if (smallestZ.Post.Post) {
									smallestZ.Post.Post.Pre = smallestZ.Pre;
								}

								smallestZ.Pre.CumX = smallestZ.Post.CumX;
							} else {
								smallestZ.Pre.Post = smallestZ.Post;
								smallestZ.Post.Pre = smallestZ.Pre;

								if (smallestZ.Pre.CumZ < smallestZ.Post.CumZ) {
									smallestZ.Pre.CumX = smallestZ.CumX;
								}
							}
						}
					}
				}
			}
		}

		/**
   * Executes the packing algorithm variants.
   * @param {Container} container 
   */

	}, {
		key: "ExecuteIterations",
		value: function ExecuteIterations(container) {
			var itelayer = 0;
			var layersIndex = 0;
			var bestVolume = 0;

			for (var containerOrientationVariant = 1; containerOrientationVariant <= 6 && !quit; containerOrientationVariant++) {
				switch (containerOrientationVariant) {
					case 1:
						px = container.Length;py = container.Height;pz = container.Width;
						break;

					case 2:
						px = container.Width;py = container.Height;pz = container.Length;
						break;

					case 3:
						px = container.Width;py = container.Length;pz = container.Height;
						break;

					case 4:
						px = container.Height;py = container.Length;pz = container.Width;
						break;

					case 5:
						px = container.Length;py = container.Width;pz = container.Height;
						break;

					case 6:
						px = container.Height;py = container.Width;pz = container.Length;
						break;
				}

				layers.push(new Layer(-1));
				this.ListCanditLayers();
				//layers = layers.OrderBy(l => l.LayerEval).ToList();
				layers.sort(Layer.SortByEval);

				for (layersIndex = 1; layersIndex <= layerListLen && !quit; layersIndex++) {
					packedVolume = 0;
					packedy = 0;
					packing = true;
					layerThickness = layers[layersIndex].LayerDim;
					itelayer = layersIndex;
					remainpy = py;
					remainpz = pz;
					packedItemCount = 0;

					for (x = 1; x <= itemsToPackCount; x++) {
						itemsToPack[x].IsPacked = false;
					}

					do {
						layerinlayer = 0;
						layerDone = false;

						this.PackLayer();

						packedy = packedy + layerThickness;
						remainpy = py - packedy;

						if (layerinlayer != 0 && !quit) {
							prepackedy = packedy;
							preremainpy = remainpy;
							remainpy = layerThickness - prelayer;
							packedy = packedy - layerThickness + prelayer;
							remainpz = lilz;
							layerThickness = layerinlayer;
							layerDone = false;

							this.PackLayer();

							packedy = prepackedy;
							remainpy = preremainpy;
							remainpz = pz;
						}

						this.FindLayer(remainpy);
					} while (packing && !quit);

					if (packedVolume > bestVolume && !quit) {
						bestVolume = packedVolume;
						bestVariant = containerOrientationVariant;
						bestIteration = itelayer;
					}

					if (hundredPercentPacked) break;
				}

				if (hundredPercentPacked) break;

				if (container.Length == container.Height && container.Height == container.Width) containerOrientationVariant = 6;

				layers = [];
			}
		}

		/**
   * Finds the most proper boxes by looking at all six possible orientations,
  * empty space given, adjacent boxes, and pallet limits.
   * @param {Number} hmx 
   * @param {Number} hy 
   * @param {Number} hmy 
   * @param {Number} hz 
   * @param {Number} hmz 
   */

	}, {
		key: "FindBox",
		value: function FindBox(hmx, hy, hmy, hz, hmz) {
			var y = 0;

			bfx = Number.MAX_VALUE;
			bfy = Number.MAX_VALUE;
			bfz = Number.MAX_VALUE;
			bbfx = Number.MAX_VALUE;
			bbfy = Number.MAX_VALUE;
			bbfz = Number.MAX_VALUE;
			boxi = 0;
			bboxi = 0;

			for (y = 1; y <= itemsToPackCount; y = y + itemsToPack[y].Quantity) {
				for (x = y; x < x + itemsToPack[y].Quantity - 1; x++) {
					if (!itemsToPack[x].IsPacked) break;
				}

				if (itemsToPack[x].IsPacked) continue;

				if (x > itemsToPackCount) return;

				this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim1, itemsToPack[x].Dim2, itemsToPack[x].Dim3);

				if (itemsToPack[x].Dim1 == itemsToPack[x].Dim3 && itemsToPack[x].Dim3 == itemsToPack[x].Dim2) continue;

				this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim1, itemsToPack[x].Dim3, itemsToPack[x].Dim2);
				this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim2, itemsToPack[x].Dim1, itemsToPack[x].Dim3);
				this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim2, itemsToPack[x].Dim3, itemsToPack[x].Dim1);
				this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim3, itemsToPack[x].Dim1, itemsToPack[x].Dim2);
				this.AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim3, itemsToPack[x].Dim2, itemsToPack[x].Dim1);
			}
		}

		/**
   * Finds the most proper layer height by looking at the unpacked boxes and the remaining empty space available.
   * @param {Number} thickness 
   */

	}, {
		key: "FindLayer",
		value: function FindLayer(thickness) {
			var exdim = 0;
			var dimdif = 0;
			var dimen2 = 0;
			var dimen3 = 0;
			var y = 0;
			var z = 0;
			var layereval = 0;
			var maxEvaluations = 1000000;

			layerThickness = 0;

			for (x = 1; x <= itemsToPackCount; x++) {
				if (itemsToPack[x].IsPacked) continue;

				for (y = 1; y <= 3; y++) {
					switch (y) {
						case 1:
							exdim = itemsToPack[x].Dim1;
							dimen2 = itemsToPack[x].Dim2;
							dimen3 = itemsToPack[x].Dim3;
							break;

						case 2:
							exdim = itemsToPack[x].Dim2;
							dimen2 = itemsToPack[x].Dim1;
							dimen3 = itemsToPack[x].Dim3;
							break;

						case 3:
							exdim = itemsToPack[x].Dim3;
							dimen2 = itemsToPack[x].Dim1;
							dimen3 = itemsToPack[x].Dim2;
							break;
					}

					layereval = 0;

					if (exdim <= thickness && (dimen2 <= px && dimen3 <= pz || dimen3 <= px && dimen2 <= pz)) {
						for (z = 1; z <= itemsToPackCount; z++) {
							if (!(x == z) && !itemsToPack[z].IsPacked) {
								dimdif = Math.abs(exdim - itemsToPack[z].Dim1);

								if (Math.abs(exdim - itemsToPack[z].Dim2) < dimdif) {
									dimdif = Math.abs(exdim - itemsToPack[z].Dim2);
								}

								if (Math.abs(exdim - itemsToPack[z].Dim3) < dimdif) {
									dimdif = Math.abs(exdim - itemsToPack[z].Dim3);
								}

								layereval = layereval + dimdif;
							}
						}

						if (layereval < maxEvaluations) {
							maxEvaluations = layereval;
							layerThickness = exdim;
						}
					}
				}
			}

			if (layerThickness == 0 || layerThickness > remainpy) packing = false;
		}

		/**
   * Finds the first to be packed gap in the layer edge.
   */

	}, {
		key: "FindSmallestZ",
		value: function FindSmallestZ() {
			var scrapmemb = scrapfirst;
			smallestZ = scrapmemb;

			while (scrapmemb.Post) {
				if (scrapmemb.Post.CumZ < smallestZ.CumZ) {
					smallestZ = scrapmemb.Post;
				}

				scrapmemb = scrapmemb.Post;
			}
		}

		/**
   * Initializes everything.
   * @param {Container} container 
   * @param {Array<Item>} items 
   */

	}, {
		key: "Initialize",
		value: function Initialize(container, items) {
			itemsToPack = [];
			itemsPackedInOrder = [];

			// The original code uses 1-based indexing everywhere. This fake entry is added to the beginning
			// of the list to make that possible.
			itemsToPack.push(new __WEBPACK_IMPORTED_MODULE_1__components_Item__["default"](0, 0, 0, 0, 0, 0));

			layers = [];
			itemsToPackCount = 0;

			for (var iItems = 0, numItems = items.length; iItems < numItems; iItems++) {
				var item = items[iItems];
				for (var i = 1; i <= item.Quantity; i++) {
					var newItem = new __WEBPACK_IMPORTED_MODULE_1__components_Item__["default"](item.ID, item.Dim1, item.Dim2, item.Dim3, item.Quantity);
					itemsToPack.push(newItem);
				}

				itemsToPackCount += item.Quantity;
			}

			itemsToPack.push(new __WEBPACK_IMPORTED_MODULE_1__components_Item__["default"](0, 0, 0, 0, 0));

			totalContainerVolume = container.Length * container.Height * container.Width;
			totalItemVolume = 0;

			for (x = 1; x <= itemsToPackCount; x++) {
				totalItemVolume = totalItemVolume + itemsToPack[x].Volume;
			}

			scrapfirst = new ScrapPad();

			scrapfirst.Pre = undefined;
			scrapfirst.Post = undefined;
			packingBest = false;
			hundredPercentPacked = false;
			quit = false;
		}

		/**
   * Lists all possible layer heights by giving a weight value to each of them.
   */

	}, {
		key: "ListCanditLayers",
		value: function ListCanditLayers() {
			var same = false;
			var exdim = 0;
			var dimdif = 0;
			var dimen2 = 0;
			var dimen3 = 0;
			var y = 0;
			var z = 0;
			var k = 0;
			var layereval = 0;

			layerListLen = 0;

			for (x = 1; x <= itemsToPackCount; x++) {
				for (y = 1; y <= 3; y++) {
					switch (y) {
						case 1:
							exdim = itemsToPack[x].Dim1;
							dimen2 = itemsToPack[x].Dim2;
							dimen3 = itemsToPack[x].Dim3;
							break;

						case 2:
							exdim = itemsToPack[x].Dim2;
							dimen2 = itemsToPack[x].Dim1;
							dimen3 = itemsToPack[x].Dim3;
							break;

						case 3:
							exdim = itemsToPack[x].Dim3;
							dimen2 = itemsToPack[x].Dim1;
							dimen3 = itemsToPack[x].Dim2;
							break;
					}

					if (exdim > py || (dimen2 > px || dimen3 > pz) && (dimen3 > px || dimen2 > pz)) continue;

					same = false;

					for (k = 1; k <= layerListLen; k++) {
						if (exdim == layers[k].LayerDim) {
							same = true;
							continue;
						}
					}

					if (same) continue;

					layereval = 0;

					for (z = 1; z <= itemsToPackCount; z++) {
						if (!(x == z)) {
							dimdif = Math.abs(exdim - itemsToPack[z].Dim1);

							if (Math.abs(exdim - itemsToPack[z].Dim2) < dimdif) {
								dimdif = Math.abs(exdim - itemsToPack[z].Dim2);
							}
							if (Math.abs(exdim - itemsToPack[z].Dim3) < dimdif) {
								dimdif = Math.abs(exdim - itemsToPack[z].Dim3);
							}
							layereval = layereval + dimdif;
						}
					}

					layerListLen++;

					layers.push(new Layer());
					layers[layerListLen].LayerEval = layereval;
					layers[layerListLen].LayerDim = exdim;
				}
			}
		}

		/**
   * Transforms the found coordinate system to the one entered by the user and writes them to the report file.
   */

	}, {
		key: "OutputBoxList",
		value: function OutputBoxList() {
			var packCoordX = 0;
			var packCoordY = 0;
			var packCoordZ = 0;
			var packDimX = 0;
			var packDimY = 0;
			var packDimZ = 0;

			switch (bestVariant) {
				case 1:
					packCoordX = itemsToPack[cboxi].CoordX;
					packCoordY = itemsToPack[cboxi].CoordY;
					packCoordZ = itemsToPack[cboxi].CoordZ;
					packDimX = itemsToPack[cboxi].PackDimX;
					packDimY = itemsToPack[cboxi].PackDimY;
					packDimZ = itemsToPack[cboxi].PackDimZ;
					break;

				case 2:
					packCoordX = itemsToPack[cboxi].CoordZ;
					packCoordY = itemsToPack[cboxi].CoordY;
					packCoordZ = itemsToPack[cboxi].CoordX;
					packDimX = itemsToPack[cboxi].PackDimZ;
					packDimY = itemsToPack[cboxi].PackDimY;
					packDimZ = itemsToPack[cboxi].PackDimX;
					break;

				case 3:
					packCoordX = itemsToPack[cboxi].CoordY;
					packCoordY = itemsToPack[cboxi].CoordZ;
					packCoordZ = itemsToPack[cboxi].CoordX;
					packDimX = itemsToPack[cboxi].PackDimY;
					packDimY = itemsToPack[cboxi].PackDimZ;
					packDimZ = itemsToPack[cboxi].PackDimX;
					break;

				case 4:
					packCoordX = itemsToPack[cboxi].CoordY;
					packCoordY = itemsToPack[cboxi].CoordX;
					packCoordZ = itemsToPack[cboxi].CoordZ;
					packDimX = itemsToPack[cboxi].PackDimY;
					packDimY = itemsToPack[cboxi].PackDimX;
					packDimZ = itemsToPack[cboxi].PackDimZ;
					break;

				case 5:
					packCoordX = itemsToPack[cboxi].CoordX;
					packCoordY = itemsToPack[cboxi].CoordZ;
					packCoordZ = itemsToPack[cboxi].CoordY;
					packDimX = itemsToPack[cboxi].PackDimX;
					packDimY = itemsToPack[cboxi].PackDimZ;
					packDimZ = itemsToPack[cboxi].PackDimY;
					break;

				case 6:
					packCoordX = itemsToPack[cboxi].CoordZ;
					packCoordY = itemsToPack[cboxi].CoordX;
					packCoordZ = itemsToPack[cboxi].CoordY;
					packDimX = itemsToPack[cboxi].PackDimZ;
					packDimY = itemsToPack[cboxi].PackDimX;
					packDimZ = itemsToPack[cboxi].PackDimY;
					break;
			}

			itemsToPack[cboxi].CoordX = packCoordX;
			itemsToPack[cboxi].CoordY = packCoordY;
			itemsToPack[cboxi].CoordZ = packCoordZ;
			itemsToPack[cboxi].PackDimX = packDimX;
			itemsToPack[cboxi].PackDimY = packDimY;
			itemsToPack[cboxi].PackDimZ = packDimZ;

			itemsPackedInOrder.push(itemsToPack[cboxi]);
		}

		/**
   * Packs the boxes found and arranges all variables and records properly.
   */

	}, {
		key: "PackLayer",
		value: function PackLayer() {
			var lenx = 0;
			var lenz = 0;
			var lpz = 0;

			if (layerThickness == 0) {
				packing = false;
				return;
			}

			scrapfirst.CumX = px;
			scrapfirst.CumZ = 0;

			//for (; !quit;)
			while (!quit) {
				this.FindSmallestZ();

				if (!smallestZ.Pre && !smallestZ.Post) {
					//*** SITUATION-1: NO BOXES ON THE RIGHT AND LEFT SIDES ***

					lenx = smallestZ.CumX;
					lpz = remainpz - smallestZ.CumZ;
					this.FindBox(lenx, layerThickness, remainpy, lpz, lpz);
					this.CheckFound();

					if (layerDone) break;
					if (evened) continue;

					itemsToPack[cboxi].CoordX = 0;
					itemsToPack[cboxi].CoordY = packedy;
					itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
					if (cboxx == smallestZ.CumX) {
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					} else {
						smallestZ.Post = new ScrapPad();

						smallestZ.Post.Post = undefined;
						smallestZ.Post.Pre = smallestZ;
						smallestZ.Post.CumX = smallestZ.CumX;
						smallestZ.Post.CumZ = smallestZ.CumZ;
						smallestZ.CumX = cboxx;
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				} else if (!smallestZ.Pre) {
					//*** SITUATION-2: NO BOXES ON THE LEFT SIDE ***

					lenx = smallestZ.CumX;
					lenz = smallestZ.Post.CumZ - smallestZ.CumZ;
					lpz = remainpz - smallestZ.CumZ;
					this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
					this.CheckFound();

					if (layerDone) break;
					if (evened) continue;

					itemsToPack[cboxi].CoordY = packedy;
					itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
					if (cboxx == smallestZ.CumX) {
						itemsToPack[cboxi].CoordX = 0;

						if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ) {
							smallestZ.CumZ = smallestZ.Post.CumZ;
							smallestZ.CumX = smallestZ.Post.CumX;
							trash = smallestZ.Post;
							smallestZ.Post = smallestZ.Post.Post;

							if (smallestZ.Post) {
								smallestZ.Post.Pre = smallestZ;
							}
						} else {
							smallestZ.CumZ = smallestZ.CumZ + cboxz;
						}
					} else {
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;

						if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ) {
							smallestZ.CumX = smallestZ.CumX - cboxx;
						} else {
							smallestZ.Post.Pre = new ScrapPad();

							smallestZ.Post.Pre.Post = smallestZ.Post;
							smallestZ.Post.Pre.Pre = smallestZ;
							smallestZ.Post = smallestZ.Post.Pre;
							smallestZ.Post.CumX = smallestZ.CumX;
							smallestZ.CumX = smallestZ.CumX - cboxx;
							smallestZ.Post.CumZ = smallestZ.CumZ + cboxz;
						}
					}
				} else if (!smallestZ.Post) {
					//*** SITUATION-3: NO BOXES ON THE RIGHT SIDE ***

					lenx = smallestZ.CumX - smallestZ.Pre.CumX;
					lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
					lpz = remainpz - smallestZ.CumZ;
					this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
					this.CheckFound();

					if (layerDone) break;
					if (evened) continue;

					itemsToPack[cboxi].CoordY = packedy;
					itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
					itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

					if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX) {
						if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ) {
							smallestZ.Pre.CumX = smallestZ.CumX;
							smallestZ.Pre.Post = undefined;
						} else {
							smallestZ.CumZ = smallestZ.CumZ + cboxz;
						}
					} else {
						if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ) {
							smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
						} else {
							smallestZ.Pre.Post = new ScrapPad();

							smallestZ.Pre.Post.Pre = smallestZ.Pre;
							smallestZ.Pre.Post.Post = smallestZ;
							smallestZ.Pre = smallestZ.Pre.Post;
							smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
							smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
						}
					}
				} else if (smallestZ.Pre.CumZ == smallestZ.Post.CumZ) {
					//*** SITUATION-4: THERE ARE BOXES ON BOTH OF THE SIDES ***

					//*** SUBSITUATION-4A: SIDES ARE EQUAL TO EACH OTHER ***

					lenx = smallestZ.CumX - smallestZ.Pre.CumX;
					lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
					lpz = remainpz - smallestZ.CumZ;

					this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
					this.CheckFound();

					if (layerDone) break;
					if (evened) continue;

					itemsToPack[cboxi].CoordY = packedy;
					itemsToPack[cboxi].CoordZ = smallestZ.CumZ;

					if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX) {
						itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

						if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ) {
							smallestZ.Pre.CumX = smallestZ.Post.CumX;

							if (smallestZ.Post.Post) {
								smallestZ.Pre.Post = smallestZ.Post.Post;
								smallestZ.Post.Post.Pre = smallestZ.Pre;
							} else {
								smallestZ.Pre.Post = undefined;
							}
						} else {
							smallestZ.CumZ = smallestZ.CumZ + cboxz;
						}
					} else if (smallestZ.Pre.CumX < px - smallestZ.CumX) {
						if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ) {
							smallestZ.CumX = smallestZ.CumX - cboxx;
							itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
						} else {
							itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;
							smallestZ.Pre.Post = new ScrapPad();

							smallestZ.Pre.Post.Pre = smallestZ.Pre;
							smallestZ.Pre.Post.Post = smallestZ;
							smallestZ.Pre = smallestZ.Pre.Post;
							smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
							smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
						}
					} else {
						if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ) {
							smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
							itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;
						} else {
							itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
							smallestZ.Post.Pre = new ScrapPad();

							smallestZ.Post.Pre.Post = smallestZ.Post;
							smallestZ.Post.Pre.Pre = smallestZ;
							smallestZ.Post = smallestZ.Post.Pre;
							smallestZ.Post.CumX = smallestZ.CumX;
							smallestZ.Post.CumZ = smallestZ.CumZ + cboxz;
							smallestZ.CumX = smallestZ.CumX - cboxx;
						}
					}
				} else {
					//*** SUBSITUATION-4B: SIDES ARE NOT EQUAL TO EACH OTHER ***

					lenx = smallestZ.CumX - smallestZ.Pre.CumX;
					lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
					lpz = remainpz - smallestZ.CumZ;
					this.FindBox(lenx, layerThickness, remainpy, lenz, lpz);
					this.CheckFound();

					if (layerDone) break;
					if (evened) continue;

					itemsToPack[cboxi].CoordY = packedy;
					itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
					itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

					if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX) {
						if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ) {
							smallestZ.Pre.CumX = smallestZ.CumX;
							smallestZ.Pre.Post = smallestZ.Post;
							smallestZ.Post.Pre = smallestZ.Pre;
						} else {
							smallestZ.CumZ = smallestZ.CumZ + cboxz;
						}
					} else {
						if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ) {
							smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
						} else if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ) {
							itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
							smallestZ.CumX = smallestZ.CumX - cboxx;
						} else {
							smallestZ.Pre.Post = new ScrapPad();

							smallestZ.Pre.Post.Pre = smallestZ.Pre;
							smallestZ.Pre.Post.Post = smallestZ;
							smallestZ.Pre = smallestZ.Pre.Post;
							smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
							smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
						}
					}
				}

				this.VolumeCheck();
			}
		}

		/**
   * Using the parameters found, packs the best solution found and reports to the console.
   * @param {Container} container 
   */

	}, {
		key: "Report",
		value: function Report(container) {
			quit = false;

			switch (bestVariant) {
				case 1:
					px = container.Length;py = container.Height;pz = container.Width;
					break;

				case 2:
					px = container.Width;py = container.Height;pz = container.Length;
					break;

				case 3:
					px = container.Width;py = container.Length;pz = container.Height;
					break;

				case 4:
					px = container.Height;py = container.Length;pz = container.Width;
					break;

				case 5:
					px = container.Length;py = container.Width;pz = container.Height;
					break;

				case 6:
					px = container.Height;py = container.Width;pz = container.Length;
					break;
			}

			packingBest = true;

			//Print("BEST SOLUTION FOUND AT ITERATION                      :", bestIteration, "OF VARIANT", bestVariant);
			//Print("TOTAL ITEMS TO PACK                                   :", itemsToPackCount);
			//Print("TOTAL VOLUME OF ALL ITEMS                             :", totalItemVolume);
			//Print("WHILE CONTAINER ORIENTATION X - Y - Z                 :", px, py, pz);

			layers.length = 0;
			layers[0] = new Layer(-1);
			this.ListCanditLayers();
			//layers = layers.OrderBy(l => l.LayerEval).ToList();
			layers.sort(Layer.SortByEval);
			packedVolume = 0;
			packedy = 0;
			packing = true;
			layerThickness = layers[bestIteration].LayerDim;
			remainpy = py;
			remainpz = pz;

			for (x = 1; x <= itemsToPackCount; x++) {
				itemsToPack[x].IsPacked = false;
			}

			do {
				layerinlayer = 0;
				layerDone = false;
				this.PackLayer();
				packedy = packedy + layerThickness;
				remainpy = py - packedy;

				if (layerinlayer > epsilon) {
					prepackedy = packedy;
					preremainpy = remainpy;
					remainpy = layerThickness - prelayer;
					packedy = packedy - layerThickness + prelayer;
					remainpz = lilz;
					layerThickness = layerinlayer;
					layerDone = false;
					this.PackLayer();
					packedy = prepackedy;
					remainpy = preremainpy;
					remainpz = pz;
				}

				if (!quit) {
					this.FindLayer(remainpy);
				}
			} while (packing && !quit);
		}

		/**
   * After packing of each item, the 100% packing condition is checked.
   */

	}, {
		key: "VolumeCheck",
		value: function VolumeCheck() {
			itemsToPack[cboxi].IsPacked = true;
			itemsToPack[cboxi].PackDimX = cboxx;
			itemsToPack[cboxi].PackDimY = cboxy;
			itemsToPack[cboxi].PackDimZ = cboxz;
			packedVolume = packedVolume + itemsToPack[cboxi].Volume;
			packedItemCount++;

			if (packingBest) {
				this.OutputBoxList();
			} else if (packedVolume == totalContainerVolume || packedVolume == totalItemVolume) {
				packing = false;
				hundredPercentPacked = true;
			}
		}
	}]);

	return AFit;
}();

/* harmony default export */ __webpack_exports__["a"] = (AFit);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Execute", function() { return CLP_Solver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SolutionData", function() { return solution_data; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContainerItem", function() { return item_in_container; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signaler", function() { return signaler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signals", function() { return signals; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Workbook__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




/** Javascript port by chadiik 2018
 * 
 * CLP Spreadsheet Solver v1.1
 * Open source, developed by Dr. Gunes Erdogan
 * http://people.bath.ac.uk/ge277/index.php/clp-spreadsheet-solver/
 * 'This work is licensed under the Creative Commons Attribution 4.0 International License.; <=view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/.
 */

var epsilon = 0.0001;

//data declarations

var item_type_data =
/**
 * @param {Number} id 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} length 
 */
function item_type_data(id, width, height, length) {
    _classCallCheck(this, item_type_data);

    this.id = id;
    this.width = width;
    this.height = height;
    this.length = length;
    this.volume = width * height * length;
    this.weight = 0;
    this.xy_rotatable = true;
    this.yz_rotatable = true;
    this.mandatory = 0;
    this.profit = 0;
    this.number_requested = 1;
    this.sort_criterion = 0;
};

var item_list_data = function () {
    function item_list_data() {
        _classCallCheck(this, item_list_data);

        this.num_item_types = 0;
        this.total_number_of_items = 0;
        /** @type {Array<item_type_data>} */
        this.item_types;
    }

    _createClass(item_list_data, [{
        key: "item_typesGet",
        value: function item_typesGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.item_types[index];
        }
    }]);

    return item_list_data;
}();

var item_list = new item_list_data();

var container_type_data = function container_type_data() {
    _classCallCheck(this, container_type_data);

    this.type_id = 0;
    this.width = 0;
    this.height = 0;
    this.length = 0;
    this.volume_capacity = 0;
    this.weight_capacity = 0;
    this.mandatory = 0;
    this.cost = 0;
    this.number_available = 0;
};

var container_list_data = function () {
    function container_list_data() {
        _classCallCheck(this, container_list_data);

        this.num_container_types = 0;
        /** @type {Array<container_type_data>} */
        this.container_types;
    }

    _createClass(container_list_data, [{
        key: "container_typesGet",
        value: function container_typesGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.container_types[index];
        }
    }]);

    return container_list_data;
}();

var container_list = new container_list_data();

var compatibility_data = function () {
    function compatibility_data() {
        _classCallCheck(this, compatibility_data);

        /** @type {Array<Boolean>} */
        this.item_to_item;
        /** @type {Array<Array<Boolean>>} */
        this.container_to_item;
    }

    _createClass(compatibility_data, [{
        key: "item_to_itemGet",
        value: function item_to_itemGet(index, index2) {
            if (index === 0 || index2 === 0) {
                console.warn('0 index');
            }return this.item_to_item[index][index2];
        }
    }, {
        key: "container_to_itemGet",
        value: function container_to_itemGet(index, index2) {
            if (index === 0 || index2 === 0) {
                console.warn('0 index');
            }return this.container_to_item[index][index2];
        }
    }]);

    return compatibility_data;
}();

var compatibility_list = new compatibility_data();

var item_location = function item_location() {
    _classCallCheck(this, item_location);

    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_z = 0;
    this.next_to_item_type = 0;
};

var item_in_container = function () {
    function item_in_container() {
        _classCallCheck(this, item_in_container);

        this.item_type = 0;
        this.rotation = 0; //1 to 6
        this.mandatory = 0;
        this.origin_x = 0;
        this.origin_y = 0;
        this.origin_z = 0;
        this.opposite_x = 0;
        this.opposite_y = 0;
        this.opposite_z = 0;
    }

    _createClass(item_in_container, null, [{
        key: "ResolveOrientation",
        value: function ResolveOrientation(rotationNum) {
            var orientations_base1 = ['xyz', 'xyz', 'zyx', 'xzy', 'yzx', 'yxz', 'zxy'];
            return orientations_base1[rotationNum];
        }
    }]);

    return item_in_container;
}();

var container_data = function () {
    function container_data() {
        _classCallCheck(this, container_data);

        this.type_id = 0;
        this.width = 0;
        this.height = 0;
        this.length = 0;
        this.volume_capacity = 0;
        this.weight_capacity = 0;
        this.cost = 0;
        this.item_cnt = 0;
        this.mandatory = 0;
        this.addition_point_count = 0;
        this.volume_packed = 0;
        this.weight_packed = 0;

        /** @type {Array<item_in_container>} */
        this.items;
        /** @type {Array<item_location>} */
        this.addition_points;
        /** @type {Array<Number>} */
        this.repack_item_count;
    }

    _createClass(container_data, [{
        key: "itemsGet",
        value: function itemsGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.items[index];
        }
    }, {
        key: "addition_pointsGet",
        value: function addition_pointsGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.addition_points[index];
        }
    }, {
        key: "repack_item_countGet",
        value: function repack_item_countGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.repack_item_count[index];
        }
    }]);

    return container_data;
}();

var solution_data = function () {
    function solution_data() {
        _classCallCheck(this, solution_data);

        this.feasible = false;

        this.num_containers = 0;
        this.net_profit = 0;
        this.total_volume = 0;
        this.total_weight = 0;
        this.total_distance = 0;
        this.total_x_moment = 0;
        this.total_yz_moment = 0;

        /** @type {Array<container_data>} */
        this.container;
        /** @type {Array<Array<Number>>} */
        this.rotation_order;
        /** @type {Array<Number>} */
        this.item_type_order;
        /** @type {Array<Number>} */
        this.unpacked_item_count;
    }

    _createClass(solution_data, [{
        key: "containerGet",
        value: function containerGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.container[index];
        }
    }, {
        key: "item_type_orderGet",
        value: function item_type_orderGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.item_type_order[index];
        }
    }, {
        key: "unpacked_item_countGet",
        value: function unpacked_item_countGet(index) {
            if (index === 0) {
                console.warn('0 index');
            }return this.unpacked_item_count[index];
        }
    }]);

    return solution_data;
}();

var instance_data = function instance_data() {
    _classCallCheck(this, instance_data);

    this.front_side_support = false;
    this.item_item_compatibility_worksheet = false; // true if the data exists
    this.container_item_compatibility_worksheet = false; // true if the data exists
};

var instance = new instance_data();

var solver_option_data = function solver_option_data() {
    _classCallCheck(this, solver_option_data);

    this.CPU_time_limit = 0;
    this.item_sort_criterion = 0;
    this.show_progress = false;
};

var solver_options = new solver_option_data();

/**
 * 
 * @param {solution_data} solution 
 * @param {Number} random_reorder_probability 
 */
function SortContainers(solution, random_reorder_probability) {

    var i = 0;
    var j = 0;
    var candidate_index = 0;
    var max_mandatory = 0;
    var max_volume_packed = 0;
    var min_ratio = 0;

    /** @type {container_data} */
    var swap_container;

    // insertion sort

    if (Math.random() < 1 - random_reorder_probability) {
        // insertion sort
        for (i = 1; i <= solution.num_containers; i++) {
            var container = solution.containerGet(i);
            candidate_index = i;
            max_mandatory = container.mandatory;
            max_volume_packed = container.volume_packed;
            min_ratio = container.cost / container.volume_capacity;

            for (j = i + 1; j <= solution.num_containers; j++) {
                var container2 = solution.containerGet(j);
                if (container2.mandatory > max_mandatory || container2.mandatory === max_mandatory && container2.volume_packed > max_volume_packed + epsilon || container2.mandatory === 0 && max_mandatory === 0 && container2.volume_packed > max_volume_packed - epsilon && container2.cost / container2.volume_capacity < min_ratio) {
                    candidate_index = j;
                    max_mandatory = container2.mandatory;
                    max_volume_packed = container2.volume_packed;
                    min_ratio = container2.cost / container2.volume_capacity;
                }
            }

            if (candidate_index != i) {
                swap_container = solution.containerGet(candidate_index);
                solution.container[candidate_index] = solution.containerGet(i);
                solution.container[i] = swap_container;
            }
        }
    } else {
        for (i = 1; i <= solution.num_containers; i++) {
            candidate_index = Math.floor((solution.num_containers - i + 1) * Math.random() + i);

            if (candidate_index != i) {
                swap_container = solution.containerGet(candidate_index);
                solution.container[candidate_index] = solution.containerGet(i);
                solution.container[i] = swap_container;
            }
        }
    }
}

/**
 * 
 * @param {solution_data} solution 
 * @param {Number} container_id 
 * @param {Number} percent_time_left 
 */
function PerturbSolution(solution, container_id, percent_time_left) {

    var i = 0;
    var j = 0;
    var k = 0;
    var swap_long = 0;
    var operator_selection = 0;
    var container_emptying_probability = 0;
    var item_removal_probability = 0;
    var repack_flag = false;
    var continue_flag = false;

    var max_z = 0;

    //With solution.containerGet(container_id)
    var container = solution.containerGet(container_id);

    // test

    container_emptying_probability = 0.05 + 0.15 * percent_time_left;
    item_removal_probability = 0.05 + 0.15 * percent_time_left;

    if (container.item_cnt > 0) {

        if (Math.random() < container_emptying_probability) {

            // empty the container
            for (j = 1; j <= container.item_cnt; j++) {
                var jType = container.itemsGet(j).item_type;
                solution.unpacked_item_count[jType] = solution.unpacked_item_countGet(jType) + 1;
                solution.net_profit = solution.net_profit - item_list.item_typesGet(jType).profit;
            }

            solution.net_profit = solution.net_profit + container.cost;
            solution.total_volume = solution.total_volume - container.volume_packed;
            solution.total_weight = solution.total_weight - container.weight_packed;

            container.item_cnt = 0;
            container.volume_packed = 0;
            container.weight_packed = 0;
            container.addition_point_count = 1;
            container.addition_points[1].origin_x = 0;
            container.addition_points[1].origin_y = 0;
            container.addition_points[1].origin_z = 0;
        } else {
            repack_flag = false;
            operator_selection = Math.random();

            if (operator_selection < 0.3) {

                for (j = 1; j < container.item_cnt; j++) {
                    var jItem = container.itemsGet(j);

                    if (solution.feasible === false && jItem.mandatory === 0 || Math.random() < item_removal_probability) {
                        var _jType = jItem.item_type;
                        solution.unpacked_item_count[_jType] = solution.unpacked_item_countGet(_jType) + 1;
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(_jType).profit;
                        jItem.item_type = 0;

                        repack_flag = true;
                    }
                }
            } else if (operator_selection < 0.3) {
                // ???
                max_z = 0;
                for (j = 1; j <= container.item_cnt; j++) {
                    if (max_z < container.itemsGet(j).opposite_z) max_z = container.itemsGet(j).opposite_z;
                }

                max_z = max_z * (0.1 + 0.5 * percent_time_left * Math.random());

                for (j = 1; j <= container.item_cnt; j++) {
                    var _jItem = container.itemsGet(j);

                    if (solution.feasible === false && _jItem.mandatory === 0 || _jItem.opposite_z < max_z) {
                        var _jType2 = _jItem.item_type;
                        solution.unpacked_item_count[_jType2] = solution.unpacked_item_countGet(_jType2) + 1;
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(_jType2).profit;
                        _jItem.item_type = 0;

                        repack_flag = true;
                    }
                }
            } else {

                max_z = 0;
                for (j = 1; j <= container.item_cnt; j++) {
                    if (max_z < container.itemsGet(j).opposite_z) max_z = container.itemsGet(j).opposite_z;
                }

                max_z = max_z * (0.6 - 0.5 * percent_time_left * Math.random());

                for (j = 1; j <= container.item_cnt; j++) {
                    var _jItem2 = container.itemsGet(j);

                    if (solution.feasible === false && _jItem2.mandatory === 0 || _jItem2.opposite_z > max_z) {
                        var _jType3 = _jItem2.item_type;
                        solution.unpacked_item_count[_jType3] = solution.unpacked_item_countGet(_jType3) + 1;
                        solution.net_profit = solution.net_profit - item_list.item_typesGet(_jType3).profit;
                        _jItem2.item_type = 0;

                        repack_flag = true;
                    }
                }
            }

            if (repack_flag) {

                for (j = 1; j <= container.item_cnt; j++) {
                    if (container.itemsGet(j).item_type > 0) solution.net_profit = solution.net_profit - item_list.item_typesGet(container.itemsGet(j).item_type).profit;
                }

                solution.net_profit = solution.net_profit + container.cost;
                solution.total_volume = solution.total_volume - container.volume_packed;
                solution.total_weight = solution.total_weight - container.weight_packed;

                for (j = 1; j <= item_list.num_item_types; j++) {
                    container.repack_item_count[j] = 0;
                }

                for (j = 1; j <= container.item_cnt; j++) {
                    if (container.itemsGet(j).item_type > 0) container.repack_item_count[container.itemsGet(j).item_type] = container.repack_item_countGet(container.itemsGet(j).item_type) + 1;
                }

                container.volume_packed = 0;
                container.weight_packed = 0;
                container.item_cnt = 0;
                container.addition_point_count = 1;
                container.addition_points[1].origin_x = 0;
                container.addition_points[1].origin_y = 0;
                container.addition_points[1].origin_z = 0;

                // repack now

                for (j = 1; j <= item_list.num_item_types; j++) {
                    continue_flag = true;
                    while (container.repack_item_countGet(solution.item_type_orderGet(j)) > 0 && continue_flag) {
                        continue_flag = AddItemToContainer(solution, container_id, solution.item_type_orderGet(j), 2, true);
                    } // put the remaining items in the unpacked items list

                    solution.unpacked_item_count[solution.item_type_orderGet(j)] = solution.unpacked_item_countGet(solution.item_type_orderGet(j)) + container.repack_item_countGet(solution.item_type_orderGet(j));
                    container.repack_item_count[solution.item_type_orderGet(j)] = 0;
                }
            }
        }
    }

    // change the preferred rotation order randomly

    for (i = 1; i <= item_list.num_item_types; i++) {

        for (j = 1; j <= 6; j++) {
            k = Math.floor((6 - j + 1) * Math.random() + j); // the order to swap with

            swap_long = solution.rotation_order[i][j];
            solution.rotation_order[i][j] = solution.rotation_order[i][k];
            solution.rotation_order[i][k] = swap_long;
        }
        // MsgBox ("Item type " + i + " rotation order: " + solution.rotation_order(i, 1) + solution.rotation_order(i, 2) + solution.rotation_order(i, 3) + solution.rotation_order(i, 4) + solution.rotation_order(i, 5) + solution.rotation_order(i, 6))
    }

    // change the item order randomly - test

    for (i = 1; i <= item_list.num_item_types; i++) {
        j = Math.floor((item_list.num_item_types - i + 1) * Math.random() + i); // the order to swap with

        swap_long = solution.item_type_orderGet(i);
        solution.item_type_order[i] = solution.item_type_orderGet(j);
        solution.item_type_order[j] = swap_long;
    }
}

/**
 * 
 * @param {solution_data} solution 
 * @param {Number} container_index 
 * @param {Number} item_type_index 
 * @param {Number} add_type 
 * @param {Boolean} item_cohesion 
 */
function AddItemToContainer(solution, container_index, item_type_index, add_type, item_cohesion) {

    var i = 0;
    var j = 0;

    var rotation_index = 0;

    var origin_x = 0;
    var origin_y = 0;
    var origin_z = 0;
    var opposite_x = 0;
    var opposite_y = 0;
    var opposite_z = 0;

    var min_x = 0;
    var min_y = 0;
    var min_z = 0;
    var next_to_item_type = 0;

    var candidate_position = 0;
    var current_rotation = 0;
    var candidate_rotation = 0;

    var area_supported = 0;
    var area_required = 0;
    var intersection_right = 0;
    var intersection_left = 0;
    var intersection_top = 0;
    var intersection_bottom = 0;
    var support_flag = false;

    //With solution.containerGet(container_index)
    var container = solution.containerGet(container_index);

    min_x = container.width + 1;
    min_y = container.height + 1;
    min_z = container.length + 1;
    next_to_item_type = 0;

    candidate_position = 0;

    var GoTo = false;
    // compatibility check
    if (!GoTo && instance.container_item_compatibility_worksheet === true) {
        if (compatibility_list.container_to_itemGet(container.type_id, item_list.item_typesGet(item_type_index).id) === false) GoTo = true; //'AddItemToContainer_Finish';
    }

    // volume size check
    if (!GoTo && container.volume_packed + item_list.item_typesGet(item_type_index).volume > container.volume_capacity) GoTo = true; //'AddItemToContainer_Finish';

    // weight capacity check
    if (!GoTo && container.weight_packed + item_list.item_typesGet(item_type_index).weight > container.weight_capacity) GoTo = true; //'AddItemToContainer_Finish';

    // item to item compatibility check
    if (!GoTo && instance.item_item_compatibility_worksheet === true) {
        for (i = 1; i <= container.item_cnt; i++) {
            if (compatibility_list.item_to_itemGet(item_list.item_typesGet(item_type_index).id, item_list.item_typesGet(container.itemsGet(i).item_type).id) === false) {
                GoTo = true; //'AddItemToContainer_Finish';
                break;
            }
        }
    }

    if (!GoTo) {
        for (rotation_index = 1; rotation_index <= 6; rotation_index++) {
            current_rotation = solution.rotation_order[item_type_index][rotation_index];

            // forbidden rotations
            if ((current_rotation === 3 || current_rotation === 4) && item_list.item_typesGet(item_type_index).xy_rotatable === false) {
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            if ((current_rotation === 5 || current_rotation === 6) && item_list.item_typesGet(item_type_index).yz_rotatable === false) {
                //GoTo  = 'next_rotation_iteration';
                continue;
            }

            // symmetry breaking

            if (current_rotation === 2 && Math.abs(item_list.item_typesGet(item_type_index).width - item_list.item_typesGet(item_type_index).length) < epsilon) {
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            if (current_rotation === 4 && Math.abs(item_list.item_typesGet(item_type_index).width - item_list.item_typesGet(item_type_index).height) < epsilon) {
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            if (current_rotation === 6 && Math.abs(item_list.item_typesGet(item_type_index).height - item_list.item_typesGet(item_type_index).length) < epsilon) {
                //GoTo = 'next_rotation_iteration';
                continue;
            }

            for (i = 1; i <= container.addition_point_count; i++) {

                if (item_cohesion === true && candidate_position != 0 && next_to_item_type === item_type_index && container.addition_pointsGet(i).next_to_item_type != item_type_index) {
                    //GoTo = 'next_iteration';
                    continue;
                }

                origin_x = container.addition_pointsGet(i).origin_x;
                origin_y = container.addition_pointsGet(i).origin_y;
                origin_z = container.addition_pointsGet(i).origin_z;

                if (current_rotation === 1) {
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).width;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).height;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).length;
                } else if (current_rotation === 2) {
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).length;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).height;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).width;
                } else if (current_rotation === 3) {
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).width;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).length;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).height;
                } else if (current_rotation === 4) {
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).height;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).length;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).width;
                } else if (current_rotation === 5) {
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).height;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).width;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).length;
                } else if (current_rotation === 6) {
                    opposite_x = origin_x + item_list.item_typesGet(item_type_index).length;
                    opposite_y = origin_y + item_list.item_typesGet(item_type_index).width;
                    opposite_z = origin_z + item_list.item_typesGet(item_type_index).height;
                }

                // check the feasibility of all four corners, w.r.t to the other items

                if (opposite_x > container.width + epsilon || opposite_y > container.height + epsilon || opposite_z > container.length + epsilon) {
                    //GoTo = 'next_iteration';
                    continue;
                }

                var next_iteration = false;
                for (j = 1; j <= container.item_cnt; j++) {

                    if (opposite_x < container.itemsGet(j).origin_x + epsilon || container.itemsGet(j).opposite_x < origin_x + epsilon || opposite_y < container.itemsGet(j).origin_y + epsilon || container.itemsGet(j).opposite_y < origin_y + epsilon || opposite_z < container.itemsGet(j).origin_z + epsilon || container.itemsGet(j).opposite_z < origin_z + epsilon) {
                        // no conflict
                    } else {
                        // conflict
                        //GoTo = 'next_iteration';
                        next_iteration = true;
                        break;
                    }
                }

                if (next_iteration) {
                    continue;
                }

                // vertical support

                if (origin_y < epsilon) {
                    support_flag = true;
                } else {
                    area_supported = 0;
                    area_required = (opposite_x - origin_x) * (opposite_z - origin_z);
                    support_flag = false;
                    for (j = container.item_cnt; j >= 1; j--) {
                        if (Math.abs(origin_y - container.itemsGet(j).opposite_y) < epsilon) {
                            // check for intersection

                            intersection_right = opposite_x;
                            if (intersection_right > container.itemsGet(j).opposite_x) intersection_right = container.itemsGet(j).opposite_x;

                            intersection_left = origin_x;
                            if (intersection_left < container.itemsGet(j).origin_x) intersection_left = container.itemsGet(j).origin_x;

                            intersection_top = opposite_z;
                            if (intersection_top > container.itemsGet(j).opposite_z) intersection_top = container.itemsGet(j).opposite_z;

                            intersection_bottom = origin_z;
                            if (intersection_bottom < container.itemsGet(j).origin_z) intersection_bottom = container.itemsGet(j).origin_z;

                            if (intersection_right > intersection_left && intersection_top > intersection_bottom) {
                                area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom);
                                if (area_supported > area_required - epsilon) {
                                    support_flag = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (support_flag === false) {
                    //GoTo = 'next_iteration';
                    continue;
                }

                // side support

                if (instance.front_side_support === true) {
                    if (origin_z < epsilon) {
                        support_flag = true;
                    } else {
                        area_supported = 0;
                        area_required = (opposite_x - origin_x) * (opposite_y - origin_y);
                        support_flag = false;
                        for (j = container.item_cnt; j >= 1; j--) {
                            if (Math.abs(origin_z - container.itemsGet(j).opposite_z) < epsilon) {
                                // check for intersection

                                intersection_right = opposite_x;
                                if (intersection_right > container.itemsGet(j).opposite_x) intersection_right = container.itemsGet(j).opposite_x;

                                intersection_left = origin_x;
                                if (intersection_left < container.itemsGet(j).origin_x) intersection_left = container.itemsGet(j).origin_x;

                                intersection_top = opposite_y;
                                if (intersection_top > container.itemsGet(j).opposite_y) intersection_top = container.itemsGet(j).opposite_y;

                                intersection_bottom = origin_y;
                                if (intersection_bottom < container.itemsGet(j).origin_y) intersection_bottom = container.itemsGet(j).origin_y;

                                if (intersection_right > intersection_left && intersection_top > intersection_bottom) {
                                    area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom);
                                    if (area_supported > area_required - epsilon) {
                                        support_flag = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                if (support_flag === false) {
                    //GoTo = 'next_iteration';
                    continue;
                }

                // no conflicts at this point

                if (item_cohesion === true && next_to_item_type != item_type_index && container.addition_pointsGet(i).next_to_item_type === item_type_index) {
                    min_x = origin_x;
                    min_y = origin_y;
                    min_z = origin_z;
                    candidate_position = i;
                    candidate_rotation = current_rotation;
                    next_to_item_type = container.addition_pointsGet(i).next_to_item_type;
                } else {
                    if (origin_z < min_z || origin_z <= min_z + epsilon && origin_y < min_y || origin_z <= min_z + epsilon && origin_y <= min_y + epsilon && origin_x < min_x || origin_z <= min_z + epsilon && origin_y <= min_y + epsilon && origin_x <= min_x + epsilon && (opposite_x > container.width + epsilon || opposite_y > container.height + epsilon)) {
                        min_x = origin_x;
                        min_y = origin_y;
                        min_z = origin_z;
                        candidate_position = i;
                        candidate_rotation = current_rotation;
                        next_to_item_type = container.addition_pointsGet(i).next_to_item_type;
                    }
                }
            }
        }
    }

    // next_iteration: Next i
    // next_rotation_iteration: Next rotation_index

    // AddItemToContainer_Finish:

    if (candidate_position === 0) {
        return false;
    } else {
        //With solution.containerGet(container_index)
        var _container = solution.containerGet(container_index);
        _container.item_cnt = _container.item_cnt + 1;
        _container.itemsGet(_container.item_cnt).item_type = item_type_index;
        _container.itemsGet(_container.item_cnt).origin_x = _container.addition_pointsGet(candidate_position).origin_x;
        _container.itemsGet(_container.item_cnt).origin_y = _container.addition_pointsGet(candidate_position).origin_y;
        _container.itemsGet(_container.item_cnt).origin_z = _container.addition_pointsGet(candidate_position).origin_z;
        _container.itemsGet(_container.item_cnt).rotation = candidate_rotation;
        _container.itemsGet(_container.item_cnt).mandatory = item_list.item_typesGet(item_type_index).mandatory;

        if (candidate_rotation === 1) {
            _container.itemsGet(_container.item_cnt).opposite_x = _container.itemsGet(_container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).width;
            _container.itemsGet(_container.item_cnt).opposite_y = _container.itemsGet(_container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).height;
            _container.itemsGet(_container.item_cnt).opposite_z = _container.itemsGet(_container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).length;
        } else if (candidate_rotation === 2) {
            _container.itemsGet(_container.item_cnt).opposite_x = _container.itemsGet(_container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).length;
            _container.itemsGet(_container.item_cnt).opposite_y = _container.itemsGet(_container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).height;
            _container.itemsGet(_container.item_cnt).opposite_z = _container.itemsGet(_container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).width;
        } else if (candidate_rotation === 3) {
            _container.itemsGet(_container.item_cnt).opposite_x = _container.itemsGet(_container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).width;
            _container.itemsGet(_container.item_cnt).opposite_y = _container.itemsGet(_container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).length;
            _container.itemsGet(_container.item_cnt).opposite_z = _container.itemsGet(_container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).height;
        } else if (candidate_rotation === 4) {
            _container.itemsGet(_container.item_cnt).opposite_x = _container.itemsGet(_container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).height;
            _container.itemsGet(_container.item_cnt).opposite_y = _container.itemsGet(_container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).length;
            _container.itemsGet(_container.item_cnt).opposite_z = _container.itemsGet(_container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).width;
        } else if (candidate_rotation === 5) {
            _container.itemsGet(_container.item_cnt).opposite_x = _container.itemsGet(_container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).height;
            _container.itemsGet(_container.item_cnt).opposite_y = _container.itemsGet(_container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).width;
            _container.itemsGet(_container.item_cnt).opposite_z = _container.itemsGet(_container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).length;
        } else if (candidate_rotation === 6) {
            _container.itemsGet(_container.item_cnt).opposite_x = _container.itemsGet(_container.item_cnt).origin_x + item_list.item_typesGet(item_type_index).length;
            _container.itemsGet(_container.item_cnt).opposite_y = _container.itemsGet(_container.item_cnt).origin_y + item_list.item_typesGet(item_type_index).width;
            _container.itemsGet(_container.item_cnt).opposite_z = _container.itemsGet(_container.item_cnt).origin_z + item_list.item_typesGet(item_type_index).height;
        }

        _container.volume_packed = _container.volume_packed + item_list.item_typesGet(item_type_index).volume;
        _container.weight_packed = _container.weight_packed + item_list.item_typesGet(item_type_index).weight;

        if (add_type === 2) {
            _container.repack_item_count[item_type_index] = _container.repack_item_countGet(item_type_index) - 1;
        }

        // update the addition points

        for (i = candidate_position; i <= _container.addition_point_count - 1; i++) {
            _container.addition_points[i] = _container.addition_pointsGet(i + 1);
        }

        _container.addition_point_count = _container.addition_point_count - 1;

        if (_container.itemsGet(_container.item_cnt).opposite_x < _container.width - epsilon && _container.itemsGet(_container.item_cnt).origin_y < _container.height - epsilon && _container.itemsGet(_container.item_cnt).origin_z < _container.length - epsilon) {
            _container.addition_point_count = _container.addition_point_count + 1;
            _container.addition_pointsGet(_container.addition_point_count).origin_x = _container.itemsGet(_container.item_cnt).opposite_x;
            _container.addition_pointsGet(_container.addition_point_count).origin_y = _container.itemsGet(_container.item_cnt).origin_y;
            _container.addition_pointsGet(_container.addition_point_count).origin_z = _container.itemsGet(_container.item_cnt).origin_z;
            _container.addition_pointsGet(_container.addition_point_count).next_to_item_type = item_type_index;
        }

        if (_container.itemsGet(_container.item_cnt).origin_x < _container.width - epsilon && _container.itemsGet(_container.item_cnt).opposite_y < _container.height - epsilon && _container.itemsGet(_container.item_cnt).origin_z < _container.length - epsilon) {
            _container.addition_point_count = _container.addition_point_count + 1;
            _container.addition_pointsGet(_container.addition_point_count).origin_x = _container.itemsGet(_container.item_cnt).origin_x;
            _container.addition_pointsGet(_container.addition_point_count).origin_y = _container.itemsGet(_container.item_cnt).opposite_y;
            _container.addition_pointsGet(_container.addition_point_count).origin_z = _container.itemsGet(_container.item_cnt).origin_z;
            _container.addition_pointsGet(_container.addition_point_count).next_to_item_type = item_type_index;
        }

        if (_container.itemsGet(_container.item_cnt).origin_x < _container.width - epsilon && _container.itemsGet(_container.item_cnt).origin_y < _container.height - epsilon && _container.itemsGet(_container.item_cnt).opposite_z < _container.length - epsilon) {
            _container.addition_point_count = _container.addition_point_count + 1;
            _container.addition_pointsGet(_container.addition_point_count).origin_x = _container.itemsGet(_container.item_cnt).origin_x;
            _container.addition_pointsGet(_container.addition_point_count).origin_y = _container.itemsGet(_container.item_cnt).origin_y;
            _container.addition_pointsGet(_container.addition_point_count).origin_z = _container.itemsGet(_container.item_cnt).opposite_z;
            _container.addition_pointsGet(_container.addition_point_count).next_to_item_type = item_type_index;
        }

        //With solution
        // update the profit

        if (solution.containerGet(container_index).item_cnt === 1) {
            solution.net_profit = solution.net_profit + item_list.item_typesGet(item_type_index).profit - solution.containerGet(container_index).cost;
        } else {
            solution.net_profit = solution.net_profit + item_list.item_typesGet(item_type_index).profit;
        }

        // update the volume per container and the total volume

        solution.total_volume = solution.total_volume + item_list.item_typesGet(item_type_index).volume;
        solution.total_weight = solution.total_weight + item_list.item_typesGet(item_type_index).weight;

        // update the unpacked items

        if (add_type === 1) {
            solution.unpacked_item_count[item_type_index] = solution.unpacked_item_countGet(item_type_index) - 1;
        }

        return true;
    }

    return false;
}

/**
 * @typedef SolverOptions
 * @property {Number} itemSortCriterion - 1:Volume, 2:Weight, 3:MaxDim
 * @property {Boolean} showProgress
 * @property {Number} cpuTimeLimit - in seconds
 * 
 * @param {SolverOptions} options 
 */
function GetSolverOptions(options) {
    if (options) {
        solver_options.item_sort_criterion = options.itemSortCriterion;
        solver_options.show_progress = options.showProgress;
        solver_options.CPU_time_limit = options.cpuTimeLimit;
    } else {
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("CLP Solver Console").Activate;

        //With solver_options

        if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(12, 3).Value === "Volume") {
            solver_options.item_sort_criterion = 1;
        } else if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(12, 3).Value === "Weight") {
            solver_options.item_sort_criterion = 2;
        } else {
            solver_options.item_sort_criterion = 3;
        }

        if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(13, 3).Value === "Yes") {
            solver_options.show_progress = true;
        } else {
            solver_options.show_progress = false;
        }

        solver_options.CPU_time_limit = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(14, 3).Value;
    }
}

/**
 * @typedef ItemData
 * @property {Number} length
 * @property {Number} width
 * @property {Number} height
 * @property {Boolean} xyRotatable
 * @property {Boolean} yzRotatable
 * @property {Number} weight
 * @property {Number} mandatory
 * @property {Number} profit
 * @property {Number} quantity
 * 
 * @param {Array<ItemData>} itemsData 
 */
function GetItemData(itemsData) {

    var numItemTypes;

    if (itemsData) {
        numItemTypes = itemsData.length;
    } else {
        numItemTypes = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("CLP Solver Console").Cells(2, 3).Value;
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("1.Items").Activate;
    }
    item_list.num_item_types = numItemTypes;
    item_list.total_number_of_items = 0;

    item_list.item_types = [null];
    var i = 0;
    for (i = 1; i <= item_list.num_item_types; i++) {
        item_list.item_types.push(new item_type_data());
    }

    var max_volume = 0;
    var max_weight = 0;

    if (itemsData) {
        if (itemsData[0] !== null) itemsData.unshift(null);
        for (i = 1; i <= item_list.num_item_types; i++) {
            var item = itemsData[i];
            item_list.item_typesGet(i).id = i;

            item_list.item_typesGet(i).width = item.width;
            item_list.item_typesGet(i).height = item.height;
            item_list.item_typesGet(i).length = item.length;

            item_list.item_typesGet(i).volume = item.width * item.height * item.length;

            if (max_volume < item_list.item_typesGet(i).volume) {
                max_volume = item_list.item_typesGet(i).volume;
            }

            item_list.item_typesGet(i).xy_rotatable = item.xyRotatable;
            item_list.item_typesGet(i).yz_rotatable = item.yzRotatable;

            if (Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).height) < epsilon && Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).length) < epsilon) {
                item_list.item_typesGet(i).xy_rotatable = false;
                item_list.item_typesGet(i).yz_rotatable = false;
            }

            item_list.item_typesGet(i).weight = item.weight;

            if (max_weight < item_list.item_typesGet(i).weight) {
                max_weight = item_list.item_typesGet(i).weight;
            }

            item_list.item_typesGet(i).mandatory = item.mandatory;

            item_list.item_typesGet(i).profit = item.profit;

            item_list.item_typesGet(i).number_requested = item.quantity;

            item_list.total_number_of_items = item_list.total_number_of_items + item_list.item_typesGet(i).number_requested;
        }
    } else {
        //With item_list
        for (i = 1; i <= item_list.num_item_types; i++) {
            item_list.item_typesGet(i).id = i;

            item_list.item_typesGet(i).width = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 4).Value;
            item_list.item_typesGet(i).height = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 5).Value;
            item_list.item_typesGet(i).length = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 6).Value;

            item_list.item_typesGet(i).volume = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 7).Value;

            if (max_volume < item_list.item_typesGet(i).volume) {
                max_volume = item_list.item_typesGet(i).volume;
            }

            if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 9).Value === "Yes") {
                item_list.item_typesGet(i).xy_rotatable = true;
            } else {
                item_list.item_typesGet(i).xy_rotatable = false;
            }

            if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 10).Value === "Yes") {
                item_list.item_typesGet(i).yz_rotatable = true;
            } else {
                item_list.item_typesGet(i).yz_rotatable = false;
            }

            if (Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).height) < epsilon && Math.abs(item_list.item_typesGet(i).width - item_list.item_typesGet(i).length) < epsilon) {
                item_list.item_typesGet(i).xy_rotatable = false;
                item_list.item_typesGet(i).yz_rotatable = false;
            }

            item_list.item_typesGet(i).weight = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 11).Value;

            if (max_weight < item_list.item_typesGet(i).weight) {
                max_weight = item_list.item_typesGet(i).weight;
            }

            if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 12).Value === "Must be packed") {
                item_list.item_typesGet(i).mandatory = 1;
            } else if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 12).Value === "May be packed") {
                item_list.item_typesGet(i).mandatory = 0;
            } else if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 12).Value === "Don't pack") {
                item_list.item_typesGet(i).mandatory = -1;
            }

            item_list.item_typesGet(i).profit = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 13).Value;

            item_list.item_typesGet(i).number_requested = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2 + i, 14).Value;

            item_list.total_number_of_items = item_list.total_number_of_items + item_list.item_typesGet(i).number_requested;
        }
    }

    for (i = 1; i <= item_list.num_item_types; i++) {

        if (solver_options.item_sort_criterion === 1) {
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).volume * (max_weight + 1) + item_list.item_typesGet(i).weight;
        } else if (solver_options.item_sort_criterion === 2) {
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).weight * (max_volume + 1) + item_list.item_typesGet(i).volume;
        } else {
            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).width;
            if (item_list.item_typesGet(i).sort_criterion < item_list.item_typesGet(i).height) {
                item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).height;
            }
            if (item_list.item_typesGet(i).sort_criterion < item_list.item_typesGet(i).length) {
                item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).length;
            }

            item_list.item_typesGet(i).sort_criterion = item_list.item_typesGet(i).sort_criterion * (max_volume + 1) + item_list.item_typesGet(i).volume;
        }
    }
}

/**
 * @typedef ContainerData
 * @property {Number} length
 * @property {Number} width
 * @property {Number} height
 * @property {Number} weightCapacity
 * @property {Number} mandatory
 * @property {Number} cost
 * @property {Number} quantity
 * 
 * @param {Array<ContainerData>} containersData 
 */
function GetContainerData(containersData) {

    var numContainerTypes;
    if (containersData) {
        numContainerTypes = containersData.length;
    } else {
        numContainerTypes = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("CLP Solver Console").Cells(4, 3).Value;
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("2.Containers").Activate;
    }

    container_list.num_container_types = numContainerTypes;

    container_list.container_types = [null];
    var i = 0;
    for (i = 1; i <= container_list.num_container_types; i++) {
        container_list.container_types.push(new container_type_data());
    }

    if (containersData) {
        containersData.unshift(null);
        for (i = 1; i <= container_list.num_container_types; i++) {
            var container = containersData[i];

            container_list.container_typesGet(i).type_id = i;

            container_list.container_typesGet(i).width = container.width;
            container_list.container_typesGet(i).height = container.height;
            container_list.container_typesGet(i).length = container.length;

            container_list.container_typesGet(i).volume_capacity = container.width * container.height * container.length;
            container_list.container_typesGet(i).weight_capacity = container.weightCapacity;

            container_list.container_typesGet(i).mandatory = container.mandatory;

            container_list.container_typesGet(i).cost = container.cost;

            container_list.container_typesGet(i).number_available = container.quantity;
        }
    } else {
        //With container_list
        for (i = 1; i <= container_list.num_container_types; i++) {

            container_list.container_typesGet(i).type_id = i;

            container_list.container_typesGet(i).width = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 3).Value;
            container_list.container_typesGet(i).height = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 4).Value;
            container_list.container_typesGet(i).length = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 5).Value;

            container_list.container_typesGet(i).volume_capacity = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 6).Value;
            container_list.container_typesGet(i).weight_capacity = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 7).Value;

            if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 8).Value === "Must be used") {
                container_list.container_typesGet(i).mandatory = 1;
            } else if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 8).Value === "May be used") {
                container_list.container_typesGet(i).mandatory = 0;
            } else if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 8).Value === "Do not use") {
                container_list.container_typesGet(i).mandatory = -1;
            }

            container_list.container_typesGet(i).cost = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 9).Value;

            container_list.container_typesGet(i).number_available = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(1 + i, 10).Value;
        }
    }
}

function GetCompatibilityData() {}

/*

//With compatibility_list
    
var i = 0;
var j = 0;
var k = 0;
  if( instance.item_item_compatibility_worksheet === true ){

    compatibility_list.item_to_item = [[]];
    
    for( i = 1; i <= item_list.num_item_types; i++) {
        for( j = 1; j <= item_list.num_item_types; j++ ){
            item_list.item_to_item[i][j] = true;
        }
    }
    
    k = 3;
    for( i = 1; i <= item_list.num_item_types; i++){
        for( j = i + 1; j <= item_list.num_item_types; j++){
            if( ThisWorkbook.Worksheets("1.3.Item-Item Compatibility").Cells(k, 3) === "No" ){
                item_list.item_to_item[i][j] = false;
                item_list.item_to_item[j][i] = false;
            }
            k = k + 1;
        }
    }
    
}

if( instance.container_item_compatibility_worksheet = true ){

    Re var .container_to_itemGet(1; <=container_list.num_container_types, 1; <=item_list.num_item_types)
    
    for( i = 1; <=container_list.num_container_types
        for( j = 1; <=item_list.num_item_types
        
            .container_to_itemGet(i, j) = true
            
        }
    }
    
    k = 3
    for( i = 1; <=container_list.num_container_types
        for( j = 1; <=item_list.num_item_types
        
            if( ThisWorkbook.Worksheets("2.3.Container-ItemCompatibility").Cells(k, 3) = "No" ){
                .container_to_itemGet(i, j) = false
            }
                
            k = k + 1
        }
    }
    
}
*/


/**
 * 
 * @param {solution_data} solution 
 */
function InitializeSolution(solution) {

    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;

    //With solution
    solution.feasible = false;
    solution.net_profit = 0;
    solution.total_volume = 0;
    solution.total_weight = 0;
    solution.total_distance = 0;
    solution.total_x_moment = 0;
    solution.total_yz_moment = 0;

    solution.num_containers = 0;
    for (i = 1; i <= container_list.num_container_types; i++) {
        if (container_list.container_typesGet(i).mandatory >= 0) {
            solution.num_containers = solution.num_containers + container_list.container_typesGet(i).number_available;
        }
    }

    solution.rotation_order = [null];
    for (i = 1; i <= item_list.num_item_types; i++) {
        solution.rotation_order[i] = [null];
        for (j = 1; j <= 6; j++) {
            solution.rotation_order[i][j] = j;
        }
    }

    solution.item_type_order = [null];
    for (i = 1; i <= item_list.num_item_types; i++) {
        solution.item_type_order[i] = i;
    }

    solution.container = [null];
    for (i = 1; i <= solution.num_containers; i++) {
        solution.container[i] = new container_data();

        solution.containerGet(i).items = [null];
        for (j = 1; j <= item_list.total_number_of_items; j++) {
            solution.containerGet(i).items.push(new item_in_container());
        }solution.containerGet(i).addition_points = [null];
        for (j = 1; j <= 3 * item_list.total_number_of_items; j++) {
            solution.containerGet(i).addition_points.push(new item_location());
        }solution.containerGet(i).repack_item_count = [null];
        for (j = 1; j <= item_list.total_number_of_items; j++) {
            solution.containerGet(i).repack_item_count.push(0);
        }
    }

    solution.unpacked_item_count = [null];

    l = 1;
    for (i = 1; i <= container_list.num_container_types; i++) {
        if (container_list.container_typesGet(i).mandatory >= 0) {
            for (j = 1; j <= container_list.container_typesGet(i).number_available; j++) {

                solution.containerGet(l).width = container_list.container_typesGet(i).width;
                solution.containerGet(l).height = container_list.container_typesGet(i).height;
                solution.containerGet(l).length = container_list.container_typesGet(i).length;
                solution.containerGet(l).volume_capacity = container_list.container_typesGet(i).volume_capacity;
                solution.containerGet(l).weight_capacity = container_list.container_typesGet(i).weight_capacity;
                solution.containerGet(l).cost = container_list.container_typesGet(i).cost;
                solution.containerGet(l).mandatory = container_list.container_typesGet(i).mandatory;
                solution.containerGet(l).type_id = i;
                solution.containerGet(l).volume_packed = 0;
                solution.containerGet(l).weight_packed = 0;
                solution.containerGet(l).item_cnt = 0;

                solution.containerGet(l).addition_point_count = 1;

                for (k = 1; k <= item_list.total_number_of_items; k++) {
                    solution.containerGet(l).itemsGet(k).item_type = 0;
                    solution.containerGet(l).addition_pointsGet(k).origin_x = 0;
                    solution.containerGet(l).addition_pointsGet(k).origin_y = 0;
                    solution.containerGet(l).addition_pointsGet(k).origin_z = 0;
                    solution.containerGet(l).addition_pointsGet(k).next_to_item_type = 0;
                }

                for (k = 1; k <= item_list.total_number_of_items; k++) {
                    solution.containerGet(l).repack_item_count[k] = 0;
                }

                l = l + 1;
            }
        }
    }

    for (i = 1; i <= item_list.num_item_types; i++) {
        solution.unpacked_item_count[i] = item_list.item_typesGet(i).number_requested;
    }
}

function GetInstanceData() {

    if (__WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("CLP Solver Console").Cells(6, 3).Value === "Yes") {
        instance.front_side_support = true;
    } else {
        instance.front_side_support = false;
    }

    if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["c" /* CheckWorksheetExistence */])("1.3.Item-Item Compatibility") === true) {
        instance.item_item_compatibility_worksheet = true;
    } else {
        instance.item_item_compatibility_worksheet = false;
    }

    if (Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["c" /* CheckWorksheetExistence */])("2.3.Container-ItemCompatibility") === true) {
        instance.container_item_compatibility_worksheet = true;
    } else {
        instance.container_item_compatibility_worksheet = false;
    }
}

/**
 * @param {solution_data} solution 
 */
function WriteSolution(solution) {

    //Application.ScreenUpdating = False
    //Application.Calculation = xlCalculationManual

    var i = 0;
    var j = 0;
    var k = 0;

    var container_index = 0;

    /** @type {container_data} */
    var swap_container;

    // sort the containers

    for (i = 1; i <= solution.num_containers; i++) {
        for (j = solution.num_containers; j >= 2; j--) {
            if (solution.containerGet(j).type_id < solution.containerGet(j - 1).type_id || solution.containerGet(j).type_id === solution.containerGet(j - 1).type_id && solution.containerGet(j).volume_packed > solution.containerGet(j - 1).volume_packed) {
                swap_container = solution.containerGet(j);
                solution.container[j] = solution.containerGet(j - 1);
                solution.container[j - 1] = swap_container;
            }
        }
    }

    __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Activate;

    if (solution.feasible === false) {
        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2, 1).Value = "Warning: Last solution returned by the solver does not satisfy all constraints.";
        //Range(Cells(2, 1), Cells(2, 10)).Interior.ColorIndex = 45;
    } else {
        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(2, 1).Value = 0;
        //Range(Cells(2, 1), Cells(2, 10)).Interior.Pattern = xlNone;
        //Range(Cells(2, 1), Cells(2, 10)).Interior.TintAndShade = 0;
        //Range(Cells(2, 1), Cells(2, 10)).Interior.PatternTintAndShade = 0;
    }

    var offset = 0;

    offset = 0;
    container_index = 1;

    //With solution

    for (i = 1; i <= container_list.num_container_types; i++) {

        for (j = 1; j <= container_list.container_typesGet(i).number_available; j++) {

            Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["d" /* Range */])(Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(6, offset + 2), Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + 2 * item_list.total_number_of_items, offset + 2)).Value = 0;
            Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["d" /* Range */])(Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(6, offset + 3), Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + 2 * item_list.total_number_of_items, offset + 5)).ClearContents;
            Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["d" /* Range */])(Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(6, offset + 6), Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + 2 * item_list.total_number_of_items, offset + 6)).Value = 0;

            if (container_list.container_typesGet(i).mandatory >= 0) {
                Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(3, 'B', solution.containerGet(container_index).item_cnt);
                for (k = 1; k <= solution.containerGet(container_index).item_cnt; k++) {
                    Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 2).Value = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("1.Items").Cells(2 + item_list.item_typesGet(solution.containerGet(container_index).itemsGet(k).item_type).id, 2).Value;
                    Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 3).Value = solution.containerGet(container_index).itemsGet(k).origin_x;
                    Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 4).Value = solution.containerGet(container_index).itemsGet(k).origin_y;
                    Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 5).Value = solution.containerGet(container_index).itemsGet(k).origin_z;
                    if (solution.containerGet(container_index).itemsGet(k).rotation === 1) {
                        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 6).Value = "xyz";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 2) {
                        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 6).Value = "zyx";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 3) {
                        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 6).Value = "xzy";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 4) {
                        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 6).Value = "yzx";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 5) {
                        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 6).Value = "yxz";
                    } else if (solution.containerGet(container_index).itemsGet(k).rotation === 6) {
                        Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["b" /* Cells */])(5 + k, offset + 6).Value = "zxy";
                    }
                }

                container_index = container_index + 1;
            }

            offset = offset + 11;
        }
    }

    signaler.Dispatch(signals.solution, solution);

    //Application.ScreenUpdating = true
    //Application.Calculation = xlCalculationAutomatic
}

/**
 * 
 * @param {Array<SolverOptions>} solverOptions 
 * @param {Array<ItemData>} itemsData 
 * @param {Array<ContainerData>} containersData 
 */
function CLP_Solver(solverOptions, itemsData, containersData) {

    //Application.ScreenUpdating = false
    //Application.Calculation = xlCalculationManual

    var WorksheetExists = false;
    var reply = 0;

    GetSolverOptions(solverOptions);

    WorksheetExists = Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["c" /* CheckWorksheetExistence */])("1.Items") && Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["c" /* CheckWorksheetExistence */])("2.Containers") && Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["c" /* CheckWorksheetExistence */])("3.Solution");
    if ((!solverOptions || !itemsData || !containersData) && WorksheetExists === false) {
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].Alert("Worksheets 1.Items, 2.Containers, and 3.Solution must exist for the CLP Spreadsheet Solver to function.");
        //Application.ScreenUpdating = true
        //Application.Calculation = xlCalculationAutomatic
        return;
    } else {
        reply = __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].Confirm("This will take " + solver_options.CPU_time_limit + " seconds. Do you want to continue?", true); //, vbYesNo, "CLP Spreadsheet Solver")
        if (reply === false) {
            //Application.ScreenUpdating = true
            //Application.Calculation = xlCalculationAutomatic
            return;
        }
    }

    //Application.EnableCancelKey = xlErrorHandler
    //On Error GoTo CLP_Solver_Finish

    // Allocate memory and get the data

    GetItemData(itemsData);
    GetContainerData(containersData);
    //GetInstanceData();
    //GetCompatibilityData();
    SortItems();

    var incumbent = new solution_data();
    InitializeSolution(incumbent);

    var best_known = new solution_data();
    InitializeSolution(best_known);
    best_known = incumbent;

    var iteration = 0;

    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;

    var nonempty_container_cnt = 0;
    var container_id = 0;

    var start_time = 0;
    var end_time = 0;

    var continue_flag = false;
    var sort_criterion = 0;
    var selected_rotation = 0;

    // infeasibility check    

    var fcData = FeasibilityCheckData();
    var infeasibility_count = fcData.infeasibility_count;
    var infeasibility_string = fcData.infeasibility_string;

    if (infeasibility_count > 0) {
        reply = __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].Confirm("Infeasibilities detected. " + infeasibility_string + " Do you want to continue?", true); //, vbYesNo, "CLP Spreadsheet Solver")
        if (reply === false) {
            //Application.ScreenUpdating = true
            //Application.Calculation = xlCalculationAutomatic
            return;
        }
    }

    start_time = performance.now() / 1000.0;
    end_time = start_time;

    // constructive phase

    if (solver_options.show_progress === true) {
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = true;
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = "Constructive phase...";
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = false;
    } else {
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = true;
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = "LNS algorithm running...";
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = false;
    }

    SortContainers(incumbent, 0);

    for (i = 1; i <= incumbent.num_containers; i++) {
        // sort the rotation order for this container
        for (j = 1; j <= item_list.num_item_types; j++) {
            sort_criterion = 0;
            selected_rotation = 0;

            if (sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height)) {
                sort_criterion = Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height);
                selected_rotation = 1;
            }

            if (sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height)) {
                sort_criterion = Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height);
                selected_rotation = 2;
            }

            if (item_list.item_typesGet(j).xy_rotatable === true && sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length)) {
                sort_criterion = Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length);
                selected_rotation = 3;
            }

            if (item_list.item_typesGet(j).xy_rotatable === true && sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length)) {
                sort_criterion = sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length);
                selected_rotation = 4;
            }

            if (item_list.item_typesGet(j).yz_rotatable === true && sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width)) {
                sort_criterion = Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).height) * item_list.item_typesGet(j).height * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width);
                selected_rotation = 5;
            }

            if (item_list.item_typesGet(j).yz_rotatable === true && sort_criterion < Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width)) {
                sort_criterion = Math.floor(incumbent.containerGet(i).width / item_list.item_typesGet(j).length) * item_list.item_typesGet(j).length * (Math.floor(incumbent.containerGet(i).height / item_list.item_typesGet(j).width) * item_list.item_typesGet(j).width);
                selected_rotation = 6;
            }

            if (selected_rotation === 0) {
                selected_rotation = 1;
            }

            incumbent.rotation_order[j][1] = selected_rotation;
            incumbent.rotation_order[j][selected_rotation] = 1;
        }

        for (j = 1; j <= item_list.num_item_types; j++) {

            continue_flag = true;
            while (incumbent.unpacked_item_countGet(incumbent.item_type_orderGet(j)) > 0 && continue_flag) {
                continue_flag = AddItemToContainer(incumbent, i, incumbent.item_type_orderGet(j), 1, false);
            }
        }

        incumbent.feasible = true;
        for (j = 1; j <= item_list.num_item_types; j++) {
            if (incumbent.unpacked_item_countGet(j) > 0 && item_list.item_typesGet(j).mandatory === 1) {
                incumbent.feasible = false;
                break;
            }
        }

        CalculateDispersion(incumbent);

        if (incumbent.feasible === true && best_known.feasible === false || incumbent.feasible === false && best_known.feasible === false && incumbent.total_volume > best_known.total_volume + epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit + epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume - epsilon) {

            best_known = incumbent;
        }
    }

    // GoTo CLP_Solver_Finish

    // end_time = Timer
    // MsgBox "Constructive phase result: " + best_known.net_profit + " time: " + end_time - start_time

    // improvement phase

    iteration = 0;

    //Do
    do {
        //DoEvents
        if (solver_options.show_progress === true && iteration % 100 === 0) {
            //Application.ScreenUpdating = true
            if (best_known.feasible === true) {
                __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = "Starting iteration " + iteration + ". Best net profit found so far: " + best_known.net_profit + " Dispersion: " + best_known.total_distance;
            } else {
                __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = "Starting iteration " + iteration + ". Best net profit found so far: N/A" + " Dispersion: " + best_known.total_distance;
            }
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = false;
        }

        if (Math.random() < 0.5) {
            // < ((end_time - start_time) / solver_options.CPU_time_limit) ^ 2 ){

            incumbent = best_known;
        }

        //With incumbent
        for (i = 1; i <= incumbent.num_containers; i++) {
            PerturbSolution(incumbent, i, 1 - (end_time - start_time) / solver_options.CPU_time_limit);
        }

        SortContainers(incumbent, 0.2);

        //With incumbent
        for (i = 1; i <= incumbent.num_containers; i++) {
            for (j = 1; j <= item_list.num_item_types; j++) {
                continue_flag = true;
                while (incumbent.unpacked_item_countGet(incumbent.item_type_orderGet(j)) > 0 && continue_flag === true) {
                    continue_flag = AddItemToContainer(incumbent, i, incumbent.item_type_orderGet(j), 1, false);
                    //DoEvents
                }
            }

            incumbent.feasible = true;
            for (j = 1; j <= item_list.num_item_types; j++) {
                if (incumbent.unpacked_item_countGet(j) > 0 && item_list.item_typesGet(j).mandatory === 1) {
                    incumbent.feasible = false;
                    break;
                }
            }

            CalculateDispersion(incumbent);

            if (incumbent.feasible === true && best_known.feasible === false || incumbent.feasible === false && best_known.feasible === false && incumbent.total_volume > best_known.total_volume + epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit + epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume - epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume + epsilon && incumbent.total_distance < best_known.total_distance - epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume + epsilon && incumbent.total_distance < best_known.total_distance + epsilon && incumbent.total_x_moment < best_known.total_x_moment - epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume + epsilon && incumbent.total_distance < best_known.total_distance + epsilon && incumbent.total_x_moment < best_known.total_x_moment + epsilon && incumbent.total_yz_moment < best_known.total_yz_moment - epsilon) {

                best_known = incumbent;
            }
        }

        iteration = iteration + 1;

        end_time = performance.now() / 1000.0;

        /* WILL NEVER HAPPEN ? chadik
        if( end_time < start_time - 0.01 ){
            solver_options.CPU_time_limit = solver_options.CPU_time_limit - (86400 - start_time)
            start_time = end_time
        }
        */
    } while (end_time - start_time < solver_options.CPU_time_limit / 3);

    // reorganize now

    CalculateDistance(best_known);

    nonempty_container_cnt = 0;
    //With best_known
    for (i = 1; i <= best_known.num_containers; i++) {
        if (best_known.containerGet(i).item_cnt > 0) {
            nonempty_container_cnt = nonempty_container_cnt + 1;
        }
    }

    for (container_id = 1; container_id <= best_known.num_containers; container_id++) {
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = true;
        if (best_known.feasible === true) {
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: " + best_known.net_profit + " Distance: " + best_known.total_distance;
        } else {
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: N/A" + " Distance: " + best_known.total_distance;
        }
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = false;

        if (best_known.containerGet(container_id).item_cnt > 0) {

            incumbent = best_known;

            start_time = performance.now() / 1000.0;
            end_time = start_time;

            //Do
            do {
                //DoEvents

                PerturbSolution(incumbent, container_id, 0.1 + 0.2 * ((end_time - start_time) / (solver_options.CPU_time_limit * 0.666 / nonempty_container_cnt)));

                //With incumbent

                for (j = 1; j <= item_list.num_item_types; j++) {
                    continue_flag = true;
                    while (incumbent.unpacked_item_countGet(incumbent.item_type_orderGet(j)) > 0 && continue_flag === true) {
                        continue_flag = AddItemToContainer(incumbent, container_id, incumbent.item_type_orderGet(j), 1, true);
                        //DoEvents
                    }
                }

                incumbent.feasible = true;
                for (j = 1; j <= item_list.num_item_types; j++) {
                    if (incumbent.unpacked_item_countGet(j) > 0 && item_list.item_typesGet(j).mandatory === 1) {
                        incumbent.feasible = false;
                        break;
                    }
                }

                CalculateDistance(incumbent);

                if (incumbent.feasible === true && best_known.feasible === false || incumbent.feasible === false && best_known.feasible === false && incumbent.total_volume > best_known.total_volume + epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit + epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume - epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume + epsilon && incumbent.total_distance < best_known.total_distance - epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume + epsilon && incumbent.total_distance < best_known.total_distance + epsilon && incumbent.total_x_moment < best_known.total_x_moment - epsilon || incumbent.feasible === true && best_known.feasible === true && incumbent.net_profit > best_known.net_profit - epsilon && incumbent.total_volume < best_known.total_volume + epsilon && incumbent.total_distance < best_known.total_distance + epsilon && incumbent.total_x_moment < best_known.total_x_moment + epsilon && incumbent.total_yz_moment < best_known.total_yz_moment - epsilon) {

                    best_known = incumbent;

                    // if( best_known.feasible = true ){
                    //     Application.StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: " + best_known.net_profit + " Distance: " + best_known.total_distance
                    // } else {
                    //     Application.StatusBar = "Reorganizing container " + container_id + ". Best net profit found so far: N/A" + " Distance: " + best_known.total_distance
                    // }
                }

                end_time = performance.now() / 1000.0;

                /* WILL NEVER HAPPEN? chadiik
                if( end_time < start_time - 0.01 ){
                    solver_options.CPU_time_limit = solver_options.CPU_time_limit - (86400 - start_time)
                    start_time = end_time
                }
                */
            } while (end_time - start_time < solver_options.CPU_time_limit * 0.666 / nonempty_container_cnt);
        }
    }

    // MsgBox "Iterations performed: " + iteration

    //CLP_Solver_Finish:

    // ensure loadability

    var min_x = 0;
    var min_y = 0;
    var min_z = 0;

    var intersection_right = 0;
    var intersection_left = 0;
    var intersection_top = 0;
    var intersection_bottom = 0;

    var selected_item_index = 0;

    /** @type {item_in_container} */
    var swap_item;

    var area_supported = 0;
    var area_required = 0;
    var support_flag = false;

    for (i = 1; i <= best_known.num_containers; i++) {
        //With best_known.containerGet(i)
        var container = best_known.containerGet(i);

        for (j = 1; j <= container.item_cnt; j++) {

            selected_item_index = 0;
            min_x = container.width;
            min_y = container.height;
            min_z = container.length;

            for (k = j; k <= container.item_cnt; k++) {

                if (container.itemsGet(k).origin_z < min_z - epsilon || container.itemsGet(k).origin_z < min_z + epsilon && container.itemsGet(k).origin_y < min_y - epsilon || container.itemsGet(k).origin_z < min_z + epsilon && container.itemsGet(k).origin_y < min_y + epsilon && container.itemsGet(k).origin_x < min_x - epsilon) {

                    // check for support

                    if (container.itemsGet(k).origin_y < epsilon) {
                        support_flag = true;
                    } else {
                        area_supported = 0;
                        area_required = (container.itemsGet(k).opposite_x - container.itemsGet(k).origin_x) * (container.itemsGet(k).opposite_z - container.itemsGet(k).origin_z);
                        support_flag = false;
                        for (l = j - 1; l >= 1; l--) {

                            if (Math.abs(container.itemsGet(k).origin_y - container.itemsGet(l).opposite_y) < epsilon) {

                                // check for intersection

                                intersection_right = container.itemsGet(k).opposite_x;
                                if (intersection_right > container.itemsGet(l).opposite_x) intersection_right = container.itemsGet(l).opposite_x;

                                intersection_left = container.itemsGet(k).origin_x;
                                if (intersection_left < container.itemsGet(l).origin_x) intersection_left = container.itemsGet(l).origin_x;

                                intersection_top = container.itemsGet(k).opposite_z;
                                if (intersection_top > container.itemsGet(l).opposite_z) intersection_top = container.itemsGet(l).opposite_z;

                                intersection_bottom = container.itemsGet(k).origin_z;
                                if (intersection_bottom < container.itemsGet(l).origin_z) intersection_bottom = container.itemsGet(l).origin_z;

                                if (intersection_right > intersection_left && intersection_top > intersection_bottom) {
                                    area_supported = area_supported + (intersection_right - intersection_left) * (intersection_top - intersection_bottom);
                                    if (area_supported > area_required - epsilon) {
                                        support_flag = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (support_flag === true) {
                        selected_item_index = k;

                        min_x = container.itemsGet(k).origin_x;
                        min_y = container.itemsGet(k).origin_y;
                        min_z = container.itemsGet(k).origin_z;
                    }
                }
            }

            if (selected_item_index > 0) {
                swap_item = container.itemsGet(selected_item_index);
                container.items[selected_item_index] = container.itemsGet(j);
                container.items[j] = swap_item;
            } else {
                __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].Alert("Loading order could not be constructed.");
            }
        }
    }

    // write the solution

    // MsgBox best_known.total_distance

    if (best_known.feasible === true) {
        reply = __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].Confirm("CLP Spreadsheet Solver performed " + iteration + " LNS iterations and found a solution with a net profit of " + best_known.net_profit + ". Do you want to overwrite the current solution with the best found solution?", true); //, vbYesNo, "CLP Spreadsheet Solver")
        if (reply) {
            WriteSolution(best_known);
        }
    } else if (infeasibility_count > 0) {
        WriteSolution(best_known);
    } else {
        reply = __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].Confirm("The best found solution after " + iteration + " LNS iterations does not satisfy all constraints. Do you want to overwrite the current solution with the best found solution?", true); //, vbYesNo, "CLP Spreadsheet Solver")
        if (reply) {
            WriteSolution(best_known);
        }
    }

    // Erase the data
    /*
    delete item_list.item_types;
    delete container_list.container_types;
    delete compatibility_list.item_to_item;
    delete compatibility_list.container_to_item;
      for( i = 1; i <= incumbent.num_containers; i++){
        delete incumbent.containerGet(i).items;
    }
    delete incumbent.container;
    delete incumbent.unpacked_item_count;
    
    if(best_known.container){
        for( i = 1; i <= best_known.container.length; i++){
            if(best_known.container[i])
                delete best_known.containerGet(i).items;
        }
        delete best_known.container;
    }
    delete best_known.unpacked_item_count;
    */
    __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].StatusBar = false;
    __WEBPACK_IMPORTED_MODULE_0__Workbook__["a" /* Application */].ScreenUpdating = true;
    //Application.Calculation = xlCalculationAutomatic

    //ThisWorkbook.Worksheets("3.Solution").Activate;
    //Cells(1, 1).Select;
}

function FeasibilityCheckData() {

    var i = 0;
    var j = 0;
    var feasibility_flag = false;

    var infeasibility_count = 0;
    var infeasibility_string = '';

    Object(__WEBPACK_IMPORTED_MODULE_0__Workbook__["d" /* Range */])(__WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 9, 1), __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + 4 * item_list.total_number_of_items, 1)).Clear;

    var volume_capacity_required = 0;
    var volume_capacity_available = 0;

    var weight_capacity_required = 0;
    var weight_capacity_available = 0;

    var max_width = 0;
    var max_heigth = 0;
    var max_length = 0;

    //With item_list
    for (i = 1; i <= item_list.num_item_types; i++) {
        if (item_list.item_typesGet(i).mandatory === 1) {
            volume_capacity_required = volume_capacity_required + item_list.item_typesGet(i).volume * item_list.item_typesGet(i).number_requested;
            weight_capacity_required = weight_capacity_required + item_list.item_typesGet(i).weight * item_list.item_typesGet(i).number_requested;
        }
    }

    //With container_list
    for (i = 1; i <= container_list.num_container_types; i++) {
        if (container_list.container_typesGet(i).mandatory >= 0) {
            volume_capacity_available = volume_capacity_available + container_list.container_typesGet(i).volume_capacity * container_list.container_typesGet(i).number_available;
            weight_capacity_available = weight_capacity_available + container_list.container_typesGet(i).weight_capacity * container_list.container_typesGet(i).number_available;

            if (container_list.container_typesGet(i).width > max_width) max_width = container_list.container_typesGet(i).width;
            if (container_list.container_typesGet(i).height > max_heigth) max_heigth = container_list.container_typesGet(i).height;
            if (container_list.container_typesGet(i).length > max_length) max_length = container_list.container_typesGet(i).length;
        }
    }

    if (volume_capacity_required > volume_capacity_available + epsilon) {
        infeasibility_count = infeasibility_count + 1;
        infeasibility_string = infeasibility_string + "The amount of available volume is not enough to pack the mandatory items.\n";
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available volume is not enough to pack the mandatory items.";
    }

    if (weight_capacity_required > weight_capacity_available + epsilon) {
        infeasibility_count = infeasibility_count + 1;
        infeasibility_string = infeasibility_string + "The amount of available weight capacity is not enough to pack the mandatory items.\n";
        __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "The amount of available weight capacity is not enough to pack the mandatory items.";
    }

    //With item_list
    for (i = 1; i <= item_list.num_item_types; i++) {
        //With .item_typesGet(i)
        var itemType = item_list.item_typesGet(i);
        if (itemType.mandatory === 1 && itemType.xy_rotatable === false && itemType.yz_rotatable === false && (itemType.width > max_width + epsilon || itemType.height > max_heigth + epsilon || itemType.length > max_length + epsilon)) {
            infeasibility_count = infeasibility_count + 1;
            if (infeasibility_count < 5) {
                infeasibility_string = infeasibility_string + "Item type " + i + " is too large to fit into any container." + "\n";
            }
            if (infeasibility_count === 5) {
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too large to fit into any container.";
        }

        if (itemType.mandatory === 1 && itemType.width > max_width + epsilon && itemType.width > max_heigth + epsilon && itemType.width > max_length + epsilon) {
            infeasibility_count = infeasibility_count + 1;
            if (infeasibility_count < 5) {
                infeasibility_string = infeasibility_string + "Item type " + i + " is too wide to fit into any container." + "\n";
            }
            if (infeasibility_count === 5) {
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too wide to fit into any container.";
        }

        if (itemType.mandatory === 1 && itemType.height > max_width + epsilon && itemType.height > max_heigth + epsilon && itemType.height > max_length + epsilon) {
            infeasibility_count = infeasibility_count + 1;
            if (infeasibility_count < 5) {
                infeasibility_string = infeasibility_string + "Item type " + i + " is too tall to fit into any container." + "\n";
            }
            if (infeasibility_count === 5) {
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too tall to fit into any container.";
        }

        if (itemType.mandatory === 1 && itemType.length > max_width + epsilon && itemType.length > max_heigth + epsilon && itemType.length > max_length + epsilon) {
            infeasibility_count = infeasibility_count + 1;
            if (infeasibility_count < 5) {
                infeasibility_string = infeasibility_string + "Item type " + i + " is too long to fit into any container." + "\n";
            }
            if (infeasibility_count === 5) {
                infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
            }
            __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is too long to fit into any container.";
        }
    }

    if (instance.container_item_compatibility_worksheet === true) {

        for (i = 1; i <= item_list.num_item_types; i++) {

            feasibility_flag = false;

            for (j = 1; j <= container_list.num_container_types; j++) {
                if (compatibility_list.container_to_itemGet(j, i) === true) {
                    feasibility_flag = true;
                    break;
                }
            }

            if (feasibility_flag === false) {

                infeasibility_count = infeasibility_count + 1;
                if (infeasibility_count < 5) {
                    infeasibility_string = infeasibility_string + "Item type " + i + " is not compatible with any container." + "\n";
                }
                if (infeasibility_count === 5) {
                    infeasibility_string = infeasibility_string + "More can be found in the list of detected infeasibilities in the solution worksheet." + "\n";
                }
                __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets("3.Solution").Cells(item_list.total_number_of_items + 8 + infeasibility_count, 1).Value = "Item type " + i + " is not compatible with any container.";
            }
        }
    }

    return {
        infeasibility_count: infeasibility_count,
        infeasibility_string: infeasibility_string
    };
}

function SortItems() {

    var i = 0;
    var j = 0;

    /** @type {item_type_data} */
    var swap_item_type;

    if (item_list.num_item_types > 1) {
        for (i = 1; i <= item_list.num_item_types; i++) {
            for (j = item_list.num_item_types; j >= 2; j--) {
                if (item_list.item_typesGet(j).mandatory > item_list.item_typesGet(j - 1).mandatory || item_list.item_typesGet(j).mandatory === 1 && item_list.item_typesGet(j - 1).mandatory === 1 && item_list.item_typesGet(j).sort_criterion > item_list.item_typesGet(j - 1).sort_criterion || item_list.item_typesGet(j).mandatory === 0 && item_list.item_typesGet(j - 1).mandatory === 0 && item_list.item_typesGet(j).profit / item_list.item_typesGet(j).volume > item_list.item_typesGet(j - 1).profit / item_list.item_typesGet(j - 1).volume) {

                    swap_item_type = item_list.item_typesGet(j);
                    item_list.item_types[j] = item_list.item_typesGet(j - 1);
                    item_list.item_types[j - 1] = swap_item_type;
                }
            }
        }
    }

    // for( i = 1; <=item_list.num_item_types
    //    MsgBox item_list.item_typesGet(i).id + " " + item_list.item_typesGet(i).weight + " " + item_list.item_typesGet(i).sort_criterion
    // }
}

/**
 * @param {solution_data} solution 
 */
function CalculateDistance(solution) {

    var j = 0;
    var k = 0;
    var l = 0;
    var max_z = 0;

    //With solution

    solution.total_distance = 0;
    solution.total_x_moment = 0;
    solution.total_yz_moment = 0;

    for (j = 1; j <= solution.num_containers; j++) {

        //With .containerGet(j)
        var container = solution.containerGet(j);
        max_z = 0;
        for (k = 1; k <= container.item_cnt; k++) {
            for (l = k + 1; l <= container.item_cnt; l++) {
                if (container.itemsGet(k).item_type === container.itemsGet(l).item_type) {
                    solution.total_distance = solution.total_distance + Math.abs(container.itemsGet(k).opposite_x + container.itemsGet(k).origin_x - container.itemsGet(l).opposite_x - container.itemsGet(l).origin_x) + Math.abs(container.itemsGet(k).opposite_y + container.itemsGet(k).origin_y - container.itemsGet(l).opposite_y - container.itemsGet(l).origin_y) + Math.abs(container.itemsGet(k).opposite_z + container.itemsGet(k).origin_z - container.itemsGet(l).opposite_z - container.itemsGet(l).origin_z);
                }

                // solution.total_distance = solution.total_distance + container.itemsGet(k).opposite_z
            }

            if (max_z < container.itemsGet(k).opposite_z) max_z = container.itemsGet(k).opposite_z;

            // solution.total_distance = solution.total_distance + penalty * max_z
            solution.total_distance = solution.total_distance + container.itemsGet(k).opposite_z;

            // solution.total_x_moment = solution.total_x_moment + (container.itemsGet(k).origin_y + container.itemsGet(k).opposite_y) * item_list.item_typesGet(container.itemsGet(k).item_type).weight
        }

        solution.total_distance = solution.total_distance + container.item_cnt * container.item_cnt * max_z;
    }
}

/**
 * @param {solution_data} solution 
 */
function CalculateDispersion(solution) {

    var i = 0;
    var j = 0;
    var k = 0;
    var item_flag = false;
    var container_count = 0;

    // With solution

    solution.total_distance = 0;

    for (i = 1; i <= item_list.num_item_types; i++) {
        container_count = 0;
        for (j = 1; j <= solution.num_containers; j++) {

            // With .containerGet(j)
            var container = solution.containerGet(j);
            item_flag = false;
            for (k = 1; k <= container.item_cnt; k++) {
                if (container.itemsGet(k).item_type === i) {
                    item_flag = true;
                    break;
                }
            }

            if (item_flag === true) container_count = container_count + 1;
        }

        solution.total_distance = solution.total_distance + container_count * container_count;
    }
}

var signaler = new __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__["default"]();
var signals = {
    solution: 'solution'
};



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ThisWorkbook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Cells; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CheckWorksheetExistence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Application; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Signaler__ = __webpack_require__(2);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var typeofString = 'string';
var colLabels = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

var signals = {
    updated: 'u'
};

var CellEntry /*extends Signaler*/ = function () {
    function CellEntry(value) {
        _classCallCheck(this, CellEntry);

        this.Value = value;
        this.col = 0;
        this.row = 0;

        /** @type {Function} */
        this.calculate = undefined;
    }

    _createClass(CellEntry, [{
        key: 'toString',
        value: function toString() {
            return this.Value.toString();
        }
    }, {
        key: 'Value',
        get: function get() {
            if (this.calculate) this._value = this.calculate();
            return this._value;
        },
        set: function set(value) {
            this._value = value;
            //this.Dispatch(signals.updated, this);
        }
    }, {
        key: 'Select',
        get: function get() {
            console.log('Select: ', this.Value);
        }
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return CellEntry;
}();

/**
 * 
 * @param {Number} row 
 * @param {Number} col 
 * @param {*} [value]
 */


function Cells(row, col, value) {
    return new CellEntry('default');
}

/** @type {Worksheet} */
var active;

var Worksheet = function () {
    /** @param {string} label */
    function Worksheet(label) {
        _classCallCheck(this, Worksheet);

        this.label = label.toLowerCase();
        /** @type {Map<Number, Map<Number, CellEntry>>} */
        this.data = new Map();

        this.cellsFN = this.Cells.bind(this);
    }

    /**
     * 
     * @param {CellEntry} cell1 
     * @param {CellEntry} cell2 
     */


    _createClass(Worksheet, [{
        key: 'Sum',
        value: function Sum(cell1, cell2) {
            var cells = Range(cell1, cell2).cells;
            var total = 0;
            cells.forEach(function (cell) {
                var value = Number.parseFloat(cell.Value);
                if (!isNaN(value)) total += value;
            });
            return total;
        }
    }, {
        key: 'Cells',
        value: function Cells(row, col, value) {
            if ((typeof col === 'undefined' ? 'undefined' : _typeof(col)) === typeofString) col = colLabels.indexOf(col);

            if (!this.data.has(row) || !this.data.get(row).has(col)) {
                if (!this.data.has(row)) this.data.set(row, new Map());

                var newEntry = new CellEntry(0);
                newEntry.row = row;
                newEntry.col = col;
                this.data.get(row).set(col, newEntry);
            }

            if (value) this.data.get(row).get(col).Value = value;

            return this.data.get(row).get(col);
        }
    }, {
        key: 'Find',
        value: function Find(value) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.data.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var row = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = row.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var cell = _step2.value;

                            if (cell.Value === value) {
                                return cell;
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'Print',
        value: function Print() {
            console.group(this.label);
            var rows = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _ref = _step3.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var row = _ref2[0];
                    var rowData = _ref2[1];

                    var rowResult = [row + ':'];
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = rowData[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _ref3 = _step4.value;

                            var _ref4 = _slicedToArray(_ref3, 2);

                            var col = _ref4[0];
                            var colData = _ref4[1];

                            rowResult.push(colData.Value);
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    rows[row] = rowResult;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            rows.forEach(function (row) {
                var _console;

                (_console = console).log.apply(_console, _toConsumableArray(row));
            });
            console.groupEnd();
        }
    }, {
        key: 'Activate',
        get: function get() {
            active = this;
            Cells = this.cellsFN;
        }
    }]);

    return Worksheet;
}();

var Workbook = function () {
    function Workbook() {
        _classCallCheck(this, Workbook);

        /** @type {Map<string, Worksheet>} */
        this.worksheets = new Map();
    }

    /** @param {Worksheet} worksheet */


    _createClass(Workbook, [{
        key: 'Add',
        value: function Add(worksheet) {
            this.worksheets.set(worksheet.label.toLowerCase(), worksheet);
        }

        /** @param {string} label */

    }, {
        key: 'Worksheets',
        value: function Worksheets(label) {
            return this.worksheets.get(label.toLowerCase());
        }
    }, {
        key: 'Print',
        value: function Print() {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.worksheets.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var worksheet = _step5.value;

                    worksheet.Print();
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }
        }
    }, {
        key: 'print',
        get: function get() {
            this.Print();
        }
    }]);

    return Workbook;
}();

var solverSheet = new Worksheet('CLP Solver Console');
var itemsSheet = new Worksheet('1.Items');
var containersSheet = new Worksheet('2.Containers');
var solutionSheet = new Worksheet('3.Solution');

var ThisWorkbook = new Workbook();
ThisWorkbook.Add(solverSheet);
ThisWorkbook.Add(itemsSheet);
ThisWorkbook.Add(containersSheet);
ThisWorkbook.Add(solutionSheet);

/**
 * @param {string} label 
 * @returns {Boolean}
 */
function CheckWorksheetExistence(label) {
    return ThisWorkbook.Worksheets(label) !== undefined;
}

var CellsRange = function () {
    function CellsRange() {
        _classCallCheck(this, CellsRange);

        /** @type {Array<CellEntry>} */
        this.cells = [];
    }

    _createClass(CellsRange, [{
        key: 'Value',
        set: function set(value) {
            this.cells.forEach(function (cell) {
                cell.Value = value;
            });
        }
    }, {
        key: 'Clear',
        get: function get() {
            this.cells.forEach(function (cell) {
                cell.Value = null;
            });
        }
    }, {
        key: 'ClearContents',
        get: function get() {
            this.Clear;
        }
    }]);

    return CellsRange;
}();

var _range = new CellsRange();

/**
 * @param {CellEntry} cell1 
 * @param {CellEntry} cell2 
 */
function Range(cell1, cell2) {
    var minCol = Math.min(cell1.col, cell2.col);
    var maxCol = Math.max(cell1.col, cell2.col);
    var minRow = Math.min(cell1.row, cell2.row);
    var maxRow = Math.max(cell1.row, cell2.row);

    _range.cells.length = 0;
    for (var c = minCol; c < maxCol; c++) {
        for (var r = minRow; r < maxRow; r++) {
            _range.cells.push(Cells(r, c));
        }
    }

    return _range;
}

var Application = function () {
    function Application() {
        _classCallCheck(this, Application);
    }

    _createClass(Application, null, [{
        key: 'Alert',
        value: function Alert(msg) {
            console.log('CLP alert:', msg);
        }
    }, {
        key: 'Confirm',
        value: function Confirm(msg, defaultValue) {
            console.log('CLP confirm (' + defaultValue + '):', msg);
            return defaultValue;
        }
    }, {
        key: 'StatusBar',
        set: function set(value) {
            console.log(value);
        }
    }, {
        key: 'ScreenUpdating',
        set: function set(value) {}
    }]);

    return Application;
}();



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bin = function () {
  function Bin(name, w, h, d, mw) {
    _classCallCheck(this, Bin);

    this.name = name || '';
    this.width = w || 0;
    this.height = h || 0;
    this.depth = d || 0;
    this.maxWeight = mw || 0;
    this.items = [];
  }

  _createClass(Bin, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.height;
    }
  }, {
    key: 'getDepth',
    value: function getDepth() {
      return this.depth;
    }
  }, {
    key: 'getMaxWeight',
    value: function getMaxWeight() {
      return this.maxWeight;
    }
  }, {
    key: 'getItems',
    value: function getItems() {
      return this.items;
    }
  }, {
    key: 'getVolume',
    value: function getVolume() {
      return this.getWidth() * this.getHeight() * this.getDepth();
    }
  }, {
    key: 'getPackedWeight',
    value: function getPackedWeight() {
      return this.items.reduce(function (weight, item) {
        return weight + item.getWeight();
      }, 0);
    }
  }, {
    key: 'weighItem',
    value: function weighItem(item) {
      var maxWeight = this.getMaxWeight();
      return !maxWeight || item.getWeight() + this.getPackedWeight() <= maxWeight;
    }
  }, {
    key: 'putItem',
    value: function putItem(item, p) {
      var box = this;
      var fit = false;

      item.position = p;
      for (var i = 0; i < 6; i++) {
        item.rotationType = i;
        var d = item.getDimension();

        if (box.getWidth() < p[0] + d[0] || box.getHeight() < p[1] + d[1] || box.getDepth() < p[2] + d[2]) {
          continue;
        }

        fit = true;

        for (var j = 0; j < box.items.length; j++) {
          var _j = box.items[j];
          if (_j.intersect(item)) {
            fit = false;
            break;
          }
        }

        if (fit) {
          box.items.push(item);
        }

        return fit;
      }

      return fit;
    }
  }]);

  return Bin;
}();

/* harmony default export */ __webpack_exports__["default"] = (Bin);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationType_WHD", function() { return RotationType_WHD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationType_HWD", function() { return RotationType_HWD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationType_HDW", function() { return RotationType_HDW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationType_DHW", function() { return RotationType_DHW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationType_DWH", function() { return RotationType_DWH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationType_WDH", function() { return RotationType_WDH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WidthAxis", function() { return WidthAxis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeightAxis", function() { return HeightAxis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DepthAxis", function() { return DepthAxis; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StartPosition", function() { return StartPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RotationTypeStrings", function() { return RotationTypeStrings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rectIntersect", function() { return rectIntersect; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RotationTypeStrings;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RotationType_WHD = 0;
var RotationType_HWD = 1;
var RotationType_HDW = 2;
var RotationType_DHW = 3;
var RotationType_DWH = 4;
var RotationType_WDH = 5;

var WidthAxis = 0;
var HeightAxis = 1;
var DepthAxis = 2;

var StartPosition = [0, 0, 0];

var RotationTypeStrings = (_RotationTypeStrings = {}, _defineProperty(_RotationTypeStrings, RotationType_WHD, 'xyz'), _defineProperty(_RotationTypeStrings, RotationType_HWD, 'yxz'), _defineProperty(_RotationTypeStrings, RotationType_HDW, 'yzx'), _defineProperty(_RotationTypeStrings, RotationType_DHW, 'zyx'), _defineProperty(_RotationTypeStrings, RotationType_DWH, 'zxy'), _defineProperty(_RotationTypeStrings, RotationType_WDH, 'xzy'), _RotationTypeStrings);

var Item = function () {
  function Item(name, w, h, d, wg) {
    _classCallCheck(this, Item);

    this.name = name || '';
    this.width = w || 0;
    this.height = h || 0;
    this.depth = d || 0;
    this.weight = wg || 0;
    this.rotationType = RotationType_WHD;
    this.position = []; // x, y, z
  }

  _createClass(Item, [{
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.height;
    }
  }, {
    key: 'getDepth',
    value: function getDepth() {
      return this.depth;
    }
  }, {
    key: 'getWeight',
    value: function getWeight() {
      return this.weight;
    }
  }, {
    key: 'getRotationType',
    value: function getRotationType() {
      return this.rotationType;
    }
  }, {
    key: 'getRotationTypeString',
    value: function getRotationTypeString() {
      return RotationTypeStrings[this.getRotationType()];
    }
  }, {
    key: 'getDimension',
    value: function getDimension() {
      var d = void 0;
      switch (this.rotationType) {
        case RotationType_WHD:
          d = [this.getWidth(), this.getHeight(), this.getDepth()];
          break;
        case RotationType_HWD:
          d = [this.getHeight(), this.getWidth(), this.getDepth()];
          break;
        case RotationType_HDW:
          d = [this.getHeight(), this.getDepth(), this.getWidth()];
          break;
        case RotationType_DHW:
          d = [this.getDepth(), this.getHeight(), this.getWidth()];
          break;
        case RotationType_DWH:
          d = [this.getDepth(), this.getWidth(), this.getHeight()];
          break;
        case RotationType_WDH:
          d = [this.getWidth(), this.getDepth(), this.getHeight()];
          break;
      }
      return d;
    }
  }, {
    key: 'intersect',
    value: function intersect(i2) {
      return rectIntersect(this, i2, WidthAxis, HeightAxis) && rectIntersect(this, i2, HeightAxis, DepthAxis) && rectIntersect(this, i2, WidthAxis, DepthAxis);
    }
  }, {
    key: 'getVolume',
    value: function getVolume() {
      return this.getWidth() * this.getHeight() * this.getDepth();
    }
  }]);

  return Item;
}();

/* harmony default export */ __webpack_exports__["default"] = (Item);


var rectIntersect = function rectIntersect(i1, i2, x, y) {
  var d1 = void 0,
      d2 = void 0,
      cx1 = void 0,
      cy1 = void 0,
      cx2 = void 0,
      cy2 = void 0,
      ix = void 0,
      iy = void 0;

  d1 = i1.getDimension();
  d2 = i2.getDimension();

  cx1 = i1.position[x] + d1[x] / 2;
  cy1 = i1.position[y] + d1[y] / 2;
  cx2 = i2.position[x] + d2[x] / 2;
  cy2 = i2.position[y] + d2[y] / 2;

  ix = Math.max(cx1, cx2) - Math.min(cx1, cx2);
  iy = Math.max(cy1, cy2) - Math.min(cy1, cy2);

  return ix < (d1[x] + d2[x]) / 2 && iy < (d1[y] + d2[y]) / 2;
};

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CargoBoxView__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CargoView__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_cik_Signaler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__packer_CargoGroup__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_common_CargoEntry__ = __webpack_require__(5);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









/**
 * @typedef {Object} CargoListViewParams
 * @property {import('../UX').default} ux
 */

/**
 * @typedef SortResult
 * @property {Number} min
 * @property {Number} max
 * @property {Number} cargoes
 */

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

var signals = {
    sort: 'sort'
};

/** @type {CargoListViewParams} */
var defaultParams = {};

var CargoListView = function (_Signaler) {
    _inherits(CargoListView, _Signaler);

    /**
     * @param {CargoListViewParams} params 
     */
    function CargoListView(params) {
        _classCallCheck(this, CargoListView);

        var _this = _possibleConstructorReturn(this, (CargoListView.__proto__ || Object.getPrototypeOf(CargoListView)).call(this));

        _this.params = __WEBPACK_IMPORTED_MODULE_5__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);

        _this.view;
        _this.templatesView = new THREE.Object3D();

        /**
         * @type {Map<CargoGroup, CargoView>}
         */
        _this.cargoTemplateViews = new Map();
        return _this;
    }

    /**
     * 
     * @param {CargoGroup} group 
     */


    _createClass(CargoListView, [{
        key: "Add",
        value: function Add(group) {
            //Logger.Log('Adding cargo group #' + this.cargoTemplateViews.size + ': ' + group.ToString() + ' to view', group);
            var templateCargoView;
            switch (group.entry.type) {
                case 'BoxEntry':
                    {
                        templateCargoView = new __WEBPACK_IMPORTED_MODULE_1__CargoBoxView__["a" /* default */](group.entry);

                        break;
                    }

                default:
                    templateCargoView = __WEBPACK_IMPORTED_MODULE_2__CargoView__["a" /* default */].Dummy(group.entry);
                    __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Warn('group.entry.type not supported by viewer,', group);
                    break;
            }

            this.cargoTemplateViews.set(group, templateCargoView);
            this.templatesView.add(templateCargoView.view);

            this.Sort();
        }

        /**
         * 
         * @param {CargoGroup} group 
         */

    }, {
        key: "Remove",
        value: function Remove(group) {
            var templateCargoView = this.cargoTemplateViews.get(group);
            if (templateCargoView) {
                this.cargoTemplateViews.delete(group);
                this.templatesView.remove(templateCargoView.view);

                this.Sort();
            }
        }

        /**
         * 
         * @param {CargoGroup|CargoEntry|string|Number} id 
         */

    }, {
        key: "GetTemplate",
        value: function GetTemplate(id) {
            var group;
            if (id instanceof __WEBPACK_IMPORTED_MODULE_4__packer_CargoGroup__["a" /* default */]) {
                group = id;
            } else if (id instanceof __WEBPACK_IMPORTED_MODULE_6__components_common_CargoEntry__["a" /* default */]) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.cargoTemplateViews.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var cargoGroup = _step.value;

                        if (cargoGroup.entry === id) group = cargoGroup;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.cargoTemplateViews.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var cargoGroup = _step2.value;

                        if (cargoGroup.entry.uid === id) group = cargoGroup;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }

            return this.cargoTemplateViews.get(group);
        }

        /**
         * @param {Map<CargoGroup, CargoView>} cargoViews 
         * @returns {Number}
         */

    }, {
        key: "Sort",
        value: function Sort() {

            this.SortMapBySize();

            var units = this.params.ux.params.units;

            this.templatesView.scale.set(1, 1, 1);
            this.templatesView.updateMatrixWorld(true);
            var worldToLocal = new THREE.Matrix4().getInverse(this.templatesView.matrixWorld);
            var padding = 3 * units,
                start = 0;

            var i = 0,
                offset = 0;

            /**
             * @type {SortResult}
             */
            var result = { min: start, max: start, cargoes: 0 };

            var list = this.cargoTemplateViews.values(),
                cargoView;
            while ((cargoView = list.next()).done === false) {

                cargoView.value.position.set(0, start, 0);

                tempBox.setFromObject(cargoView.value.view);
                tempBox.applyMatrix4(worldToLocal);

                tempBox.getSize(tempVec);
                var halfSize = tempVec.y / 2;
                if (i > 0) offset += halfSize;

                cargoView.value.position.set(0, start + offset, 0);

                offset += halfSize + padding;

                i++;
            }

            //result.min = tempVec.set(0, result.min, 0).applyMatrix4(this.view.matrixWorld).y;
            //result.max = tempVec.set(0, offset, 0).applyMatrix4(this.view.matrixWorld).y;
            result.min = start;
            result.max = offset;
            result.cargoes = i;
            this.Dispatch(signals.sort, result);

            //for(var [cargo, cargoView] of cargoViews){}
        }
    }, {
        key: "SortMapBySize",
        value: function SortMapBySize() {
            var _this2 = this;

            /**
             * 
             * @param {[CargoGroup, CargoListView]} a 
             * @param {[CargoGroup, CargoListView]} b 
             */
            function sort(a, b) {
                return -a[0].entry.dimensions.Compare(b[0].entry.dimensions);
            }

            var list = [].concat(_toConsumableArray(this.cargoTemplateViews.entries()));
            list.sort(sort);
            this.cargoTemplateViews = new Map(list);
            return;

            this.cargoTemplateViews.clear();
            list.forEach(function (entry) {
                _this2.cargoTemplateViews.set(entry[0], entry[1]);
            });
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return CargoListView;
}(__WEBPACK_IMPORTED_MODULE_3__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (CargoListView);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoView__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_box_BoxEntry__ = __webpack_require__(10);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var unitCubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
var materialTemplate = new THREE.MeshStandardMaterial();

var brightnessRange = [.45, .55];
var hueBase = Math.random();
function nextColor() {
    var color = new THREE.Color();
    color.setHSL(hueBase, 1, brightnessRange[0] + Math.random() * (brightnessRange[1] - brightnessRange[0]));
    hueBase = __WEBPACK_IMPORTED_MODULE_1__utils_cik_Utils__["default"].GoldenSeries(hueBase);
    return color;
}

var CargoBoxView = function (_CargoView) {
    _inherits(CargoBoxView, _CargoView);

    /**
     * 
     * @param {BoxEntry} boxEntry 
     */
    function CargoBoxView(boxEntry) {
        _classCallCheck(this, CargoBoxView);

        var _this = _possibleConstructorReturn(this, (CargoBoxView.__proto__ || Object.getPrototypeOf(CargoBoxView)).call(this, boxEntry));

        var material = materialTemplate.clone();
        material.color = nextColor();
        _this.mesh = new THREE.Mesh(unitCubeGeometry, material);
        _this.mesh.scale.copy(boxEntry.dimensions.vec3);

        _this.view = new THREE.Object3D();
        _this.view.add(_this.mesh);
        return _this;
    }

    /** @returns {BoxEntry} */


    _createClass(CargoBoxView, [{
        key: "SetScale",


        /**
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} z 
         */
        value: function SetScale(x, y, z) {
            this.mesh.scale.set(x, y, z);
        }

        /**
         * @param {Number} x in radians
         * @param {Number} y in radians
         * @param {Number} z in radians
         */

    }, {
        key: "SetRotationAngles",
        value: function SetRotationAngles(x, y, z) {
            this.mesh.rotation.set(x, y, z);
        }
    }, {
        key: "entry",
        get: function get() {
            return _get(CargoBoxView.prototype.__proto__ || Object.getPrototypeOf(CargoBoxView.prototype), "entry", this);
        },
        set: function set(value) {
            _set(CargoBoxView.prototype.__proto__ || Object.getPrototypeOf(CargoBoxView.prototype), "entry", value, this);
            var s = value.dimensions.vec3;
            this.SetScale(s.x, s.y, s.z);
        }
    }]);

    return CargoBoxView;
}(__WEBPACK_IMPORTED_MODULE_0__CargoView__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (CargoBoxView);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__packer_container_Container__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ContainerView__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__packer_container_ContainingVolume__ = __webpack_require__(8);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






var typeofString = 'string';

var yRotation = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
var tempMatrix4 = new THREE.Matrix4();

var PackingSpaceView = function () {
    function PackingSpaceView() {
        _classCallCheck(this, PackingSpaceView);

        this.view = new THREE.Object3D();

        /**
         * @type {Array<ContainerView>}
         */
        this.containerViews = [];
    }

    /**
     * @param {Container} container 
     */


    _createClass(PackingSpaceView, [{
        key: "Add",
        value: function Add(container) {
            __WEBPACK_IMPORTED_MODULE_2__utils_cik_Logger__["a" /* default */].Log('Adding container: ' + container.ToString() + ' to view', container);
            var containerView = __WEBPACK_IMPORTED_MODULE_1__ContainerView__["a" /* default */].Request(container);
            this.view.add(containerView.view);
            this.containerViews.push(containerView);
        }

        /**
         * 
         * @param {Container} container 
         */

    }, {
        key: "Remove",
        value: function Remove(container) {}

        /**
         * @param {string} containingVolumeUID 
         */

    }, {
        key: "FindContainingVolume",
        value: function FindContainingVolume(containingVolumeUID) {
            for (var iCView = 0; iCView < this.containerViews.length; iCView++) {
                var volumes = this.containerViews[iCView].container.volumes;
                for (var iCVolume = 0; iCVolume < volumes.length; iCVolume++) {
                    if (volumes[iCVolume].uid === containingVolumeUID) {
                        return volumes[iCVolume];
                    }
                }
            }
        }

        /**
         * @param {ContainingVolume} containingVolume 
         */

    }, {
        key: "GetMatrix",
        value: function GetMatrix(containingVolume) {
            if ((typeof containingVolume === "undefined" ? "undefined" : _typeof(containingVolume)) === typeofString) containingVolume = this.FindContainingVolume(containingVolume);
            tempMatrix4.identity();
            tempMatrix4.makeTranslation(containingVolume.position.x - containingVolume.dimensions.width / 2, containingVolume.position.y, containingVolume.position.z - containingVolume.dimensions.length / 2);
            //tempMatrix4.premultiply(yRotation);
            return tempMatrix4;
        }
    }]);

    return PackingSpaceView;
}();

/* harmony default export */ __webpack_exports__["a"] = (PackingSpaceView);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__packer_container_Container__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_assets_Asset__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__packer_container_ContainingVolume__ = __webpack_require__(8);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






/**
 * 
 * @param {Container} container 
 */
function createContainerBoxes(container) {
    /**
     * @type {Map<ContainingVolume, THREE.Mesh>}
     */
    var meshes = new Map();

    container.volumes.forEach(function (cv) {
        var mesh = __WEBPACK_IMPORTED_MODULE_1__components_assets_Asset__["a" /* default */].CreateMesh();

        var extent = cv.dimensions.vec3;
        mesh.scale.copy(extent);
        mesh.position.y += extent.y / 2;

        mesh.material = mesh.material.clone();
        mesh.material.color.setHex(0xffaaaa);
        mesh.material.transparent = true;
        mesh.material.opacity = .2;
        mesh.material.side = THREE.BackSide;
        mesh.material.polygonOffset = true;
        mesh.material.polygonOffsetFactor = 1;
        mesh.material.polygonOffsetUnits = 1;

        meshes.set(cv, mesh);
    });

    return meshes;
}

var views = new WeakMap();

var ContainerView = function () {
    /**
     * 
     * @param {Container} container 
     * @param {THREE.Object3D} view
     */
    function ContainerView(container, view) {
        _classCallCheck(this, ContainerView);

        views.set(container, this);

        this.container = container;
        this.view = new THREE.Object3D();
        this.view.add(view);

        __WEBPACK_IMPORTED_MODULE_1__components_assets_Asset__["a" /* default */].StandardSceneObject(this.view);

        var containerBoxes = createContainerBoxes(container);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = containerBoxes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var cv = _ref2[0];
                var mesh = _ref2[1];

                mesh.position.add(cv.position);
                this.view.add(mesh);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        console.log(this);
    }

    /*
    Set(object3d){
        this.view = object3d;
    }*/

    /**
     * @param {Container} container
     * @returns {ContainerView}
     */


    _createClass(ContainerView, null, [{
        key: "Request",
        value: function Request(container) {
            var view = views.get(container);
            if (!view) {
                var meshes = createContainerBoxes(container);
                var _view = new THREE.Object3D();
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = meshes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _ref3 = _step2.value;

                        var _ref4 = _slicedToArray(_ref3, 2);

                        var cv = _ref4[0];
                        var mesh = _ref4[1];

                        mesh.position.add(cv.position);
                        _view.add(mesh);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                containerView = new ContainerView(container, _view);
                __WEBPACK_IMPORTED_MODULE_2__utils_cik_Logger__["a" /* default */].Warn('View not found for:', container);
            }
            return view;
        }
    }]);

    return ContainerView;
}();

/* harmony default export */ __webpack_exports__["a"] = (ContainerView);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultGeometry = new THREE.CubeGeometry(1, 1, 1);
var defaultMeshMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

var objectLoader = new THREE.ObjectLoader();
var jsonLoader = new THREE.JSONLoader();

var Asset = function () {
    function Asset() {
        _classCallCheck(this, Asset);
    }

    /**
     * 
     * @param {THREE.Geometry|THREE.BufferGeometry} geometry 
     * @param {THREE.Material} [material]
     */


    _createClass(Asset, null, [{
        key: "CreateMesh",
        value: function CreateMesh(geometry, material) {
            geometry = geometry || defaultGeometry;
            material = material || defaultMeshMaterial;

            var mesh = new THREE.Mesh(geometry, material);
            return mesh;
        }

        /**
         * @typedef GeometryJSONReturn
         * @property {THREE.Geometry|THREE.BufferGeometry} geometry
         * @property {Array<THREE.Material>} [materials]
         * 
         * @param {Object} json - Representing Geometry or BufferGeometry json data
         * @param {string} [texturePath] - optional texture url 
         * @returns {GeometryJSONReturn}
         */

    }, {
        key: "FromGeometryJSON",
        value: function FromGeometryJSON(json, texturePath) {
            return jsonLoader.parse(json, texturePath);
        }

        /**
         * @param {Object} json 
         * @param {THREE.Object3D} texturePath 
         */

    }, {
        key: "FromJSON",
        value: function FromJSON(json, texturePath) {
            return objectLoader.parse(json, texturePath);
        }

        /**
         * 
         * @param {THREE.Object3D} object 
         */

    }, {
        key: "StandardSceneObject",
        value: function StandardSceneObject(object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }]);

    return Asset;
}();

/* harmony default export */ __webpack_exports__["a"] = (Asset);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _new = Symbol('new'),
    _reset = Symbol('reset');

/**
 * @template {T}
 */

var Pool = function () {
    /**
     * @param {function(...args)=>T} fnNew 
     * @param {function(T, ...args)=>T} [fnReset]
     */
    function Pool(fnNew, fnReset) {
        _classCallCheck(this, Pool);

        this.objects = [];

        this[_new] = fnNew;
        this[_reset] = fnReset;
    }

    /** Get a clean object (fnNew & fnReset) from the pool
     * @returns {T}
     */


    _createClass(Pool, [{
        key: 'Request',
        value: function Request() {
            var object;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (this.objects.length === 0) {
                object = this[_new].apply(this, args);
            } else {
                object = this.objects[this.objects.length - 1];
                --this.objects.length;
            }

            return this[_reset].apply(this, [object].concat(args));
        }

        /** Make object available again
         * @param {T} object 
         */

    }, {
        key: 'Return',
        value: function Return(object) {
            this.objects[this.objects.length] = object;
        }
    }]);

    return Pool;
}();

/* harmony default export */ __webpack_exports__["a"] = (Pool);

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__box_Dimensions__ = __webpack_require__(9);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var epsilon = Math.pow(2, -52);
var numberType = 'number';

var signals = {
    updated: 'updated',
    aborted: 'aborted',
    completed: 'completed'
};

/**
 * Cubic volumes entry
 */

var CargoInput = function (_Signaler) {
    _inherits(CargoInput, _Signaler);

    function CargoInput() {
        _classCallCheck(this, CargoInput);

        return _possibleConstructorReturn(this, (CargoInput.__proto__ || Object.getPrototypeOf(CargoInput)).call(this));

        /** Do not modify directly, use CargoInput.Update instead
         * @ignore
         */
        //this.entry = new BoxEntry();
    }

    /** Creates a new BoxEntry, required for inputs. (Can be reused) */


    _createClass(CargoInput, [{
        key: 'CreateBoxEntry',
        value: function CreateBoxEntry() {
            return new __WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__["a" /* default */]();
        }

        /** Shows/updates entry 3D display
         * @param {BoxEntry} entry 
         * @returns {Boolean}
         */

    }, {
        key: 'Show',
        value: function Show(entry) {
            if (__WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__["a" /* default */].Assert(entry)) {
                try {
                    this.Dispatch(signals.updated, entry);
                    return true;
                } catch (error) {
                    __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Warn('Error in Cargo.Input.Show, error/entry:', error, entry);
                }

                return false;
            }

            __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Warn('BoxEntry.Assert failed in Cargo.Input.Show, entry:', entry);
            return false;
        }

        /** Hides entry 3D display */

    }, {
        key: 'Hide',
        value: function Hide() {
            this.Dispatch(signals.aborted);
        }

        /** Adds a new entry and obtain its uid
         * @param {BoxEntry} entry
         * @returns {Number|Boolean} uid or false if error
         */

    }, {
        key: 'Add',
        value: function Add(entry) {
            if (__WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__["a" /* default */].Assert(entry)) {

                if (__WEBPACK_IMPORTED_MODULE_3__box_Dimensions__["a" /* default */].IsVolume(entry.dimensions.Abs()) === false) {
                    __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Warn('Cargo.Input.Add, entry rejected, dimensions != Volume:', entry);
                    return false;
                }

                try {
                    var commitedEntry = entry.Clone();
                    var uid = commitedEntry.SetUID();

                    this.Dispatch(signals.completed, commitedEntry);
                    return uid;
                } catch (error) {
                    __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Warn('Error in Cargo.Input.Add, error/entry:', error, entry);
                }

                return false;
            }

            __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Warn('BoxEntry.Assert failed in Cargo.Input.Add, entry:', entry);
            return false;
        }
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return CargoInput;
}(__WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (CargoInput);

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Signaler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__packer_container_Container__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_PackingSpace__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__view_ContainerView__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__assets_Asset__ = __webpack_require__(38);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







/**
 * @typedef PackingSpaceJSON
 * @property {THREE.Geometry} jsonObject.geometry
 * @property {Container} jsonObject.container
 */

var signals = {
    containerLoaded: 'containerLoaded'
};

var PackingSpaceInput = function (_Signaler) {
    _inherits(PackingSpaceInput, _Signaler);

    function PackingSpaceInput() {
        _classCallCheck(this, PackingSpaceInput);

        var _this = _possibleConstructorReturn(this, (PackingSpaceInput.__proto__ || Object.getPrototypeOf(PackingSpaceInput)).call(this));

        _this.packingSpace = new __WEBPACK_IMPORTED_MODULE_2__packer_PackingSpace__["a" /* default */]();
        return _this;
    }

    /**
     * 
     * @param {PackingSpaceJSON} jsonObject 
     */


    _createClass(PackingSpaceInput, [{
        key: "Load",
        value: function Load(jsonObject) {
            var data = typeof jsonObject === 'string' ? JSON.parse(jsonObject) : jsonObject;
            console.log(data);
            if (data.container) {
                var container = __WEBPACK_IMPORTED_MODULE_1__packer_container_Container__["a" /* default */].FromJSON(data.container);

                if (data.view) {
                    var model = __WEBPACK_IMPORTED_MODULE_4__assets_Asset__["a" /* default */].FromJSON(data.view);
                    //var model = Asset.CreateMesh(geometry);
                    var containerView = new __WEBPACK_IMPORTED_MODULE_3__view_ContainerView__["a" /* default */](container, model);
                }

                this.packingSpace.AddContainer(container);

                this.Dispatch(signals.containerLoaded, container);
            }
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return PackingSpaceInput;
}(__WEBPACK_IMPORTED_MODULE_0__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (PackingSpaceInput);

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43);


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FreightPacker__ = __webpack_require__(44);

global.FreightPacker = __WEBPACK_IMPORTED_MODULE_0__FreightPacker__["a" /* default */];
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(20)))

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_Capabilities__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_App__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_components_CargoInput__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_components_PackingSpaceInput__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_UX__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__api_components_PackerInterface__ = __webpack_require__(62);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }










/**
 * @typedef InitializationParams
 * @property {Boolean} debug
 * @property {import('./api/UX').UXParams} ux
 */

/**
 * @type {InitializationParams}
 */
var defaultParams = {
	debug: false
};

var utils = {
	THREE: THREE,
	dat: window.dat || __webpack_require__(1).default,
	Signaler: __webpack_require__(2).default,
	Utils: __webpack_require__(0).default,
	Debug: __webpack_require__(63).default,
	Config: __webpack_require__(4).default
};

var FreightPacker = function () {
	/**
  * Freight Packer API instance
  * @param {HTMLDivElement} containerDiv
  * @param {InitializationParams} params
  */
	function FreightPacker(containerDiv, params) {
		_classCallCheck(this, FreightPacker);

		this.params = __WEBPACK_IMPORTED_MODULE_4__api_utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);
		FreightPacker.DevSetup(this);

		this.ux = new __WEBPACK_IMPORTED_MODULE_6__api_UX__["a" /* default */](this.params.ux);

		/**
   * Handles input of: description fields (label, etc.), dimensions and constraints
   * @type {CargoInput}
   */
		this.cargoInput = new __WEBPACK_IMPORTED_MODULE_2__api_components_CargoInput__["a" /* default */]();

		/**
   * Handles input of: packing spaces configurations and assets
   * @type {PackingSpaceInput}
   */
		this.packingSpaceInput = new __WEBPACK_IMPORTED_MODULE_5__api_components_PackingSpaceInput__["a" /* default */]();

		var app = new __WEBPACK_IMPORTED_MODULE_1__api_App__["a" /* default */](containerDiv, this.ux, {
			cargoInput: this.cargoInput,
			packingSpaceInput: this.packingSpaceInput
		});

		FreightPacker.DevSetup(app);

		/**
   * Manual solving and notification
   * @type {PackerInterface}
   */
		this.packer = new __WEBPACK_IMPORTED_MODULE_7__api_components_PackerInterface__["a" /* default */](app);

		if (this.params.debug) {
			FreightPacker.Auto(this);
		}
	}

	/**
  * Will resolve if requirements are met, otherwise rejects with an error message
  * @return {Promise<Void>|Promise<string>} 
  */


	_createClass(FreightPacker, null, [{
		key: 'CheckRequirements',
		value: function CheckRequirements() {
			var webgl = __WEBPACK_IMPORTED_MODULE_0__api_utils_Capabilities__["a" /* default */].IsWebGLReady();

			return new Promise(function (resolve, reject) {
				if (webgl) {
					resolve();
				} else {
					var message = 'WebGL not supported.';
					reject(message);
				}
			});
		}
	}, {
		key: 'DevSetup',


		/** @param {FreightPacker|App} domain */
		value: function DevSetup(domain) {
			if (domain instanceof FreightPacker) {
				var fp = domain;
				global.fp = fp;
				var params = fp.params;
				if (params.debug) {
					__WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__["a" /* default */].active = true;
					__WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__["a" /* default */].toConsole = true;
					__WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__["a" /* default */].traceToConsole = true;
				}

				//require('./api/debug/Tester').testPool();
				//utils.Debug.CLPTest.Test1();
			}

			if (domain instanceof __WEBPACK_IMPORTED_MODULE_1__api_App__["a" /* default */]) {
				var SceneSetup = __webpack_require__(11).default;
				var app = domain;
				app.sceneSetup.On(SceneSetup.signals.init, function () {
					FreightPacker.utils.Debug.Viz.scene = app.sceneSetup.sceneController.scene;
				});
			}
		}

		/** @param {FreightPacker} fp */

	}, {
		key: 'Auto',
		value: function Auto(fp) {}
	}, {
		key: 'utils',
		get: function get() {
			return utils;
		}
	}]);

	return FreightPacker;
}();

/* harmony default export */ __webpack_exports__["a"] = (FreightPacker);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(20)))

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Capabilities = function () {
  function Capabilities() {
    _classCallCheck(this, Capabilities);
  }

  _createClass(Capabilities, null, [{
    key: 'IsWebGLReady',
    value: function IsWebGLReady() {
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl && gl instanceof WebGLRenderingContext;
    }
  }]);

  return Capabilities;
}();

/* harmony default export */ __webpack_exports__["a"] = (Capabilities);

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UpdateComponent__ = __webpack_require__(22);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * @typedef {Object} IScreen
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 * @property {Number} left
 * @property {Number} right
 * @property {Number} bottom
 * @property {Number} top
 */

/**
 * @typedef {Object} DragEvent
 * @property {MouseEvent} mouseEvent
 * @property {Number} sx - Start screen x
 * @property {Number} sy - Start screen y
 * @property {Number} x - Current screen x
 * @property {Number} y - Current screen y
 * @property {Number} dx - Delta x
 * @property {Number} dy - Delta y
 * @property {Number} distance - Distance (current - start)
 * @property {Number} minDist - Minimum distance to raise onDrag
 */

/** keyboard api (http://dmauro.github.io/Keypress/)
* @typedef keyboard
* @property {function} on
* @property {function} unregister
*/

var epsilon = Math.pow(2, -52);
var defaultKeysListen = 'abcdefghijklmnopqrtsuvwxyz'.split('').concat(['ctlr', 'shift', 'alt']);

var Input = function () {

    /**
     * 
     * @param {HTMLElement} domContainer 
     */
    function Input(domContainer) {
        _classCallCheck(this, Input);

        this.enabled = true;

        var scope = this;
        Object.defineProperty(this, 'camera', {
            get: function get() {
                return scope._camera;
            },
            set: function set(camera) {
                scope._camera = camera;
                scope.fov = { min: 40, max: camera.fov, target: camera.fov };
            }
        });

        this.domContainer = domContainer;

        this._mouse = { x: 0, y: 0 };
        this.mouseScreen = new THREE.Vector2();
        this.mouseViewport = new THREE.Vector2();
        this.mouseDelta = new THREE.Vector2();
        this.lastMouseDownTime = 0;
        /**
         * @type {IScreen}
         */
        this.screen = {};
        this.ComputeScreen();

        this.raycaster = new THREE.Raycaster();

        this.clock = new THREE.Clock();
        this.clock.start();

        this._raycastGroups = { Update: {}, Update25: {}, Update10: {}, OnMouseDown: {}, OnDoubleClick: {}, OnMouseUp: {}, OnRightClick: {}, OnClick: {} };
        this.updateComponents = [new __WEBPACK_IMPORTED_MODULE_0__UpdateComponent__["a" /* default */](true, 1 / 25, this.Update25.bind(this)), new __WEBPACK_IMPORTED_MODULE_0__UpdateComponent__["a" /* default */](true, 1 / 10, this.Update10.bind(this))];

        this.fireOnce = [];

        this.onMouseDown = [];
        this.onMouseUp = [];
        this.onRightClick = [];
        this.onDoubleClick = [];
        this.onClick = [];
        this.onDrag = [];

        /**
         * @type {DragEvent}
         */
        this.onDragEvent = {
            mouseEvent: undefined,
            sx: undefined, sy: undefined,
            x: 0, y: 0,
            dx: 0, dy: 0,
            distance: 0,
            minDist: 4 // pixels 
        };
        var onDragStatus = false;
        Object.defineProperty(this.onDragEvent, '_status', {
            get: function get() {
                return onDragStatus;
            },
            set: function set(value) {
                onDragStatus = value;
                this.sx = this.sy = undefined;
                this.dx = this.dy = 0;
            }
        });

        this.doubleClickTime = .2;

        this.domContainer.addEventListener('mousedown', this.OnMouseDown.bind(this));
        this.domContainer.addEventListener('mouseup', this.OnMouseUp.bind(this));
        this.domContainer.addEventListener('contextmenu', this.OnRightClick.bind(this));
        this.domContainer.addEventListener('mousemove', this.OnMouseMove.bind(this), false);

        var thisOnMouseWheel = this.OnMouseWheel.bind(this);
        if (this.domContainer.addEventListener) {
            this.domContainer.addEventListener("mousewheel", thisOnMouseWheel, false);
            this.domContainer.addEventListener("DOMMouseScroll", thisOnMouseWheel, false);
        } else this.domContainer.attachEvent("onmousewheel", thisOnMouseWheel);

        this.screenNeedsUpdate = true;
        window.addEventListener('scroll', this.OnScroll.bind(this));

        this.cameraNeedsUpdate = true;
        this.onResize = [];
        window.addEventListener('resize', this.OnResize.bind(this));

        /**
         * @type {keyboard}
         */
        this.keyboard = new window.keypress.Listener();
        this.keyboard.on = this.keyboard.simple_combo;
        this.keyboard.unregister = this.keyboard.unregister_combo;
        this.keys = {};

        //
    }

    _createClass(Input, [{
        key: 'Dispose',
        value: function Dispose() {
            // remove listeners
        }
    }, {
        key: 'ListenKeys',
        value: function ListenKeys(keys) {
            if (keys === undefined) {
                keys = defaultKeysListen;
            }

            var scope = this;
            keys.forEach(function (key) {
                scope.keys[key] = false;
                scope.keyboard.register_combo({
                    keys: key,
                    prevent_repeat: true,
                    on_keydown: function on_keydown() {
                        scope.keys[key] = true;
                    },
                    on_keyup: function on_keyup() {
                        scope.keys[key] = false;
                    }
                });
            });
        }
    }, {
        key: 'ComputeScreen',
        value: function ComputeScreen() {
            var screen = this.domContainer.getBoundingClientRect();
            this.screen.x = screen.x;
            this.screen.y = screen.y;
            this.screen.width = screen.width;
            this.screen.height = screen.height;
            this.screen.left = screen.left;
            this.screen.right = screen.right;
            this.screen.bottom = screen.bottom;
            this.screen.top = screen.top;

            /*
            var rectOffset = Utils.GetRectOffset(this.domContainer);
            this.screen.x += rectOffset.x;
            this.screen.left += rectOffset.x;
            this.screen.y += rectOffset.y;
            this.screen.top += rectOffset.y;
            */
        }
    }, {
        key: 'OnMouseDown',
        value: function OnMouseDown(mouseEvent) {
            if (mouseEvent.button === 0) {
                this.UpdateScreenAndMouse(mouseEvent);
                var now = this.clock.getElapsedTime();
                if (now - this.lastMouseDownTime < this.doubleClickTime) {
                    if (this._dridMouseDown !== undefined) {
                        this.AbortDelayedAction(this._dridMouseDown);
                        this._dridMouseDown = undefined;
                    }
                    this.OnDoubleClick(mouseEvent);
                    return;
                }

                this.lastMouseDownTime = now;
                this.onDragEvent._status = true;

                var scope = this;
                this._dridMouseDown = this.DelayedAction(this._mouseDownDelayed = function () {
                    scope._dridMouseDown = undefined;
                    for (var i = 0; i < scope.onMouseDown.length; i++) {
                        scope.onMouseDown[i](mouseEvent);
                    }
                    scope.UpdateRaycast('OnMouseDown');
                    scope.mouseDelta.copy(scope.mouseScreen);
                }, this.doubleClickTime * 1000);
            }
        }
    }, {
        key: 'OnDoubleClick',
        value: function OnDoubleClick(mouseEvent) {
            for (var i = 0; i < this.onDoubleClick.length; i++) {
                this.onDoubleClick[i](mouseEvent);
            }

            this.UpdateRaycast('OnDoubleClick');
        }
    }, {
        key: 'ExecuteDelayedMD',
        value: function ExecuteDelayedMD(mouseEvent) {
            if (this._dridMouseDown !== undefined) {
                this.AbortDelayedAction(this._dridMouseDown);
                this._dridMouseDown = undefined;
                this._mouseDownDelayed();
            }
        }
    }, {
        key: 'OnMouseUp',
        value: function OnMouseUp(mouseEvent) {
            if (mouseEvent.button === 0) {
                var now = this.clock.getElapsedTime();
                if (now - this.lastMouseDownTime < this.doubleClickTime) {
                    this.ExecuteDelayedMD(mouseEvent);
                }

                this.UpdateScreenAndMouse(mouseEvent);
                for (var i = 0; i < this.onMouseUp.length; i++) {
                    this.onMouseUp[i](mouseEvent);
                }

                this.UpdateRaycast('OnMouseUp');
                var d = this.mouseDelta.distanceToSquared(this.mouseScreen);
                var noMouseDrag = d < 10; // pixels squared
                if (noMouseDrag) {
                    this.OnClick(mouseEvent);
                }

                this.onDragEvent._status = false;
            }
        }
    }, {
        key: 'OnMouseDrag',
        value: function OnMouseDrag() {
            var p = this.onDragEvent;
            if (p._status) {
                var m = this.mouseScreen;
                if (p.sx === undefined) p.sx = p.x = m.x;
                if (p.sy === undefined) p.sy = p.y = m.y;

                var vx = p.x - p.sx,
                    vy = p.y - p.sy;
                p.distance = Math.sqrt(vx * vx + vy * vy);
                if (p.distance > p.minDist && (Math.abs(p.dx) > epsilon || Math.abs(p.dy) > epsilon)) {
                    for (var i = 0; i < this.onDrag.length; i++) {
                        this.onDrag[i](p);
                    }
                }

                p.dx = p.x - m.x;
                p.dy = p.y - m.y;

                p.x = m.x;
                p.y = m.y;
            }
        }
    }, {
        key: 'OnClick',
        value: function OnClick(mouseEvent) {
            for (var i = 0; i < this.onClick.length; i++) {
                this.onClick[i](mouseEvent);
            }

            this.UpdateRaycast('OnClick');
        }
    }, {
        key: 'OnRightClick',
        value: function OnRightClick(mouseEvent) {
            //mouseEvent.preventDefault();
            this.UpdateScreenAndMouse(mouseEvent);
            for (var i = 0; i < this.onRightClick.length; i++) {
                this.onRightClick[i](mouseEvent);
            }

            this.UpdateRaycast('OnRightClick');
        }
    }, {
        key: 'OnMouseMove',
        value: function OnMouseMove(mouseEvent) {
            this._mouse.x = THREE.Math.clamp(mouseEvent.clientX - this.screen.left, 0, this.screen.width);
            this._mouse.y = THREE.Math.clamp(mouseEvent.clientY - this.screen.top, 0, this.screen.height);
            this.onDragEvent.mouseEvent = mouseEvent;
            this.ExecuteDelayedMD(mouseEvent);
        }
    }, {
        key: 'OnScroll',
        value: function OnScroll(event) {
            this.screenNeedsUpdate = true;
        }
    }, {
        key: 'OnMouseWheel',
        value: function OnMouseWheel(mouseEvent) {
            mouseEvent.preventDefault();
            var delta = THREE.Math.clamp(mouseEvent.wheelDelta || -mouseEvent.detail, -1, 1);
            this.fov.target = THREE.Math.clamp(this.fov.target - delta * 2., this.fov.min, this.fov.max);
            this.fov.lerp = 0;
        }
    }, {
        key: 'LerpZoom',
        value: function LerpZoom() {
            this.fov.lerp += .1;
            if (this.fov.lerp >= 1 || Number.isNaN(this.fov.lerp)) {
                return;
            }
            this.camera.fov += (this.fov.target - this.camera.fov) * this.fov.lerp;
            this.camera.updateProjectionMatrix();
        }
    }, {
        key: 'OnResize',
        value: function OnResize(event) {
            this.screenNeedsUpdate = true;
            this.cameraNeedsUpdate = true;
        }
    }, {
        key: 'RemoveEventCallback',
        value: function RemoveEventCallback(eventType, callback) {
            var callbacks = this[eventType];
            for (var iCallback = 0; iCallback < callbacks.length; iCallback++) {
                if (callbacks[iCallback] === callback) {
                    callbacks.splice(iCallback, 1);
                }
            }
        }
    }, {
        key: 'Update',
        value: function Update() {
            this.UpdateScreenAndMouse();

            this.FireOnce();

            // Raycasts
            this.UpdateRaycaster();
            this.UpdateRaycast('Update');

            var now = this.clock.getElapsedTime();
            for (var iUpdate = 0; iUpdate < this.updateComponents.length; iUpdate++) {
                var updateComponent = this.updateComponents[iUpdate];
                if (updateComponent.active && now - updateComponent.lastUpdateTime > updateComponent.interval) {
                    updateComponent.Update(now);
                }
            }

            this.OnMouseDrag();
        }
    }, {
        key: 'Update25',
        value: function Update25() {
            this.LerpZoom();
            this.UpdateRaycast('Update25');
        }
    }, {
        key: 'Update10',
        value: function Update10() {
            this.UpdateRaycast('Update10');
        }
    }, {
        key: 'FireOnce',
        value: function FireOnce() {
            for (var iCallback = this.fireOnce.length; iCallback-- > 0;) {
                this.fireOnce[iCallback]();
            }
            this.fireOnce.length = 0;
        }
    }, {
        key: 'DelayedAction',
        value: function DelayedAction(action, delay) {
            var drid = window.setTimeout(function () {
                action();
            }, delay);
            return drid;
        }
    }, {
        key: 'AbortDelayedAction',
        value: function AbortDelayedAction(drid) {
            window.clearTimeout(drid);
            return;
        }
    }, {
        key: 'Repeat',
        value: function Repeat(action, interval) {
            if (this._repeats === undefined) this._repeats = [];
            var drid = window.setInterval(function () {
                action();
            }, interval);
            this._repeats.push({ action: action, drid: drid });
            return drid;
        }
    }, {
        key: 'StopRepeat',
        value: function StopRepeat(action) {
            if (this._repeats === undefined) return;
            if (typeof action === 'number') {
                window.clearInterval(action);
                return;
            }
            for (var i = 0; i < this._repeats.length; i++) {
                if (this._repeats[i].action === action) {
                    window.clearInterval(this._repeats[i].drid);
                    this._repeats.splice(i, 1);
                    return;
                }
            }
        }
    }, {
        key: 'UpdateScreenAndMouse',
        value: function UpdateScreenAndMouse(mouseEvent) {
            if (this.screenNeedsUpdate) {
                this.ComputeScreen();
                this.screenNeedsUpdate = false;
            }
            if (this.cameraNeedsUpdate) {
                for (var i = 0; i < this.onResize.length; i++) {
                    this.onResize[i](this.screen);
                }
                this.cameraNeedsUpdate = false;
            }

            if (mouseEvent !== undefined) {
                this._mouse.x = THREE.Math.clamp(mouseEvent.clientX - this.screen.left, 0, this.screen.width);
                this._mouse.y = THREE.Math.clamp(mouseEvent.clientY - this.screen.top, 0, this.screen.height);
            }

            this.mouseScreen.x = this._mouse.x;
            this.mouseScreen.y = this._mouse.y;

            this.mouseViewport.x = this._mouse.x / this.screen.width * 2 - 1;
            this.mouseViewport.y = -this._mouse.y / this.screen.height * 2 + 1;
        }
    }, {
        key: 'RaycastTest',
        value: function RaycastTest(objects, recursive) {
            this.UpdateRaycaster();
            recursive = recursive !== undefined ? recursive : false;
            var intersects = objects instanceof Array ? this.raycaster.intersectObjects(objects, recursive) : this.raycaster.intersectObject(objects, recursive);
            if (intersects.length > 0) {
                return intersects[0];
            }
            return undefined;
        }
    }, {
        key: 'AddRaycastGroup',
        value: function AddRaycastGroup(event, groupID, group) {
            if (this._raycastGroups[event][groupID] !== undefined) console.log('RaycastGroup ' + groupID + ' is being overwritten.');
            this._raycastGroups[event][groupID] = group;
        }
    }, {
        key: 'RemoveRaycastGroup',
        value: function RemoveRaycastGroup(event, groupID) {
            delete this._raycastGroups[event][groupID];
        }
    }, {
        key: 'UpdateRaycaster',
        value: function UpdateRaycaster() {
            this.camera.updateMatrixWorld();
            this.raycaster.setFromCamera(this.mouseViewport, this.camera);
        }
    }, {
        key: 'UpdateRaycast',
        value: function UpdateRaycast(event) {
            var raycastGroupsKeys = Object.keys(this._raycastGroups[event]);
            var numRaycastGroups = raycastGroupsKeys.length;
            if (numRaycastGroups > 0) {
                if (numRaycastGroups > 1) raycastGroupsKeys.sort().reverse();

                for (var iGroup = 0; iGroup < numRaycastGroups; iGroup++) {
                    var key = raycastGroupsKeys[iGroup];
                    this._raycastGroups[event][key].Raycast(this.raycaster);
                }
            }
        }
    }]);

    return Input;
}();

/* harmony default export */ __webpack_exports__["a"] = (Input);

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Quality = function () {
    function Quality(callback) {
        _classCallCheck(this, Quality);

        this.testCallback = callback;
    }

    _createClass(Quality, [{
        key: "Common",
        value: function Common(quality) {
            //                      0       1       2       3
            var composer = [0, 0, 0, 1];
            var antialias = [0, 1, 1, 0];
            var shadows = [0, 0, 1, 1];
            var renderSizeMul = [.5, 1, 1, 1];

            var result = {
                composer: Boolean(composer[quality]),
                antialias: Boolean(antialias[quality]),
                shadows: Boolean(shadows[quality]),
                renderSizeMul: renderSizeMul[quality]
            };
            return result;
        }
    }, {
        key: "OnTestComplete",
        value: function OnTestComplete(quality) {
            var result = this.Common(quality);
            this.testCallback(result);
        }
    }, {
        key: "PerformanceTest1",
        value: function PerformanceTest1() {
            var quality = 2;
            // Test webgl supported shader precision, see WebGLRenderer, https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
            this.OnTestComplete(quality);
        }
    }]);

    return Quality;
}();

/* harmony default export */ __webpack_exports__["a"] = (Quality);

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * @typedef RendererParams
 * @property {Boolean} antialias
 * @property {Boolean} shadows
 * @property {Boolean} shadowsAutoUpdate
 * @property {Number} clearColor - hex color 0xff7f00
 * @property {Number} renderSizeMul
 * @property {Boolean} composer
 */

/** @type {RendererParams} */
var defaultParams = {
    antialias: true,
    shadows: THREE.PCFSoftShadowMap,
    shadowsAutoUpdate: true,
    clearColor: 0xcfcfcf,
    renderSizeMul: 1,
    composer: false
};

var Renderer = function () {
    /**
     * @param {RendererParams} params 
     */
    function Renderer(params) {
        _classCallCheck(this, Renderer);

        this.params = __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);
        this.renderer = new THREE.WebGLRenderer({ antialias: this.params.antialias });

        if (this.params.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = this.params.shadows;
            this.renderer.shadowMap.autoUpdate = this.params.shadowsAutoUpdate;
        }

        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        //this.renderer.toneMappingExposure = ;

        this.maxTextureSize = this.renderer.context.getParameter(this.renderer.context.MAX_TEXTURE_SIZE);
        this.pixelRatio = window.devicePixelRatio !== undefined ? window.devicePixelRatio : 1;
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setClearColor(new THREE.Color(this.params.clearColor), 1);

        this.ResizeRenderer = function (screen) {
            var newWidth = screen.width * this.params.renderSizeMul;
            var newHeight = screen.height * this.params.renderSizeMul;
            this.renderer.setSize(newWidth, newHeight);
        };

        this.Render = function (scene, camera) {
            this.renderer.render(scene, camera);
        };

        this.UpdateShadowMaps = function () {
            this.renderer.shadowMap.needsUpdate = true;
        };

        this.ResizeDomElement = function (screen) {
            this.renderer.domElement.style.width = Math.floor(screen.width) + 'px';
            this.renderer.domElement.style.height = Math.floor(screen.height) + 'px';
        };

        this.AdjustCamera = function (screen, camera) {
            camera.aspect = screen.width / screen.height;
            camera.updateProjectionMatrix();
        };

        this.ReconfigureViewport = function (screen, camera) {
            this.AdjustCamera(screen, camera);

            this.ResizeRenderer(screen);
            this.ResizeDomElement(screen);
        };

        if (this.params.composer) {
            Renderer.UseComposer(this);
        }
    }

    _createClass(Renderer, [{
        key: 'Dispose',
        value: function Dispose() {
            this.renderer.dispose();
        }
    }], [{
        key: 'UseComposer',
        value: function UseComposer(sceneRenderer) {
            sceneRenderer.composer = new THREE.EffectComposer(sceneRenderer.renderer);
            sceneRenderer.renderPass = new THREE.RenderPass(undefined, undefined);
            sceneRenderer.renderPass.renderToScreen = true;
            sceneRenderer.composer.addPass(sceneRenderer.renderPass);
            sceneRenderer.renderPasses = [sceneRenderer.renderPass];

            sceneRenderer.UseCamera = function (camera) {
                sceneRenderer.camera = camera;
                sceneRenderer.renderPass.camera = camera;
            };

            sceneRenderer.ResizeRenderer = function (screen) {
                var newWidth = screen.width * sceneRenderer.params.renderSizeMul;
                var newHeight = screen.height * sceneRenderer.params.renderSizeMul;
                sceneRenderer.renderer.setSize(newWidth, newHeight);

                newWidth = Math.floor(newWidth / sceneRenderer.pixelRatio) || 1;
                newHeight = Math.floor(newWidth / sceneRenderer.pixelRatio) || 1;
                sceneRenderer.composer.setSize(newWidth, newHeight);
            };

            sceneRenderer.Render = function (scene) {
                sceneRenderer.renderPass.scene = scene;
                sceneRenderer.composer.render();
            };
        }
    }]);

    return Renderer;
}();

/* harmony default export */ __webpack_exports__["a"] = (Renderer);

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_Controller__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scene_Camera__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_Transform__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_cik_Utils__ = __webpack_require__(0);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






/**
 * @typedef {Object} HUDViewParams
 * @property {import('../UX').default} ux
 */

/** @type {HUDViewParams} */
var defaultParams = {};

// -11.3, 23.9, 215.5
var defaultCamTRS = new __WEBPACK_IMPORTED_MODULE_2__scene_Transform__["a" /* default */](new THREE.Vector3(0, 80, 400), new THREE.Euler(-0.1, 0, 0));

var HUDView = function (_Controller) {
        _inherits(HUDView, _Controller);

        /**
         * @param {HUDViewParams} params 
         * @param {import('../scene/Camera').CameraParams} cameraParams 
         */
        function HUDView(params, cameraParams) {
                _classCallCheck(this, HUDView);

                var _this = _possibleConstructorReturn(this, (HUDView.__proto__ || Object.getPrototypeOf(HUDView)).call(this, params));

                _this.params = __WEBPACK_IMPORTED_MODULE_3__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);

                var units = _this.params.ux.params.units;

                _this.cameraController = new __WEBPACK_IMPORTED_MODULE_1__scene_Camera__["a" /* default */](cameraParams);

                _this.cameraTransform = defaultCamTRS.Clone();
                _this.cameraTransform.position.multiplyScalar(units);
                _this.cameraTransform.Apply(_this.cameraController);
                _this.cameraController.camera.updateMatrixWorld();

                //var gridHelper = new THREE.GridHelper(100 * units, 20);
                //this.AddDefault(gridHelper);
                return _this;
        }

        return HUDView;
}(__WEBPACK_IMPORTED_MODULE_0__scene_Controller__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (HUDView);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _position = Symbol('position');
var _rotation = Symbol('rotation');

var Transform = function () {

    /**
     * @param {THREE.Vector3} position 
     * @param {THREE.Euler} rotation 
     */
    function Transform(position, rotation) {
        _classCallCheck(this, Transform);

        this[_position] = position || new THREE.Vector3();
        this[_rotation] = rotation || new THREE.Euler();
    }

    /**
     * @returns {THREE.Vector3}
     */


    _createClass(Transform, [{
        key: 'Apply',


        /**
         * 
         * @param {THREE.Object3D} target 
         */
        value: function Apply(target) {
            target.position.copy(this[_position]);
            target.rotation.copy(this[_rotation]);
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var transform = new Transform(this[_position].clone(), this[_rotation].clone());
            return transform;
        }
    }, {
        key: 'position',
        get: function get() {
            return this[_position];
        },
        set: function set(value) {
            this[_position] = value;
        }

        /**
         * @returns {THREE.Euler}
         */

    }, {
        key: 'rotation',
        get: function get() {
            return this[_rotation];
        },
        set: function set(value) {
            this[_rotation] = value;
        }
    }]);

    return Transform;
}();

/* harmony default export */ __webpack_exports__["a"] = (Transform);

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoGroup__ = __webpack_require__(15);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _position = Symbol('position');
var _rotation = Symbol('rotation');

var PackingItem = function () {
    function PackingItem() {
        _classCallCheck(this, PackingItem);

        this[_position] = new THREE.Vector3();
        this[_rotation] = new THREE.Euler();
    }

    /** @returns {THREE.Vector3} */


    _createClass(PackingItem, [{
        key: 'position',
        get: function get() {
            return this[_position];
        },
        set: function set(value) {
            this[_position] = value;
        }

        /** @returns {THREE.Euler} */

    }, {
        key: 'rotation',
        get: function get() {
            return this[_position];
        },
        set: function set(value) {
            this[_rotation] = value;
        }
    }]);

    return PackingItem;
}();

var Cargo = function (_PackingItem) {
    _inherits(Cargo, _PackingItem);

    /**
     * 
     * @param {CargoGroup} group
     */
    function Cargo(group) {
        _classCallCheck(this, Cargo);

        var _this = _possibleConstructorReturn(this, (Cargo.__proto__ || Object.getPrototypeOf(Cargo)).call(this));

        _this.group = group;
        return _this;
    }

    _createClass(Cargo, [{
        key: 'Clone',
        value: function Clone() {
            var cargo = new Cargo(this.group);
            return cargo;
        }
    }, {
        key: 'ToString',
        value: function ToString() {
            var output = 'Cargo(' + this.entry.ToString() + ')';

            return output;
        }
    }, {
        key: 'entry',
        get: function get() {
            return this.group.entry;
        }
    }]);

    return Cargo;
}(PackingItem);

/* harmony default export */ __webpack_exports__["a"] = (Cargo);

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__ = __webpack_require__(9);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var type = 'Volume';
var _box3 = Symbol('box3');

var Volume = function () {
    function Volume() {
        _classCallCheck(this, Volume);

        /**
         * @type {THREE.Vector3}
         */
        this.position = new THREE.Vector3();

        /**
         * @type {Dimensions}
         */
        this.dimensions = new __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__["a" /* default */]();

        this[_box3] = new THREE.Box3();
    }

    /** @returns {THREE.Box3} */


    _createClass(Volume, [{
        key: 'toJSON',
        value: function toJSON() {
            return {
                type: type,
                position: this.position,
                dimensions: this.dimensions
            };
        }
    }, {
        key: 'ToString',
        value: function ToString() {
            return this.dimensions.ToString();
        }
    }, {
        key: 'box3',
        get: function get() {
            /** @type {THREE.Box3} */
            var b = this[_box3];
            b.setFromCenterAndSize(this.position, this.dimensions.vec3);
            return b;
        }
    }], [{
        key: 'FromJSON',
        value: function FromJSON(data, volume) {
            if (!volume) {
                if (data.type !== type) console.warn('Data supplied is not: ' + type);

                volume = new Volume();
            }

            volume.position = new THREE.Vector3(data.position.x, data.position.y, data.position.z);
            volume.dimensions = __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__["a" /* default */].FromJSON(data.dimensions);

            return volume;
        }
    }]);

    return Volume;
}();

/* harmony default export */ __webpack_exports__["a"] = (Volume);

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export PackingProperty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SupportsStacking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RotationConstraint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TranslationConstraint; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _enabled = Symbol('enabled');

var PackingProperty = function () {
    function PackingProperty() {
        _classCallCheck(this, PackingProperty);

        this[_enabled] = false;
    }

    /** @returns {Boolean} Is property enabled */


    _createClass(PackingProperty, [{
        key: 'Reset',
        value: function Reset() {
            this.enabled = false;
        }
    }, {
        key: 'Copy',
        value: function Copy() {
            Logger.Warn('PackingProperty.Copy is not implemented');
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            Logger.Warn('PackingProperty.Clone is not implemented');
        }
    }, {
        key: 'enabled',
        get: function get() {
            return this[_enabled];
        },
        set: function set(value) {
            this[_enabled] = value;
        }
    }], [{
        key: 'Assert',
        value: function Assert(prop) {
            return prop instanceof PackingProperty;
        }
    }]);

    return PackingProperty;
}();

var SupportsStacking = function (_PackingProperty) {
    _inherits(SupportsStacking, _PackingProperty);

    function SupportsStacking() {
        _classCallCheck(this, SupportsStacking);

        return _possibleConstructorReturn(this, (SupportsStacking.__proto__ || Object.getPrototypeOf(SupportsStacking)).call(this));
    }

    /**
     * @param {SupportsStacking} prop 
     */


    _createClass(SupportsStacking, [{
        key: 'Copy',
        value: function Copy(prop) {
            this.enabled = prop.enabled;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var prop = new SupportsStacking();
            prop.enabled = this.enabled;
            return prop;
        }
    }]);

    return SupportsStacking;
}(PackingProperty);

var Constraint = function (_PackingProperty2) {
    _inherits(Constraint, _PackingProperty2);

    function Constraint() {
        _classCallCheck(this, Constraint);

        return _possibleConstructorReturn(this, (Constraint.__proto__ || Object.getPrototypeOf(Constraint)).call(this));
    }

    _createClass(Constraint, [{
        key: 'Copy',
        value: function Copy(prop) {
            Logger.Warn('Constraint.Copy is not implemented');
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            Logger.Warn('Constraint.Clone is not implemented');
        }
    }]);

    return Constraint;
}(PackingProperty);

var RotationConstraint = function (_Constraint) {
    _inherits(RotationConstraint, _Constraint);

    function RotationConstraint() {
        _classCallCheck(this, RotationConstraint);

        return _possibleConstructorReturn(this, (RotationConstraint.__proto__ || Object.getPrototypeOf(RotationConstraint)).call(this));
    }

    /**
     * @param {RotationConstraint} prop 
     */


    _createClass(RotationConstraint, [{
        key: 'Copy',
        value: function Copy(prop) {
            this.enabled = prop.enabled;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var prop = new RotationConstraint();
            prop.enabled = this.enabled;
            return prop;
        }
    }]);

    return RotationConstraint;
}(Constraint);

var TranslationConstraint = function (_Constraint2) {
    _inherits(TranslationConstraint, _Constraint2);

    function TranslationConstraint() {
        _classCallCheck(this, TranslationConstraint);

        return _possibleConstructorReturn(this, (TranslationConstraint.__proto__ || Object.getPrototypeOf(TranslationConstraint)).call(this));
    }

    /**
     * @param {TranslationConstraint} prop 
     */


    _createClass(TranslationConstraint, [{
        key: 'Copy',
        value: function Copy(prop) {
            this.enabled = prop.enabled;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var prop = new TranslationConstraint();
            prop.enabled = this.enabled;
            return prop;
        }
    }]);

    return TranslationConstraint;
}(Constraint);



/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolve", function() { return resolve; });

function almost(n1, n2) {
    return Math.abs(n1 - n2) < .01;
}

function resolve(w, l, h, dimensions) {
    var dw = dimensions.width,
        dl = dimensions.length,
        dh = dimensions.height;

    if (almost(w, dw)) {
        // x
        if (almost(h, dh)) {
            // y
            return 'xyz';
        } else if (almost(h, dl)) {
            // z
            return 'xzy';
        }
    } else if (almost(w, dh)) {
        // y
        if (almost(h, dw)) {
            // x
            return 'yxz';
        } else if (almost(h, dl)) {
            // z
            return 'yzx';
        }
    } else if (almost(w, dl)) {
        // z
        if (almost(h, dw)) {
            // x
            return 'zxy';
        } else if (almost(h, dh)) {
            // y
            return 'zyx';
        }
    }

    console.warn('ResolveOrientation issue with:', item);
    return 'xyz';
}



/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Bin__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Item__ = __webpack_require__(33);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Packer = function () {
  function Packer(bins, items) {
    _classCallCheck(this, Packer);

    this.bins = bins || [];
    this.items = items || [];
    this.unfitItems = [];
  }

  _createClass(Packer, [{
    key: 'addBin',
    value: function addBin(bin) {
      this.bins.push(bin);
    }
  }, {
    key: 'addItem',
    value: function addItem(item) {
      this.items.push(item);
    }
  }, {
    key: 'findFittedBin',
    value: function findFittedBin(i) {
      for (var _i = 0; _i < this.bins.length; _i++) {
        var b = this.bins[_i];

        if (!b.weighItem(i) || !b.putItem(i, __WEBPACK_IMPORTED_MODULE_1__Item__["StartPosition"])) {
          continue;
        }

        if (b.items.length === 1 && b.items[0] === i) {
          b.items = [];
        }

        return b;
      }
      return null;
    }
  }, {
    key: 'getBiggerBinThan',
    value: function getBiggerBinThan(b) {
      var v = b.getVolume();
      for (var _i = 0; _i < this.bins; _i++) {
        var b2 = this.bins[_i];
        if (b2.getVolume() > v) {
          return b2;
        }
      }
      return null;
    }
  }, {
    key: 'unfitItem',
    value: function unfitItem() {
      if (this.items.length === 0) {
        return;
      }
      this.unfitItems.push(this.items[0]);
      this.items.splice(0, 1);
    }
  }, {
    key: 'packToBin',
    value: function packToBin(b, items) {
      var b2 = null;
      var unpacked = [];
      var fit = b.weighItem(items[0]) && b.putItem(items[0], __WEBPACK_IMPORTED_MODULE_1__Item__["StartPosition"]);

      if (!fit) {
        var _b = this.getBiggerBinThan(b);
        if (_b) {
          return this.packToBin(_b, items);
        }
        return this.items;
      }

      // Pack unpacked items.
      for (var _i = 1; _i < this.items.length; _i++) {
        var fitted = false;
        var item = this.items[_i];

        if (b.weighItem(item)) {
          // Try available pivots in current bin that are not intersect with
          // existing items in current bin.
          lookup: for (var _pt = 0; _pt < 3; _pt++) {
            for (var _j = 0; _j < b.items.length; _j++) {
              var pv = void 0;
              var ib = b.items[_j];
              switch (_pt) {
                case __WEBPACK_IMPORTED_MODULE_1__Item__["WidthAxis"]:
                  pv = [ib.position[0] + ib.getWidth(), ib.position[1], ib.position[2]];
                  break;
                case __WEBPACK_IMPORTED_MODULE_1__Item__["HeightAxis"]:
                  pv = [ib.position[0], ib.position[1] + ib.getHeight(), ib.position[2]];
                  break;
                case __WEBPACK_IMPORTED_MODULE_1__Item__["DepthAxis"]:
                  pv = [ib.position[0], ib.position[1], ib.position[2] + ib.getDepth()];
                  break;
              }

              if (b.putItem(item, pv)) {
                fitted = true;
                break lookup;
              }
            }
          }
        }

        if (!fitted) {
          while (b2 !== null) {
            b2 = this.getBiggerBinThan(b);
            if (b2) {
              b2.items.push(item);
              var left = this.packToBin(b2, b2.items);
              if (left.length === 0) {
                b = b2;
                fitted = true;
                break;
              }
            }
          }

          if (!fitted) {
            unpacked.push(item);
          }
        }
      }

      return unpacked;
    }
  }, {
    key: 'pack',
    value: function pack() {

      this.bins.sort(function (a, b) {
        return a.getVolume() > b.getVolume();
      });

      this.items.sort(function (a, b) {
        return a.getVolume() < b.getVolume();
      });

      while (this.items.length > 0) {
        var bin = this.findFittedBin(this.items[0]);

        if (bin === null) {
          this.unfitItem();
          continue;
        }

        this.items = this.packToBin(bin, this.items);
      }

      return this;
    }
  }]);

  return Packer;
}();

/* harmony default export */ __webpack_exports__["default"] = (Packer);

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pack", function() { return pack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveOrientation", function() { return resolveOrientation; });


/**
 * @param {Container} container 
 * @param {Array<Item>} items 
 */
var pack = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(container, items) {
        var packings, unpacked, iItem, item, packed, iPacking, _packing, iSpace, _packing$spaces, _space, _placement, space, placement, packing;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        /** @type {Array<Packing>} */
                        packings = [];
                        /** @type {Array<Item>} */

                        unpacked = [];


                        items.sort(volumeSort);

                        //for(let iItem = 0; iItem < items.length; iItem++){
                        iItem = 0;

                    case 4:
                        if (!(items.length > 0)) {
                            _context.next = 59;
                            break;
                        }

                        item = items[iItem];

                        if (!(item.weight > container.weight)) {
                            _context.next = 8;
                            break;
                        }

                        return _context.abrupt('return', { failed: 'Item is too big' });

                    case 8:
                        packed = false;
                        iPacking = 0;

                    case 10:
                        if (!(iPacking < packings.length && !packed)) {
                            _context.next = 45;
                            break;
                        }

                        _packing = packings[iPacking];
                        _context.next = 14;
                        return debugAs('Packing', _packing);

                    case 14:
                        if (!(_packing.weight + item.weight > container.weight)) {
                            _context.next = 18;
                            break;
                        }

                        _context.next = 17;
                        return debugAs('Log', 'Packing ' + iPacking + ' is overweight');

                    case 17:
                        return _context.abrupt('continue', 42);

                    case 18:
                        iSpace = 0;

                    case 19:
                        if (!(iSpace < _packing.spaces.length)) {
                            _context.next = 42;
                            break;
                        }

                        _space = _packing.spaces[iSpace];
                        _context.next = 23;
                        return debugAs('Space', _space);

                    case 23:

                        // Try placing the item in this space, if it doesn't fit skip on the next space
                        _placement = place(item, _space);

                        if (_placement) {
                            _context.next = 28;
                            break;
                        }

                        _context.next = 27;
                        return debugAs('Log', 'Placing item in Space ' + iSpace + ' of Packing ' + iPacking + ' failed');

                    case 27:
                        return _context.abrupt('continue', 39);

                    case 28:
                        _context.next = 30;
                        return debugAs('Placement', 'placement');

                    case 30:

                        // Add the item to the packing and break up the surrounding spaces
                        _packing.placements.push(_placement);
                        _packing.weight += item.weight;
                        _packing.spaces.splice(iSpace, 1);
                        (_packing$spaces = _packing.spaces).push.apply(_packing$spaces, _toConsumableArray(breakUpSpace(_space, _placement)));

                        packed = true;
                        items.splice(iItem, 1);
                        _context.next = 38;
                        return debugAs('Log', 'Item packed successfully in Space ' + iSpace + ' of Packing ' + iPacking);

                    case 38:
                        return _context.abrupt('break', 42);

                    case 39:
                        iSpace++;
                        _context.next = 19;
                        break;

                    case 42:
                        iPacking++;
                        _context.next = 10;
                        break;

                    case 45:
                        if (!packed) {
                            _context.next = 47;
                            break;
                        }

                        return _context.abrupt('continue', 4);

                    case 47:

                        // Can't fit in any of the spaces for the current packings so lets try a new space the size of the container
                        /** @type {Space} */
                        space = {
                            dimensions: container.dimensions.sort(rnsort),
                            position: [0, 0, 0]
                        };
                        placement = place(item, space);

                        // If it can't be placed in this space, then it's just too big for the container and we should abandon hope

                        if (placement) {
                            _context.next = 54;
                            break;
                        }

                        unpacked.push.apply(unpacked, _toConsumableArray(items.splice(iItem, 1)));
                        _context.next = 53;
                        return debugAs('Log', 'Placing item of dimensions' + str(item.dimensions) + ' abandoned');

                    case 53:
                        return _context.abrupt('continue', 4);

                    case 54:

                        // Otherwise lets put the item in a new packing and break up the remaing free space around it
                        /** @type {Packing} */
                        packing = {
                            placements: [placement],
                            weight: item.weight,
                            spaces: breakUpSpace(space, placement)
                        };

                        packings.push(packing);

                        items.splice(iItem, 1);
                        _context.next = 4;
                        break;

                    case 59:
                        return _context.abrupt('return', {
                            packings: packings,
                            unpacked: unpacked
                        });

                    case 60:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function pack(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function str(obj) {
    var result;
    if (obj instanceof Array) {
        result = '[';
        var i = void 0;
        for (i = 0; i < obj.length - 1; i++) {
            result += obj[i] + ', ';
        }result += obj[i] + ']';
    }
    return result;
}

function debugLog() {
    var _console;

    (_console = console).log.apply(_console, arguments);
    return sleep(200);
}

function debugPacking() {

    return sleep(200);
}

function debugSpace() {

    return sleep(200);
}

function debugPlacement() {

    return sleep(200);
}

function debugAs(type) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    switch (type) {
        case 'Log':
            return debugLog.apply(undefined, args);
        case 'Packing':
            return debugPacking.apply(undefined, args);
        case 'Space':
            return debugSpace.apply(undefined, args);
        case 'Placement':
            return debugPlacement.apply(undefined, args);
    }
    return true;
}

/**
 * @typedef {Array<Number>} Dimensions
 * @typedef {Array<Number>} Position
 * 
 * @typedef Item
 * @property {string} id 
 * @property {Dimensions} dimensions
 * @property {Number} weight
 * 
 * @typedef Container
 * @property {Dimensions} dimensions
 * @property {Number} weight
 * 
 * @typedef Placement
 * @property {string} id
 * @property {Dimensions} dimensions
 * @property {Position} position
 * @property {Number} weight
 * 
 * @typedef Space
 * @property {Dimensions} dimensions
 * @property {Position} position
 * 
 * @typedef Packing
 * @property {Array<Space>} spaces
 * @property {Array<Placement>} placements
 * @property {Number} weight
 */

var placePermutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

/**
 * @param {Item} item 
 * @param {Space} space
 * @returns {Placement}
 */
function place(item, space) {
    var d = item.dimensions,
        sd = space.dimensions;

    for (var i = 0; i < 6; i++) {
        var p = placePermutations[i];
        if (d[p[0]] <= sd[0] && d[p[1]] <= sd[1] && d[p[2]] <= sd[2]) {
            return {
                id: item.id,
                dimensions: [d[p[0]], d[p[1]], d[p[2]]],
                position: space.position,
                weight: item.weight
            };
        }
    }

    return undefined;
}

/**
 * 
 * @param {Space} space 
 * @param {Placement} placement
 * @returns {Array<Space>} 
 */
function breakUpSpace(space, placement) {
    var spaceDim = space.dimensions,
        spacePos = space.position,
        placementDim = placement.dimensions;
    return [{
        dimensions: [spaceDim[0] - placementDim[0], spaceDim[1], spaceDim[2]],
        position: [spacePos[0] + placementDim[0], spacePos[1], spacePos[2]]
    }, {
        dimensions: [placementDim[0], spaceDim[1] - placementDim[1], spaceDim[2]],
        position: [spacePos[0], spacePos[1] + placementDim[1], spacePos[2]]
    }, {
        dimensions: [placementDim[0], placementDim[1], spaceDim[2] - placementDim[2]],
        position: [spacePos[0], spacePos[1], spacePos[2] + placementDim[2]]
    }];
}

function rnsort(a, b) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
}

function volumeSort(a, b) {
    var av = a.dimensions[0] * a.dimensions[1] * a.dimensions[2];
    var bv = b.dimensions[0] * b.dimensions[1] * b.dimensions[2];

    if (av > bv) return -1;
    if (av < bv) return 1;
    return 0;
}

function almost(n1, n2) {
    return Math.abs(n1 - n2) < .01;
}

/** 
 * @param {Array<Number>} packedDimensions
 * @param {Array<Number>} itemDimensions
 * @returns {string} - axis order (xyz, xzy, yxz, yzx, zxy or zyx)
 */
function resolveOrientation(packedDimensions, itemDimensions) {
    var pw = packedDimensions[0],
        ph = packedDimensions[1],
        w = itemDimensions[0],
        h = itemDimensions[1],
        l = itemDimensions[2];
    if (almost(pw, w)) {
        // x
        if (almost(ph, h)) {
            // y
            return 'xyz';
        } else if (almost(ph, l)) {
            // z
            return 'xzy';
        }
    } else if (almost(pw, h)) {
        // y
        if (almost(ph, w)) {
            // x
            return 'yxz';
        } else if (almost(ph, l)) {
            // z
            return 'yzx';
        }
    } else if (almost(pw, l)) {
        // z
        if (almost(ph, w)) {
            // x
            return 'zxy';
        } else if (almost(ph, h)) {
            // y
            return 'zyx';
        }
    }
    return 'xyz';
}



/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoListView__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__packer_Packer__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_CargoList__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PackingSpaceView__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__packer_PackingSpace__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__view_SceneSetup__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__PackResultView__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_cik_input_UpdateComponent__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__packer_container_Container__ = __webpack_require__(6);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }













/**
 * @typedef {Object} ViewParams
 * @property {import('../UX').default} ux
 * @property {Object} cargoListView
 * @property {import('../utils/cik/Utils3D').IPoint} cargoListView.bottomLeft
 * @property {import('./CargoListView').CargoListViewParams} cargoListView.params
 * @property {Object} packResultView
 * @property {import('./PackResultView').PackResultViewParams} packResultView.params
 */

/** @type {ViewParams} */
var defaultParams = {
    ux: undefined,
    cargoListView: {
        bottomLeft: { x: 100, y: 100 },
        params: {}
    },
    packResultView: {
        params: {}
    }
};

var tempVec = new THREE.Vector3();

var View = function () {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {SceneSetup} sceneSetup 
     * @param {ViewParams} params 
     */
    function View(packer, sceneSetup, params) {
        _classCallCheck(this, View);

        this.sceneSetup = sceneSetup;
        this.params = __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);

        var scope = this;

        // Fill lights
        if (true) {
            var lights = this.sceneSetup.DefaultLights(this.sceneSetup.sceneController, true, false);

            var dl = lights.filter(function (light) {
                return light instanceof THREE.DirectionalLight;
            })[0];
            var dlData = { "color": "0xfeeedd", "intensity": 1, "castShadow": true, "shadow.bias": 0.001, "shadow.radius": 1, "shadow.mapSize.x": 2048, "shadow.mapSize.y": 2048, "shadow.camera.left": -400, "shadow.camera.top": 400, "shadow.camera.right": 400, "shadow.camera.bottom": -400, "shadow.camera.near": 1, "shadow.camera.far": 1000 };
            var Config = __webpack_require__(4).default;
            Config.Load(dl, dlData);

            if (this.sceneSetup.ux.params.hud) {
                this.sceneSetup.DefaultLights(this.sceneSetup.hud);
            }
        }

        // Packing space
        this.packingSpaceView = new __WEBPACK_IMPORTED_MODULE_3__PackingSpaceView__["a" /* default */]();
        this.sceneSetup.sceneController.AddDefault(this.packingSpaceView.view);
        /** @param {Container} container */
        function onContainerAdded(container) {
            /** @type {THREE.Box3} */
            var box3 = void 0;
            container.volumes.forEach(function (volume) {
                if (box3 === undefined) box3 = volume.box3;else box3.union(volume.box3);
            });
            scope.sceneSetup.cameraController.Frame(box3, .7);
            scope.packingSpaceView.Add(container);
        }
        packer.packingSpace.On(__WEBPACK_IMPORTED_MODULE_4__packer_PackingSpace__["a" /* default */].signals.containerAdded, onContainerAdded);

        // Cargo list
        this.params.cargoListView.params.ux = this.params.ux;
        this.cargoListView = new __WEBPACK_IMPORTED_MODULE_0__CargoListView__["a" /* default */](this.params.cargoListView.params);
        var onCargoGroupAdded = this.cargoListView.Add.bind(this.cargoListView);
        packer.cargoList.On(__WEBPACK_IMPORTED_MODULE_2__packer_CargoList__["a" /* default */].signals.groupAdded, onCargoGroupAdded);
        var onCargoRemoved = this.cargoListView.Remove.bind(this.cargoListView);
        packer.cargoList.On(__WEBPACK_IMPORTED_MODULE_2__packer_CargoList__["a" /* default */].signals.groupRemoved, onCargoRemoved);

        // Cargo list display
        if (this.params.ux.params.hud) {
            this.sceneSetup.hud.Add(this.cargoListView.templatesView);
            this.HUDSetup();
        }

        // Packing result
        this.params.packResultView.params.ux = this.params.ux;
        this.packResultView = new __WEBPACK_IMPORTED_MODULE_8__PackResultView__["a" /* default */](this.cargoListView, this.packingSpaceView, this.params.packResultView.params);
        this.sceneSetup.sceneController.AddDefault(this.packResultView.view);

        var onPackUpdate = this.packResultView.DisplayPackingResult.bind(this.packResultView);
        packer.On(__WEBPACK_IMPORTED_MODULE_1__packer_Packer__["a" /* default */].signals.packUpdate, onPackUpdate);

        var updateComponent = new __WEBPACK_IMPORTED_MODULE_9__utils_cik_input_UpdateComponent__["a" /* default */](true, 1 / 30, this.Update.bind(this));
        this.sceneSetup.input.updateComponents.push(updateComponent);

        if (this.params.ux.params.configure) {
            this.Configure();
        }
    }

    /** @param {Number} now */


    _createClass(View, [{
        key: "Update",
        value: function Update(now) {
            this.packResultView.Update();
        }
    }, {
        key: "HUDSetup",
        value: function HUDSetup() {
            var units = this.params.ux.params.units;
            var input = this.sceneSetup.input;
            var hud = this.sceneSetup.hud;
            var clv = this.cargoListView;
            var scope = this;

            var cargoListViewRect = new __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].Rect(0, 0, 150, input.screen.height);
            var clvRectIgnore = cargoListViewRect.Clone();
            clvRectIgnore.Offset(input.screen.left, input.screen.top);

            var min = -1,
                max = 1;
            var v = new THREE.Vector3(),
                viewportPointA = new THREE.Vector2(),
                viewportPointB = new THREE.Vector2();
            var dragOffset = 0;

            // 

            /**
             * @param {import('./CargoListView').SortResult} sortResult
             */
            function onSort(sortResult) {
                if (sortResult.cargoes > 0) {
                    __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].Project(v.set(0, sortResult.min, 0), hud.cameraController.camera, input.screen, viewportPointA);
                    __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].Project(v.set(0, sortResult.max, 0), hud.cameraController.camera, input.screen, viewportPointB);

                    var distance = viewportPointA.sub(viewportPointB).length();
                    var ratio = .8 / distance;
                    var s = Math.max(.6, Math.pow(Math.min(1, clv.templatesView.scale.length() * ratio), .9));
                    clv.templatesView.scale.set(s, s, s);
                    clv.templatesView.updateMatrixWorld();
                }

                min = v.set(0, sortResult.min, 0).applyMatrix4(clv.templatesView.matrixWorld).y;
                max = v.set(0, sortResult.max, 0).applyMatrix4(clv.templatesView.matrixWorld).y;
            }
            this.cargoListView.On(__WEBPACK_IMPORTED_MODULE_0__CargoListView__["a" /* default */].signals.sort, onSort);

            /**
             * @param {import('../utils/cik/input/Input').DragEvent} dragEvent 
             */
            function onDrag(dragEvent) {
                var start = cargoListViewRect.ContainsPoint(dragEvent.sx, dragEvent.sy);
                var current = cargoListViewRect.ContainsPoint(dragEvent.x, dragEvent.y);
                if (start && current) {
                    var offset = dragEvent.dy * .5 * units;
                    var clvMin = min + offset,
                        clvMax = max + offset;
                    __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].Project(v.set(0, clvMin, 0), hud.cameraController.camera, input.screen, viewportPointA);
                    __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].Project(v.set(0, clvMax, 0), hud.cameraController.camera, input.screen, viewportPointB);
                    //console.log(viewportPointA, viewportPointB);
                    if (offset > 0 && viewportPointA.y < -.7 || offset < 0 && viewportPointB.y > .8) {
                        dragOffset += offset;
                        min += offset;
                        max += offset;
                        clv.templatesView.position.y += offset;
                    }
                }
            }
            input.onDrag.push(onDrag);

            this.sceneSetup.cameraController.orbitControls.ignoredAreas.push(clvRectIgnore);

            /**
             * @param {import('../utils/cik/input/Input').IScreen} screen 
             */
            function onScreenResize(screen) {

                cargoListViewRect.bottom = screen.height;
                clvRectIgnore.Copy(cargoListViewRect);
                clvRectIgnore.Offset(screen.left, screen.top);

                var bottomLeft = scope.params.cargoListView.bottomLeft; // offset in pixels
                tempVec.set(bottomLeft.x, bottomLeft.y); // viewport point in pixels

                __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].ToNDC(tempVec, screen); // NDC point
                __WEBPACK_IMPORTED_MODULE_6__utils_cik_Utils3D__["a" /* default */].Unproject(tempVec, hud.cameraController.camera, tempVec, 'z'); // worldPos on z plane
                tempVec.y += dragOffset;
                clv.templatesView.position.copy(tempVec); // set view position

                clv.templatesView.updateMatrixWorld(true);

                clv.Sort();
            }

            input.onResize.push(onScreenResize);
            onScreenResize(input.screen);
        }
    }, {
        key: "Configure",
        value: function Configure() {

            var Smart = __webpack_require__(13).default;
            var Config = __webpack_require__(4).default;
            var Control3D = __webpack_require__(14).default;

            var scope = this;
            var input = this.sceneSetup.input;

            if (this.params.ux.params.hud) {
                var hudControl3D = Control3D.Request('hud');

                Config.MakeShortcut('Configure', 'Show HUDControl3D', function () {
                    hudControl3D.Toggle(scope.cargoListView.templatesView);
                });
            }
        }
    }]);

    return View;
}();

/* harmony default export */ __webpack_exports__["a"] = (View);

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} Screen
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @typedef {Object} IPoint
 * @property {Number} x
 * @property {Number} y
 */

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

var Utils3D = function () {
    function Utils3D() {
        _classCallCheck(this, Utils3D);
    }

    _createClass(Utils3D, null, [{
        key: 'ToNDC',


        /** Converts 'vec' to NDC, to supply 'vec' in the range [0, 1], ommit 'screen'
         * @param {THREE.Vector2|THREE.Vector3} vec 
         * @param {Screen} [screen]
         * @returns {THREE.Vector2|THREE.Vector3}
         */
        value: function ToNDC(vec, screen) {
            if (screen) {
                vec.x /= screen.width;
                vec.y /= screen.height;
            }
            vec.x = vec.x * 2 - 1;
            vec.y = vec.y * 2 - 1;

            if (vec.z !== undefined) vec.z = .5;

            return vec;
        }

        /** Converts 'vec' to [0, 1] range, to supply 'vec' in NDC [-1, 1], ommit 'screen'
         * @param {THREE.Vector2|THREE.Vector3} vec 
         * @param {Screen} [screen]
         * @returns {THREE.Vector2|THREE.Vector3}
         */

    }, {
        key: 'ToUnit',
        value: function ToUnit(vec, screen) {
            if (screen) {
                vec.x /= screen.width;
                vec.y /= screen.height;
            } else {
                vec.x = vec.x / 2 + .5;
                vec.y = vec.y / 2 + .5;
            }

            if (vec.z !== undefined) vec.z = .5;

            return vec;
        }

        /** Converts a NDC to world plane (axis) position
         * @param {THREE.Vector2|THREE.Vector3} viewportPoint - in NDC, can be safely used as 'result' if THREE.Vector3
         * @param {THREE.Camera} camera 
         * @param {THREE.Vector3} [result]
         * @param {string} [axis] - 'x', 'y' or 'z' (default='z')
         * @returns {THREE.Vector3}
         */

    }, {
        key: 'Unproject',
        value: function Unproject(viewportPoint, camera, result, axis) {
            // Ref: https://stackoverflow.com/a/13091694/1712403

            result = result || new THREE.Vector3();
            result.set(viewportPoint.x, viewportPoint.y, .5);
            result.unproject(camera);
            result.sub(camera.position).normalize();

            axis = axis || 'z';
            var distance = -camera.position[axis] / result[axis];
            result.multiplyScalar(distance).add(camera.position);

            return result;
        }

        /** Converts world position to NDC
         * @param {THREE.Vector3} worldPoint 
         * @param {THREE.Camera} camera 
         * @param {Screen} screen 
         * @param {THREE.Vector2} result 
         */

    }, {
        key: 'Project',
        value: function Project(worldPoint, camera, screen, result) {
            // Ref: https://github.com/josdirksen/threejs-cookbook/blob/master/03-camera/03.07-convert-world-coordintate-to-screen-coordinates.html

            tempVec.copy(worldPoint).project(camera);
            result = result || new THREE.Vector2();
            result.x = tempVec.x;
            result.y = tempVec.y;
            return result;
        }
    }]);

    return Utils3D;
}();

var Rect = function () {
    /**
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} right 
     * @param {Number} bottom 
     */
    function Rect(left, top, right, bottom) {
        _classCallCheck(this, Rect);

        this.Set(left, top, right, bottom);
    }

    /**
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} right 
     * @param {Number} bottom 
     */


    _createClass(Rect, [{
        key: 'Set',
        value: function Set(left, top, right, bottom) {
            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
        }

        /**
         * @param {IPoint|Number} point - {x, y} | x value
         * @param {Number} y - y value
         */

    }, {
        key: 'ContainsPoint',
        value: function ContainsPoint(point, y) {
            var x = y ? point : point.x;
            y = y ? y : point.y;
            return x > this.left && x < this.right && y > this.top && y < this.bottom;
        }
    }, {
        key: 'Offset',
        value: function Offset(x, y) {
            this.left += x;
            this.top += y;
            this.right += x;
            this.bottom += y;
        }
    }, {
        key: 'Copy',
        value: function Copy(rect) {
            this.Set(rect.left, rect.top, rect.right, rect.bottom);
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            return new Rect(this.left, this.top, this.right, this.bottom);
        }
    }]);

    return Rect;
}();

Utils3D.Rect = Rect;

/* harmony default export */ __webpack_exports__["a"] = (Utils3D);

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CargoListView__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CargoView__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_cik_Pool__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__PackedCargoBoxView__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__PackingSpaceView__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_cik_Tween__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__packer_Packer__ = __webpack_require__(7);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }











/**
 * @typedef {Object} PackResultViewParams
 * @property {import('../UX').default} ux
 */

/** @type {PackResultViewParams} */
var defaultParams = {};

/**
 * @param {CargoView} cargoView
 * @returns {PackedCargoBoxView}
 */
function poolNewFN(cargoView) {
    //console.log('pool new', cargoView);
    var packedCargoView = new __WEBPACK_IMPORTED_MODULE_4__PackedCargoBoxView__["a" /* default */](cargoView.entry);
    packedCargoView.Extend(cargoView);
    return packedCargoView;
}

/**
 * @param {PackedCargoBoxView} object 
 * @param {CargoView} cargoView
 * @returns {PackedCargoBoxView}
 */
function poolResetFN(object, cargoView) {
    //console.log('pool reset', cargoView);
    object.Extend(cargoView);
    return object;
}

function getOrientationAngles(orientation) {
    switch (orientation) {
        case 'xyz':
            return [0, 0, 0];
        case 'xzy':
            return [90, 0, 0];
        case 'yxz':
            return [0, 0, 90];
        case 'yzx':
            return [90, 0, 90];
        case 'zxy':
            return [90, -90, 0];
        case 'zyx':
            return [0, -90, 0];
    }
}

/**
 * @param {string} orientation 
 */
function getOrientationEuler(orientation) {
    var rad = Math.PI / 180.0;
    var a = getOrientationAngles(orientation);
    return new THREE.Euler(a[0] * rad, a[1] * rad, a[2] * rad);
}

var PackResultView = function () {
    /**
     * @param {CargoListView} cargoListView
     * @param {PackingSpaceView} packingSpaceView
     * @param {PackResultViewParams} params 
     */
    function PackResultView(cargoListView, packingSpaceView, params) {
        _classCallCheck(this, PackResultView);

        this.cargoListView = cargoListView;
        this.packingSpaceView = packingSpaceView;
        this.params = __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__["default"].AssignUndefined(params, defaultParams);

        this.view = new THREE.Object3D();

        this.pool = new __WEBPACK_IMPORTED_MODULE_3__utils_cik_Pool__["a" /* default */](poolNewFN, poolResetFN);

        /** @type {Array<Tween>} */
        this.animatingViews = [];
    }

    /** 
     * @param {Packer.PackingResult} packingResult
     */


    _createClass(PackResultView, [{
        key: 'DisplayPackingResult',
        value: function DisplayPackingResult(packingResult) {
            var _this = this;

            console.log(packingResult);
            //var containingVolume = this.packingSpaceView.FindContainingVolume(containingVolumeID);
            var containingVolume = packingResult.packed[0].containingVolume;
            var matrix = this.packingSpaceView.GetMatrix(containingVolume);
            var offset = new THREE.Vector3();
            var orientation = new THREE.Quaternion();
            var scale = new THREE.Vector3();
            matrix.decompose(offset, orientation, scale);

            var animatingViews = this.animatingViews;
            var view = this.view;
            var onTweenCompleted = this.OnTweenCompleted.bind(this);

            var _loop = function _loop() {
                var item = packingResult.packed[i];
                var cargoViewTemplate = _this.cargoListView.GetTemplate(item.entry);
                var packedCargoView = _this.pool.Request(cargoViewTemplate);

                __WEBPACK_IMPORTED_MODULE_6__utils_cik_Logger__["a" /* default */].WarnOnce('PackResultView.DisplayPackingResult', 'packedCargoView should be rotated instead of re-scaling');
                var rotation = getOrientationEuler(item.orientation);
                packedCargoView.SetRotationAngles(rotation.x, rotation.y, rotation.z);

                var x = item.position.x + offset.x,
                    y = item.position.y + offset.y,
                    z = item.position.z + offset.z;

                var zEntry = containingVolume.dimensions.length;
                setTimeout(function () {
                    var posTweenCombo = __WEBPACK_IMPORTED_MODULE_7__utils_cik_Tween__["a" /* default */].Combo.Request3(__WEBPACK_IMPORTED_MODULE_7__utils_cik_Tween__["a" /* default */].functions.linear, x, y, zEntry, 0, 0, z - zEntry, .5);

                    posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
                    posTweenCombo.onComplete = onTweenCompleted;
                    posTweenCombo.Update(0);
                    animatingViews.push(posTweenCombo);

                    view.add(packedCargoView.view);
                }, 100 * i);
            };

            for (var i = 0, numPackedItems = packingResult.packed.length; i < numPackedItems; i++) {
                _loop();
            }
        }

        /**
         * 
         * @param {Tween|Tween.Combo} tween 
         */

    }, {
        key: 'OnTweenCompleted',
        value: function OnTweenCompleted(tween) {
            var index = this.animatingViews.indexOf(tween);
            if (index != -1) {
                this.animatingViews.splice(index, 1);
            }
            tween.Unhook();
            tween.Return();
        }
    }, {
        key: 'Update',
        value: function Update() {
            this.animatingViews.forEach(function (animatingView) {
                animatingView.Update();
            });
        }
    }]);

    return PackResultView;
}();

/* harmony default export */ __webpack_exports__["a"] = (PackResultView);

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoBoxView__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_box_BoxEntry__ = __webpack_require__(10);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var unitCubeEdgeGeometry = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1));
var wireframeMaterialTemplate = new THREE.LineBasicMaterial({ color: 0xffffff });

var PackedCargoBoxView = function (_CargoBoxView) {
    _inherits(PackedCargoBoxView, _CargoBoxView);

    /**
     * @param {BoxEntry} boxEntry 
     */
    function PackedCargoBoxView(boxEntry) {
        _classCallCheck(this, PackedCargoBoxView);

        var _this = _possibleConstructorReturn(this, (PackedCargoBoxView.__proto__ || Object.getPrototypeOf(PackedCargoBoxView)).call(this, boxEntry));

        var meshMaterial = _this.mesh.material;
        meshMaterial.polygonOffset = true;
        meshMaterial.polygonOffsetFactor = 1;
        meshMaterial.polygonOffsetUnits = 1;
        meshMaterial.transparent = true;
        meshMaterial.opacity = .5;

        _this.mesh.castShadow = _this.mesh.receiveShadow = true;

        var material = wireframeMaterialTemplate.clone();
        _this.wireMesh = new THREE.LineSegments(unitCubeEdgeGeometry, material);
        _this.wireMesh.scale.copy(boxEntry.dimensions.vec3);

        _this.view.add(_this.wireMesh);
        return _this;
    }

    /** @returns {BoxEntry} */


    _createClass(PackedCargoBoxView, [{
        key: "SetScale",


        /**
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} z 
         */
        value: function SetScale(x, y, z) {
            this.mesh.scale.set(x, y, z);
            this.wireMesh.scale.set(x, y, z);
        }

        /**
         * @param {Number} x in radians
         * @param {Number} y in radians
         * @param {Number} z in radians
         */

    }, {
        key: "SetRotationAngles",
        value: function SetRotationAngles(x, y, z) {
            this.mesh.rotation.set(x, y, z);
            this.wireMesh.rotation.set(x, y, z);
        }

        /**
         * @param {CargoBoxView} cargoView 
         */

    }, {
        key: "Extend",
        value: function Extend(cargoView) {
            this.entry = cargoView.entry;
            this.mesh.material.color = cargoView.mesh.material.color;
        }
    }, {
        key: "entry",
        get: function get() {
            return _get(PackedCargoBoxView.prototype.__proto__ || Object.getPrototypeOf(PackedCargoBoxView.prototype), "entry", this);
        },
        set: function set(value) {
            _set(PackedCargoBoxView.prototype.__proto__ || Object.getPrototypeOf(PackedCargoBoxView.prototype), "entry", value, this);
            this.scale = value.dimensions.vec3;
        }
    }]);

    return PackedCargoBoxView;
}(__WEBPACK_IMPORTED_MODULE_0__CargoBoxView__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (PackedCargoBoxView);

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Pool__ = __webpack_require__(39);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/** 
 * Tween update function
 * @param {Number} time 
 * @param {Number} startValue 
 * @param {Number} delta 
 * @param {Number} duration
 * @returns {Number} value
 */
function TweenCallback(time, startValue, delta, duration) {}

/**
 * On completed callback
 * @param {Tween} target
 */
function TweenCompletedCallback(target) {}

var clock = new THREE.Clock();

function poolNewFN() {
    return new Tween();
}
/** @param {Tween} tween */
function poolResetFN(tween) {
    return tween;
}
var pool = new __WEBPACK_IMPORTED_MODULE_0__Pool__["a" /* default */](poolNewFN, poolResetFN);

var functions = {
    /** @type {TweenCallback} */
    linear: function linear(t, b, c, d) {
        return b + c * (t / d);
    },

    ease: {
        /** @type {TweenCallback} */
        easeOutElastic: function easeOutElastic(t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
        }
    }
};

/**
 * On completed callback
 * @param {TweenCombo} target
 */
function TweenComboCompletedCallback(target) {}

var TweenCombo = function () {
    /**
     * 
     * @param {Array<Tween>} tweens 
     */
    function TweenCombo() {
        _classCallCheck(this, TweenCombo);

        for (var _len = arguments.length, tweens = Array(_len), _key = 0; _key < _len; _key++) {
            tweens[_key] = arguments[_key];
        }

        this.tweens = tweens;

        /** @type {TweenComboCompletedCallback} */
        this.onComplete;
        this.completed = false;
    }

    /**
     * @param {Object} object 
     * @param {Array<string>} properties 
     */


    _createClass(TweenCombo, [{
        key: "Hook",
        value: function Hook(object) {
            for (var _len2 = arguments.length, properties = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                properties[_key2 - 1] = arguments[_key2];
            }

            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].Hook(object, properties[i]);
            };
        }
    }, {
        key: "Unhook",
        value: function Unhook() {
            this.tweens.forEach(function (tween) {
                tween.Unhook();
            });
        }

        /**
         * Update tween
         * @param {Number} t [0, duration]
         */

    }, {
        key: "Update",
        value: function Update(t) {
            var completed = true;
            this.tweens.forEach(function (tween) {
                if (tween.completed === false) tween.Update(t);

                completed = completed && tween.completed;
            });

            this.completed = completed;
            if (this.completed && this.onComplete) this.onComplete(this);
        }

        /**
         * Returns tweens to pool
         */

    }, {
        key: "Return",
        value: function Return() {
            this.tweens.forEach(function (tween) {
                pool.Return(tween);
            });
        }

        /**
         * @param {TweenCallback} callback 
         * @param {Number} startValue0
         * @param {Number} startValue1
         * @param {Number} startValue2
         * @param {Number} delta0
         * @param {Number} delta1
         * @param {Number} delta2
         * @param {Number} duration
         */

    }], [{
        key: "Request3",
        value: function Request3(callback, startValue0, startValue1, startValue2, delta0, delta1, delta2, duration) {
            var tween0 = pool.Request();
            tween0.Reset(callback, startValue0, delta0, duration);

            var tween1 = pool.Request();
            tween1.Reset(callback, startValue1, delta1, duration);

            var tween2 = pool.Request();
            tween2.Reset(callback, startValue2, delta2, duration);

            var combo = new TweenCombo(tween0, tween1, tween2);

            return combo;
        }
    }]);

    return TweenCombo;
}();

var Tween = function () {
    /**
     * @param {TweenCallback} callback 
     * @param {Number} [startValue] 
     * @param {Number} delta 
     * @param {Number} duration 
     */
    function Tween(callback, startValue, delta, duration) {
        _classCallCheck(this, Tween);

        this.Reset(callback, startValue, delta, duration);

        /** @type {TweenCompletedCallback} */
        this.onComplete;
    }

    /**
     * @param {TweenCallback} callback 
     * @param {Number} [startValue]
     * @param {Number} delta 
     * @param {Number} duration 
     */


    _createClass(Tween, [{
        key: "Reset",
        value: function Reset(callback, startValue, delta, duration) {
            this.callback = callback;
            this.startValue = startValue;
            this.delta = delta;
            this.duration = duration;

            if (this.startValue === undefined && this.object && this.property) {
                this.startValue = this.object[this.property];
            }

            this.startTime = clock.getElapsedTime();
            this.completed = false;
        }

        /**
         * @param {Object} object 
         * @param {string} property 
         */

    }, {
        key: "Hook",
        value: function Hook(object, property) {
            this.object = object;
            this.property = property;

            if (this.startValue === undefined) {
                this.startValue = this.object[this.property];
            }
        }
    }, {
        key: "Unhook",
        value: function Unhook() {
            this.object = this.property = undefined;
        }

        /**
         * Update tween
         * @param {Number} t [0, duration]
         */

    }, {
        key: "Update",
        value: function Update(t) {
            if (t === undefined) t = clock.getElapsedTime() - this.startTime;

            if (t >= this.duration) {
                this.completed = true;
                var endValue = this.startValue + this.delta;

                if (this.object) this.object[this.property] = endValue;

                if (this.onComplete) this.onComplete(this);

                return endValue;
            }

            var x = this.callback(t, this.startValue, this.delta, this.duration);
            if (this.object) this.object[this.property] = x;

            return x;
        }
    }, {
        key: "Return",
        value: function Return() {
            pool.Return(this);
        }

        /**
         * @param {TweenCallback} callback 
         * @param {Number} [startValue]
         * @param {Number} delta 
         * @param {Number} duration 
         */

    }], [{
        key: "Request",
        value: function Request(callback, startValue, delta, duration) {
            var tween = pool.Request();
            tween.Reset(callback, startValue, delta, duration);

            return tween;
        }
    }, {
        key: "functions",
        get: function get() {
            return functions;
        }
    }]);

    return Tween;
}();

Tween.Combo = TweenCombo;

/* harmony default export */ __webpack_exports__["a"] = (Tween);

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_Packer__ = __webpack_require__(7);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var _app = Symbol('app');

var signals = {
    packUpdate: 'packUpdate'
};

var PackerInterface = function (_Signaler) {
    _inherits(PackerInterface, _Signaler);

    /**
     * @param {App} app 
     */
    function PackerInterface(app) {
        _classCallCheck(this, PackerInterface);

        var _this = _possibleConstructorReturn(this, (PackerInterface.__proto__ || Object.getPrototypeOf(PackerInterface)).call(this));

        var scope = _this;
        function onPackUpdate() {
            scope.Dispatch(signals.packUpdate);
        }

        app.packer.On(__WEBPACK_IMPORTED_MODULE_2__packer_Packer__["a" /* default */].signals.packUpdate, onPackUpdate);
        _this[_app] = app;
        return _this;
    }

    _createClass(PackerInterface, [{
        key: "Solve",
        value: function Solve(arg) {
            /** @type {App} */
            var app = this[_app];
            app.packer.Solve(arg);
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return PackerInterface;
}(__WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__["default"]);

/* harmony default export */ __webpack_exports__["a"] = (PackerInterface);

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__packer_afit_AFitTest__ = __webpack_require__(64);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



function delay(time, callback) {
    setTimeout(callback, time);
}

var debugGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
var debugMaterial = new THREE.MeshStandardMaterial({ color: 0xff7f00, transparent: true, opacity: .35 });
var debugBox = new THREE.Mesh(debugGeometry, debugMaterial);

var tempVec = new THREE.Vector3();

var DebugBox = function () {
    function DebugBox() {
        _classCallCheck(this, DebugBox);
    }

    _createClass(DebugBox, null, [{
        key: 'FromCenterSize',


        /**
         * @param {THREE.Vector3} center 
         * @param {Number|THREE.Vector3} size 
         */
        value: function FromCenterSize(center, size) {
            var box = debugBox.clone();
            box.position.copy(center);

            if (size instanceof THREE.Vector3) box.scale.copy(size);else box.scale.set(size, size, size);

            return box;
        }

        /**
         * @param {THREE.Box3} box3 
         */

    }, {
        key: 'FromBox3',
        value: function FromBox3(box3) {
            var box = debugBox.clone();

            box3.getCenter(tempVec);
            box.position.copy(tempVec);
            box3.getSize(tempVec);
            box.scale.copy(tempVec);

            return box;
        }
    }]);

    return DebugBox;
}();

/**
 * DebugViz
 */

/** @type {THREE.Object3D} */


var view;

/** @type {Map<string, *>} */
var debugObjects = new Map();

var tVec3 = new THREE.Vector3(),
    tPos = new THREE.Vector3(),
    tScale = new THREE.Vector3();

var DebugViz = function () {
    function DebugViz() {
        _classCallCheck(this, DebugViz);
    }

    _createClass(DebugViz, null, [{
        key: 'SetViewParent',


        /**
         * @param {THREE.Object3D} parent
         */
        value: function SetViewParent(parent) {
            view = new THREE.Object3D();
            view.name = 'DebugViz view';
            view.renderOrder = Number.MAX_SAFE_INTEGER - 10;
            parent.add(view);
        }
    }, {
        key: 'DrawVolume',


        /**
         * @param {Number} x center x * @param {Number} y center y * @param {Number} z center z * @param {Number} w * @param {Number} h * @param {Number} l
         * @param {Number} [color] hex color
         * @param {Number} [duration] in milliseconds
         */
        value: function DrawVolume(x, y, z, w, h, l, color, duration) {
            tPos.set(x, y, z);
            tScale.set(w, h, l);

            /** @type {THREE.Mesh} */
            var volume = debugBox.clone();
            view.add(volume);

            volume.position.copy(center);

            if (color) {
                /** @type {THREE.MeshStandardMaterial} */
                var material = volume.material;
                material.color.setHex(color);
            }

            var uid = THREE.Math.generateUUID();
            debugObjects.set(uid, volume);

            if (duration) {
                delay(duration, function () {
                    DebugViz.RemoveObjectByUID(uid);
                });
            }

            return uid;
        }

        /**
         * @param {string} uid 
         */

    }, {
        key: 'RemoveObjectByUID',
        value: function RemoveObjectByUID(uid) {
            var object = debugObjects.get(uid);
            if (object instanceof THREE.Object3D && object.parent) {
                object.parent.remove(object);
            }
        }
    }, {
        key: 'view',
        get: function get() {
            return view;
        }
    }]);

    return DebugViz;
}();

/**
 * DebugViz
 */

var Debug = function () {
    function Debug() {
        _classCallCheck(this, Debug);
    }

    _createClass(Debug, null, [{
        key: 'AFitTest',
        get: function get() {
            return __WEBPACK_IMPORTED_MODULE_0__packer_afit_AFitTest__["a" /* default */];
        }
    }, {
        key: 'CLPTest',
        get: function get() {
            return __webpack_require__(65);
        }
    }]);

    return Debug;
}();

Debug.Box = DebugBox;
Debug.Viz = DebugViz;

/* harmony default export */ __webpack_exports__["default"] = (Debug);

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Item__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AFit__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Container__ = __webpack_require__(17);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





/** @param {Array<Item>} items */
function sumOfVolumes(items) {
    var sum = 0;
    for (var i = 0, len = items.length; i < len; i++) {
        sum += items[i].Volume;
    }return sum;
}

/**
 * @param {Array<Object>} objects 
 * @param {Array<string>} m - mapping to Item.constructor, ie: [ID, Length, ...]
 */
function toItems(objects, m) {
    var items = [];
    objects.forEach(function (o) {
        items.push(new __WEBPACK_IMPORTED_MODULE_0__components_Item__["default"](o[m[0]], o[m[1]], o[m[2]], o[m[3]], o[m[4]]));
    });
    return items;
}

var TestData =
/**
 * @param {Container} container 
 * @param {Array<Item>} items 
 */
function TestData(container, items) {
    _classCallCheck(this, TestData);

    this.container = container;
    this.items = items;
};

var AFitTest = function () {
    function AFitTest() {
        _classCallCheck(this, AFitTest);

        this.aFitPacker = new __WEBPACK_IMPORTED_MODULE_1__AFit__["a" /* default */]();
    }

    /**
     * @param {Container} container 
     * @param {Array<Item>} items 
     */


    _createClass(AFitTest, [{
        key: "T1",
        value: function T1(container, items) {

            var startTime = performance.now();
            var result = this.aFitPacker.Solve(container, items);
            result.PackTimeInMilliseconds = Math.ceil(performance.now() - startTime);

            var containerVolume = container.Length * container.Width * container.Height;
            var itemVolumePacked = sumOfVolumes(result.PackedItems);
            var itemVolumeUnpacked = sumOfVolumes(result.UnpackedItems);

            result.PercentContainerVolumePacked = Math.floor(itemVolumePacked / containerVolume * 100 * 100) / 100;
            result.PercentItemVolumePacked = Math.floor(itemVolumePacked / (itemVolumePacked + itemVolumeUnpacked) * 100 * 100) / 100;

            return result;
        }
    }], [{
        key: "GenerateDataSample1",
        value: function GenerateDataSample1() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 15, Width: 13, Height: 9 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 5, Width: 4, Height: 2, Quantity: 1 }, { ID: 1001, Name: 'Item2', Length: 2, Width: 1, Height: 1, Quantity: 3 }, { ID: 1002, Name: 'Item3', Length: 9, Width: 7, Height: 3, Quantity: 4 }, { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 8 }, { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 1 }, { ID: 1005, Name: 'Item6', Length: 3, Width: 3, Height: 2, Quantity: 2 }];

            var container = Object.assign(new __WEBPACK_IMPORTED_MODULE_2__components_Container__["default"](), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }, {
        key: "GenerateDataSample2",
        value: function GenerateDataSample2() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 60, Width: 35, Height: 25 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 30, Width: 50, Height: 20, Quantity: 1 }, { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 6 }, { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 3 }, { ID: 1005, Name: 'Item6', Length: 5, Width: 5, Height: 2, Quantity: 16 }];

            var container = Object.assign(new __WEBPACK_IMPORTED_MODULE_2__components_Container__["default"](), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }, {
        key: "GenerateDataSampleFlatdeck",
        value: function GenerateDataSampleFlatdeck() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 100, Width: 70, Height: 90, Quantity: 3 }, { ID: 1003, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7 }, { ID: 1004, Name: 'Item5', Length: 40, Width: 20, Height: 30, Quantity: 4 }, { ID: 1005, Name: 'Item6', Length: 30, Width: 20, Height: 30, Quantity: 20 }];

            var container = Object.assign(new __WEBPACK_IMPORTED_MODULE_2__components_Container__["default"](), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }]);

    return AFitTest;
}();

/* harmony default export */ __webpack_exports__["a"] = (AFitTest);

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Test1", function() { return Test1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "test1Data", function() { return test1Data; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Workbook__ = __webpack_require__(31);


var solverSheet = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets('CLP Solver Console');
var itemsSheet = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets('1.Items');
var containersSheet = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets('2.Containers');
var solutionSheet = __WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */].Worksheets('3.Solution');

var noYes = ['No', 'Yes'];
var sortCriterion = [null, 'Volume', 'Weight', 'MaxDim'];

/** @type {import('./CLPSolver').SolverOptions} */
var solverOptions = {
    itemSortCriterion: 1,
    showProgress: false,
    cpuTimeLimit: 3
};

// First-Fit-Decreasing based on:
solverSheet.Cells(12, 3, sortCriterion[solverOptions.itemSortCriterion]);
// Show progress on status bar?
solverSheet.Cells(13, 3, noYes[Number(solverOptions.showProgress)]);
// CPU time limit (seconds)
solverSheet.Cells(14, 3, solverOptions.cpuTimeLimit);

// Front side support required?
solverSheet.Cells(6, 3, noYes[0]);

function packPriority(p) {
    switch (p) {
        case 1:
            return 'Must be packed';
        case 0:
            return 'May be packed';
        case -1:
            return 'Don\'t pack';
    }
}
function fillPriority(p) {
    switch (p) {
        case 1:
            return 'Must be used';
        case 0:
            return 'May be used';
        case -1:
            return 'Do not use';
    }
}

var containersDataSrc = [{ ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102 }];
var containersData = [];
var itemsDataSrc = [{ ID: 1001, Name: 'Item1', Length: 100, Width: 70, Height: 90, Quantity: 3 }, { ID: 1002, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7 }, { ID: 1003, Name: 'Item5', Length: 40, Width: 20, Height: 30, Quantity: 4 }, { ID: 1004, Name: 'Item6', Length: 30, Width: 20, Height: 30, Quantity: 20 }];
var itemsData = [];

var numItems = itemsDataSrc.length;
// Number of types of items
solverSheet.Cells(2, 3, numItems);

for (var i = 1; i <= numItems; i++) {
    var item = itemsDataSrc[i - 1];

    var volume = item.Length * item.Width * item.Height;

    /** @type {import('./CLPSolver').ItemData} */
    var itemData = {
        length: item.Length,
        width: item.Width,
        height: item.Height,
        xyRotatable: true,
        yzRotatable: true,
        mandatory: 1,
        profit: 0,
        weight: volume / 1000,
        quantity: item.Quantity
    };
    itemsData.push(itemData);
    continue;
    // 1 id, 2 name, 4 width, 5 height, 6 length, 7 volume, 9 xy, 10 yz, 11 weight, 12 packPriority = MustBePacked, 13 profit = 0, 14 quantity

    itemsSheet.Cells(2 + i, 1, i);
    itemsSheet.Cells(2 + i, 2, item.ID);

    itemsSheet.Cells(2 + i, 4, itemData.width);
    itemsSheet.Cells(2 + i, 5, itemData.height);
    itemsSheet.Cells(2 + i, 6, itemData.length);
    itemsSheet.Cells(2 + i, 7, volume);

    itemsSheet.Cells(2 + i, 9, noYes[Number(itemData.xyRotatable)]);
    itemsSheet.Cells(2 + i, 10, noYes[Number(itemData.yzRotatable)]);

    itemsSheet.Cells(2 + i, 11, itemData.weight);

    itemsSheet.Cells(2 + i, 12, packPriority(itemData.mandatory));

    itemsSheet.Cells(2 + i, 13, itemData.profit);

    itemsSheet.Cells(2 + i, 14, itemData.quantity);
}

var numContainers = containersDataSrc.length;
// Number of types of containers
solverSheet.Cells(4, 3, numContainers);
for (var i = 1; i <= numContainers; i++) {
    var container = containersDataSrc[i - 1];

    var _volume = container.Width * container.Height * container.Length;

    /** @type {import('./CLPSolver').ContainerData} */
    var containerData = {
        length: container.Length,
        width: container.Width,
        height: container.Height,
        quantity: 1,
        mandatory: 1,
        cost: 0,
        weightCapacity: _volume / 1000
    };
    containersData.push(containerData);
    continue;
    // 1 id, 2 name, 3 width, 4 height, 5, length, 6 volume_capacity, 7 weight_capacity, 8 fillPriority = 1, 9 cost = 1, 10 quantity

    containersSheet.Cells(1 + i, 1, i);
    containersSheet.Cells(1 + i, 2, container.ID);

    containersSheet.Cells(1 + i, 3, containerData.width);
    containersSheet.Cells(1 + i, 4, containerData.height);
    containersSheet.Cells(1 + i, 5, containerData.length);
    containersSheet.Cells(1 + i, 6, _volume);

    containersSheet.Cells(1 + i, 7, containerData.weightCapacity);

    containersSheet.Cells(1 + i, 8, fillPriority(containerData.mandatory));

    containersSheet.Cells(1 + i, 9, containerData.cost);

    containersSheet.Cells(1 + i, 10, containerData.quantity);
}

solutionSheet.Cells(1, 'B').calculate = function () {
    return Math.abs(solutionSheet.Cells(4, 'J').Value);
}; // =+$J$4
solutionSheet.Cells(4, 'G').calculate = function () {
    return solutionSheet.Sum(solutionSheet.Cells(6, 'G'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'G'));
}; // =SUM($G$6:$G$39)
solutionSheet.Cells(4, 'H').calculate = function () {
    return solutionSheet.Sum(solutionSheet.Cells(6, 'H'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'H'));
}; // =SUM($H$6:$H$39)
solutionSheet.Cells(4, 'I').calculate = function () {
    return solutionSheet.Sum(solutionSheet.Cells(6, 'I'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'I'));
}; // =SUM($I$6:$I$39)
solutionSheet.Cells(4, 'J').calculate = function () {
    return solutionSheet.Sum(solutionSheet.Cells(6, 'J'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'J'));
}; // =SUM($J$6:$J$39)

for (var i = 1; i <= 100 /*solutionSheet.Cells(3, 'B')*/; i++) {
    solutionSheet.Cells(5 + i, 'G').calculate = function () {
        var itemName = solutionSheet.Cells(6, 'B').Value;
        return itemsSheet.Cells(itemsSheet.Find(itemName).row, 1).Value;
    }; // itemIndex

    solutionSheet.Cells(5 + i, 'H').calculate = function () {
        return itemsSheet.Cells(2 + solutionSheet.Cells(5 + i, 'G'), 7).Value;
    }; // volume
    solutionSheet.Cells(5 + i, 'I').calculate = function () {
        return itemsSheet.Cells(2 + solutionSheet.Cells(5 + i, 'G'), 11).Value;
    }; // weight
    solutionSheet.Cells(5 + i, 'J').calculate = function () {
        return itemsSheet.Cells(2 + solutionSheet.Cells(5 + i, 'G'), 13).Value;
    }; // profit
}

console.log('CLP setup complete');
console.log(__WEBPACK_IMPORTED_MODULE_0__Workbook__["e" /* ThisWorkbook */]);

var CLPSolver = __webpack_require__(30);

var test1Data = {
    solverOptions: solverOptions,
    items: itemsData,
    container: containersData[0]
};

function Test1() {

    /** @param {CLPSolver.SolutionData} solution */
    function onSolution(solution) {
        console.log(solution);
        var packedItems = solution.container.filter(function (container) {
            return container !== null;
        })[0].items;
        console.log(packedItems);
    }
    CLPSolver.signaler.On(CLPSolver.signals.solution, onSolution);
    CLPSolver.Execute(test1Data.solverOptions, test1Data.items, [test1Data.container]);
}



/***/ })
/******/ ]);
//# sourceMappingURL=FreightPacker.js.map