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
/******/ 	return __webpack_require__(__webpack_require__.s = 56);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var trimVariableRegex = new RegExp(/(?:\d|_|-)+$/);
var twopi = 2 * Math.PI;
var goldenRatio = (1 + Math.sqrt(5)) / 2;
var goldenRatioConjugate = goldenRatio - 1;

var typeofObject = 'object';

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
            if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== typeofObject) {
                target = {};
                Object.assign(target, source);
                return target;
            }

            var keys = Object.keys(source);
            keys.forEach(function (key) {
                if (_typeof(source[key]) === typeofObject) Utils.AssignUndefined(target[key], source[key]);
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

exports.default = Utils;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** SignalerCallback 
 * @callback SignalerCallback
 * @param {Array<*>} args
 */

var Signaler = function () {
    function Signaler() {
        _classCallCheck(this, Signaler);

        /** @type {Array<SignalerCallback>} */
        this.signals = {};
        /** @type {Array<string>} */
        this.dispatches = {};
    }

    /** @param {string} event @param {SignalerCallback} callback */


    _createClass(Signaler, [{
        key: "OnIncludingPrior",
        value: function OnIncludingPrior(event, callback) {
            var args = this.dispatches[event];
            if (args) {
                callback.apply(undefined, _toConsumableArray(args));
            } else {
                this.On(event, callback);
            }
        }

        /** @param {string} event @param {SignalerCallback} callback */

    }, {
        key: "On",
        value: function On(event, callback) {
            if (this.signals[event] === undefined) {
                this.signals[event] = [];
            }
            this.signals[event].push(callback);
        }

        /** @param {string} event @param {SignalerCallback} callback */

    }, {
        key: "Once",
        value: function Once(event, callback) {
            if (this.signals[event] === undefined) {
                this.signals[event] = [];
            }
            var eventCallbacks = this.signals[event];
            var _once = void 0;
            _once = function once() {
                eventCallbacks.splice(eventCallbacks.indexOf(_once), 1);
                callback.apply(undefined, arguments);
            };
            eventCallbacks.push(_once);
        }

        /** @param {string} event @param {SignalerCallback} callback */

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

        /** @param {string} event @param {Array<*>} [args] */

    }, {
        key: "Dispatch",
        value: function Dispatch(event) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this.dispatches[event] = args;
            var callbacks = this.signals[event];
            if (callbacks) {
                for (var i = 0, len = callbacks.length; i < len; i++) {
                    callbacks[i].apply(callbacks, args);
                }
            }
        }
    }]);

    return Signaler;
}();

exports.default = Signaler;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            _Utils2.default.AssignUndefined(filter, defaultPrintFilter);

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

exports.default = Logger;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ColorTemplate = __webpack_require__(66);

var _ColorTemplate2 = _interopRequireDefault(_ColorTemplate);

var _Signaler = __webpack_require__(1);

var _Signaler2 = _interopRequireDefault(_Signaler);

var _Resources = __webpack_require__(45);

var _Resources2 = _interopRequireDefault(_Resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SolidMaterialType = THREE.MeshStandardMaterial;
var TransparentMaterialType = THREE.MeshStandardMaterial;
var InvisibleMaterialType = THREE.MeshBasicMaterial;

var defaultGeometry = new THREE.CubeGeometry(1, 1, 1);
var defaultMeshMaterial = new SolidMaterialType({ color: 0xaaaaaa });

var objectLoader = new THREE.ObjectLoader();
var jsonLoader = new THREE.JSONLoader();

var castShadow = true;
var receiveShadow = true;

/** @type {Map<string, ColorTemplate>} */
var colorTemplates = new Map();

var signaler = new _Signaler2.default();
var signals = {
    resourcesSet: 'resourcesSet'
};

var _resources = Symbol('resources');

var Asset = function () {
    function Asset() {
        _classCallCheck(this, Asset);
    }

    /** @param {Resources} value */


    _createClass(Asset, null, [{
        key: "SetTextureMap",


        /**
         * @param {string} url 
         * @param {THREE.Material} material 
         * @param {string} mapName 
         * @returns {Promise<THREE.Texture>}
         */
        value: function SetTextureMap(url, material, mapName) {
            return new Promise(function (resolve, reject) {
                signaler.OnIncludingPrior(signals.resourcesSet, function () {
                    var texture = material[mapName];
                    if (texture instanceof THREE.Texture || texture === null) {
                        material[mapName] = new THREE.TextureLoader().load(Asset.resources.texturesPath + url, resolve, undefined, reject);
                    }
                });
            });
        }

        /**
         * @param {Number} color hex
         */

    }, {
        key: "CreateSolidMaterialMatte",
        value: function CreateSolidMaterialMatte(color) {
            return new Asset.SolidMaterialType({ color: color, roughness: 1, metalness: .2 });
        }

        /**
         * 
         * @param {THREE.Geometry|THREE.BufferGeometry} geometry 
         * @param {THREE.Material} [material]
         */

    }, {
        key: "CreateMesh",
        value: function CreateMesh(geometry, material) {
            geometry = geometry || defaultGeometry;
            material = material || defaultMeshMaterial;

            var mesh = new THREE.Mesh(geometry, material);
            return mesh;
        }
    }, {
        key: "RestoreMaterial",
        value: function RestoreMaterial(material, modified) {
            if (modified === undefined) return;

            var keys = Object.keys(modified);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (material[key] !== undefined) {
                    if (material[key].setHex) {
                        /** @type {THREE.Color} */
                        var color = material.color;
                        color.setHex(modified[key]);
                    } else {
                        material[key] = modified[key];
                    }
                }
            }
        }
    }, {
        key: "SetMaterialFocus",
        value: function SetMaterialFocus(material, value, modified) {

            /** @type {THREE.Color} */
            var color = material.color;
            if (color !== undefined) {
                if (modified) modified.color = color.getHex();

                var reduce = (value - 1) / 4;
                color.r = THREE.Math.clamp(color.r - reduce, 0, 1);
                color.g = THREE.Math.clamp(color.g - reduce, 0, 1);
                color.b = THREE.Math.clamp(color.b - reduce, 0, 1);
            }

            /** @type {Number} */
            var opacity = material.opacity;
            if (opacity !== undefined) {
                if (modified) {
                    modified.opacity = opacity;
                    modified.transparent = material.transparent;
                }

                material.opacity = THREE.Math.clamp(material.opacity * value, 0, 1);;
                material.transparent = material.opacity < 1;
            }
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
         * @returns {THREE.Object3D}
         */

    }, {
        key: "FromJSON",
        value: function FromJSON(json) {
            return objectLoader.parse(json);
        }

        /** @param {THREE.Object3D} object */

    }, {
        key: "StandardSceneObject",
        value: function StandardSceneObject(object) {
            Asset.CastReceiveShadow(object);
        }

        /** @param {THREE.Object3D} object @param {Boolean} [value] */

    }, {
        key: "CastReceiveShadow",
        value: function CastReceiveShadow(object, value) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = value === undefined ? castShadow : value;
                    child.receiveShadow = value === undefined ? receiveShadow : value;
                }
            });
        }

        /** @param {THREE.Object3D} object @param {Boolean} [value] */

    }, {
        key: "ReceiveShadow",
        value: function ReceiveShadow(object, value) {
            if (value === undefined) value = receiveShadow;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.receiveShadow = value;
                }
            });
        }

        /** @param {THREE.Object3D} object @param {Boolean} [value] */

    }, {
        key: "CastShadow",
        value: function CastShadow(object, value) {
            if (value === undefined) value = castShadow;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = value;
                }
            });
        }

        /**
         * @param {string} key 
         * @param {Array<string|THREE.Color>} colors 
         */

    }, {
        key: "CreateColorTemplate",
        value: function CreateColorTemplate(key) {
            for (var _len = arguments.length, colors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                colors[_key - 1] = arguments[_key];
            }

            var template = new (Function.prototype.bind.apply(_ColorTemplate2.default, [null].concat(colors)))();
            colorTemplates.set(key, template);
        }

        /**
         * @param {string} key 
         */

    }, {
        key: "ColorTemplates",
        value: function ColorTemplates(key) {
            return colorTemplates.get(key);
        }
    }, {
        key: "resources",
        set: function set(value) {
            Asset[_resources] = value;
            signaler.Dispatch(signals.resourcesSet);
        },
        get: function get() {
            return Asset[_resources];
        }
    }]);

    return Asset;
}();

Asset.SolidMaterialType = SolidMaterialType;
Asset.TransparentMaterialType = TransparentMaterialType;
Asset.InvisibleMaterialType = InvisibleMaterialType;

Asset.CreateColorTemplate('Containers', 0x020202, 0x7f7f7f, 0xffffff);

exports.default = Asset;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultGUIParams = { publish: true, key: '' };
// dat.GUI console mirroring
// Access with >> dat.list

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

        params = _Utils2.default.AssignUndefined(params, defaultGUIParams);

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

exports.default = dat;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _PackingProperty = __webpack_require__(65);

var _Dimensions = __webpack_require__(33);

var _Dimensions2 = _interopRequireDefault(_Dimensions);

var _TextField = __webpack_require__(44);

var _TextField2 = _interopRequireDefault(_TextField);

var _CargoEntry2 = __webpack_require__(6);

var _CargoEntry3 = _interopRequireDefault(_CargoEntry2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef {Object} BoxEntryProperties
 * @property {StackingProperty} stacking
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

        _this.dimensions = new _Dimensions2.default(0, 0, 0);

        _this.weight = 0;
        _this.quantity = 1;

        /**
         * @type {BoxEntryProperties}
         */
        _this.properties;

        _this.properties.stacking = new _PackingProperty.StackingProperty();
        _this.properties.rotation = new _PackingProperty.RotationConstraint();
        _this.properties.translation = new _PackingProperty.TranslationConstraint();

        _this.descriptions.set('label', new _TextField2.default('label', getDefaultLabel()));
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
            label.content = _TextField2.default.defaultContent;
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
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        field = _step$value[1];

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
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        key = _step2$value[0],
                        field = _step2$value[1];

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
            _set(BoxEntry.prototype.__proto__ || Object.getPrototypeOf(BoxEntry.prototype), "weight", value, this);
        },
        get: function get() {
            return _get(BoxEntry.prototype.__proto__ || Object.getPrototypeOf(BoxEntry.prototype), "weight", this);
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
            if (field) field.content = value;else this.descriptions.set('label', new _TextField2.default('label', value));
        }
    }], [{
        key: "Assert",
        value: function Assert(entry) {
            return entry instanceof BoxEntry && _Dimensions2.default.Assert(entry.dimensions) && entry.properties && entry.descriptions && entry.weight !== undefined && entry.quantity !== undefined && _typeof(entry.weight) === numberType && _typeof(entry.quantity) === numberType && _PackingProperty.StackingProperty.Assert(entry.properties.stacking) && _PackingProperty.RotationConstraint.Assert(entry.properties.rotation) && _PackingProperty.TranslationConstraint.Assert(entry.properties.translation);
        }
    }]);

    return BoxEntry;
}(_CargoEntry3.default);

BoxEntry.StackingProperty = _PackingProperty.StackingProperty;
BoxEntry.RotationConstraint = _PackingProperty.RotationConstraint;
BoxEntry.TranslationConstraint = _PackingProperty.TranslationConstraint;

exports.default = BoxEntry;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TextField = __webpack_require__(44);

var _TextField2 = _interopRequireDefault(_TextField);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        /** @param {string} key @param {string} [value] ommit value param to get description content instead of setting it */

    }, {
        key: "Description",
        value: function Description(key, value) {
            var d = this.descriptions.get(key);
            if (d) {
                if (value === undefined) return d.content;

                d.content = value;
            } else {
                if (value === undefined) return false;

                d = new _TextField2.default(key, value);
                this.descriptions.set(key, d);
            }
        }

        /** @param {string} key */

    }, {
        key: "DeleteDescription",
        value: function DeleteDescription(key) {
            if (this.descriptions.has(key)) this.descriptions.delete(key);
        }
    }, {
        key: "Copy",
        value: function Copy(entry) {
            _Logger2.default.Warn('CargoEntry.Copy is not implemented');
        }
    }, {
        key: "Clone",
        value: function Clone() {
            _Logger2.default.Warn('CargoEntry.Clone is not implemented');
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

exports.default = CargoEntry;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ContainingVolume = __webpack_require__(10);

var _ContainingVolume2 = _interopRequireDefault(_ContainingVolume);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var type = 'Container';

var combinedVolume = new _ContainingVolume2.default();

var Container = function () {
    function Container() {
        _classCallCheck(this, Container);

        /**
         * Containing volumes array
         * @type {Array<ContainingVolume>}
         */
        this.volumes = [];

        _Logger2.default.WarnOnce('Container.constructor', 'label not implemented');
    }

    /** @param {ContainingVolume} volume */


    _createClass(Container, [{
        key: "Add",
        value: function Add(volume) {
            this.volumes.push(volume);
        }

        /**
         * @param {string} [uid] - You'll rarely need to provide this
         */

    }, {
        key: "SetUID",
        value: function SetUID(uid) {
            this.uid = uid || THREE.Math.generateUUID();
            return this.uid;
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
        key: "combinedVolume",
        get: function get() {
            var minX = Number.MAX_SAFE_INTEGER,
                minY = Number.MAX_SAFE_INTEGER,
                minZ = Number.MAX_SAFE_INTEGER;

            var maxX = Number.MIN_SAFE_INTEGER,
                maxY = Number.MIN_SAFE_INTEGER,
                maxZ = Number.MIN_SAFE_INTEGER;

            var combinedWeightCapacity = 0;

            this.volumes.forEach(function (volume) {
                var pos = volume.position;
                var dim = volume.dimensions;
                if (pos.x < minX) minX = pos.x;
                if (pos.y < minY) minY = pos.y;
                if (pos.z < minZ) minZ = pos.z;
                if (pos.x + dim.width > maxX) maxX = pos.x + dim.width;
                if (pos.y + dim.height > maxY) maxY = pos.y + dim.height;
                if (pos.z + dim.length > maxZ) maxZ = pos.z + dim.length;

                combinedWeightCapacity += volume.weightCapacity;
            });

            combinedVolume.container = this;
            combinedVolume.dimensions.Set(maxX - minX, maxZ - minZ, maxY - minY);
            combinedVolume.position.set((maxX + minX) / 2, (maxZ + minZ) / 2, (maxY + minY) / 2);
            combinedVolume.weightCapacity = combinedWeightCapacity;

            return combinedVolume;
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
            if (data.type !== type) throw 'Data supplied is not: ' + type;

            var container = new Container();
            for (var i = 0, numVolumes = data.volumes.length; i < numVolumes; i++) {
                var containingVolume = _ContainingVolume2.default.FromJSON(data.volumes[i]);
                containingVolume.container = container;
                container.Add(containingVolume);
            }

            return container;
        }
    }]);

    return Container;
}();

exports.default = Container;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var typeofNumber = 'number';

var _maxHeight = Symbol('maxHeight');
var _validOrientations = Symbol('validOrientations');

var orientations = ['xyz', 'zyx', 'yxz', 'yzx', 'zxy', 'xzy'];
var dimensions = [0, 0, 0];

var Item = function () {
    /**
     * @param {string} id 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} length 
     * @param {Number} weight 
     * @param {Number} quantity 
     * @param {Array<Number|string>} validOrientations
     * @param {Number} stackingCapacity 
     * @param {Boolean} grounded 
     */
    function Item(id, width, height, length, weight, quantity, validOrientations, stackingCapacity, grounded) {
        _classCallCheck(this, Item);

        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length;
        this.weight = weight;
        /** @type {Number} */
        this.volume = width * height * length;
        this.quantity = quantity;

        this.validOrientations = validOrientations;

        this.stackingCapacity = stackingCapacity;
        this.grounded = grounded;
    }

    /** @returns {Array<Number>} */


    _createClass(Item, [{
        key: 'GetOrientedDimensions',


        /** @param {Number} orientation */
        value: function GetOrientedDimensions(orientation) {
            switch (orientation) {
                case 0:
                    return this.xyz;
                case 1:
                    return this.zyx;
                case 2:
                    return this.yxz;
                case 3:
                    return this.yzx;
                case 4:
                    return this.zxy;
                case 5:
                    return this.xzy;
            }
        }

        /** @param {Number} orientation */

    }, {
        key: 'validOrientations',
        get: function get() {
            return this[_validOrientations];
        },
        set: function set(value) {
            if (!value) value = orientations;

            var validOrientations = [];
            for (var i = 0; i < value.length; i++) {
                var vo = value[i];
                var orientation = (typeof vo === 'undefined' ? 'undefined' : _typeof(vo)) === typeofNumber ? vo : orientations.indexOf(vo.toLowerCase());
                if (orientation !== -1) validOrientations.push(orientation);
            }

            if (validOrientations.length === 0) validOrientations[0] = 'xyz' || orientations[0];

            this[_validOrientations] = validOrientations;
            this[_maxHeight] = undefined;
        }
    }, {
        key: 'xyz',
        get: function get() {
            dimensions[0] = this.width;dimensions[1] = this.height;dimensions[2] = this.length;return dimensions;
        }
    }, {
        key: 'zyx',
        get: function get() {
            dimensions[0] = this.length;dimensions[1] = this.height;dimensions[2] = this.width;return dimensions;
        }
    }, {
        key: 'yxz',
        get: function get() {
            dimensions[0] = this.height;dimensions[1] = this.width;dimensions[2] = this.length;return dimensions;
        }
    }, {
        key: 'yzx',
        get: function get() {
            dimensions[0] = this.height;dimensions[1] = this.length;dimensions[2] = this.width;return dimensions;
        }
    }, {
        key: 'zxy',
        get: function get() {
            dimensions[0] = this.length;dimensions[1] = this.width;dimensions[2] = this.height;return dimensions;
        }
    }, {
        key: 'xzy',
        get: function get() {
            dimensions[0] = this.width;dimensions[1] = this.length;dimensions[2] = this.height;return dimensions;
        }

        /** @returns {Number} */

    }, {
        key: 'maxHeight',
        get: function get() {
            if (this[_maxHeight] === undefined) {
                var maxHeight = 0;
                for (var i = 0; i < this.validOrientations.length; i++) {
                    var _dimensions = this.GetOrientedDimensions(this.validOrientations[i]);
                    if (_dimensions[1] > maxHeight) maxHeight = _dimensions[1];
                }
                this[_maxHeight] = maxHeight;
            }

            return this[_maxHeight];
        }
    }], [{
        key: 'ResolveOrientation',
        value: function ResolveOrientation(orientation) {
            return orientations[orientation];
        }

        /** @param {Array<Item>} items */

    }, {
        key: 'GetMinDimensions',
        value: function GetMinDimensions(items) {
            var minDimensions = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

            for (var iItem = 0, numItems = items.length; iItem < numItems; iItem++) {
                var item = items[iItem];
                var validOrientations = item.validOrientations;
                for (var iOrient = 0; iOrient < validOrientations.length; iOrient++) {
                    var orientation = validOrientations[iOrient];
                    var _dimensions2 = item.GetOrientedDimensions(orientation);
                    if (_dimensions2[0] < minDimensions[0]) minDimensions[0] = _dimensions2[0];
                    if (_dimensions2[1] < minDimensions[1]) minDimensions[1] = _dimensions2[1];
                    if (_dimensions2[2] < minDimensions[2]) minDimensions[2] = _dimensions2[2];
                }
            }

            return minDimensions;
        }

        /**
         * @param {Item} a 
         * @param {Item} b 
         */

    }, {
        key: 'VolumeSort',
        value: function VolumeSort(a, b) {
            if (a.volume < b.volume) return -1;
            if (a.volume > b.volume) return 1;
            return 0;
        }

        /**
         * @param {Item} a 
         * @param {Item} b 
         */

    }, {
        key: 'HeightSort',
        value: function HeightSort(a, b) {
            if (a.maxHeight < b.maxHeight) return -1;
            if (a.maxHeight > b.maxHeight) return 1;
            if (a.volume < b.volume) return -1;
            if (a.volume > b.volume) return 1;
            return 0;
        }
    }]);

    return Item;
}();

var Container =
/**
 * @param {string} id 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} length 
 * @param {Number} weightCapacity 
 */
function Container(id, width, height, length, weightCapacity) {
    _classCallCheck(this, Container);

    this.id = id;
    this.width = width;
    this.height = height;
    this.length = length;
    this.weightCapacity = weightCapacity;
};

exports.Item = Item;
exports.Container = Container;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Math2D = __webpack_require__(47);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @typedef Rectangle @property {Vec2} p1 @property {Vec2} p2 @property {Vec2} p3 @property {Vec2} p4 
 * @property {Number} weight @property {Number} weightCapacity @property {Number} stackingCapacity 
 */

/**
 * @param {Rectangle | Array<Rectangle>} rect 
 * @param {Number} weight 
 * @param {Number} weightCapacity 
 * @param {Number} stackingCapacity 
 */
function setRectangleWeights(rect, weight, weightCapacity, stackingCapacity) {
    if (rect instanceof Array) {
        for (var i = 0; i < rect.length; i++) {
            rect[i].weight = weight;
            rect[i].weightCapacity = weightCapacity;
            rect[i].stackingCapacity = stackingCapacity;
        }
    } else {
        rect.weight = weight;
        rect.weightCapacity = weightCapacity;
        rect.stackingCapacity = stackingCapacity;
    }
}

var smallValue = .000001;
var smallValueSqrt = .001;
var maxWeightValue = Number.MAX_SAFE_INTEGER;

var Region = function () {
    /**
     * @param {Number} x * @param {Number} y * @param {Number} z * @param {Number} width * @param {Number} height * @param {Number} length * @param {Number} preferredX 
     */
    function Region(x, y, z, width, height, length, preferredX) {
        _classCallCheck(this, Region);

        this.Set(x, y, z, width, height, length, preferredX);
        this.SetWeights(0, maxWeightValue, maxWeightValue);
    }

    /**
     * @param {Number} x * @param {Number} y * @param {Number} z * @param {Number} width * @param {Number} height * @param {Number} length * @param {Number} preferredX 
     */


    _createClass(Region, [{
        key: "Set",
        value: function Set(x, y, z, width, height, length, preferredX) {
            this.x = x;this.y = y;this.z = z;
            this.width = width;this.height = height;this.length = length;
            this.preferredX = preferredX;
            return this;
        }

        /**
         * @param {Number} weight 
         * @param {Number} weightCapacity 
         * @param {Number} stackingCapacity 
         */

    }, {
        key: "SetWeights",
        value: function SetWeights(weight, weightCapacity, stackingCapacity) {
            this.weight = weight;
            this.weightCapacity = weightCapacity;
            this.stackingCapacity = stackingCapacity;
        }

        /** @param {Region} region */

    }, {
        key: "Copy",
        value: function Copy(region) {
            this.Set(region.x, region.y, region.z, region.width, region.height, region.length, region.preferredX);
            this.SetWeights(this.weight, this.weightCapacity, this.stackingCapacity);
            return this;
        }
    }, {
        key: "GetCorners",


        /**
         * @param {Number} offset offsets the region by this before calculating corners 
         * @returns {Array<Number>} 8 corners, length = 24 + center point [24, 25, 26]
         */
        value: function GetCorners(offset) {
            var x = this.x - offset,
                y = this.y - offset,
                z = this.z - offset,
                w = this.width + offset * 2,
                h = this.height + offset * 2,
                l = this.length + offset * 2;

            tempCorners[0] = x;tempCorners[1] = y;tempCorners[2] = z; // 0:
            tempCorners[3] = x + w;tempCorners[4] = y;tempCorners[5] = z; // 0:w
            tempCorners[6] = x;tempCorners[7] = y + h;tempCorners[8] = z; // 0:h
            tempCorners[9] = x + w;tempCorners[10] = y + h;tempCorners[11] = z; // 0:wh

            tempCorners[12] = x;tempCorners[13] = y;tempCorners[14] = z + l; // 1:
            tempCorners[15] = x + w;tempCorners[16] = y;tempCorners[17] = z + l; // 1:w
            tempCorners[18] = x;tempCorners[19] = y + h;tempCorners[20] = z + l; // 1:h
            tempCorners[21] = x + w;tempCorners[22] = y + h;tempCorners[23] = z + l; // 1:wh

            tempCorners[24] = x + w / 2;tempCorners[25] = y + h / 2;tempCorners[26] = z + l / 2; // center

            return tempCorners;
        }

        /**
         * @param {Array} result
         * @returns {Array<Number>} 4 corners, length = 12
         */

    }, {
        key: "GetFloorPoints",
        value: function GetFloorPoints(result) {
            if (result === undefined) result = tempPoints;
            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.width,
                l = this.length;

            result[0] = x;result[1] = y;result[2] = z;
            result[3] = x + w;result[4] = y;result[5] = z;
            result[6] = x + w;result[7] = y;result[8] = z + l;
            result[9] = x;result[10] = y;result[11] = z + l;

            return result;
        }

        /**
         * @param {Number} offset offsets the region by this before checking * @param {Number} px * @param {Number} py * @param {Number} pz 
         */

    }, {
        key: "ContainsPoint",
        value: function ContainsPoint(offset, px, py, pz) {
            var x = this.x - offset,
                y = this.y - offset,
                z = this.z - offset,
                w = this.width + offset * 2,
                h = this.height + offset * 2,
                l = this.length + offset * 2;
            return px > x && px < x + w && py > y && py < y + h && pz > z && pz < z + l;
        }

        /** @param {Number} offset offsets the region by this before checking * @param {Region} subRegion */

    }, {
        key: "ContainsRegion",
        value: function ContainsRegion(offset, subRegion) {
            var x = this.x - offset,
                y = this.y - offset,
                z = this.z - offset,
                w = this.width + offset * 2,
                h = this.height + offset * 2,
                l = this.length + offset * 2;
            var rx = subRegion.x,
                ry = subRegion.y,
                rz = subRegion.z,
                rw = subRegion.width,
                rh = subRegion.height,
                rl = subRegion.length;
            return rx > x && rx + rw < x + w && ry > y && ry + rh < y + h && rz > z && rz + rl < z + l;
        }

        /** @param {Number} offset offsets the region by this before checking * @param {Region} other */

    }, {
        key: "Intersects",
        value: function Intersects(offset, other) {
            var x = this.x - offset,
                y = this.y - offset,
                z = this.z - offset,
                w = this.width + offset * 2,
                h = this.height + offset * 2,
                l = this.length + offset * 2;

            return x <= other.x + other.width && x + w >= other.x && y <= other.y + other.height && y + h >= other.y && z <= other.z + other.length && z + l >= other.z;
        }

        /** @param {Number} offset offsets the region by this before checking * @param {Number} width * @param {Number} height * @param {Number} length
         * @param {Number} weight @param {Boolean} grounded
         * @param {Region} [result]
         */

    }, {
        key: "FitTest",
        value: function FitTest(offset, width, height, length, weight, grounded, result) {
            if (!result) result = tempRegion;

            if (grounded && this.y > smallValue) return false;

            // Check that all dimensions fit
            var fit = width < this.width + offset * 2 && height < this.height + offset * 2 && length < this.length + offset * 2;
            if (fit) {

                var weightFit = weight <= this.weightCapacity;
                if (weightFit) {

                    // Calculate x based on preferred side
                    var x = this.preferredX !== 0 ? this.x + this.width - width : this.x;
                    result.Set(x, this.y, this.z, width, height, length, this.preferredX);
                    result.SetWeights(weight, 0, maxWeightValue);
                    return result;
                }
            }

            return false;
        }

        /** @param {Region} region * @param {Number} minRegionAxis */

    }, {
        key: "Subtract",
        value: function Subtract(region, minRegionAxis) {
            /** @type {Array<Region>} */
            var newRegions;

            // Calculate a new east region
            var axis = region.x + region.width;
            var size = this.x + this.width - axis;
            if (size > minRegionAxis) {
                var east = new Region(axis, this.y, this.z, size, this.height, this.length, 0);
                east.SetWeights(0, this.weightCapacity, this.stackingCapacity);
                if (newRegions === undefined) newRegions = [];
                newRegions.push(east);
            }

            // Calculate a new west region
            axis = this.x;
            size = region.x - axis;
            if (size > minRegionAxis) {
                var west = new Region(axis, this.y, this.z, size, this.height, this.length, 1);
                west.SetWeights(0, this.weightCapacity, this.stackingCapacity);
                if (newRegions === undefined) newRegions = [];
                newRegions.push(west);
            }

            // Calculate a new over/up region
            axis = region.y + region.height;
            size = this.y + this.height - axis;
            if (size > minRegionAxis) {
                var over = new Region(region.x, axis, region.z, region.width, size, region.length, 0); // todo: add overhang var? // togglePreferredX based on pre-packed weight distribution?
                over.SetWeights(0, region.stackingCapacity, region.stackingCapacity);
                if (newRegions === undefined) newRegions = [];
                newRegions.push(over);
            }

            // Calculate a new south region
            axis = this.z;
            size = region.z - axis;
            if (false) {
                var south = new Region(this.x, this.y, axis, this.width, this.height, size, 0); // todo togglePreferredX based on pre-packed weight distribution?
                south.SetWeights(0, this.weightCapacity, this.stackingCapacity);
                if (newRegions === undefined) newRegions = [];
                newRegions.push(south);
            }

            // Set this as new north/front region
            axis = region.z + region.length;
            size = this.z + this.length - axis;
            this.z = axis;
            this.length = size;
            this.SetWeights(0, this.weightCapacity, this.stackingCapacity);

            return newRegions;
        }

        /** @param {Region} other */

    }, {
        key: "ConnectFloorRects",
        value: function ConnectFloorRects(other) {
            var ptsA = this.GetFloorPoints(tempPoints),
                ptsB = other.GetFloorPoints(tempPoints2);

            var adjacent = 0;
            var intersections = [];
            for (var iA = 0; iA < 12; iA += 3) {
                var nextA = iA + 3 === 12 ? 0 : iA + 3;
                var ax = ptsA[iA],
                    az = ptsA[iA + 2],
                    nax = ptsA[nextA],
                    naz = ptsA[nextA + 2];

                for (var iB = 0; iB < 12; iB += 3) {
                    var nextB = iB + 3 === 12 ? 0 : iB + 3;
                    var bx = ptsB[iB],
                        bz = ptsB[iB + 2],
                        nbx = ptsB[nextB],
                        nbz = ptsB[nextB + 2];

                    if ((0, _Math2D.rectangleContainsPoint)(smallValue, ptsA[0], ptsA[2], ptsA[6] - ptsA[0], ptsA[8] - ptsA[2], bx, bz) || (0, _Math2D.rectangleContainsPoint)(smallValue, ptsB[0], ptsB[2], ptsB[6] - ptsB[0], ptsB[8] - ptsB[2], ax, az)) {
                        adjacent++;
                    }

                    var intersection = (0, _Math2D.linesIntersect)(ax, az, nax, naz, bx, bz, nbx, nbz);
                    if (intersection && ((0, _Math2D.rectangleContainsPoint)(smallValue, ptsA[0], ptsA[2], ptsA[6] - ptsA[0], ptsA[8] - ptsA[2], intersection.x, intersection.y) || (0, _Math2D.rectangleContainsPoint)(smallValue, ptsB[0], ptsB[2], ptsB[6] - ptsB[0], ptsB[8] - ptsB[2], intersection.x, intersection.y))) {
                        intersections.push(intersection);
                    }
                }
            }

            if (adjacent > 1) {
                for (var i = 0; i < 12; i += 3) {
                    intersections.push({ x: ptsA[i], y: ptsA[i + 2] }, { x: ptsB[i], y: ptsB[i + 2] });
                }
            } else {
                intersections.length = 0;
            }

            var rectangles = (0, _Math2D.rectanglesFromPoints)(intersections);

            var rectA = { p1: { x: ptsA[0], y: ptsA[2] }, p2: { x: ptsA[3], y: ptsA[5] }, p3: { x: ptsA[6], y: ptsA[8] }, p4: { x: ptsA[9], y: ptsA[11] } };
            var rectB = { p1: { x: ptsB[0], y: ptsB[2] }, p2: { x: ptsB[3], y: ptsB[5] }, p3: { x: ptsB[6], y: ptsB[8] }, p4: { x: ptsB[9], y: ptsB[11] } };
            rectangles.push(rectA, rectB);

            (0, _Math2D.reduceRectangles)(rectangles);

            setRectangleWeights(rectangles, this.weight + other.weight, this.weightCapacity + other.weightCapacity, this.stackingCapacity + other.stackingCapacity);

            return rectangles;
        }
    }, {
        key: "ToString",
        value: function ToString() {
            return format('R(p:[@, @, @], d:[@, @, @], w:@, wCap:@, sCap:@)', { nf: function nf(n) {
                    return numberFormat(n, 2);
                } }, this.x, this.y, this.z, this.width, this.height, this.length, this.weight, this.weightCapacity, this.stackingCapacity);
        }

        /**
         * Deepest to front, smallest to largest
         * @param {Region} a * @param {Region} b 
         */

    }, {
        key: "volume",
        get: function get() {
            return this.width * this.height * this.length;
        }
    }], [{
        key: "SortDeepestSmallest",
        value: function SortDeepestSmallest(a, b) {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            if (a.volume < b.volume) return -1;
            if (a.volume > b.volume) return 1;
            return 0;
        }
    }]);

    return Region;
}();

var tempRegion = new Region();
var tempCorners = [0];
var tempPoints = [0];
var tempPoints2 = [0];

exports.default = Region;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Volume2 = __webpack_require__(70);

var _Volume3 = _interopRequireDefault(_Volume2);

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _weightCapacity = Symbol('weightCapacity');
var type = 'ContainingVolume';

var ContainingVolume = function (_Volume) {
    _inherits(ContainingVolume, _Volume);

    /** @param {Container} container */
    function ContainingVolume(container) {
        _classCallCheck(this, ContainingVolume);

        var _this = _possibleConstructorReturn(this, (ContainingVolume.__proto__ || Object.getPrototypeOf(ContainingVolume)).call(this));

        _this.container = container;
        _this.weightCapacity = 0;

        _this.SetUID();
        return _this;
    }

    _createClass(ContainingVolume, [{
        key: "SetUID",


        /**
         * @param {string} [uid] - You'll rarely need to provide this
         */
        value: function SetUID(uid) {
            this.uid = uid || THREE.Math.generateUUID();
            return this.uid;
        }
    }, {
        key: "toJSON",
        value: function toJSON() {
            var json = _get(ContainingVolume.prototype.__proto__ || Object.getPrototypeOf(ContainingVolume.prototype), "toJSON", this).call(this);
            json.type = type;
            json.weightCapacity = this.weightCapacity;
            return json;
        }
    }, {
        key: "ToString",
        value: function ToString() {
            return _get(ContainingVolume.prototype.__proto__ || Object.getPrototypeOf(ContainingVolume.prototype), "ToString", this).call(this);
        }
    }, {
        key: "weightCapacity",
        set: function set(value) {
            this[_weightCapacity] = value;
        },
        get: function get() {
            return this[_weightCapacity];
        }
    }], [{
        key: "FromJSON",
        value: function FromJSON(data) {
            if (data.type !== type) console.warn('Data supplied is not: ' + type);

            var containingVolume = new ContainingVolume();
            containingVolume.weightCapacity = data.weightCapacity;
            _Volume3.default.FromJSON(data, containingVolume);

            return containingVolume;
        }
    }]);

    return ContainingVolume;
}(_Volume3.default);

exports.default = ContainingVolume;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    if (obj[endKey].setHex) {
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

            params = _Utils2.default.AssignUndefined(params, defaultEditParams);

            var controllers = [];
            var target = this.target;
            if (gui === undefined) {

                gui = new (window.dat || __webpack_require__(4).default).GUI({
                    autoPlace: true
                });
            } else if (label) {
                gui = gui.addFolder(label);
            }

            if (this.editing === undefined) {
                this.editing = {};

                this.Update = function () {
                    __webpack_require__(53);

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
                        __webpack_require__(53);

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
            if (shortcutsGUI === undefined) shortcutsGUI = new (window.dat || __webpack_require__(4).default).GUI({
                autoPlace: false
            });
            return shortcutsGUI;
        }
    }]);

    return Config;
}();

Config.Controller = Controller;

exports.default = Config;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CargoList = __webpack_require__(34);

var _CargoList2 = _interopRequireDefault(_CargoList);

var _PackingSpace = __webpack_require__(36);

var _PackingSpace2 = _interopRequireDefault(_PackingSpace);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _ContainingVolume = __webpack_require__(10);

var _ContainingVolume2 = _interopRequireDefault(_ContainingVolume);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} PackerParams
 * @property {import('../UX').default} ux
 * @property {Number} defaultStackingFactor
 */

/** @typedef {import('../packer/cub/CUB').CUBParams} CUBParams */

/** @typedef SolverParams
 * @property {CUBParams} algorithmParams
 * @property {string} algorithm default = 'cub'
 */

var PackedCargo =
/**
 * @param {BoxEntry} entry 
 * @param {ContainingVolume} containingVolume 
 * @param {THREE.Vector3} position 
 * @param {Number} orientation 
 */
function PackedCargo(entry, containingVolume, position, orientation) {
    _classCallCheck(this, PackedCargo);

    this.entry = entry;
    this.containingVolume = containingVolume;
    this.position = position;
    this.orientation = orientation;
};

var UnpackedCargo =
/**
 * @param {BoxEntry} entry 
 * @param {Number} unpackedQuantity
 */
function UnpackedCargo(entry, unpackedQuantity) {
    _classCallCheck(this, UnpackedCargo);

    this.entry = entry;
    this.unpackedQuantity = unpackedQuantity;
};

var PackingResult =
/** @param {Number} numTotalItem @param {Number} runtime */
function PackingResult(numTotalItems, runtime) {
    _classCallCheck(this, PackingResult);

    /** @type {Array<PackedCargo>} */
    this.packed = [];

    /** @type {Array<UnpackedCargo>} */
    this.unpacked = [];

    this.numTotalItems = numTotalItems || 0;

    this.runtime = runtime || -1;
};

/** @type {PackerParams} */


var defaultParams = {};
var signals = {
    packUpdate: 'packUpdate',
    packFailed: 'packFailed'
};

var _solverParams = Symbol('solverParams');

var epsilon = Math.pow(2, -52);

var Packer = function (_Signaler) {
    _inherits(Packer, _Signaler);

    /** @param {PackerParams} params */
    function Packer(params) {
        _classCallCheck(this, Packer);

        var _this = _possibleConstructorReturn(this, (Packer.__proto__ || Object.getPrototypeOf(Packer)).call(this));

        _this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        _this.packingSpace = new _PackingSpace2.default();
        _this.cargoList = new _CargoList2.default();

        _this.solverExecutionsCount = 0;
        return _this;
    }

    /** @param {PackerParams} extendedParams */


    _createClass(Packer, [{
        key: "Solve",


        /** @param {SolverParams} params */
        value: function Solve(params) {
            params = params || this[_solverParams];
            this[_solverParams] = params;

            this.solverExecutionsCount++;

            var algorithm = params.algorithm;
            var algorithmParams = params.algorithmParams;
            if (algorithm === 'cub') this.SolveCUB(algorithmParams);
        }

        /** @param {import('../packer/cub/CUB').CUBParams} params */

    }, {
        key: "SolveCUB",
        value: function () {
            var _ref = _asyncToGenerator(function* (params) {

                if (this.packingSpace.ready === false) {
                    this.Dispatch(signals.packFailed, 'Packing space not ready');
                    return;
                }

                if (this.cargoList.ready === false) {
                    this.Dispatch(signals.packFailed, 'Cargo list not ready');
                    return;
                }

                var Container = __webpack_require__(8).Container;
                var Item = __webpack_require__(8).Item;

                var containingVolume = this.packingSpace.current.volume;
                var d = containingVolume.dimensions;
                var container = new Container(containingVolume.uid, d.width, d.height, d.length, containingVolume.weightCapacity);

                var numTotalItems = 0;

                /** @type {Array<Item>} */
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
                        var validOrientations = entry.properties.rotation.enabled ? entry.properties.rotation.allowedOrientations : undefined;
                        var stackingCapacity = entry.properties.stacking.enabled ? entry.properties.stacking.capacity : entry.weight > epsilon ? entry.weight * this.params.defaultStackingFactor : Number.MAX_SAFE_INTEGER - 10;
                        var grounded = entry.properties.translation.enabled ? entry.properties.translation.grounded : false;
                        var item = new Item(entry.uid, d.width, d.height, d.length, entry.weight, entry.quantity, validOrientations, stackingCapacity, grounded);
                        items.push(item);
                        numTotalItems += entry.quantity;
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

                var CUB = __webpack_require__(71);
                var startTime = performance.now();
                var result = yield CUB.pack(container, items, params);
                var cubRuntime = performance.now() - startTime;

                var cubRuntime2Dec = Math.round(cubRuntime / 1000 * 100) / 100;
                var packingResult = new PackingResult(numTotalItems, cubRuntime2Dec);
                result.packedItems.forEach(function (packedItem) {
                    var entry = entries[packedItem.ref.id];
                    var position = new THREE.Vector3(packedItem.x + packedItem.packedWidth / 2, packedItem.y + packedItem.packedHeight / 2, packedItem.z + packedItem.packedLength / 2);
                    var orientation = Item.ResolveOrientation(packedItem.orientation);
                    var packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                    packingResult.packed.push(packedCargo);
                });

                result.unpackedItems.forEach(function (unpackedItem) {
                    var entry = entries[unpackedItem.id];
                    var unpackedQuantity = unpackedItem.quantity;
                    var unpackedCargo = new UnpackedCargo(entry, unpackedQuantity);
                    packingResult.unpacked.push(unpackedCargo);
                });

                this.Dispatch(signals.packUpdate, packingResult);
            });

            function SolveCUB(_x) {
                return _ref.apply(this, arguments);
            }

            return SolveCUB;
        }()
    }, {
        key: "extendedParams",
        set: function set(extendedParams) {
            this.params = _Utils2.default.AssignUndefined(this.params, extendedParams);
        }
    }, {
        key: "solveAgain",
        get: function get() {
            return this.solverExecutionsCount > 0;
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return Packer;
}(_Signaler3.default);

Packer.PackingResult = PackingResult;
Packer.PackedCargo = PackedCargo;
Packer.UnpackedCargo = UnpackedCargo;

exports.default = Packer;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PackedContainer = exports.PackedItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Components = __webpack_require__(8);

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var smallValue = .000001;

var PackedItem = function () {

    /**
     * @param {Item} ref 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} packedWidth
     * @param {Number} packedHeight
     * @param {Number} packedLength
     * @param {Number} orientation 
     */
    function PackedItem(ref, x, y, z, packedWidth, packedHeight, packedLength, orientation) {
        _classCallCheck(this, PackedItem);

        this.ref = ref;
        this.x = x;this.y = y;this.z = z;
        this.packedWidth = packedWidth;this.packedHeight = packedHeight;this.packedLength = packedLength;
        this.orientation = orientation;
    }

    /** @param {PackedItem} a * @param {PackedItem} b */


    _createClass(PackedItem, null, [{
        key: "DepthSort",
        value: function DepthSort(a, b) {
            var az = a.z + a.packedLength,
                bz = b.z + b.packedLength;
            if (az + smallValue < bz) return -1;
            if (az > bz + smallValue) return 1;
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            if (a.ref.volume > b.ref.volume + smallValue) return -1;
            if (a.ref.volume + smallValue < b.ref.volume) return 1;
            return 0;
        }

        /** @param {PackedItem} a * @param {PackedItem} b */

    }, {
        key: "Sort",
        value: function Sort(a, b) {
            if (a.z + smallValue < b.z) {
                if (a.z + a.packedLength > b.z && a.y > b.y) return 1;
                return -1;
            }
            if (b.z + smallValue < a.z) {
                if (b.z + b.packedLength > a.z && b.y > a.y) return 1;
                return 1;
            }
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            if (a.ref.volume > b.ref.volume + smallValue) return -1;
            if (a.ref.volume + smallValue < b.ref.volume) return 1;
            return 0;
        }
    }]);

    return PackedItem;
}();

var PackedContainer = function () {
    /**
     * @param {Container} container 
     */
    function PackedContainer(container) {
        _classCallCheck(this, PackedContainer);

        this.container = container;

        /** @type {Array<PackedItem>} */
        this.packedItems = [];
        /** @type {Array<Item>} */
        this.unpackedItems = [];

        this.cumulatedWeight = 0;
    }

    /** @param {PackedItem} item */


    _createClass(PackedContainer, [{
        key: "Pack",
        value: function Pack(item) {
            this.cumulatedWeight += item.ref.weight;
            this.packedItems.push(item);
        }

        /** @param {Item} item */

    }, {
        key: "Unpack",
        value: function Unpack(item) {
            this.unpackedItems.push(item);
        }

        /** @param {Number} weight */

    }, {
        key: "WeightPass",
        value: function WeightPass(weight) {
            return this.cumulatedWeight + weight <= this.container.weightCapacity;
        }

        /** @param {Region} placement */

    }, {
        key: "FitPass",
        value: function FitPass(placement) {
            var numPackedItems = this.packedItems.length;

            // Make sure that the new 'packed item to be' does not collide with a previous one
            for (var iPacked = 0; iPacked < numPackedItems; iPacked++) {
                var packedItem = this.packedItems[iPacked];
                // Creates temporary region for following calculations
                var packedRegion = tempRegion2.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, 0);
                packedRegion.SetWeights(packedItem.ref.weight, 0, packedItem.ref.stackingCapacity);

                var intersects = packedRegion.Intersects(-smallValue, placement);
                if (intersects) {
                    return false;
                }
            }

            return true;
        }
    }]);

    return PackedContainer;
}();

exports.PackedItem = PackedItem;
exports.PackedContainer = PackedContainer;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** SignalerCallback 
 * @callback SignalerCallback
 * @param {Array<*>} args
 */

var _signals = Symbol('signals');
var _dispatches = Symbol('dispatches');

var LightDispatcher = function () {
    function LightDispatcher() {
        _classCallCheck(this, LightDispatcher);

        this[_signals] = {};
        this[_dispatches] = {};
    }

    /** @param {string} event @param {SignalerCallback} callback */


    _createClass(LightDispatcher, [{
        key: 'On',
        value: function On(event, callback) {
            if (this[_signals][event] === undefined) {
                this[_signals][event] = [];
            }
            this[_signals][event].push(callback);
        }

        /** @param {string} event @param {SignalerCallback} callback */

    }, {
        key: 'Off',
        value: function Off(event, callback) {
            var callbacks = this[_signals][event];
            if (callbacks) {
                var index = callbacks.indexOf(callback);
                if (index != -1) {
                    callbacks.splice(index, 1);
                }
            }
        }

        /** @param {string} event @param {Array<*>} [args] */

    }, {
        key: 'Dispatch',
        value: function Dispatch(event) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            this[_dispatches][event] = args;
            var callbacks = this[_signals][event];
            if (callbacks) {
                for (var i = 0, len = callbacks.length; i < len; i++) {
                    callbacks[i].apply(callbacks, args);
                }
            }
        }
    }]);

    return LightDispatcher;
}();

exports.default = LightDispatcher;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var signals = {
    start: 'start',
    complete: 'complete'
};

var WizardStep = function (_Signaler) {
    _inherits(WizardStep, _Signaler);

    /**
     * 
     * @param {string} key 
     * @param {Object} data 
     */
    function WizardStep(key, data) {
        _classCallCheck(this, WizardStep);

        /**
         * @type {string}
         */
        var _this = _possibleConstructorReturn(this, (WizardStep.__proto__ || Object.getPrototypeOf(WizardStep)).call(this));

        _this.key = key;

        /**
         * @type {Object}
         */
        _this.data = data || {};
        return _this;
    }

    _createClass(WizardStep, [{
        key: 'Start',
        value: function Start(dataPass) {
            this.Dispatch(signals.start);
        }
    }, {
        key: 'Complete',
        value: function Complete(data) {
            this.Dispose();
            this.Dispatch(signals.complete, data);
        }
    }, {
        key: 'Dispose',
        value: function Dispose() {}
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return WizardStep;
}(_Signaler3.default);

exports.default = WizardStep;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Dom}
 */
var instance;

var Dom = function () {
    function Dom() {
        _classCallCheck(this, Dom);

        instance = this;
        //this.element = crel('div', {id:'UIDom', class:'UIOrigin UIExpand'});
        this.element = document.body;
    }

    /**
     * 
     * @param {HTMLElement} element 
     */


    _createClass(Dom, [{
        key: "Add",
        value: function Add(element) {
            this.element.appendChild(element.domElement);
        }
    }], [{
        key: "instance",
        get: function get() {
            return instance;
        }
    }]);

    return Dom;
}();

exports.default = Dom;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Input = __webpack_require__(58);

var _Input2 = _interopRequireDefault(_Input);

var _Quality = __webpack_require__(60);

var _Quality2 = _interopRequireDefault(_Quality);

var _Controller = __webpack_require__(42);

var _Controller2 = _interopRequireDefault(_Controller);

var _Renderer = __webpack_require__(61);

var _Renderer2 = _interopRequireDefault(_Renderer);

var _Camera = __webpack_require__(18);

var _Camera2 = _interopRequireDefault(_Camera);

var _HUDView = __webpack_require__(63);

var _HUDView2 = _interopRequireDefault(_HUDView);

var _UX = __webpack_require__(23);

var _UX2 = _interopRequireDefault(_UX);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

            var quality = new _Quality2.default().Common(2);

            var units = this.ux.params.units;
            var controllerParams = {};
            this.sceneController = new _Controller2.default(controllerParams);

            /** @type {import('../scene/Renderer').RendererParams} */
            var rendererParams = { clearColor: this.ux.params.backgroundColor };
            Object.assign(rendererParams, quality);
            this.sceneRenderer = new _Renderer2.default(rendererParams);
            this.sceneRenderer.renderer.toneMappingExposure = 1.6;
            this.domElement.appendChild(this.sceneRenderer.renderer.domElement);

            /** @type {import('./Camera').CameraParams} */
            var cameraParams = { fov: this.ux.params.fov, aspect: 1, near: 1 * units, far: 5000 * units };
            this.cameraController = new _Camera2.default(cameraParams);
            this.cameraController.OrbitControls(this.sceneRenderer.renderer.domElement);

            this.input = new _Input2.default(this.domElement);
            this.input.camera = this.cameraController.camera;

            var sceneRendererRef = this.sceneRenderer;
            var appCameraRef = this.cameraController.camera;
            this.input.onResize.push(function (screen) {
                sceneRendererRef.ReconfigureViewport(screen, appCameraRef);
            });

            // hud
            if (this.ux.params.hud) {
                /** @type {import('../view/HUDView').HUDViewParams} */
                var hudParams = { ux: this.ux, sceneSetup: this, container: this.sceneRenderer.renderer.domElement };
                /** @type {import('./Camera').CameraParams} */
                var hudCameraParams = _Utils2.default.AssignUndefined({ fov: 15 }, cameraParams);
                this.hud = new _HUDView2.default(hudParams, hudCameraParams);
                var hudCameraRef = this.hud.cameraController.camera;
                this.input.onResize.push(function (screen) {
                    sceneRendererRef.AdjustCamera(screen, hudCameraRef);
                });

                this.sceneRenderer.renderer.autoClear = false;
            }
            // /hud

            // Comeplete setup
            var setupParams = {
                gridHelper: false

                // Initial camera move
            };this.cameraController.position.x = 100 * units;
            this.cameraController.position.y = 100 * units;
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
                        hud.Update(timestamp);

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
            directionalLight.position.set(300 * units, 300 * units, 125 * units);

            controller.ambientContainer.add(ambientLight);
            controller.ambientContainer.add(directionalLight);

            var directionalLightComplem = new THREE.DirectionalLight(0xfeeedd);
            directionalLightComplem.position.set(-200 * units, 175 * units, 125 * units);

            controller.ambientContainer.add(directionalLightComplem);

            if (this.ux.params.configure && configure) {
                var onGUIChanged = function onGUIChanged() {
                    dl.shadow.camera.updateProjectionMatrix();
                    sceneRenderer.UpdateShadowMaps();
                    if (dl.shadow.map) {
                        if (dl.shadow.mapSize.manhattanDistanceTo(mapSize) > 0.0001) {
                            mapSize.copy(dl.shadow.mapSize);
                            dl.shadow.map.dispose();
                            dl.shadow.map = null;
                        }
                    }

                    if (helpers) {
                        dlHelper.update();
                        dlCameraHelper.update();
                    }
                };

                var Smart = __webpack_require__(28).default;
                var Config = __webpack_require__(11).default;
                var Control3D = __webpack_require__(29).default;

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

                var sceneRenderer = this.sceneRenderer;
                global.sceneRenderer = sceneRenderer;
                var mapSize = dl.shadow.mapSize.clone();


                _smart.Config.apply(_smart, ['Directional light + shadow', dl, onGUIChanged, Smart.serializeModes.json].concat(lightController, shadowControllers, _toConsumableArray(shadowCameraControllers)));
            }

            return [ambientLight, directionalLight, directionalLightComplem];
        }
    }, {
        key: 'Configure',
        value: function Configure() {

            var Smart = __webpack_require__(28).default;
            var Config = __webpack_require__(11).default;
            var Control3D = __webpack_require__(29).default;

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
                        console.log('position', _Utils2.default.VecToString(hud.cameraController.position, 1));
                        console.log('rotation', _Utils2.default.VecToString(hud.cameraController.rotation, 3));
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
}(_Signaler3.default);

exports.default = SceneSetup;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tween = __webpack_require__(19);

var _Tween2 = _interopRequireDefault(_Tween);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

__webpack_require__(62);

var epsilon = Math.pow(2, -52);

/**
 * @typedef {Object} CameraParams
 * @property {Number} fov
 * @property {Number} aspect
 * @property {Number} near
 * @property {Number} far
 */

/** @typedef FrameCoords @property {THREE.Vector3} position @property {THREE.Vector3} center */

/** @type {FrameCoords} */
var tempCoords = {};
/** @type {FrameCoords} */
var ownCoords = { position: new THREE.Vector3(), center: new THREE.Vector3() };

var tempVec3 = new THREE.Vector3(),
    tempVec3_b = new THREE.Vector3();

var signals = {
    change: 'change',
    userChange: 'userChange'
};

var Camera = function (_Signaler) {
    _inherits(Camera, _Signaler);

    /**
     * @param {CameraParams} params 
     */
    function Camera(params) {
        _classCallCheck(this, Camera);

        var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

        _this.params = params;

        _this.camera = new THREE.PerspectiveCamera(_this.params.fov, _this.params.aspect, _this.params.near, _this.params.far);
        _this.camera.name = 'UserCamera';

        _this.changed = false;

        _this.dollyAnimation = {
            enabled: false,
            position: _Tween2.default.Combo.RequestN(_Tween2.default.functions.ease.easeInOutQuad, .5, 0, 0, 0, 0, 0, 0),
            lookAt: _Tween2.default.Combo.RequestN(_Tween2.default.functions.ease.easeInOutQuad, .5, 0, 0, 0, 0, 0, 0)
        };

        var scope = _this;
        function onDollyAnimationComplete() {
            scope.dollyAnimation.enabled = false;
        }
        _this.dollyAnimation.position.onComplete = onDollyAnimationComplete;
        _this.dollyAnimation.lookAt.onComplete = onDollyAnimationComplete;

        _this.dollyAnimation.position.Hook(_this.position, 'x', 'y', 'z');

        _this.fovAnimation = {
            enabled: false,
            fov: new _Tween2.default(_Tween2.default.functions.ease.easeInOutQuad, 0, 0, 0)
        };

        function onFOVAnimationComplete() {
            scope.fovAnimation.enabled = false;
        }
        _this.fovAnimation.fov.onComplete = onFOVAnimationComplete;
        _this.fovAnimation.fov.Hook(_this.camera, 'fov');
        return _this;
    }

    _createClass(Camera, [{
        key: "FirstPersonControls",
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
        key: "OrbitControls",
        value: function OrbitControls(container, params) {
            if (this.orbitControls === undefined && container !== undefined) {

                var lookTarget = new THREE.Vector3();
                this.camera.getWorldDirection(lookTarget);
                lookTarget.multiplyScalar(200).add(this.camera.position);

                /** @type {THREE.EventDispatcher} */
                this.orbitControls = new THREE.OrbitControls(this.camera, container);
                this.orbitControls.target.copy(lookTarget);

                this.dollyAnimation.lookAt.Hook(this.orbitControls.target, 'x', 'y', 'z');

                var _scope = this;
                this.orbitControls.addEventListener('change', function (e) {
                    _scope.changed = true;
                });
                this.orbitControls.addEventListener('start', function (e) {
                    _scope.Dispatch(signals.userChange);
                });

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
                    this.saveState();
                    this.enabled = false;
                };
                this.orbitControls.Release = function () {
                    this.reset();
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
        key: "ToggleControls",
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

        /** @param {THREE.Vector3} position */

    }, {
        key: "SetTarget",
        value: function SetTarget(position) {
            if (this.controls instanceof THREE.OrbitControls) {
                this.controls.target.copy(position);
                this.changed = true;
            } else {
                console.warn('SetTarget not implemented for control type:', this.controls);
            }
        }

        /** @returns {THREE.Vector3} */

    }, {
        key: "GetTarget",
        value: function GetTarget() {
            if (this.controls instanceof THREE.OrbitControls) {
                return this.controls.target;
            } else {
                console.warn('GetTarget not implemented for control type:', this.controls);
            }
        }
    }, {
        key: "Update",
        value: function Update() {
            if (this.dollyAnimation.enabled) {
                this.dollyAnimation.position.Update();
                this.dollyAnimation.lookAt.Update();
                this.changed = true;
            }

            if (this.fovAnimation.enabled) {
                this.fovAnimation.fov.Update();
                this.camera.updateProjectionMatrix();
                this.changed = true;
            }

            if (this.controls !== undefined) {
                this.controls.Update();
            }
        }
    }, {
        key: "Hold",
        value: function Hold() {
            if (this.enabled && this.controls !== undefined && this.controls.Hold) {
                this.controls.Hold();
            }
        }
    }, {
        key: "Release",
        value: function Release() {
            if (!this.enabled && this.controls !== undefined && this.controls.Release) {
                this.controls.Release();
            }
        }

        /**
         * @param {THREE.Box3} box3 
         * @param {Number} [distanceMultiplier]
         * @param {THREE.Vector3} [orientation]
         * @param {Number} [fov] fov in degrees
         * @returns {FrameCoords}
         */

    }, {
        key: "CalcFrameCoords",
        value: function CalcFrameCoords(box3, distanceMultiplier, orientation, fov) {
            if (distanceMultiplier === undefined) distanceMultiplier = .75;

            fov = (fov || this.camera.fov) * (Math.PI / 180);

            var extent = tempVec3;
            box3.getSize(extent);
            var frameSize = Math.max(extent.x, extent.y, extent.z, 1);
            var distance = Math.abs(frameSize / Math.sin(fov / 2)) * distanceMultiplier;

            var center = tempVec3_b;
            box3.getCenter(center);

            var position = tempVec3;
            orientation = orientation ? orientation : position.subVectors(this.camera.position, center);
            position.copy(orientation).normalize().multiplyScalar(distance).add(center);
            position.y = Math.abs(position.y);

            tempCoords.position = position;
            tempCoords.center = center;
            return tempCoords;
        }

        /**
         * @param {THREE.Box3} box3 
         * @param {Number} [distanceMultiplier]
         */

    }, {
        key: "Frame",
        value: function Frame(box3, distanceMultiplier) {
            var coords = this.CalcFrameCoords(box3, distanceMultiplier);

            this.camera.position.copy(coords.position);
            this.SetTarget(coords.center);
        }

        /**
         * @param {Number} duration
         * @param {THREE.Box3} box3 
         * @param {Number} [distanceMultiplier]
         */

    }, {
        key: "TransitionToFrame",
        value: function TransitionToFrame(duration, box3, distanceMultiplier) {
            var endCoords = this.CalcFrameCoords(box3, distanceMultiplier);
            this.TransitionFromToCoords(duration, undefined, endCoords);
        }

        /**
         * @param {Number} duration
         * @param {FrameCoords} startCoords 
         * @param {FrameCoords} endCoords 
         */

    }, {
        key: "TransitionFromToCoords",
        value: function TransitionFromToCoords(duration, startCoords, endCoords) {

            if (!startCoords) {
                startCoords = ownCoords;
                startCoords.position.copy(this.position);
                startCoords.center.copy(this.orbitControls.target);
            }

            this.dollyAnimation.position.SetDurations(duration, duration, duration);
            this.dollyAnimation.lookAt.SetDurations(duration, duration, duration);

            var p = startCoords.position;
            this.dollyAnimation.position.SetStartValues(p.x, p.y, p.z);
            var tp = endCoords.position;
            this.dollyAnimation.position.SetDeltas(tp.x - p.x, tp.y - p.y, tp.z - p.z);

            p = startCoords.center;
            this.dollyAnimation.lookAt.SetStartValues(p.x, p.y, p.z);
            tp = endCoords.center;
            this.dollyAnimation.lookAt.SetDeltas(tp.x - p.x, tp.y - p.y, tp.z - p.z);

            this.dollyAnimation.position.Restart();
            this.dollyAnimation.lookAt.Restart();
            this.dollyAnimation.enabled = true;
        }

        /** @param {Number} duration @param {Number} fov */

    }, {
        key: "TransitionToFOV",
        value: function TransitionToFOV(duration, fov) {
            var deltaFOV = fov - this.camera.fov;
            if (Math.abs(deltaFOV) < epsilon) return;

            this.fovAnimation.fov.duration = duration;
            this.fovAnimation.fov.startValue = this.camera.fov;
            this.fovAnimation.fov.delta = deltaFOV;
            this.fovAnimation.fov.Restart();
            this.fovAnimation.enabled = true;
        }

        /**
         * @returns {Boolean}
         */

    }, {
        key: "position",
        get: function get() {
            return this.camera.position;
        },
        set: function set(value) {
            this.camera.position.copy(value);this.changed = true;
        }
    }, {
        key: "rotation",
        get: function get() {
            return this.camera.rotation;
        },
        set: function set(value) {
            this.camera.rotation.copy(value);this.changed = true;
        }
    }, {
        key: "enabled",
        get: function get() {
            return this.controls && this.controls.enabled;
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return Camera;
}(_Signaler3.default);

exports.default = Camera;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Pool = __webpack_require__(20);

var _Pool2 = _interopRequireDefault(_Pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var pool = new _Pool2.default(poolNewFN, poolResetFN);

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
        },

        /** @type {TweenCallback} */
        easeOutQuad: function easeOutQuad(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },

        /** @type {TweenCallback} */
        easeOutCubic: function easeOutCubic(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },

        easeInOutQuad: function easeInOutQuad(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b;
        }
    },

    special: {
        /** @type {TweenCallback} */
        pingPong: function pingPong(t, b, c, d) {
            return Math.sin(t / d * Math.PI) * c + b;
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

    /** @param {Array<Number>} args */


    _createClass(TweenCombo, [{
        key: "SetDurations",
        value: function SetDurations() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].duration = args[i];
            }
        }

        /** @param {Array<Number>} args */

    }, {
        key: "SetDeltas",
        value: function SetDeltas() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].delta = args[i];
            }
        }

        /** @param {Array<Number>} args */

    }, {
        key: "SetStartValues",
        value: function SetStartValues() {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].startValue = args[i];
            }
        }

        /**
         * @param {Object} object 
         * @param {Array<string>} properties 
         */

    }, {
        key: "Hook",
        value: function Hook(object) {
            for (var _len5 = arguments.length, properties = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                properties[_key5 - 1] = arguments[_key5];
            }

            for (var i = 0; i < this.tweens.length; i++) {
                this.tweens[i].Hook(object, properties[i]);
            };
        }
    }, {
        key: "Unhook",
        value: function Unhook() {
            this.tweens.forEach(function (tween) {
                return tween.Unhook();
            });
        }

        /** Restarts time */

    }, {
        key: "Restart",
        value: function Restart() {
            this.tweens.forEach(function (tween) {
                return tween.Restart();
            });
        }

        /**
         * Update tween
         * @param {Number} [t] [0, duration]
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
        value: function Request3(callback, duration, startValue0, delta0, startValue1, delta1, startValue2, delta2) {
            var tween0 = pool.Request();
            tween0.Reset(callback, startValue0, delta0, duration);

            var tween1 = pool.Request();
            tween1.Reset(callback, startValue1, delta1, duration);

            var tween2 = pool.Request();
            tween2.Reset(callback, startValue2, delta2, duration);

            var combo = new TweenCombo(tween0, tween1, tween2);
            return combo;
        }

        /**
         * @param {TweenCallback} callback 
         * @param {Number} duration 
         * @param {Array<Number>} args startValueN, deltaN
         */

    }, {
        key: "RequestN",
        value: function RequestN(callback, duration) {

            var tweens = [];
            for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2); i += 2) {
                var tween = pool.Request();
                tween.Reset(callback, arguments.length <= i + 2 ? undefined : arguments[i + 2], arguments.length <= i + 1 + 2 ? undefined : arguments[i + 1 + 2], duration);
                tweens.push(tween);
            }

            var combo = new (Function.prototype.bind.apply(TweenCombo, [null].concat(tweens)))();
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

            this.Restart();
        }

        /** Restarts time */

    }, {
        key: "Restart",
        value: function Restart() {
            this.completed = false;
            this.startTime = clock.getElapsedTime();
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
         * @param {Number} [t] [0, duration]
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

exports.default = Tween;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = Pool;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CargoView2 = __webpack_require__(22);

var _CargoView3 = _interopRequireDefault(_CargoView2);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var unitCubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
var materialTemplate = new _Asset2.default.SolidMaterialType({ roughness: 1, metalness: 0, flatShading: true });

var brightnessRange = [.45, .55];
var hueBase = Math.random();
function nextColor() {
    var color = new THREE.Color();
    color.setHSL(hueBase, 1, brightnessRange[0] + Math.random() * (brightnessRange[1] - brightnessRange[0]));
    hueBase = _Utils2.default.GoldenSeries(hueBase);
    return color;
}

var _materialSettings = Symbol('matSet');
var _color = Symbol('color');

var typeofNumber = 'number',
    typeofString = 'string';

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

        var colorHex = boxEntry.Description('color');
        _this[_color] = colorHex ? new THREE.Color(colorHex) : nextColor();
        boxEntry.Description('color', _this.color.getHex());

        material.color = _this.color;
        _this.mesh = new THREE.Mesh(unitCubeGeometry, material);
        _this.mesh.scale.copy(boxEntry.dimensions.vec3);

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

            if (this.labelView) this.labelView.view.position.z = params.width / 2 + this.entry.dimensions.length / 2;
        }
    }, {
        key: "ReflectEntry",
        value: function ReflectEntry() {
            this.entry = this.entry;
        }

        /** 
         * @param {string} value 
         * @param {import('./CargoView').CargoViewLabelParams} params */

    }, {
        key: "SetLabel",
        value: function SetLabel(value, params) {
            _get(CargoBoxView.prototype.__proto__ || Object.getPrototypeOf(CargoBoxView.prototype), "SetLabel", this).call(this, value, params);

            this.labelView.view.scale.y = params.height;
            this.labelView.view.scale.x = params.width;
            this.labelView.view.position.z = params.width / 2 + this.entry.dimensions.length / 2;
            this.labelView.view.position.y = .001;
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

            var colorHex = value.Description('color');
            if (colorHex) this.color = colorHex;
        }

        /** @param {Number} value */

    }, {
        key: "focus",
        set: function set(value) {
            _set(CargoBoxView.prototype.__proto__ || Object.getPrototypeOf(CargoBoxView.prototype), "focus", value, this);

            if (this[_materialSettings]) _Asset2.default.RestoreMaterial(this.mesh.material, this[_materialSettings]);

            if (Math.abs(1 - value) > .0001) {
                if (this[_materialSettings] === undefined) {
                    this.mesh.material = this.mesh.material.clone();
                    this[_materialSettings] = {};
                    _Asset2.default.SetMaterialFocus(this.mesh.material, value, this[_materialSettings]);
                } else {
                    _Asset2.default.SetMaterialFocus(this.mesh.material, value);
                }
            }
        },
        get: function get() {
            return _get(CargoBoxView.prototype.__proto__ || Object.getPrototypeOf(CargoBoxView.prototype), "focus", this);
        }

        /** @returns {THREE.Color} */

    }, {
        key: "color",
        get: function get() {
            return this[_color];
        }

        /** @param {Number} value hex */
        ,
        set: function set(value) {
            /** @type {THREE.Color} */
            var c = this[_color];
            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === typeofNumber) c.setHex(value);else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === typeofString) c.setHex(Number.parseInt(value));else c.copy(value);
            if (this[_materialSettings]) this[_materialSettings].color = c.getHex();else this.mesh.material.color = c;
            this.focus = _get(CargoBoxView.prototype.__proto__ || Object.getPrototypeOf(CargoBoxView.prototype), "focus", this);
        }
    }], [{
        key: "GetNextColor",
        value: function GetNextColor() {
            return nextColor();
        }
    }]);

    return CargoBoxView;
}(_CargoView3.default);

exports.default = CargoBoxView;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

var _TextLabelView = __webpack_require__(46);

var _TextLabelView2 = _interopRequireDefault(_TextLabelView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef CargoViewLabelParams
 * @property {Number} width
 * @property {Number} height
 */

var dummyGeometry = new THREE.SphereBufferGeometry(1, 4, 4);
var dummyMaterial = new _Asset2.default.TransparentMaterialType({ color: 0xff0000, transparent: true, opacity: .5 });

var _entry = Symbol('entry');
var _focus = Symbol('focus');

var CargoView = function () {
    /**
     * @param {CargoEntry} entry 
     */
    function CargoView(entry) {
        _classCallCheck(this, CargoView);

        this[_entry] = entry;

        /** @type {THREE.Mesh} */
        this.mesh;

        this.view = new THREE.Object3D();

        this[_focus] = 1;
    }

    /** @returns {CargoEntry} */


    _createClass(CargoView, [{
        key: "ReflectEntry",
        value: function ReflectEntry() {}

        /** @param {string} value @param {CargoViewLabelParams} params */

    }, {
        key: "SetLabel",
        value: function SetLabel(value, params) {
            var height = 64;
            var width = Math.floor(params.width / params.height * height);
            if (this.labelView === undefined) {
                /** @type {import('./TextLabelView').TLVParams} */
                var tlvParams = { font: '32px sans serif', backColor: 'rgb(0, 0, 0)', fontColor: 'rgb(255, 255, 255)',
                    textAlign: 'right', sidePadding: 16, width: width, height: height
                };
                var ratioToX = 64;

                this.labelView = new _TextLabelView2.default(tlvParams);
                this.labelView.view.rotateY(90 * Math.PI / 180);
                this.labelView.view.rotateX(-90 * Math.PI / 180);
                this.view.add(this.labelView.view);
            }

            this.labelView.UpdateText(value);
        }

        /**
         * @param {CargoEntry} entry 
         */

    }, {
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

        /** @param {Number} value */

    }, {
        key: "focus",
        set: function set(value) {
            this[_focus] = value;
        },
        get: function get() {
            return this[_focus];
        }
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

exports.default = CargoView;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Visualization = __webpack_require__(68);

var _Visualization2 = _interopRequireDefault(_Visualization);

var _User = __webpack_require__(89);

var _User2 = _interopRequireDefault(_User);

var _App = __webpack_require__(24);

var _App2 = _interopRequireDefault(_App);

var _Constants = __webpack_require__(90);

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef UXParams
 * @property {Boolean} hud default = true, create hud (hud currently disabled in api)
 * @property {Boolean} configure default = false, execute helpers that allow configuration
 * @property {Number} units default = 1, conversion to unit employed, default=1 for inches, for meters: units=0.0254
 * @property {Boolean} autoUpdatePack default = true, will auto-update the packing if entries are modified or deleted
 * @property {Number} backgroundColor default = 0xfefefe
 * @property {Constants.scaleRefFigure} scaleRefFigure default = man, human figure to show as scale reference
 * @property {Number} fov camera perspective fov
 */
var defaultParams = {
    hud: true,
    configure: false,
    units: 1,
    autoUpdatePack: true,
    backgroundColor: 0xfefefe,
    scaleRefFigure: _Constants2.default.scaleRefFigure.man,
    fov: 15
};

var UX = function () {
    /**
     * 
     * @param {UXParams} params 
     */
    function UX(params) {
        _classCallCheck(this, UX);

        this.params = _Utils2.default.AssignUndefined(params, defaultParams);
    }

    /** @ignore ignore */


    _createClass(UX, [{
        key: "_Bind",
        value: function _Bind(value) {
            /** @type {App} */
            var app = value;

            /** Interface with visual elements */
            this.visualization = new _Visualization2.default(app);

            /** Interface with user input/output */
            this.user = new _User2.default(app);
        }
    }]);

    return UX;
}();

UX.User = _User2.default;
UX.Visualization = _Visualization2.default;

exports.default = UX;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneSetup = __webpack_require__(17);

var _SceneSetup2 = _interopRequireDefault(_SceneSetup);

var _Packer = __webpack_require__(12);

var _Packer2 = _interopRequireDefault(_Packer);

var _View = __webpack_require__(79);

var _View2 = _interopRequireDefault(_View);

var _CargoInput = __webpack_require__(86);

var _CargoInput2 = _interopRequireDefault(_CargoInput);

var _PackingSpaceInput = __webpack_require__(87);

var _PackingSpaceInput2 = _interopRequireDefault(_PackingSpaceInput);

var _UX = __webpack_require__(23);

var _UX2 = _interopRequireDefault(_UX);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _PackerInterface = __webpack_require__(88);

var _PackerInterface2 = _interopRequireDefault(_PackerInterface);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _Resources = __webpack_require__(45);

var _Resources2 = _interopRequireDefault(_Resources);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

var _DomUI = __webpack_require__(52);

var _DomUI2 = _interopRequireDefault(_DomUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var signals = {
    start: 'start'
};

/**
 * @typedef AppParams
 * @property {UX} ux
 * @property {CargoInput} cargoInput
 * @property {PackingSpaceInput} packingSpaceInput
 * @property {PackerInterface} packerInterface
 * @property {Resources} resources
 */

var App = function (_Signaler) {
    _inherits(App, _Signaler);

    /**
     * 
     * @param {HTMLDivElement} containerDiv
     * @param {AppParams} params
     */
    function App(containerDiv, params) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        var scope = _this;

        _this.ux = params.ux;
        _this.cargoInput = params.cargoInput;
        _this.packingSpaceInput = params.packingSpaceInput;
        _this.packerInterface = params.packerInterface;
        _this.resources = params.resources;
        _Asset2.default.resources = _this.resources;

        /** @type {PackerParams} */
        var packerParams = { ux: _this.ux };
        _this.packer = new _Packer2.default(packerParams);
        _this.packer.extendedParams = _this.packerInterface.params;

        _this.cargoInput.On(_CargoInput2.default.signals.insert,
        /** @param {BoxEntry} boxEntry */
        function (boxEntry) {
            scope.packer.cargoList.Add(boxEntry);
        });

        _this.cargoInput.On(_CargoInput2.default.signals.modify,
        /** @param {BoxEntry} boxEntry */
        function (boxEntry) {
            scope.packer.cargoList.Modify(boxEntry);
            scope.SolveAgain();
        });

        _this.cargoInput.On(_CargoInput2.default.signals.remove,
        /** @param {BoxEntry} boxEntry */
        function (boxEntry) {
            scope.packer.cargoList.Remove(boxEntry.uid);
            scope.SolveAgain();
        });

        _this.packingSpaceInput.On(_PackingSpaceInput2.default.signals.containerLoaded,
        /** @param {Container} container */
        function (container) {
            scope.packer.packingSpace.AddContainer(container);
        });

        _this.packerInterface.On(_PackerInterface2.default.signals.solveRequest,
        /** @param {SolverParams} solverParams */
        function (solverParams) {
            scope.Solve(solverParams);
        });

        _this.domUI = new _DomUI2.default(containerDiv, _this.ux);
        _this.sceneSetup = new _SceneSetup2.default(_this.domUI.domElement ? _this.domUI.domElement : containerDiv, _this.ux);
        _this.sceneSetup.Init().then(_this.Start.bind(_this));
        return _this;
    }

    _createClass(App, [{
        key: 'Start',
        value: function Start() {
            var scope = this;
            var packerInterface = this.packerInterface;

            /** @type {import('./view/View').ViewParams} */
            var viewParams = { ux: this.ux };
            this.view = new _View2.default(this.packer, this.sceneSetup, this.domUI, viewParams);
            this.sceneSetup.Start();

            this.ux._Bind(this);
            this.cargoInput._Bind(this);
            this.packingSpaceInput._Bind(this);

            var resetColor = function resetColor() {};
            this.cargoInput.On(_CargoInput2.default.signals.show,
            /** @param {BoxEntry} boxEntry */
            function (boxEntry) {
                var existingEntry = scope.cargoInput.GetEntry(boxEntry.uid);
                if (existingEntry) {
                    resetColor();
                    var previewColorBackup = boxEntry.Description('color');
                    resetColor = function resetColor() {
                        boxEntry.Description('color', previewColorBackup);
                    };
                    boxEntry.Description('color', existingEntry.Description('color'));
                }
                scope.view.sceneSetup.hud.Preview(boxEntry);
            });

            function hideEntryPreview() {
                resetColor();
                scope.view.sceneSetup.hud.Preview(false);
            }
            this.cargoInput.On(_CargoInput2.default.signals.hide, hideEntryPreview);
            this.cargoInput.On(_CargoInput2.default.signals.insert, hideEntryPreview);
            this.cargoInput.On(_CargoInput2.default.signals.modify, hideEntryPreview);
            this.cargoInput.On(_CargoInput2.default.signals.remove, hideEntryPreview);

            /** @param {Packer.PackingResult} packingResult */
            function onPackUpdate(packingResult) {
                packerInterface._Notify(_PackerInterface2.default.signals.solved, packingResult);
            }
            this.packer.On(_Packer2.default.signals.packUpdate, onPackUpdate);

            /** @param {*} error */
            function onPackFailed(error) {
                packerInterface._Notify(_PackerInterface2.default.signals.failed, error);
            }
            this.packer.On(_Packer2.default.signals.packFailed, onPackFailed);

            this.Dispatch(signals.start);
        }
    }, {
        key: 'SolveAgain',
        value: function SolveAgain() {
            if (this.ux.params.autoUpdatePack && this.packer.solveAgain) this.Solve();
        }

        /** @param {SolverParams} [solverParams] */

    }, {
        key: 'Solve',
        value: function Solve(solverParams) {
            this.view.ClearPackingResults();
            this.packer.Solve(solverParams);
        }
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return App;
}(_Signaler3.default);

exports.default = App;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

var _Math2D = __webpack_require__(47);

var _CUBDebug = __webpack_require__(48);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** RegionFindCallback
 * @callback RegionFindCallback
 * @param {Region} region
 * @returns {Object | Boolean}
 */

/** @typedef Vec2 @property {Number} x @property {Number} y */

/** @typedef Rectangle @property {Vec2} p1 @property {Vec2} p2 @property {Vec2} p3 @property {Vec2} p4 
 * @property {Number} weight @property {Number} weightCapacity @property {Number} stackingCapacity 
 */

var smallValue = .000001;
var minRegionAxis = smallValue;

var RegionsTree = function () {
    /** @param {Region} root */
    function RegionsTree(root) {
        _classCallCheck(this, RegionsTree);

        this.regions = [root];
    }

    /** @param {Number} index */


    _createClass(RegionsTree, [{
        key: "Get",
        value: function Get(index) {
            return this.regions[index];
        }

        /** @param {RegionFindCallback} callback @param {*} thisArg */

    }, {
        key: "Find",
        value: function Find(callback, thisArg) {
            var numRegions = this.regions.length;

            for (var iRegion = 0; iRegion < numRegions; iRegion++) {
                var region = this.regions[iRegion];
                var search = callback.call(thisArg, region);
                if (search) return search;
            }

            return false;
        }

        /** @param {Region} region * @param {Region} fit * @returns {Boolean} false if region has been deleted */

    }, {
        key: "Occupy",
        value: function Occupy(region, fit) {
            var _regions;

            // Subtracts fit from region and calculates new bounding regions
            var newRegions = region.Subtract(fit, minRegionAxis);

            // Add new bounding regions if any
            if (newRegions) (_regions = this.regions).push.apply(_regions, _toConsumableArray(newRegions));

            // Check that region is still valid, otherwise remove it
            if (region.length < minRegionAxis) {
                var regionIndex = this.regions.indexOf(region);
                this.regions.splice(regionIndex, 1);
                return false;
            }

            var debugUIDs = [];
            if (!newRegions) newRegions = [];
            newRegions.push(region);
            //console.group('Occupy');
            newRegions.forEach(function (region) {
                //console.log(region.ToString());
                debugUIDs.push((0, _CUBDebug.debugRegion)(region, 0xffff0000, true, -1, true));
            });
            //console.groupEnd();

            (0, _CUBDebug.debugClear)(debugUIDs);

            return true;
        }

        /** @param {Number} width */

    }, {
        key: "ProcessRegionsPreferredX",
        value: function ProcessRegionsPreferredX(width) {
            var regions = this.regions,
                numRegions = regions.length;
            //let width = this.container.width;

            for (var iRegion = 0; iRegion < numRegions; iRegion++) {
                var region = regions[iRegion];

                if (Math.abs(region.x) < smallValue) region.preferredX = 0;else if (Math.abs(region.x + region.width - width) < smallValue) region.preferredX = 1;
            }
        }

        /** @param {Number} width @param {Number} height */

    }, {
        key: "ProcessRegionsMergeExpand",
        value: function ProcessRegionsMergeExpand(width, height) {
            var regions = this.regions,
                numRegions = regions.length;

            var toInt = 1 / smallValue;
            function coordID(value) {
                return Math.floor(value * toInt);
            }

            /** @typedef Level @property {Number} y @property {Array<Rectangle>} rectangles */
            /** @type {Array<Level>} */
            var levels = {};

            var neighbours = [],
                rectangles = [];
            for (var iRegion = 0; iRegion < numRegions; iRegion++) {
                var regionA = regions[iRegion];

                if (regionA.weightCapacity > smallValue) {
                    neighbours.length = 0;
                    neighbours.push(iRegion);

                    for (var jRegion = iRegion + 1; jRegion < numRegions; jRegion++) {
                        var regionB = regions[jRegion];

                        if (regionB.weightCapacity > smallValue && Math.abs(regionA.y - regionB.y) < smallValue) {
                            var intersects = regionA.Intersects(smallValue, regionB);
                            if (intersects) {
                                neighbours.push(jRegion);
                            }
                        }
                    }

                    var numNeighbours = neighbours.length;
                    if (numNeighbours > 1) {
                        rectangles.length = 0;

                        for (var iNeighbour = 0; iNeighbour < numNeighbours; iNeighbour++) {
                            var neighbourA = regions[neighbours[iNeighbour]];

                            for (var jNeighbour = iNeighbour + 1; jNeighbour < numNeighbours; jNeighbour++) {
                                var neighbourB = regions[neighbours[jNeighbour]];

                                var connectedNeighbours = neighbourA.ConnectFloorRects(neighbourB);
                                rectangles.push.apply(rectangles, _toConsumableArray(connectedNeighbours));
                            }
                        }

                        if (rectangles.length > 0) {
                            var _levels$yCat$rectangl;

                            var yCat = coordID(regionA.y);
                            if (levels[yCat] === undefined) levels[yCat] = { y: regionA.y, rectangles: [] };
                            (_levels$yCat$rectangl = levels[yCat].rectangles).push.apply(_levels$yCat$rectangl, rectangles);
                        }
                    }
                }
            }

            var levelsYCats = Object.keys(levels);
            for (var iYCat = 0, numYCats = levelsYCats.length; iYCat < numYCats; iYCat++) {
                /** @type {Level} */
                var level = levels[levelsYCats[iYCat]];
                var _rectangles = level.rectangles;
                var regionY = level.y;
                var regionHeight = height - regionY;

                (0, _Math2D.reduceRectangles)(_rectangles);
                for (var iRect = 0, numRects = _rectangles.length; iRect < numRects; iRect++) {
                    var rect = _rectangles[iRect];
                    var rx = rect.p1.x,
                        ry = rect.p1.y;
                    var rw = rect.p3.x - rx,
                        rh = rect.p3.y - ry;

                    // Calculate preferred packing side based on center point relative to container
                    var preferredX = rx.x + rw / 2 < width / 2 ? 0 : 1;
                    var newRegion = new _Region2.default(rx, regionY, ry, rw, regionHeight, rh, 0);
                    newRegion.SetWeights(rect.weight, rect.weightCapacity, rect.stackingCapacity);
                    this.regions.push(newRegion);
                }
            }
        }
    }, {
        key: "ProcessRegionsForZeroRegions",
        value: function ProcessRegionsForZeroRegions() {
            var regions = this.regions;
            for (var iRegion = 0; iRegion < regions.length; iRegion++) {
                var region = regions[iRegion];
                if (region.width < minRegionAxis || region.height < minRegionAxis || region.length < minRegionAxis) {
                    regions.splice(iRegion, 1);
                    iRegion--;
                }
            }
        }
    }, {
        key: "ProcessRegionsEnclosed",
        value: function ProcessRegionsEnclosed() {
            var regions = this.regions;

            for (var iRegion = 0; iRegion < regions.length; iRegion++) {
                var regionA = regions[iRegion];
                var volumeA = regionA.volume;

                for (var jRegion = iRegion + 1; jRegion < regions.length; jRegion++) {
                    var regionB = regions[jRegion];
                    var volumeB = regionB.volume;

                    if (volumeA < volumeB) {
                        // If a A is completely contained within B, remove the A
                        if (regionB.ContainsRegion(smallValue, regionA)) {
                            regions.splice(iRegion, 1);
                            iRegion--;
                            break;
                        }
                    } else {
                        // If a B is completely contained within A, remove the B
                        if (regionA.ContainsRegion(smallValue, regionB)) {
                            regions.splice(jRegion, 1);
                            jRegion--;
                        }
                    }
                }
            }
        }

        /** @param {Function} sortFunction */

    }, {
        key: "Sort",
        value: function Sort(sortFunction) {
            this.regions.sort(sortFunction);
        }
    }]);

    return RegionsTree;
}();

exports.default = RegionsTree;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Components = __webpack_require__(8);

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

var _PackedComponents = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HeuristicResult = function () {
    /** @param {Region} containingRegion @param {Region} packedRegion @param {Number} orientation */
    function HeuristicResult(containingRegion, packedRegion, orientation) {
        _classCallCheck(this, HeuristicResult);

        this.containingRegion = containingRegion;
        this.packedRegion = packedRegion;
        this.orientation = orientation;
    }

    /** @param {HeuristicResult} value */


    _createClass(HeuristicResult, [{
        key: "Copy",
        value: function Copy(value) {
            this.containingRegion = value.containingRegion;
            this.packedRegion = value.packedRegion;
            this.orientation = value.orientation;
        }
    }]);

    return HeuristicResult;
}();

/** @typedef {import('./CUB').PackingAssistantParams HeuristicParams} */

var _workingSet = Symbol('workingSet');

var Heuristic = function () {
    /** @param {HeuristicParams} params */
    function Heuristic(params) {
        _classCallCheck(this, Heuristic);

        this.params = params;
    }

    _createClass(Heuristic, [{
        key: "Init",
        value: function Init() {}
    }, {
        key: "Fit",


        /** @param {Item} item @returns {HeuristicResult} */
        value: function Fit(item) {}
    }, {
        key: "workingSet",
        set: function set(value) {
            this[_workingSet] = value;
            this.Init();
        },
        get: function get() {
            return this[_workingSet];
        }
    }]);

    return Heuristic;
}();

Heuristic.Result = HeuristicResult;

exports.default = Heuristic;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _CargoBoxView = __webpack_require__(21);

var _CargoBoxView2 = _interopRequireDefault(_CargoBoxView);

var _CargoView = __webpack_require__(22);

var _CargoView2 = _interopRequireDefault(_CargoView);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _CargoGroup = __webpack_require__(35);

var _CargoGroup2 = _interopRequireDefault(_CargoGroup);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

var _FloatingShelf = __webpack_require__(80);

var _FloatingShelf2 = _interopRequireDefault(_FloatingShelf);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _TextLabelView = __webpack_require__(46);

var _TextLabelView2 = _interopRequireDefault(_TextLabelView);

var _RaycastGroup = __webpack_require__(32);

var _RaycastGroup2 = _interopRequireDefault(_RaycastGroup);

var _Outline = __webpack_require__(81);

var _Outline2 = _interopRequireDefault(_Outline);

var _Tween = __webpack_require__(19);

var _Tween2 = _interopRequireDefault(_Tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef {Object} CargoListViewParams
 * @property {import('../UX').default} ux
 * @property {Number} outlineOffset
 */

/**
 * @typedef SortResult
 * @property {Number} min
 * @property {Number} max
 * @property {Number} cargoes
 */

var typeofString = 'string';
var epsilon = Math.pow(2, -52);

var _selectedEntryUID = Symbol('seUID');

/** @type {Map<CargoView, TextLabelView>} */
var labels = new Map();

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

var signals = {
    sort: 'sort',
    select: 'select',
    deselect: 'deselect',
    interact: 'interact'
};

/** @type {CargoListViewParams} */
var defaultParams = {
    outlineOffset: 4
};

var CargoListView = function (_Signaler) {
    _inherits(CargoListView, _Signaler);

    /**
     * @param {CargoListViewParams} params 
     */
    function CargoListView(params) {
        _classCallCheck(this, CargoListView);

        var _this = _possibleConstructorReturn(this, (CargoListView.__proto__ || Object.getPrototypeOf(CargoListView)).call(this));

        _this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        _this.view = new THREE.Object3D();
        _this.templatesView = new THREE.Object3D();
        _this.view.add(_this.templatesView);

        /** @type {Map<CargoGroup, CargoView>} */
        _this.cargoTemplateViews = new Map();

        var units = _this.params.ux.params.units;

        // Shelf
        /** @type {import('./components/FloatingShelf').FloatingShelfParams} */
        var fsParams = { padding: new THREE.Vector3(10 * units, (_this.params.outlineOffset + 1) * units, 10 * units), colorHex: _Asset2.default.ColorTemplates('Containers').Apply(0x000000) };
        _this.floatingShelf = new _FloatingShelf2.default(_this.templatesView, fsParams);
        _this.view.add(_this.floatingShelf.view);

        // Interaction
        _this.raycastGroupItems = [];
        _this.raycastGroup = new _RaycastGroup2.default(_this.raycastGroupItems, _this.OnInteract.bind(_this),
        /** @param {CargoView} item */
        function (item) {
            return item.view;
        }, false, true);

        _this.outline = new _Outline2.default({ color: 0xffffff, opacity: 1, offsetFactor: _this.params.outlineOffset * units });
        _this.view.add(_this.outline.view);

        // Transition
        _this.slidingAnimation = {
            enabled: false,
            position: _Tween2.default.Combo.RequestN(_Tween2.default.functions.ease.easeOutCubic, .5, 0, 0),
            originalPosition: new THREE.Vector3(0, 0, 0)
        };

        var scope = _this;
        function onAnimationComplete() {
            scope.slidingAnimation.enabled = false;
        }
        _this.slidingAnimation.position.onComplete = onAnimationComplete;

        _this.slidingAnimation.position.Hook(_this.view.position, 'y');
        return _this;
    }

    /**
     * @param {CargoGroup} group 
     */


    _createClass(CargoListView, [{
        key: "Add",
        value: function Add(group) {
            var units = this.params.ux.params.units;

            var templateCargoView = void 0;
            switch (group.entry.type) {
                case 'BoxEntry':
                    {
                        templateCargoView = new _CargoBoxView2.default(group.entry);

                        var ticketParams = { width: 50 * units, height: 20 * units };

                        var height = 96;
                        var width = Math.floor(ticketParams.width / ticketParams.height * height);
                        /** @type {import('./TextLabelView').TLVParams} */
                        var tlvParams = { font: '64px sans-serif', backColor: 'rgb(0, 0, 0)', fontColor: 'rgb(255, 255, 255)',
                            textAlign: 'left', sidePadding: 30, width: width, height: height
                        };

                        var labelView = new _TextLabelView2.default(tlvParams);
                        labelView.view.rotateY(90 * Math.PI / 180);
                        labelView.view.rotateX(-90 * Math.PI / 180);
                        labelView.view.scale.y = ticketParams.height;
                        labelView.view.scale.x = ticketParams.width;
                        /** @type {BoxEntry} */
                        var boxEntry = group.entry;
                        labelView.view.position.z = ticketParams.width / 2;
                        this.view.add(labelView.view);

                        labelView.UpdateText(boxEntry.quantity);

                        labels.set(templateCargoView, labelView);

                        break;
                    }

                default:
                    templateCargoView = _CargoView2.default.Dummy(group.entry);
                    _Logger2.default.Warn('group.entry.type not supported by viewer,', group);
                    break;
            }

            this.cargoTemplateViews.set(group, templateCargoView);
            this.templatesView.add(templateCargoView.view);

            this.raycastGroupItems.push(templateCargoView);
            this.raycastGroup.UpdateItems(this.raycastGroupItems);

            this.Sort();
            this.floatingShelf.Update();
        }

        /**
         * @param {CargoGroup} group 
         */

    }, {
        key: "UpdateGroup",
        value: function UpdateGroup(group) {
            var templateCargoView = this.cargoTemplateViews.get(group);
            templateCargoView.ReflectEntry();

            this.Sort();
            this.floatingShelf.Update();

            if (this[_selectedEntryUID] === group.entry.uid) this.SetOutline(templateCargoView);
        }

        /**
         * @param {CargoGroup} group 
         */

    }, {
        key: "Remove",
        value: function Remove(group) {
            var templateCargoView = this.cargoTemplateViews.get(group);
            if (templateCargoView) {

                var raycastGroupIndex = this.raycastGroupItems.indexOf(templateCargoView);
                if (raycastGroupIndex !== -1) this.raycastGroupItems.splice(raycastGroupIndex, 1);
                this.raycastGroup.UpdateItems(this.raycastGroupItems);

                this.cargoTemplateViews.delete(group);
                this.templatesView.remove(templateCargoView.view);

                if (this[_selectedEntryUID] === group.entry.uid) this.outline.box = false;

                this.Sort();
            }
        }

        /**
         * RaycastCallback
         * @param {CargoView} cargoView
         * @param {THREE.Intersection} intersection
         */

    }, {
        key: "OnInteract",
        value: function OnInteract(cargoView, intersection) {
            this.Dispatch(signals.interact, cargoView.entry);
        }

        /** @param {CargoView} cargoView */

    }, {
        key: "Select",
        value: function Select(entryUID) {

            this[_selectedEntryUID] = entryUID;

            if (!entryUID) {
                this.outline.box = false;
                this.Dispatch(signals.deselect);
            } else {
                var cargoView = this.GetTemplate(entryUID);
                this.SetOutline(cargoView);
                this.Dispatch(signals.select, cargoView.entry);
            }
        }

        /** @param {CargoView} target */

    }, {
        key: "SetOutline",
        value: function SetOutline(target) {
            this.outline.box = target instanceof _CargoBoxView2.default ? target.mesh : target.view;
        }
    }, {
        key: "SlideUp",
        value: function SlideUp(targetY, duration) {
            var deltaY = targetY - this.view.position.y;
            if (Math.abs(deltaY) < epsilon) return;

            this.slidingAnimation.position.SetDurations(duration);
            this.slidingAnimation.position.SetStartValues(this.view.position.y);
            this.slidingAnimation.position.SetDeltas(deltaY);
            this.slidingAnimation.position.Restart();
            this.slidingAnimation.enabled = true;
        }
    }, {
        key: "SlideDown",
        value: function SlideDown(duration) {
            var deltaY = this.slidingAnimation.originalPosition.y - this.view.position.y;
            if (Math.abs(deltaY) < epsilon) return;

            this.slidingAnimation.position.SetDurations(duration);
            this.slidingAnimation.position.SetStartValues(this.view.position.y);
            this.slidingAnimation.position.SetDeltas(deltaY);
            this.slidingAnimation.position.Restart();
            this.slidingAnimation.enabled = true;
        }
    }, {
        key: "Update",
        value: function Update() {
            if (this.slidingAnimation.enabled) {
                this.slidingAnimation.position.Update();
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
            if (id instanceof _CargoGroup2.default) {
                group = id;
            } else if (id instanceof _CargoEntry2.default) {
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
         * @param {CargoView} cargoView 
         * @param {string} value 
         * @param {string} textColor css
         */

    }, {
        key: "UpdateLabel",
        value: function UpdateLabel(cargoView, value, textColor) {
            var textLabelView = labels.get(cargoView);
            if (textLabelView) {
                if (textColor) textLabelView.params.fontColor = textColor;
                textLabelView.UpdateText(value);
            }
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

            this.view.updateMatrixWorld(true);
            var worldToLocal = new THREE.Matrix4().getInverse(this.templatesView.matrixWorld);
            var padding = 5 * units,
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

                cargoView.value.position.set(start, 0, 0);

                tempBox.setFromObject(cargoView.value.view);
                tempBox.applyMatrix4(worldToLocal);

                tempBox.getSize(tempVec);
                var halfSize = tempVec.x / 2;
                if (i > 0) offset += halfSize;

                cargoView.value.position.set(start + offset, tempVec.y / 2 + padding, -tempVec.z / 2);

                var labelView = labels.get(cargoView.value);
                labelView.view.position.x = cargoView.value.position.x;
                labelView.view.position.y = padding + 1 * units;

                offset += halfSize + padding;

                i++;
            }

            result.min = start;
            result.max = offset;
            result.cargoes = i;
            this.Dispatch(signals.sort, result);
        }
    }, {
        key: "SortMapBySize",
        value: function SortMapBySize() {
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
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return CargoListView;
}(_Signaler3.default);

exports.default = CargoListView;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _UIUtils = __webpack_require__(37);

var _Config2 = __webpack_require__(11);

var _Config3 = _interopRequireDefault(_Config2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import dat from "./datGUIConsole";

var serializeModes = _Config3.default.serializeModes;

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

        this.gui = new (window.dat || __webpack_require__(4).default).GUI({ autoPlace: false });
        this.draggable = new _UIUtils.Draggable(this.label, 250);
        this.draggable.Add(this.gui.domElement);
        this.draggable.closeBtn.onclick = function () {
            scope.Hide();
        };

        var ui = _UIUtils.Element.Add(this.draggable);
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
            _UIUtils.Element.AddStyle(this.draggable.domElement, _UIUtils.styles.UIWiggleAnim);
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

            this.config = new _Config3.default(target);

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
            _Config3.default.MakeShortcut(category, target.label, function () {
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

exports.default = Smart;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(85);

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

exports.default = Control3D;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Wizard2 = __webpack_require__(54);

var _Wizard3 = _interopRequireDefault(_Wizard2);

var _LoadRefStep = __webpack_require__(93);

var _LoadRefStep2 = _interopRequireDefault(_LoadRefStep);

var _ConfigureSpaceStep = __webpack_require__(95);

var _ConfigureSpaceStep2 = _interopRequireDefault(_ConfigureSpaceStep);

var _ExportStep = __webpack_require__(100);

var _ExportStep2 = _interopRequireDefault(_ExportStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var title = 'Containers wizard...';

var ContainersEditorWizard = function (_Wizard) {
    _inherits(ContainersEditorWizard, _Wizard);

    function ContainersEditorWizard() {
        _classCallCheck(this, ContainersEditorWizard);

        var loadRef = new _LoadRefStep2.default();
        var configureSpace = new _ConfigureSpaceStep2.default();
        var exporter = new _ExportStep2.default();

        var steps = [loadRef, configureSpace, exporter];

        return _possibleConstructorReturn(this, (ContainersEditorWizard.__proto__ || Object.getPrototypeOf(ContainersEditorWizard)).call(this, steps));
    }

    _createClass(ContainersEditorWizard, null, [{
        key: "title",
        get: function get() {
            return title;
        }
    }]);

    return ContainersEditorWizard;
}(_Wizard3.default);

exports.default = ContainersEditorWizard;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Element2 = __webpack_require__(39);

var _Element3 = _interopRequireDefault(_Element2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        var domStyle = 'left:' + left + 'px; top:' + top + 'px; width:' + width + 'px; background-color: rgba(0, 0, 0, .8)';
        dom = crel('div', { class: 'UIFitContent UIDraggable', style: domStyle });
        var head = crel('div');
        dom.appendChild(head);
        var header = crel('div', { onmousedown: startMoving, onmouseup: stopMoving, class: 'UIDHeader' }, title);

        var scope = _this;
        var close = function close() {
            scope.Close();
        };
        var closeBtn = crel('button', { onmouseup: close, class: 'UIDCloseButton' }, 'Close');
        head.appendChild(closeBtn);
        head.appendChild(header);

        dom.closeBtn = closeBtn;

        _this.domElement = dom;
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
}(_Element3.default);

exports.default = Draggable;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RaycastCallback
 * 
 * @callback RaycastCallback
 * @param {Object} obj
 * @param {THREE.Intersection} intersection
 */

/**
 * Mapping function
 * 
 * @callback RaycastMapping
 * @param {Object} obj
 */

var RaycastGroup = function () {

    /**
     * 
     * @param {Array<THREE.Object3D>} items 
     * @param {RaycastCallback} callback 
     * @param {RaycastMapping} collectionQuery 
     * @param {Boolean} updateProperty 
     * @param {Boolean} recursive 
     */
    function RaycastGroup(items, callback, collectionQuery, updateProperty, recursive) {
        _classCallCheck(this, RaycastGroup);

        /**
         * @type {Boolean}
         */
        this.enabled = true;

        this.items = items;
        this.callback = callback;
        this.updateProperty = updateProperty !== undefined ? updateProperty : false;
        this.recursive = recursive !== undefined ? recursive : false;

        if (collectionQuery === undefined) {
            this.raycastItems = this.items;
        } else {
            this.raycastItems = [];
            this.collectionQuery = collectionQuery;
            this.GetRaycastItems(this.collectionQuery);
        }
    }

    _createClass(RaycastGroup, [{
        key: 'GetRaycastItems',
        value: function GetRaycastItems(collectionQuery) {
            for (var iItem = 0; iItem < this.items.length; iItem++) {
                var rItem = collectionQuery(this.items[iItem]);
                if (rItem !== undefined) {
                    this.raycastItems.push(rItem);
                } else {
                    this.items.splice(iItem, 1);
                    Cik.Log('raycastItem is undefined, entry removed from .items array');
                }
            }
        }
    }, {
        key: 'UpdateItems',
        value: function UpdateItems(items, collectionQuery) {
            this.items = items;
            if (collectionQuery === undefined) collectionQuery = this.collectionQuery;

            if (collectionQuery === undefined) {
                this.raycastItems = this.items;
            } else {
                this.raycastItems.length = 0;
                this.collectionQuery = collectionQuery;
                this.GetRaycastItems(this.collectionQuery);
            }
        }
    }, {
        key: 'UpdateRaycastItems',
        value: function UpdateRaycastItems() {
            this.raycastItems.length = 0;
            for (var i = 0; i < this.items.length; i++) {
                var raycastItem = this.collectionQuery(this.items[i]);
                if (raycastItem) this.raycastItems.push(raycastItem);
            }
        }
    }, {
        key: 'Raycast',
        value: function Raycast(raycaster) {
            if (this.enabled === false) return;

            if (this.updateProperty) {
                this.UpdateRaycastItems();
            }

            var raycastItems = this.raycastItems;

            // if ( object.visible === false || object.parent === null) return; in THREE.Raycaster.intersectObject()
            var intersects = raycaster.intersectObjects(raycastItems, this.recursive);
            if (intersects.length > 0) {
                if (this.collectionQuery) {
                    var raycastItemIndex = this.BubbleUpForIndex(intersects[0].object, raycastItems);
                    if (raycastItemIndex !== -1) this.callback(this.items[raycastItemIndex], intersects[0]);
                } else {
                    this.callback(intersects[0].object, intersects[0]);
                }
            }
        }
    }, {
        key: 'BubbleUpForIndex',
        value: function BubbleUpForIndex(child, collection) {
            var nestLimit = 100;
            var numCollection = collection.length;
            while (child !== null && nestLimit-- > 0) {
                for (var i = 0; i < numCollection; i++) {
                    if (collection[i] === child) return i;
                }child = child.parent;
            }
            return -1;
        }
    }]);

    return RaycastGroup;
}();

exports.default = RaycastGroup;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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
            /** @type {Number} */
            this.width = width;
            /** @type {Number} */
            this.length = length;
            /** @type {Number} */
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

exports.default = Dimensions;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

var _CargoGroup = __webpack_require__(35);

var _CargoGroup2 = _interopRequireDefault(_CargoGroup);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stringType = 'string';

var signals = {
    groupAdded: 'groupAdded',
    groupRemoved: 'groupRemoved',
    groupModified: 'groupModified'
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
            var group = new _CargoGroup2.default(entry);

            this.groups.set(entry.uid, group);
            this.Dispatch(signals.groupAdded, group);
        }

        /** Adds a new CargoGroup
         * @param {CargoEntry} entry 
         */

    }, {
        key: "Modify",
        value: function Modify(entry) {
            var group = this.groups.get(entry.uid);
            this.Dispatch(signals.groupModified, group);
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

        /** @param {string} entryUID @returns {BoxEntry} the entry if it exists */

    }, {
        key: "GetEntry",
        value: function GetEntry(entryUID) {
            if (this.groups.has(entryUID)) return this.groups.get(entryUID).entry;
        }
    }, {
        key: "ready",
        get: function get() {
            return this.groups.size > 0;
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return CargoList;
}(_Signaler3.default);

exports.default = CargoList;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

var _Cargo = __webpack_require__(69);

var _Cargo2 = _interopRequireDefault(_Cargo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CargoGroup = function () {
    /**
     * 
     * @param {CargoEntry} entry
     */
    function CargoGroup(entry) {
        _classCallCheck(this, CargoGroup);

        this.entry = entry;

        /** @type {Array<Cargo>} */
        this.cargoes = [];

        this.template = new _Cargo2.default(this);
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

exports.default = CargoGroup;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    /** @param {Container} container */


    _createClass(PackingSpace, [{
        key: "AddContainer",
        value: function AddContainer(container) {
            this.containers.push(container);
            this[_currentIndex]++;

            this.Dispatch(signals.containerAdded, container);
        }

        /** @returns {Container} */

    }, {
        key: "current",
        get: function get() {
            var currentIndex = this[_currentIndex];
            if (currentIndex !== -1) {
                return this.containers[currentIndex];
            }
        }
    }, {
        key: "ready",
        get: function get() {
            return this[_currentIndex] !== -1;
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return PackingSpace;
}(_Signaler3.default);

exports.default = PackingSpace;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function stopPropagation(e) {
    e.stopPropagation();
}

var stylesheet;

/** @param {string|Array<string>} css */
function createCSS(css) {
    if (stylesheet === undefined) {
        stylesheet = document.createElement('style');
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
    if (css instanceof Array) css = css.join('\n');

    if (css.length > 1) stylesheet.innerHTML += css + '\n';
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

exports.styles = styles;
exports.Element = Element;
exports.Draggable = Draggable;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var IO = {

    FileInfo: function FileInfo(file) {
        return this.Filename(file.name);
    },

    Filename: function Filename(name) {
        var trailStartIndex = name.lastIndexOf('/');
        var trail = name.slice(trailStartIndex + 1);

        var extStartIndex = trail.lastIndexOf('.');
        var nameOnly = trail.slice(0, extStartIndex);
        var extension = trail.slice(extStartIndex + 1);

        return {
            name: nameOnly,
            extension: extension
        };
    },

    SaveUTF: function SaveUTF(text, filename) {
        download(text, filename, 'text/plain');
    },

    JSON: function (_JSON) {
        function JSON(_x, _x2) {
            return _JSON.apply(this, arguments);
        }

        JSON.toString = function () {
            return _JSON.toString();
        };

        return JSON;
    }(function (object, filename) {
        var blob = new Blob([JSON.stringify(object)], { type: 'text/plain;charset=utf-8' });
        if (filename === undefined && object.hasOwnProperty('name')) filename = object.name + '.json';
        saveAs(blob, filename);
    }),

    FileInput: crel('input', { type: 'file', style: 'display: none' }),

    GetFile: function GetFile(callback, binary) {
        var onFileChange = function onFileChange() {
            var file = this.files.length > 0 ? this.files[0] : undefined;
            if (file !== undefined) {
                if (binary) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        callback(e.target.result);
                    };
                    reader.readAsArrayBuffer(file);
                } else {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        callback(e.target.result);
                    };
                    reader.readAsText(file);
                }
            }
            IO.FileInput.removeEventListener('change', onFileChange);
            IO.FileInput = crel('input', { type: 'file', style: 'display: none' });
        };
        IO.FileInput.addEventListener('change', onFileChange, false);
        IO.FileInput.click();
    },

    UploadFile: function UploadFile(path, callback, failure) {
        var filename;
        var success = function success(response) {
            callback(filename);
        };
        var failure = failure || function (response) {
            console.log('Filename:', filename, ' - Failed to upload\n', response);
        };
        var onFile = function onFile(file) {
            filename = file.name;
            IO.PHPFileUpload(file, path, success, failure);
        };
        IO.GetFile(onFile);
    },

    XHRequest: function XHRequest(success, failure) {
        var req = false;
        try {
            // most browsers
            req = new XMLHttpRequest();
        } catch (e) {
            // IE
            try {
                req = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                // try an older version
                try {
                    req = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e) {
                    return false;
                }
            }
        }
        if (!req) return false;
        if (typeof success != 'function') success = function success() {};
        if (typeof failure != 'function') failure = function failure() {};
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                return req.status === 200 ? success(req.responseText) : failure(req.status);
            }
        };
        return req;
    },

    PHPClear: function PHPClear(dir, success, failure) {
        var vars = 'dir=' + encodeURIComponent(dir);

        var req = this.XHRequest(success, failure);
        req.open('POST', 'php/Clear.php', true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(vars);
        return req;
    },

    PHPZipExtract: function PHPZipExtract(file, path, success, failure) {
        var formData = new FormData();
        formData.append('path', path);
        formData.append('zip_file', file);

        var req = this.XHRequest(success, failure);
        req.open('POST', 'php/Zipper.php', true);
        req.send(formData);
        return req;
    },

    PHPFileUpload: function PHPFileUpload(file, path, success, failure) {
        var formData = new FormData();
        formData.append("path", path);
        formData.append("file", file);

        var req = this.XHRequest(success, failure);
        req.open("POST", "php/FileUploader.php", true);
        req.setRequestHeader("enctype", "multipart/form-data");
        req.send(formData);
        return req;
    }
};

exports.default = IO;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function stopPropagation(e) {
    e.stopPropagation();
}

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
        key: 'Hide',
        value: function Hide() {
            this.domElement.classList.add('UIHideMenu');
        }
    }, {
        key: 'Show',
        value: function Show() {
            this.domElement.classList.remove('UIHideMenu');
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
                attributes: typeof attributes === 'string' ? {
                    class: attributes
                } : attributes
            };
        }
    }, {
        key: 'Span',
        value: function Span(text, attributes) {
            var _span = this._Span(text, attributes);
            return crel(_span.type, _span.attributes, _span.label);
        }
    }]);

    return Element;
}();

exports.default = Element;

/***/ }),
/* 40 */
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = UpdateComponent;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = Controller;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _CargoBoxView = __webpack_require__(21);

var _CargoBoxView2 = _interopRequireDefault(_CargoBoxView);

var _CargoView = __webpack_require__(22);

var _CargoView2 = _interopRequireDefault(_CargoView);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Transition = __webpack_require__(67);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var epsilon = Math.pow(2, -52);

var tempBox3 = new THREE.Box3();
var tempVec3 = new THREE.Vector3();

/**
 * @typedef {Object} EntryInputViewParams
 * @property {import('../UX').default} ux
 * @property {SceneSetup} sceneSetup
 * @property {scaleFigure} scaleFigure
 */

var _scaleFigure = Symbol('scaleFigure');
var scaleFigure = {
    man: 'man',
    woman: 'woman',
    none: 'none'
};

/** @type {EntryInputViewParams} */
var defaultParams = {
    scaleFigure: scaleFigure.man
};

var EntryInputView = function () {
    /** @param {EntryInputViewParams} params */
    function EntryInputView(params) {
        _classCallCheck(this, EntryInputView);

        this.params = _Utils2.default.AssignUndefined(params, defaultParams);
        var scope = this;

        this.view = new THREE.Object3D();
        this.preview = new THREE.Object3D();
        this.view.add(this.preview);

        /** @type {Map<string, CargoView>} */
        this.previewTypes = new Map();

        var units = this.params.ux.params.units;
        this.offsetX = 0;

        // scale ref
        var height = 71 * units;

        var material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, side: THREE.DoubleSide });
        _Asset2.default.SetTextureMap('scaleref-alphaMap.jpg', material, 'alphaMap').then(function (alphaMap) {
            alphaMap.repeat.setX(.5);
        });

        var refMesh = new THREE.Mesh(new THREE.PlaneGeometry(height / 2, height, 1, 1), material);

        this.offsetX = 60 * units;
        refMesh.position.x = this.offsetX;

        this.view.add(refMesh);
        this.refMesh = refMesh;
        this.scaleFigure = this.params.scaleFigure;

        tempBox3.setFromObject(this.refMesh);
        tempBox3.getSize(tempVec3);
        this.offsetX -= tempVec3.x / 2;

        var bkgMesh = new THREE.Mesh(new THREE.PlaneGeometry(height * 6, height * 1.8, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, depthWrite: false, depthFunc: THREE.NeverDepth, side: THREE.DoubleSide }));

        bkgMesh.position.z = -2 * units;

        this.view.add(bkgMesh);

        this.rotate = false;

        this.transition = new _Transition.Transition(this.view, this.view, .25);
        this.slideIn = new _Transition.Slide('x', 1.2, 0);
        this.slideIn.Init(this.transition);
        this.slideOut = new _Transition.Slide('x', 0, 1.2);
        this.slideOut.Init(this.transition);
        /** @param {Slide} transitionController */
        function onTransitionComplete(transitionController) {
            if (transitionController === scope.slideOut) {
                scope.Hide();
            } else {
                scope.rotate = true;
            }
        }
        this.transition.On(_Transition.Transition.signals.complete, onTransitionComplete);

        this.Preview();
    }

    /** @param {scaleFigure} value */


    _createClass(EntryInputView, [{
        key: 'Preview',


        /**
         * @param {CargoEntry} entry 
         */
        value: function Preview(entry) {

            var valid = entry;

            if (valid) {
                if (entry instanceof _BoxEntry2.default) valid = entry.dimensions.volume > epsilon;
            }

            if (!valid) {
                this.End();
                return false;
            }

            var c = this.preview.children;
            while (c.length > 0) {
                this.preview.remove(c[c.length - 1]);
            }var units = this.params.ux.params.units;
            var offsetX = this.offsetX;

            if (entry instanceof _BoxEntry2.default) {
                /** @type {CargoBoxView} */
                var boxView = this.previewTypes.get(entry.type);
                if (boxView) {
                    boxView.entry = entry;
                } else {
                    boxView = new _CargoBoxView2.default(entry);
                    this.previewTypes.set(entry.type, boxView);

                    boxView.mesh.material = boxView.mesh.material.clone();
                    boxView.mesh.material.depthWrite = false;
                }

                boxView.mesh.renderOrder = Number.MAX_SAFE_INTEGER - 10;
                this.preview.add(boxView.view);

                this.preview.position.x = -Math.max(entry.dimensions.width, entry.dimensions.length) / 2 + offsetX;
                this.preview.position.y = entry.dimensions.height / 2 + tempBox3.min.y;
            }

            this.Start();
        }
    }, {
        key: 'Show',
        value: function Show() {
            this.view.visible = true;
        }
    }, {
        key: 'Start',
        value: function Start() {
            if (this.previewing === false) {
                this.rotate = false;
                this.transition.controller = this.slideIn;
                this.transition.Start();
            }
            this.Show();
        }
    }, {
        key: 'Hide',
        value: function Hide() {
            this.view.visible = false;
        }
    }, {
        key: 'End',
        value: function End() {
            if (this.previewing === true) {
                this.transition.controller = this.slideOut;
                this.transition.Start();
            }
        }
    }, {
        key: 'Update',


        /** @param {Number} now @param {Number} deltaTime */
        value: function Update(now, deltaTime) {
            if (this.previewing) {
                if (this.rotate) this.preview.rotateY(-Math.PI / 10 * deltaTime / 1000);
                this.transition.Update();
            }
        }
    }, {
        key: 'scaleFigure',
        set: function set(value) {
            this[_scaleFigure] = value;
            var refMesh = this.refMesh;
            if (refMesh instanceof THREE.Mesh) {
                /** @type {THREE.Texture} */
                var alphaMap = refMesh.material.alphaMap;
                if (value === scaleFigure.man) {
                    alphaMap.offset.setX(0);
                } else {
                    alphaMap.offset.setX(.5);
                }
            }
        },
        get: function get() {
            return this[_scaleFigure];
        }
    }, {
        key: 'previewing',
        get: function get() {
            return this.view.visible;
        }
    }], [{
        key: 'scaleFigure',
        get: function get() {
            return scaleFigure;
        }
    }]);

    return EntryInputView;
}();

exports.default = EntryInputView;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = TextField;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resources = function Resources() {
    _classCallCheck(this, Resources);

    this.texturesPath = '';
};

exports.default = Resources;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tlWatchTimer, tlWatchEntries;
function tlWatchUpdater() {
    for (var i = 0; i < tlWatchEntries.length; i++) {
        var entry = tlWatchEntries[i];
        var newValue = entry.owner[entry.propertyName];
        if (newValue !== entry.savedValue) {
            entry.savedValue = newValue;
            entry.tl.value = newValue;
        }
    };
}
function addTLWatch(tl, owner, propertyName) {
    if (tlWatchTimer === undefined) {
        tlWatchEntries = [];
        tlWatchTimer = setInterval(tlWatchUpdater, 200);
    }
    tlWatchEntries.push({ tl: tl, owner: owner, propertyName: propertyName, savedValue: null });
}

var _value = Symbol('value');
var typeofString = 'string';

var signals = {
    change: 'change'
};

var TextLabel = function (_Signaler) {
    _inherits(TextLabel, _Signaler);

    function TextLabel() {
        _classCallCheck(this, TextLabel);

        var _this = _possibleConstructorReturn(this, (TextLabel.__proto__ || Object.getPrototypeOf(TextLabel)).call(this));

        _this[_value] = '';
        return _this;
    }

    _createClass(TextLabel, [{
        key: "GetString",
        value: function GetString(v) {
            return v.ToString ? v.ToString() : v.toString();
        }
    }, {
        key: "Watch",
        value: function Watch(owner, propertyName) {
            addTLWatch(this, owner, propertyName);
        }
    }, {
        key: "value",
        get: function get() {
            return this[_value];
        }

        /** @param {string} v */
        ,
        set: function set(v) {
            if (v !== typeofString) v = this.GetString(v);

            var changed = this[_value] !== v;
            this[_value] = v;
            if (changed) this.Dispatch(signals.change, this);
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return TextLabel;
}(_Signaler3.default);

var defaultGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

/**
 * @typedef TLVParams
 * @property {string} font css 32px sans-serif
 * @property {string} textAlign start, end, left, right or center
 * @property {string} sidePadding px
 * @property {Number} fontColor css
 * @property {Number} backColor css
 * @property {Number} width px
 * @property {Number} height px
 */
/** @type {TLVParams} */
var defaultParams = {
    font: '32px sans-serif',
    textAlign: 'center',
    sidePadding: 16,
    fontColor: 0x000000,
    backColor: 0xffffff,
    width: 256,
    height: 64
};

var TextLabelView = function () {

    /** @param {TLVParams} params */
    function TextLabelView(params) {
        _classCallCheck(this, TextLabelView);

        this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        this.view = new THREE.Mesh(defaultGeometry, material);
    }

    /** @param {TextLabel} value */


    _createClass(TextLabelView, [{
        key: "OnChange",


        /** @param {TextLabel} textLabel */
        value: function OnChange(textLabel) {
            var text = textLabel.value;
            this.UpdateText(text);
        }

        /** @param {string} text */

    }, {
        key: "UpdateText",
        value: function UpdateText(text) {
            if (this.canvas2d === undefined) this.canvas2d = document.createElement('canvas');

            this.canvas2d.width = this.params.width;
            this.canvas2d.height = this.params.height;

            var context2d = this.canvas2d.getContext('2d');
            context2d.fillStyle = this.params.backColor;
            context2d.fillRect(0, 0, this.params.width + 2, this.params.height + 2);
            context2d.fillStyle = this.params.fontColor;
            context2d.font = this.params.font;
            context2d.textAlign = this.params.textAlign;
            context2d.textBaseline = 'middle';

            var x = this.params.textAlign === 'start' || this.params.textAlign === 'left' ? this.params.sidePadding : this.params.textAlign === 'end' || this.params.textAlign === 'right' ? this.params.width - this.params.sidePadding : this.params.width / 2;
            context2d.fillText(text, x, this.params.height / 2);

            //
            var mesh = this.view;
            /** @type {THREE.MeshBasicMaterial} */
            var material = mesh.material;
            if (!material.map) {
                material.map = new THREE.CanvasTexture(this.canvas2d);
                material.map.minFilter = THREE.LinearFilter;
                material.map.anisotropy = 1.4;
            } else {
                material.map.image = this.canvas2d;
            }
            material.map.needsUpdate = true;
        }
    }, {
        key: "textLabel",
        set: function set(value) {
            value.On(TextLabel.signals.change, this.OnChange.bind(this));
        }
    }]);

    return TextLabelView;
}();

TextLabelView.Label = TextLabel;

exports.default = TextLabelView;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/** @typedef Vec2 @property {Number} x @property {Number} y */
/** @typedef Rectangle @property {Vec2} p1 @property {Vec2} p2 @property {Vec2} p3 @property {Vec2} p4 */

var epsilon = Math.pow(2, -52);
var smallValue = .000001;
var smallValueSqrt = .001;

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function segmentIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if (x1 === x2 && y1 === y2 || x3 === x4 && y3 === y4) {
        return false;
    }

    var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (Math.abs(denominator) < epsilon) {
        return false;
    }

    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua > 0 || ua < 1 || ub > 0 || ub < 1) return false;

    // Return a object with the x and y coordinates of the intersection
    var x = x1 + ua * (x2 - x1);
    var y = y1 + ua * (y2 - y1);

    return { x: x, y: y };
}

function linesIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
    // Line AB represented as a1x + b1y = c1
    var a1 = by - ay,
        b1 = ax - bx;
    var c1 = a1 * ax + b1 * ay;

    // Line CD represented as a2x + b2y = c2
    var a2 = dy - cy,
        b2 = cx - dx;
    var c2 = a2 * cx + b2 * cy;

    var determinant = a1 * b2 - a2 * b1;

    // The lines are parallel
    if (Math.abs(determinant) < smallValue) return false;

    var x = (b2 * c1 - b1 * c2) / determinant;
    var y = (a1 * c2 - a2 * c1) / determinant;
    return { x: x, y: y };
}

function rectangleContainsPoint(offset, rx, ry, rw, rh, px, py) {
    var x = rx - offset,
        y = ry - offset,
        w = rw + offset * 2,
        h = rh + offset * 2;
    return px > x && px < x + w && py > y && py < y + h;
}

/** @param {Number} offset offsets the region by this before checking * @param {Region} subRegion */
function rectangleContainsRectangle(offset, rx, ry, rw, rh, ox, oy, ow, oh) {
    var x = rx - offset,
        y = ry - offset,
        w = rw + offset * 2,
        h = rh + offset * 2;
    return ox > x && ox + ow < x + w && oy > y && oy + oh < y + h;
}

/**
 * @param {Array<Vec2>} points
 */
function rectanglesFromPoints(points) {
    // Separate points in lists of 'y' coordinate, grouped by 'x' coordinate
    var toInt = Math.round(1 / smallValue);
    var xs = {};
    points.forEach(function (point) {
        var xCat = Math.floor(point.x * toInt);
        if (xs[xCat] === undefined) xs[xCat] = { x: point.x, ys: [] };
        var ys = xs[xCat].ys;
        var yCat = Math.floor(point.y * toInt);
        var insert = true;
        for (var iY = 0; iY < ys.length; iY++) {
            if (ys[iY].yCat === yCat) insert = false;
        }
        if (insert) ys.push({ yCat: yCat, y: point.y });
    });

    //console.log('xs:', xs);

    // Intersect lists
    function sortYCat(a, b) {
        if (a.yCat < b.yCat) return -1;
        if (a.yCat > b.yCat) return 1;
        return 0;
    }
    var xsKeys = Object.keys(xs);
    for (var iX = 0; iX < xsKeys.length; iX++) {
        var xCat = xs[xsKeys[iX]];
        xCat.ys.sort(sortYCat);
    }

    /** @typedef IntersectedX @property {Number} x1 @property {Number} x2 @property {Array<Number>} ys */
    /** @type {Array<IntersectedX>} */
    var intersectedXs = [];
    for (var _iX = 0; _iX < xsKeys.length; _iX++) {
        var xCat1 = xs[xsKeys[_iX]];
        var ys1 = xCat1.ys;
        for (var iX2 = _iX + 1; iX2 < xsKeys.length; iX2++) {
            var xCat2 = xs[xsKeys[iX2]];
            var ys2 = xCat2.ys;

            var yIntersect = [];
            var xIntersect = { x1: xCat1.x, x2: xCat2.x, ys: yIntersect };
            for (var iY1 = 0; iY1 < ys1.length; iY1++) {
                for (var iY2 = 0; iY2 < ys2.length; iY2++) {
                    if (ys1[iY1].yCat === ys2[iY2].yCat) {
                        yIntersect.push(ys1[iY1].y);
                        break;
                    }
                }
            }

            if (yIntersect.length > 1) intersectedXs.push(xIntersect);
        }
    }

    //console.log(intersectedXs);

    /** @type {Array<Rectangle>} */
    var rectangles = [];
    for (var iIX = 0; iIX < intersectedXs.length; iIX++) {
        var intersectedX = intersectedXs[iIX];
        var ys = intersectedX.ys;
        var x1 = intersectedX.x1,
            x2 = intersectedX.x2;
        for (var _iY = 0; _iY < ys.length; _iY++) {
            for (var _iY2 = _iY + 1; _iY2 < ys.length; _iY2++) {
                var p1 = { x: x1, y: ys[_iY] },
                    p2 = { x: x2, y: ys[_iY] },
                    p3 = { x: x2, y: ys[_iY2] },
                    p4 = { x: x1, y: ys[_iY2] };

                var rectangle = { p1: p1, p2: p2, p3: p3, p4: p4 };
                rectangles.push(rectangle);
            }
        }
    }

    return rectangles;
}

/**
 * @param {Array<Rectangle>} rectangles 
 * @returns {Array<Rectangle>} the array is edited in-place
 */
function reduceRectangles(rectangles) {
    for (var iRect = 0; iRect < rectangles.length; iRect++) {
        var ra = rectangles[iRect];
        var ax = ra.p1.x,
            ay = ra.p1.y;
        var aw = ra.p3.x - ax,
            ah = ra.p3.y - ay;
        for (var jRect = 0; jRect < rectangles.length; jRect++) {
            if (iRect !== jRect) {
                var rb = rectangles[jRect];
                var bx = rb.p1.x,
                    by = rb.p1.y;
                var bw = rb.p3.x - bx,
                    bh = rb.p3.y - by;
                if (rectangleContainsRectangle(smallValue, ax, ay, aw, ah, bx, by, bw, bh)) {
                    rectangles.splice(jRect, 1);
                    jRect--;
                    iRect = Math.max(0, jRect - 1);
                    break;
                }
            }
        }
    }
    return rectangles;
}

/** @param {Number} ax @param {Number} ay @param {Number} bx @param {Number} by @param {Number} x @param {Number} y */
function segmentContainsPoint(ax, ay, bx, by, x, y) {
    var vx = bx - ax,
        vy = by - ay,
        vxa = x - ax,
        vya = y - ay,
        vxb = x - bx,
        vyb = y - by;
    var d = Math.sqrt(vx * vx + vy * vy),
        da = Math.sqrt(vxa * vxa + vya * vya),
        db = Math.sqrt(vxb * vxb + vyb * vyb);
    return Math.abs(d - (da + db)) < smallValueSqrt;
}

exports.linesIntersect = linesIntersect;
exports.rectangleContainsPoint = rectangleContainsPoint;
exports.rectangleContainsRectangle = rectangleContainsRectangle;
exports.reduceRectangles = reduceRectangles;
exports.rectanglesFromPoints = rectanglesFromPoints;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debugging = undefined;
exports.sleep = sleep;
exports.debugLog = debugLog;
exports.keypress = keypress;
exports.debugRegion = debugRegion;
exports.debugClear = debugClear;
exports.numberFormat = numberFormat;
exports.format = format;

var _Debug = __webpack_require__(72);

var _Debug2 = _interopRequireDefault(_Debug);

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debugging = exports.debugging = false;

if (debugging) {
    _Debug2.default.app.sceneSetup.input.ListenKeys(['right', 'space']);
}

function sleep(ms, force) {
    return new Promise(function (resolve) {
        if (debugging || force) setTimeout(resolve, ms);else resolve();
    });
}

function debugLog() {
    var _console;

    (_console = console).log.apply(_console, arguments);
}

function keypress(ms, force) {
    return new Promise(function (resolve) {
        if (debugging || force) {
            var execute = function execute() {
                if (tid !== undefined) clearTimeout(tid);
                removeEventListener('keydown', execute);
                resolve();
            };

            var tid = undefined;

            if (ms && ms > 0) tid = setTimeout(execute, ms);
            addEventListener('keydown', execute);
        } else {
            resolve();
        }
    });
}

/**
 * @param {Region} region * @param {Number} color 
 */
function debugRegion(region, color, solid, duration, checkered) {
    var x = region.x,
        y = region.y,
        z = region.z,
        w = region.width,
        h = region.height,
        l = region.length;
    var debugUID = _Debug2.default.Viz.DrawVolume(x + w / 2, y + h / 2, z + l / 2, w, h, l, color || 0xaaffff, duration || -1, !Boolean(solid), checkered);
    return debugUID;
}

/** @param {Array<string>} */
function debugClear(uids) {
    if (uids) {
        uids.forEach(function (uid) {
            _Debug2.default.Viz.RemoveObjectByUID(uid);
        });
    } else {
        _Debug2.default.Viz.ClearAll();
    }
}

function numberFormatDefault(n) {
    return n;
}

function numberFormat(n, d) {
    if (n > Number.MAX_SAFE_INTEGER - 2) return 'MAX';
    var nStr = Math.round(n) !== n ? n.toFixed(d) : n;
    return nStr;
}

/** @typedef FormatParams @property {Function} nf number formatting function */
/** @param {string} str @param {FormatParams} params @param {Array<*>} args */
function format(str, params) {
    if (params.nf === undefined) params.nf = numberFormatDefault;
    var index = 0;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    while ((index = str.indexOf('@', index)) !== -1) {
        if (str[index - 1] !== '\\') {
            var a = args.shift();
            if (typeof a === 'number') a = params.nf(a);
            str = str.replace('@', a);
        }
        index += 1;
    }
    return str;
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _ContainerView = __webpack_require__(50);

var _ContainerView2 = _interopRequireDefault(_ContainerView);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _ContainingVolume = __webpack_require__(10);

var _ContainingVolume2 = _interopRequireDefault(_ContainingVolume);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
            var containerView = _ContainerView2.default.Request(container);
            this.view.add(containerView.view);
            this.containerViews.push(containerView);
        }
    }, {
        key: "Clear",
        value: function Clear() {
            for (var i = 0; i < this.containerViews.length; i++) {
                var cv = this.containerViews[i];
                this.view.remove(cv.view);
            }
            this.containerViews.length = 0;
        }

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

exports.default = PackingSpaceView;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _ContainingVolume = __webpack_require__(10);

var _ContainingVolume2 = _interopRequireDefault(_ContainingVolume);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContainerBox =
/** @param {THREE.Mesh} mesh */
function ContainerBox(mesh) {
    _classCallCheck(this, ContainerBox);

    this.mesh = mesh;
};

/**
 * 
 * @param {Container} container 
 */


function createContainerBoxes(container) {
    /**
     * @type {Map<ContainingVolume, ContainerBox>}
     */
    var boxes = new Map();

    container.volumes.forEach(function (cv) {
        var mesh = _Asset2.default.CreateMesh();

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

        boxes.set(cv, new ContainerBox(mesh));
    });

    return boxes;
}

var tempVec3 = new THREE.Vector3();

/** @type {WeakMap<Container, ContainerView>} */
var views = new WeakMap();

var ContainerView = function () {
    /**
     * 
     * @param {Container} container 
     * @param {THREE.Object3D} view
     */
    function ContainerView(container, view) {
        _classCallCheck(this, ContainerView);

        // Store original dimensions
        this.initializationBox3 = new THREE.Box3();
        this.initializationBox3.setFromObject(view);

        views.set(container, this);

        this.container = container;
        this.view = new THREE.Object3D();
        this.view.add(view);

        _Asset2.default.StandardSceneObject(this.view);
        _Asset2.default.ColorTemplates('Containers').Apply(this.view);

        this.containerBoxes = createContainerBoxes(container);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.containerBoxes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2),
                    cv = _step$value[0],
                    box = _step$value[1];

                box.mesh.position.add(cv.position);
                this.view.add(box.mesh);
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

    //** @param {Input} input @param {Camera} cameraController */
    /*InitSliderBoxes(input, cameraController, changeCallback, stopCallback){
        for(var box of this.containerBoxes.values()){
            box.UseInput(input, cameraController);
            box.On(sliderSignals.change, changeCallback);
            box.On(sliderSignals.stop, stopCallback);
        }
    }*/

    /**
     * @param {Boolean} visible
     * @param {THREE.Vector3} [padding]
     */


    _createClass(ContainerView, [{
        key: "PlatformVisibility",
        value: function PlatformVisibility(visible, padding) {

            if (visible && this.platformMesh === undefined) {

                if (padding === undefined) padding = new THREE.Vector3(0, .01, 0);

                this.initializationBox3.getSize(tempVec3);

                var planeGeom = new THREE.BoxGeometry(tempVec3.x + padding.x * 2, padding.y, tempVec3.z + padding.z * 2, 1, 1, 1);
                var planeMaterial = new _Asset2.default.CreateSolidMaterialMatte(_Asset2.default.ColorTemplates('Containers').Apply(0xffffff));
                this.platformMesh = new THREE.Mesh(planeGeom, planeMaterial);
                _Asset2.default.ReceiveShadow(this.platformMesh);

                this.platformMesh.position.y = .001;
                this.view.add(this.platformMesh);
            }

            this.platformMesh.visible = visible;
        }

        /**
         * @param {Container} container
         * @returns {ContainerView}
         */

    }], [{
        key: "Request",
        value: function Request(container) {
            var view = views.get(container);
            if (!view) {
                var boxes = createContainerBoxes(container);
                var object3d = new THREE.Object3D();
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = boxes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2),
                            cv = _step2$value[0],
                            box = _step2$value[1];

                        box.mesh.position.add(cv.position);
                        object3d.add(box.mesh);
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

                view = new ContainerView(container, object3d);
                views.set(container, view);
                _Logger2.default.Warn('View not found for:', container);
            }
            return view;
        }
    }]);

    return ContainerView;
}();

exports.default = ContainerView;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _CargoListView = __webpack_require__(27);

var _CargoListView2 = _interopRequireDefault(_CargoListView);

var _CargoView = __webpack_require__(22);

var _CargoView2 = _interopRequireDefault(_CargoView);

var _Pool = __webpack_require__(20);

var _Pool2 = _interopRequireDefault(_Pool);

var _PackedCargoBoxView = __webpack_require__(82);

var _PackedCargoBoxView2 = _interopRequireDefault(_PackedCargoBoxView);

var _PackingSpaceView = __webpack_require__(49);

var _PackingSpaceView2 = _interopRequireDefault(_PackingSpaceView);

var _Tween = __webpack_require__(19);

var _Tween2 = _interopRequireDefault(_Tween);

var _Packer = __webpack_require__(12);

var _Packer2 = _interopRequireDefault(_Packer);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

/**
 * @typedef {Object} PackResultViewParams
 * @property {import('../UX').default} ux
 * @property {Number} animationDuration
 */

/** @type {PackResultViewParams} */
var defaultParams = {
    animationDuration: 1
};

/**
 * @param {CargoView} cargoView
 * @returns {PackedCargoBoxView}
 */
function poolNewFN(cargoView) {
    //console.log('pool new', cargoView);
    var packedCargoView = new _PackedCargoBoxView2.default(cargoView.entry);
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

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

var signals = {
    packVizStart: 'packVizStart',
    packVizEnd: 'packVizEnd',
    cargoVizCreate: 'cargoVizCreate',
    cargoVizPack: 'cargoVizPack',
    cargoVizUnpack: 'cargoVizUnpack'
};

var PackResultView = function (_Signaler) {
    _inherits(PackResultView, _Signaler);

    /**
     * @param {CargoListView} cargoListView
     * @param {PackingSpaceView} packingSpaceView
     * @param {PackResultViewParams} params 
     */
    function PackResultView(cargoListView, packingSpaceView, params) {
        _classCallCheck(this, PackResultView);

        var _this = _possibleConstructorReturn(this, (PackResultView.__proto__ || Object.getPrototypeOf(PackResultView)).call(this));

        _this.cargoListView = cargoListView;
        _this.packingSpaceView = packingSpaceView;
        _this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        /** @type {Array<CargoView} */
        _this.cargoViews = [];
        _this.view = new THREE.Object3D();

        _this.pool = new _Pool2.default(poolNewFN, poolResetFN);

        /** @type {Array<Tween>} */
        _this.animatingViews = [];

        if (typeof window.Pizzicato !== 'undefined') {
            var musipack = new (__webpack_require__(83).default)(_this);
        }
        return _this;
    }

    /** 
     * @param {Packer.PackingResult} packingResult
     */


    _createClass(PackResultView, [{
        key: 'DisplayPackingResult',
        value: function () {
            var _ref = _asyncToGenerator(function* (packingResult) {
                var _this2 = this;

                this.Dispatch(signals.packVizStart, packingResult);

                var scope = this;
                var units = this.params.ux.params.units;

                var containingVolume = packingResult.packed[0].containingVolume;
                var matrix = this.packingSpaceView.GetMatrix(containingVolume);
                var offset = new THREE.Vector3();
                var orientation = new THREE.Quaternion();
                var scale = new THREE.Vector3();
                matrix.decompose(offset, orientation, scale);

                /** @type {Map<CargoView, Number>} */
                var packedQuantities = new Map();

                var animatingViews = this.animatingViews;
                var view = this.view;
                //let onTweenComplete = this.OnCargoFirstTweenComplete.bind(this);
                var zEntry = containingVolume.dimensions.length;
                var numPackedItems = packingResult.packed.length;
                var delayPerItem = this.params.animationDuration * 1000 / numPackedItems;

                var _loop = function* _loop(i) {
                    var item = packingResult.packed[i];
                    var cargoViewTemplate = _this2.cargoListView.GetTemplate(item.entry);

                    var packedQuantity = packedQuantities.get(cargoViewTemplate);
                    var totalQuantity = cargoViewTemplate.entry.quantity;
                    if (packedQuantity === undefined) packedQuantities.set(cargoViewTemplate, packedQuantity = 0);
                    packedQuantities.set(cargoViewTemplate, ++packedQuantity);
                    var textColor = packedQuantity === totalQuantity ? 'rgb(255, 255, 255)' : 'rgb(255, 0, 0)';
                    _this2.cargoListView.UpdateLabel(cargoViewTemplate, packedQuantity + '/' + totalQuantity, textColor);

                    var packedCargoView = _this2.pool.Request(cargoViewTemplate);

                    _this2.cargoViews.push(packedCargoView);

                    var rotation = getOrientationEuler(item.orientation);
                    packedCargoView.SetRotationAngles(rotation.x, rotation.y, rotation.z);

                    var x = item.position.x + offset.x,
                        y = item.position.y + offset.y,
                        z = item.position.z + offset.z;

                    var posTweenCombo = _Tween2.default.Combo.RequestN(_Tween2.default.functions.ease.easeOutQuad, .5, x, 0, y, 0, zEntry, z - zEntry);

                    function onTweenComplete(tween) {
                        scope.Dispatch(signals.cargoVizPack, item);
                        scope.OnCargoFirstTweenComplete(tween);
                    }

                    posTweenCombo.extraData = packedCargoView;
                    posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
                    posTweenCombo.onComplete = onTweenComplete;
                    posTweenCombo.Update(0);
                    animatingViews.push(posTweenCombo);

                    view.add(packedCargoView.view);
                    yield sleep(delayPerItem);
                };

                for (var i = 0; i < numPackedItems; i++) {
                    yield* _loop(i);
                }

                yield sleep(500);

                var unpackedOffset = 6 * units;

                var _loop2 = function* _loop2(i, numUnpackedItems) {
                    var item = packingResult.unpacked[i];
                    var cargoViewTemplate = _this2.cargoListView.GetTemplate(item.entry);

                    var totalQuantity = cargoViewTemplate.entry.quantity;
                    if (packedQuantities.has(cargoViewTemplate) === false) {
                        var textColor = false ? 'rgb(255, 255, 255)' : 'rgb(255, 0, 0)';
                        _this2.cargoListView.UpdateLabel(cargoViewTemplate, '0/' + totalQuantity, textColor);
                    }

                    if (i === 0) unpackedOffset += item.entry.dimensions.width / 2;

                    for (var j = 0; j < item.unpackedQuantity; j++) {
                        var onTweenComplete = function onTweenComplete(tween) {
                            scope.Dispatch(signals.cargoVizUnpack, item);
                            scope.OnCargoFirstTweenComplete(tween);
                        };

                        var packedCargoView = _this2.pool.Request(cargoViewTemplate);

                        _this2.cargoViews.push(packedCargoView);

                        var x = containingVolume.dimensions.width * 1.5 + unpackedOffset + offset.x,
                            y = item.entry.dimensions.height / 2 + offset.y,
                            z = item.entry.dimensions.length * j + offset.z;

                        var posTweenCombo = _Tween2.default.Combo.RequestN(_Tween2.default.functions.ease.easeOutQuad, .5, x, 0, y, 0, zEntry, z - zEntry);

                        posTweenCombo.extraData = packedCargoView;
                        posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
                        posTweenCombo.onComplete = onTweenComplete;
                        posTweenCombo.Update(0);
                        animatingViews.push(posTweenCombo);

                        view.add(packedCargoView.view);
                        yield sleep(delayPerItem * .5);
                    }

                    unpackedOffset += item.entry.dimensions.width + 6 * units;
                };

                for (var i = 0, numUnpackedItems = packingResult.unpacked.length; i < numUnpackedItems; i++) {
                    yield* _loop2(i, numUnpackedItems);
                }
            });

            function DisplayPackingResult(_x) {
                return _ref.apply(this, arguments);
            }

            return DisplayPackingResult;
        }()

        /** @param {Tween|Tween.Combo} tween */

    }, {
        key: 'OnCargoFirstTweenComplete',
        value: function OnCargoFirstTweenComplete(tween) {
            var packedCargoView = tween.extraData;
            this.OnTweenComplete(tween);
            var scaleTweenCombo = _Tween2.default.Combo.RequestN(_Tween2.default.functions.special.pingPong, .1, 1, .1, 1, .1, 1, .1);

            scaleTweenCombo.extraData = packedCargoView;
            scaleTweenCombo.Hook(packedCargoView.view.scale, 'x', 'y', 'z');
            scaleTweenCombo.onComplete = this.OnTweenComplete.bind(this);;
            scaleTweenCombo.Update(0);
            this.animatingViews.push(scaleTweenCombo);
        }

        /** @param {Tween|Tween.Combo} tween */

    }, {
        key: 'OnTweenComplete',
        value: function OnTweenComplete(tween) {
            var packedCargoView = tween.extraData;
            packedCargoView.view.scale.set(1, 1, 1);
            var index = this.animatingViews.indexOf(tween);
            if (index != -1) {
                this.animatingViews.splice(index, 1);
            }
            tween.Unhook();
            tween.Return();
        }

        /** @param {string} entryUID */

    }, {
        key: 'SelectEntry',
        value: function SelectEntry(entryUID) {
            if (!entryUID) {
                this.DisableHighlights();
            } else {
                this.Highlight(entryUID);
            }
        }
    }, {
        key: 'DisableHighlights',
        value: function DisableHighlights() {
            for (var i = 0, numCargoViews = this.cargoViews.length; i < numCargoViews; i++) {
                this.cargoViews[i].focus = 1;
            }
        }

        /** @param {string} entryUID */

    }, {
        key: 'Highlight',
        value: function Highlight(entryUID) {
            for (var i = 0, numCargoViews = this.cargoViews.length; i < numCargoViews; i++) {
                var cargoView = this.cargoViews[i];

                var cvEntry = cargoView.entry;
                if (cvEntry.uid === entryUID) {
                    cargoView.focus = 1.75;
                } else {
                    cargoView.focus = .25;
                }
            }
        }

        /** @param {Number} value */

    }, {
        key: 'Slice',
        value: function Slice(value) {
            if (value >= 1) {
                this.view.children.forEach(function (child) {
                    child.visible = true;
                });
                return;
            }

            var minY = Number.MAX_SAFE_INTEGER,
                maxY = Number.MIN_SAFE_INTEGER;
            this.view.children.forEach(function (child) {
                tempBox.setFromObject(child);
                tempBox.getSize(tempVec);
                var halfHeight = tempVec.y / 2;
                tempBox.getCenter(tempVec);
                var low = tempVec.y - halfHeight;
                var high = tempVec.y + halfHeight;
                if (low < minY) minY = low;
                if (high > maxY) maxY = high;
            });

            var y = minY + value * (maxY - minY);

            //console.log('slice ' + y.toFixed(2) + ' between ' + minY.toFixed(2) + ' and ' + maxY.toFixed(2));

            this.view.children.forEach(function (child) {
                tempBox.setFromObject(child);
                tempBox.getSize(tempVec);
                var halfHeight = tempVec.y / 2;
                tempBox.getCenter(tempVec);
                var low = tempVec.y - halfHeight;

                if (low < y) child.visible = true;else child.visible = false;
            });
        }
    }, {
        key: 'Clear',
        value: function Clear() {
            this.animatingViews.length = 0;
            this.cargoViews.length = 0;
            while (this.view.children.length > 0) {
                this.view.remove(this.view.children[this.view.children.length - 1]);
            }
        }
    }, {
        key: 'Update',
        value: function Update() {
            this.animatingViews.forEach(function (animatingView) {
                animatingView.Update();
            });
        }
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return PackResultView;
}(_Signaler3.default);

exports.default = PackResultView;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _UIUtils = __webpack_require__(37);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//#region crel.js
//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.

    However, the code's intention should be transparent.


*/

var fn = 'function',
    obj = 'object',
    nodeType = 'nodeType',
    textContent = 'textContent',
    setAttribute = 'setAttribute',
    attrMapString = 'attrMap',
    isNodeString = 'isNode',
    isElementString = 'isElement',
    d = (typeof document === "undefined" ? "undefined" : _typeof(document)) === obj ? document : {},
    isType = function isType(a, type) {
    return (typeof a === "undefined" ? "undefined" : _typeof(a)) === type;
},
    isNode = (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === fn ? function (object) {
    return object instanceof Node;
} :
// in IE <= 8 Node is an object, obviously..
function (object) {
    return object && isType(object, obj) && nodeType in object && isType(object.ownerDocument, obj);
},
    isElement = function isElement(object) {
    return crel[isNodeString](object) && object[nodeType] === 1;
},
    isArray = function isArray(a) {
    return a instanceof Array;
},
    appendChild = function appendChild(element, child) {
    if (isArray(child)) {
        child.map(function (subChild) {
            appendChild(element, subChild);
        });
        return;
    }
    if (!crel[isNodeString](child)) {
        child = d.createTextNode(child);
    }
    element.appendChild(child);
};
function crel() {
    var args = arguments,
        //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
    element = args[0],
        child,
        settings = args[1],
        childIndex = 2,
        argumentsLength = args.length,
        attributeMap = crel[attrMapString];
    element = crel[isElementString](element) ? element : d.createElement(element);
    // shortcut
    if (argumentsLength === 1) {
        return element;
    }
    if (!isType(settings, obj) || crel[isNodeString](settings) || isArray(settings)) {
        --childIndex;
        settings = null;
    }
    // shortcut if there is only one child that is a string
    if (argumentsLength - childIndex === 1 && isType(args[childIndex], 'string') && element[textContent] !== undefined) {
        element[textContent] = args[childIndex];
    } else {
        for (; childIndex < argumentsLength; ++childIndex) {
            child = args[childIndex];
            if (child == null) {
                continue;
            }
            if (isArray(child)) {
                for (var i = 0; i < child.length; ++i) {
                    appendChild(element, child[i]);
                }
            } else {
                appendChild(element, child);
            }
        }
    }
    for (var key in settings) {
        if (!attributeMap[key]) {
            if (isType(settings[key], fn)) {
                element[key] = settings[key];
            } else {
                element[setAttribute](key, settings[key]);
            }
        } else {
            var attr = attributeMap[key];
            if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) === fn) {
                attr(element, settings[key]);
            } else {
                element[setAttribute](attr, settings[key]);
            }
        }
    }
    return element;
}
// Used for mapping one kind of attribute to the supported version of that in bad browsers.
crel[attrMapString] = {};
crel[isElementString] = isElement;
crel[isNodeString] = isNode;
if (typeof Proxy !== 'undefined') {
    crel.proxy = new Proxy(crel, {
        get: function get(target, key) {
            !(key in crel) && (crel[key] = crel.bind(null, key));
            return crel[key];
        }
    });
}
//#endregion

function numberFormatDefault(n) {
    return n;
}

function numberFormat(n, d) {
    if (n > Number.MAX_SAFE_INTEGER - 2) return 'MAX';
    var nStr = Math.round(n) !== n ? n.toFixed(d) : n;
    return nStr;
}

/** @typedef FormatParams @property {Function} nf number formatting function */
/** @type {FormatParams} */
var defaultFormatParams = {
    nf: numberFormatDefault
};

/** @param {string} str string with (at) symbol an argument placeholder @param {FormatParams} params @param {Array<*>} args */
function format(str, params) {
    params = _Utils2.default.AssignUndefined(params, defaultFormatParams);
    var index = 0;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    while ((index = str.indexOf('@', index)) !== -1) {
        if (str[index - 1] !== '\\') {
            var a = args.shift();
            if (typeof a === 'number') a = params.nf(a);
            str = str.replace('@', a);
        }
        index += 1;
    }
    return str;
}

_UIUtils.Element.CreateCSS([]);

var signals = {
    orthoViewSelected: 'orthoViewSelected'
};

var orthoviews = {
    home: 'home',
    top: 'top',
    front: 'front',
    side: 'side'
};

var DomUI = function (_Signaler) {
    _inherits(DomUI, _Signaler);

    /**
     * 
     * @param {HTMLDivElement} containerDiv 
     * @param {UX} ux 
     */
    function DomUI(containerDiv, ux) {
        _classCallCheck(this, DomUI);

        /** @type {HTMLDivElement} */
        //this.domElement = crel('div', {style: 'display: inline-block; position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;'});
        //containerDiv.appendChild(this.domElement);
        var _this = _possibleConstructorReturn(this, (DomUI.__proto__ || Object.getPrototypeOf(DomUI)).call(this));

        _this.domElement = containerDiv;
        _this.ux = ux;

        /** @type {HTMLDivElement} */
        //this.sideBar = crel('div', {style: 'float: right; right: 0px; width: 50%; height: 100%;'});
        //this.domElement.appendChild(this.sideBar);
        return _this;
    }

    _createClass(DomUI, [{
        key: "CreateOrthoViewsIcons",
        value: function CreateOrthoViewsIcons() {
            var _this2 = this;

            var scope = this;
            var texturesPath = _Asset2.default.resources.texturesPath;

            var icons = [{ url: 'orthoviews-map.png', type: orthoviews.home }, { url: 'orthoviews-map.png', type: orthoviews.top }, { url: 'orthoviews-map.png', type: orthoviews.front }, { url: 'orthoviews-map.png', type: orthoviews.side }];

            /** @type {HTMLDivElement} */
            //this.orthoViewsIcons = crel('div', {style: 'display: inline-block; float: right; right: 0px; width: 100%; height: 100%;'});
            //this.sideBar.appendChild(this.orthoViewsIcons);

            var dimensions = { x: 52, y: 52 };
            var margin = { x: 16, y: 16 };
            var padding = 8;

            function dispatch(icon) {
                scope.Dispatch(signals.orthoViewSelected, icon.type);
            }

            var _loop = function _loop(i) {
                var icon = icons[i];

                var top = i * (dimensions.y + padding) + margin.y;
                var right = margin.x;
                var imageURL = texturesPath + icon.url;
                var style = format('cursor: pointer; display: block; float: right; position: absolute; background-size: 200%; background-position: 0% @%; background-image: url("@"); width: @px; height: @px; right: @px; top: @px;', {
                    nf: function nf(n) {
                        return Math.floor(n);
                    }
                }, i / (icons.length - 1) * 100, imageURL, dimensions.x, dimensions.y, right, top);

                /** @type {HTMLDivElement} */
                var div = crel('div', { style: style });
                _this2.domElement.appendChild(div);

                div.onmouseover = function () {
                    div.style.backgroundPositionX = '100%';
                };

                div.onmouseout = function () {
                    div.style.backgroundPositionX = '0%';
                };

                div.onclick = function (e) {
                    e.preventDefault();
                    dispatch(icon);
                };
            };

            for (var i = 0; i < icons.length; i++) {
                _loop(i);
            }
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }, {
        key: "orthoviews",
        get: function get() {
            return orthoviews;
        }
    }]);

    return DomUI;
}(_Signaler3.default);

exports.default = DomUI;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _UIUtils = __webpack_require__(37);

if (window.dat && !window.dat.guiExtensions) {

    // Disabled
    var blockEvent = function blockEvent(event) {
        event.stopPropagation();
    };

    window.dat.guiExtensions = true;

    _UIUtils.Element.CreateCSS(['.tooltip .tooltiptext {', '    visibility: hidden;', '    position: absolute;', '    width: 120px;', '    background-color: #111;', '    color: #fff;', '    text-align: center;', '    padding: 2px 0;', '    border-radius: 2px;', '    z-index: 1;', '    opacity: 0;', '    transition: opacity .6s;', '}', '.tooltip-top {', '    bottom: 125%;', '    left: 50%;', '    margin-left: -60px;', '}', '.tooltip:hover .tooltiptext {', '    visibility: visible;', '    opacity: 1;', '}']);

    var styles = {
        datDisabled: 'color: #606060 !important; cursor: not-allowed !important;'
    };

    Object.defineProperty((window.dat || __webpack_require__(4).default).GUI.prototype, 'onGUIEvent', {
        get: function get() {
            if (!this._onGUIEvent) this._onGUIEvent = [];
            return this._onGUIEvent;
        }
    });

    // update all

    (window.dat || __webpack_require__(4).default).GUI.prototype.updateAll = function () {
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

    (window.dat || __webpack_require__(4).default).GUI.prototype.find = function (object, property) {
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
    Object.defineProperty((window.dat || __webpack_require__(4).default).GUI.prototype, 'opening', {
        get: function get() {
            return !this.closed;
        },

        set: function set(value) {
            for (var i = 0; i < this.onGUIEvent.length; i++) {
                this.onGUIEvent[i](value ? 'open' : 'close');
            }
        }
    });

    Object.defineProperty((window.dat || __webpack_require__(4).default).controllers.Controller.prototype, "disabled", {
        get: function get() {
            return this.domElement.hasAttribute("disabled");
        },

        set: function set(value) {
            if (value) {
                this.domElement.setAttribute("disabled", "disabled");
                this.domElement.addEventListener("click", blockEvent, true);
                _UIUtils.Element.AddStyle(this.domElement.parentElement.parentElement, styles.datDisabled);
            } else {
                this.domElement.removeAttribute("disabled");
                this.domElement.removeEventListener("click", blockEvent, true);
                _UIUtils.Element.RemoveStyle(this.domElement.parentElement.parentElement, styles.datDisabled);
            }
        },

        enumerable: true
    });

    (window.dat || __webpack_require__(4).default).GUI.prototype.enable = function (object, property, value) {
        var controller = this.find(object, property);
        controller.disabled = !value;
    };

    // Tooltip

    Object.defineProperty((window.dat || __webpack_require__(4).default).controllers.Controller.prototype, "tooltip", {
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

    (window.dat || __webpack_require__(4).default).GUI.prototype.setTooltip = function (object, property, value) {
        var controller = this.find(object, property);
        controller.tooltip = value;
    };
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

var _WizardStep = __webpack_require__(15);

var _WizardStep2 = _interopRequireDefault(_WizardStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var signals = {
    change: 'change',
    complete: 'complete'
};

var Wizard = function (_Signaler) {
    _inherits(Wizard, _Signaler);

    /**
     * 
     * @param {Array<WizardStep>} steps 
     */
    function Wizard(steps) {
        _classCallCheck(this, Wizard);

        var _this = _possibleConstructorReturn(this, (Wizard.__proto__ || Object.getPrototypeOf(Wizard)).call(this));

        _this.current = -1;
        _this.steps = steps;

        _this.Link.apply(_this, _toConsumableArray(_this.steps));
        return _this;
    }

    _createClass(Wizard, [{
        key: 'Globals',
        value: function Globals(data) {
            this.steps.forEach(function (step) {
                Object.assign(step.data, data);
            });
        }
    }, {
        key: 'Link',
        value: function Link() {
            var next = this.Next.bind(this);

            for (var _len = arguments.length, steps = Array(_len), _key = 0; _key < _len; _key++) {
                steps[_key] = arguments[_key];
            }

            steps.forEach(function (step) {
                step.On(_WizardStep2.default.signals.complete, next);
            });
        }
    }, {
        key: 'FindIndex',
        value: function FindIndex(key) {
            for (var i = 0, len = this.steps.length; i < len; i++) {
                var step = this.steps[i];
                if (step.key === key) return i;
            }
            return -1;
        }
    }, {
        key: 'Load',
        value: function Load(index, dataPass) {
            if (this.current !== -1 && this.steps[this.current]) {
                this.steps[this.current].Dispose();
            }

            if (typeof index === 'string') index = this.FindIndex(index);

            this.current = index;
            this.steps[this.current].Start(dataPass);

            this.Dispatch(signals.change, this.steps[this.current]);
        }
    }, {
        key: 'Start',
        value: function Start() {
            this.Load(0);
        }
    }, {
        key: 'Next',
        value: function Next(dataPass) {

            var next = this.current + 1;

            if (next === this.steps.length) {
                if (this.steps[this.current]) {
                    this.steps[this.current].Dispose();
                }

                var finalStep = this.steps[this.current];
                this.current++;
                this.Dispatch(signals.complete, finalStep);
                return;
            }

            this.Load(next, dataPass);
        }
    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return Wizard;
}(_Signaler3.default);

exports.default = Wizard;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometryUtils = {

			computeTangents: function computeTangents(geometry) {

						var index = geometry.index;
						var attributes = geometry.attributes;

						// based on http://www.terathon.com/code/tangent.html
						// (per vertex tangents)

						if (index === null || attributes.position === undefined || attributes.normal === undefined || attributes.uv === undefined) {

									console.warn('THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()');
									return;
						}

						var indices = index.array;
						var positions = attributes.position.array;
						var normals = attributes.normal.array;
						var uvs = attributes.uv.array;

						var nVertices = positions.length / 3;

						if (attributes.tangent === undefined) {

									geometry.addAttribute('tangent', new THREE.BufferAttribute(new Float32Array(4 * nVertices), 4));
						}

						var tangents = attributes.tangent.array;

						var tan1 = [],
						    tan2 = [];

						for (var k = 0; k < nVertices; k++) {

									tan1[k] = new THREE.Vector3();
									tan2[k] = new THREE.Vector3();
						}

						var vA = new THREE.Vector3(),
						    vB = new THREE.Vector3(),
						    vC = new THREE.Vector3(),
						    uvA = new THREE.Vector2(),
						    uvB = new THREE.Vector2(),
						    uvC = new THREE.Vector2(),
						    sdir = new THREE.Vector3(),
						    tdir = new THREE.Vector3();

						function handleTriangle(a, b, c) {

									vA.fromArray(positions, a * 3);
									vB.fromArray(positions, b * 3);
									vC.fromArray(positions, c * 3);

									uvA.fromArray(uvs, a * 2);
									uvB.fromArray(uvs, b * 2);
									uvC.fromArray(uvs, c * 2);

									var x1 = vB.x - vA.x;
									var x2 = vC.x - vA.x;

									var y1 = vB.y - vA.y;
									var y2 = vC.y - vA.y;

									var z1 = vB.z - vA.z;
									var z2 = vC.z - vA.z;

									var s1 = uvB.x - uvA.x;
									var s2 = uvC.x - uvA.x;

									var t1 = uvB.y - uvA.y;
									var t2 = uvC.y - uvA.y;

									var r = 1.0 / (s1 * t2 - s2 * t1);

									sdir.set((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r);

									tdir.set((s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r);

									tan1[a].add(sdir);
									tan1[b].add(sdir);
									tan1[c].add(sdir);

									tan2[a].add(tdir);
									tan2[b].add(tdir);
									tan2[c].add(tdir);
						}

						var groups = geometry.groups;

						if (groups.length === 0) {

									groups = [{
												start: 0,
												count: indices.length
									}];
						}

						for (var j = 0, jl = groups.length; j < jl; ++j) {

									var group = groups[j];

									var start = group.start;
									var count = group.count;

									for (var i = start, il = start + count; i < il; i += 3) {

												handleTriangle(indices[i + 0], indices[i + 1], indices[i + 2]);
									}
						}

						var tmp = new THREE.Vector3(),
						    tmp2 = new THREE.Vector3();
						var n = new THREE.Vector3(),
						    n2 = new THREE.Vector3();
						var w, t, test;

						function handleVertex(v) {

									n.fromArray(normals, v * 3);
									n2.copy(n);

									t = tan1[v];

									// Gram-Schmidt orthogonalize

									tmp.copy(t);
									tmp.sub(n.multiplyScalar(n.dot(t))).normalize();

									// Calculate handedness

									tmp2.crossVectors(n2, t);
									test = tmp2.dot(tan2[v]);
									w = test < 0.0 ? -1.0 : 1.0;

									tangents[v * 4] = tmp.x;
									tangents[v * 4 + 1] = tmp.y;
									tangents[v * 4 + 2] = tmp.z;
									tangents[v * 4 + 3] = w;
						}

						for (var j = 0, jl = groups.length; j < jl; ++j) {

									var group = groups[j];

									var start = group.start;
									var count = group.count;

									for (var i = start, il = start + count; i < il; i += 3) {

												handleVertex(indices[i + 0]);
												handleVertex(indices[i + 1]);
												handleVertex(indices[i + 2]);
									}
						}
			},

			/**
    * @param  {Array<THREE.BufferGeometry>} geometries
    * @return {THREE.BufferGeometry}
    */
			mergeBufferGeometries: function mergeBufferGeometries(geometries) {

						var isIndexed = geometries[0].index !== null;

						var attributesUsed = new Set(Object.keys(geometries[0].attributes));
						var morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));

						var attributes = {};
						var morphAttributes = {};

						var mergedGeometry = new THREE.BufferGeometry();

						for (var i = 0; i < geometries.length; ++i) {

									var geometry = geometries[i];

									// ensure that all geometries are indexed, or none

									if (isIndexed !== (geometry.index !== null)) return null;

									// gather attributes, exit early if they're different

									for (var name in geometry.attributes) {

												if (!attributesUsed.has(name)) return null;

												if (attributes[name] === undefined) attributes[name] = [];

												attributes[name].push(geometry.attributes[name]);
									}

									// gather morph attributes, exit early if they're different

									for (var name in geometry.morphAttributes) {

												if (!morphAttributesUsed.has(name)) return null;

												if (morphAttributes[name] === undefined) morphAttributes[name] = [];

												morphAttributes[name].push(geometry.morphAttributes[name]);
									}

									// gather .userData

									if (geometry.userData !== undefined) {

												mergedGeometry.userData = mergedGeometry.userData || {};
												mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
												mergedGeometry.userData.mergedUserData.push(geometry.userData);
									}
						}

						// merge indices

						if (isIndexed) {

									var indexOffset = 0;
									var indexList = [];

									for (var i = 0; i < geometries.length; ++i) {

												var index = geometries[i].index;

												if (indexOffset > 0) {

															index = index.clone();

															for (var j = 0; j < index.count; ++j) {

																		index.setX(j, index.getX(j) + indexOffset);
															}
												}

												indexList.push(index);
												indexOffset += geometries[i].attributes.position.count;
									}

									var mergedIndex = this.mergeBufferAttributes(indexList);

									if (!mergedIndex) return null;

									mergedGeometry.index = mergedIndex;
						}

						// merge attributes

						for (var name in attributes) {

									var mergedAttribute = this.mergeBufferAttributes(attributes[name]);

									if (!mergedAttribute) return null;

									mergedGeometry.addAttribute(name, mergedAttribute);
						}

						// merge morph attributes

						for (var name in morphAttributes) {

									var numMorphTargets = morphAttributes[name][0].length;

									if (numMorphTargets === 0) break;

									mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
									mergedGeometry.morphAttributes[name] = [];

									for (var i = 0; i < numMorphTargets; ++i) {

												var morphAttributesToMerge = [];

												for (var j = 0; j < morphAttributes[name].length; ++j) {

															morphAttributesToMerge.push(morphAttributes[name][j][i]);
												}

												var mergedMorphAttribute = this.mergeBufferAttributes(morphAttributesToMerge);

												if (!mergedMorphAttribute) return null;

												mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
									}
						}

						return mergedGeometry;
			},

			/**
    * @param {Array<THREE.BufferAttribute>} attributes
    * @return {THREE.BufferAttribute}
    */
			mergeBufferAttributes: function mergeBufferAttributes(attributes) {

						var TypedArray;
						var itemSize;
						var normalized;
						var arrayLength = 0;

						for (var i = 0; i < attributes.length; ++i) {

									var attribute = attributes[i];

									if (attribute.isInterleavedBufferAttribute) return null;

									if (TypedArray === undefined) TypedArray = attribute.array.constructor;
									if (TypedArray !== attribute.array.constructor) return null;

									if (itemSize === undefined) itemSize = attribute.itemSize;
									if (itemSize !== attribute.itemSize) return null;

									if (normalized === undefined) normalized = attribute.normalized;
									if (normalized !== attribute.normalized) return null;

									arrayLength += attribute.array.length;
						}

						var array = new TypedArray(arrayLength);
						var offset = 0;

						for (var j = 0; j < attributes.length; ++j) {

									array.set(attributes[j].array, offset);

									offset += attributes[j].array.length;
						}

						return new THREE.BufferAttribute(array, itemSize, normalized);
			}

};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(57);


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneSetup = __webpack_require__(17);

var _SceneSetup2 = _interopRequireDefault(_SceneSetup);

var _ContainersEditor = __webpack_require__(91);

var _ContainersEditor2 = _interopRequireDefault(_ContainersEditor);

var _WizardTest = __webpack_require__(101);

var _WizardTest2 = _interopRequireDefault(_WizardTest);

var _Dom = __webpack_require__(16);

var _Dom2 = _interopRequireDefault(_Dom);

var _UX = __webpack_require__(23);

var _UX2 = _interopRequireDefault(_UX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @type {Editor}
 */
var instance;

/** @type {import('../src/FreightPacker').InitializationParams} */
var params = {
    debug: true,
    ux: {
        hud: false,
        configure: true
    }
};

var Editor = function () {
    /**
     * 
     * @param {HTMLElement} guiElement 
     * @param {HTMLElement} viewElement 
     */
    function Editor(guiElement, viewElement) {
        _classCallCheck(this, Editor);

        console.log('FP Editor');

        instance = this;

        this.domElement = guiElement;
        this.GUI();

        var ux = new _UX2.default(params.ux);

        this.sceneSetup = new _SceneSetup2.default(viewElement, ux);
        this.sceneSetup.Init().then(this.Start.bind(this));

        this.dom = new _Dom2.default();
        //viewElement.appendChild(this.dom.element);
    }

    _createClass(Editor, [{
        key: "GUI",
        value: function GUI() {
            this.gui = new dat.GUI({ autoPlace: false });
            this.domElement.appendChild(this.gui.domElement);

            var controller = {
                EditContainers: this.EditContainers.bind(this)
            };
            this.gui.add(controller, 'EditContainers');
        }
    }, {
        key: "EditContainers",
        value: function EditContainers() {
            this.activeEditor = new _ContainersEditor2.default(this.gui);
        }
    }, {
        key: "Start",
        value: function Start() {
            var lights = this.sceneSetup.DefaultLights(this.sceneSetup.sceneController, false, false);
            this.sceneSetup.Start();
        }
    }], [{
        key: "instance",
        get: function get() {
            return instance;
        }
    }, {
        key: "namespace",
        get: function get() {
            return __webpack_require__(102);
        }
    }]);

    return Editor;
}();

global.FPEditor = Editor;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40)))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _UpdateComponent = __webpack_require__(41);

var _UpdateComponent2 = _interopRequireDefault(_UpdateComponent);

var _RaycastGroup = __webpack_require__(32);

var _RaycastGroup2 = _interopRequireDefault(_RaycastGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keypress = __webpack_require__(59);

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
        this.updateComponents = [new _UpdateComponent2.default(true, 1 / 25, this.Update25.bind(this)), new _UpdateComponent2.default(true, 1 / 10, this.Update10.bind(this))];

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
        this.keyboard = new keypress.Listener();
        this.keyboard.on = this.keyboard.simple_combo;
        this.keyboard.unregister = this.keyboard.unregister_combo;
        this.keys = {};

        //
    }

    _createClass(Input, [{
        key: "Dispose",
        value: function Dispose() {
            // remove listeners
        }
    }, {
        key: "ListenKeys",
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
        key: "ComputeScreen",
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
        key: "OnMouseDown",
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
        key: "OnDoubleClick",
        value: function OnDoubleClick(mouseEvent) {
            for (var i = 0; i < this.onDoubleClick.length; i++) {
                this.onDoubleClick[i](mouseEvent);
            }

            this.UpdateRaycast('OnDoubleClick');
        }
    }, {
        key: "ExecuteDelayedMD",
        value: function ExecuteDelayedMD(mouseEvent) {
            if (this._dridMouseDown !== undefined) {
                this.AbortDelayedAction(this._dridMouseDown);
                this._dridMouseDown = undefined;
                this._mouseDownDelayed();
            }
        }
    }, {
        key: "OnMouseUp",
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
        key: "OnMouseDrag",
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
        key: "OnClick",
        value: function OnClick(mouseEvent) {
            for (var i = 0; i < this.onClick.length; i++) {
                this.onClick[i](mouseEvent);
            }

            this.UpdateRaycast('OnClick');
        }
    }, {
        key: "OnRightClick",
        value: function OnRightClick(mouseEvent) {
            //mouseEvent.preventDefault();
            this.UpdateScreenAndMouse(mouseEvent);
            for (var i = 0; i < this.onRightClick.length; i++) {
                this.onRightClick[i](mouseEvent);
            }

            this.UpdateRaycast('OnRightClick');
        }
    }, {
        key: "OnMouseMove",
        value: function OnMouseMove(mouseEvent) {
            this._mouse.x = THREE.Math.clamp(mouseEvent.clientX - this.screen.left, 0, this.screen.width);
            this._mouse.y = THREE.Math.clamp(mouseEvent.clientY - this.screen.top, 0, this.screen.height);
            this.onDragEvent.mouseEvent = mouseEvent;
            this.ExecuteDelayedMD(mouseEvent);
        }
    }, {
        key: "OnScroll",
        value: function OnScroll(event) {
            this.screenNeedsUpdate = true;
        }
    }, {
        key: "OnMouseWheel",
        value: function OnMouseWheel(mouseEvent) {
            mouseEvent.preventDefault();
            var delta = THREE.Math.clamp(mouseEvent.wheelDelta || -mouseEvent.detail, -1, 1);
            this.fov.target = THREE.Math.clamp(this.fov.target - delta * 2., this.fov.min, this.fov.max);
            this.fov.lerp = 0;
        }
    }, {
        key: "LerpZoom",
        value: function LerpZoom() {
            this.fov.lerp += .1;
            if (this.fov.lerp >= 1 || Number.isNaN(this.fov.lerp)) {
                return;
            }
            this.camera.fov += (this.fov.target - this.camera.fov) * this.fov.lerp;
            this.camera.updateProjectionMatrix();
        }
    }, {
        key: "OnResize",
        value: function OnResize(event) {
            this.screenNeedsUpdate = true;
            this.cameraNeedsUpdate = true;
        }
    }, {
        key: "RemoveEventCallback",
        value: function RemoveEventCallback(eventType, callback) {
            var callbacks = this[eventType];
            for (var iCallback = 0; iCallback < callbacks.length; iCallback++) {
                if (callbacks[iCallback] === callback) {
                    callbacks.splice(iCallback, 1);
                }
            }
        }
    }, {
        key: "Update",
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
        key: "Update25",
        value: function Update25() {
            this.LerpZoom();
            this.UpdateRaycast('Update25');
        }
    }, {
        key: "Update10",
        value: function Update10() {
            this.UpdateRaycast('Update10');
        }
    }, {
        key: "FireOnce",
        value: function FireOnce() {
            for (var iCallback = this.fireOnce.length; iCallback-- > 0;) {
                this.fireOnce[iCallback]();
            }
            this.fireOnce.length = 0;
        }
    }, {
        key: "DelayedAction",
        value: function DelayedAction(action, delay) {
            var drid = window.setTimeout(function () {
                action();
            }, delay);
            return drid;
        }
    }, {
        key: "AbortDelayedAction",
        value: function AbortDelayedAction(drid) {
            window.clearTimeout(drid);
            return;
        }
    }, {
        key: "Repeat",
        value: function Repeat(action, interval) {
            if (this._repeats === undefined) this._repeats = [];
            var drid = window.setInterval(function () {
                action();
            }, interval);
            this._repeats.push({ action: action, drid: drid });
            return drid;
        }
    }, {
        key: "StopRepeat",
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
        key: "UpdateScreenAndMouse",
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
        key: "RaycastTest",
        value: function RaycastTest(objects, recursive) {
            this.UpdateRaycaster();
            recursive = recursive !== undefined ? recursive : false;
            var intersects = objects instanceof Array ? this.raycaster.intersectObjects(objects, recursive) : this.raycaster.intersectObject(objects, recursive);
            if (intersects.length > 0) {
                return intersects[0];
            }
            return undefined;
        }

        /**
         * @param {string} event Update Update25 Update10 OnMouseDown OnDoubleClick OnMouseUp OnRightClick OnClick
         * @param {string} groupID 
         * @param {RaycastGroup} group 
         */

    }, {
        key: "AddRaycastGroup",
        value: function AddRaycastGroup(event, groupID, group) {
            if (this._raycastGroups[event][groupID] !== undefined) console.log('RaycastGroup ' + groupID + ' is being overwritten.');
            this._raycastGroups[event][groupID] = group;
        }
    }, {
        key: "RemoveRaycastGroup",
        value: function RemoveRaycastGroup(event, groupID) {
            delete this._raycastGroups[event][groupID];
        }
    }, {
        key: "UpdateRaycaster",
        value: function UpdateRaycaster() {
            this.camera.updateMatrixWorld();
            this.raycaster.setFromCamera(this.mouseViewport, this.camera);
        }
    }, {
        key: "UpdateRaycast",
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

exports.default = Input;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

// Generated by CoffeeScript 1.8.0

/*
Copyright 2014 David Mauro

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Keypress is a robust keyboard input capturing Javascript utility
focused on input for games.

version 2.1.3
 */

/*
Combo options available and their defaults:
    keys            : []            - An array of the keys pressed together to activate combo.
    count           : 0             - The number of times a counting combo has been pressed. Reset on release.
    is_unordered    : false         - Unless this is set to true, the keys can be pressed down in any order.
    is_counting     : false         - Makes this a counting combo (see documentation).
    is_exclusive    : false         - This combo will replace other exclusive combos when true.
    is_solitary     : false         - This combo will only fire if ONLY it's keys are pressed down.
    is_sequence     : false         - Rather than a key combo, this is an ordered key sequence.
    prevent_default : false         - Prevent default behavior for all component key keypresses.
    prevent_repeat  : false         - Prevent the combo from repeating when keydown is held.
    on_keydown      : null          - A function that is called when the combo is pressed.
    on_keyup        : null          - A function that is called when the combo is released.
    on_release      : null          - A function that is called when all keys in the combo are released.
    this            : undefined     - Defines the scope for your callback functions.
 */

(function () {
  var Combo,
      keypress,
      _change_keycodes_by_browser,
      _compare_arrays,
      _compare_arrays_sorted,
      _convert_key_to_readable,
      _convert_to_shifted_key,
      _decide_meta_key,
      _factory_defaults,
      _filter_array,
      _index_of_in_array,
      _is_array_in_array,
      _is_array_in_array_sorted,
      _key_is_valid,
      _keycode_alternate_names,
      _keycode_dictionary,
      _keycode_shifted_keys,
      _log_error,
      _metakey,
      _modifier_event_mapping,
      _modifier_keys,
      _validate_combo,
      __hasProp = {}.hasOwnProperty,
      __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }return -1;
  };

  _factory_defaults = {
    is_unordered: false,
    is_counting: false,
    is_exclusive: false,
    is_solitary: false,
    prevent_default: false,
    prevent_repeat: false
  };

  _modifier_keys = ["meta", "alt", "option", "ctrl", "shift", "cmd"];

  _metakey = "ctrl";

  keypress = {};

  keypress.debug = false;

  Combo = function () {
    function Combo(dictionary) {
      var property, value;
      for (property in dictionary) {
        if (!__hasProp.call(dictionary, property)) continue;
        value = dictionary[property];
        if (value !== false) {
          this[property] = value;
        }
      }
      this.keys = this.keys || [];
      this.count = this.count || 0;
    }

    Combo.prototype.allows_key_repeat = function () {
      return !this.prevent_repeat && typeof this.on_keydown === "function";
    };

    Combo.prototype.reset = function () {
      this.count = 0;
      return this.keyup_fired = null;
    };

    return Combo;
  }();

  keypress.Listener = function () {
    function Listener(element, defaults) {
      var attach_handler, property, value;
      if (typeof jQuery !== "undefined" && jQuery !== null && element instanceof jQuery) {
        if (element.length !== 1) {
          _log_error("Warning: your jQuery selector should have exactly one object.");
        }
        element = element[0];
      }
      this.should_suppress_event_defaults = false;
      this.should_force_event_defaults = false;
      this.sequence_delay = 800;
      this._registered_combos = [];
      this._keys_down = [];
      this._active_combos = [];
      this._sequence = [];
      this._sequence_timer = null;
      this._prevent_capture = false;
      this._defaults = defaults || {};
      for (property in _factory_defaults) {
        if (!__hasProp.call(_factory_defaults, property)) continue;
        value = _factory_defaults[property];
        this._defaults[property] = this._defaults[property] || value;
      }
      this.element = element || document.body;
      attach_handler = function attach_handler(target, event, handler) {
        if (target.addEventListener) {
          target.addEventListener(event, handler);
        } else if (target.attachEvent) {
          target.attachEvent("on" + event, handler);
        }
        return handler;
      };
      this.keydown_event = attach_handler(this.element, "keydown", function (_this) {
        return function (e) {
          e = e || window.event;
          _this._receive_input(e, true);
          return _this._bug_catcher(e);
        };
      }(this));
      this.keyup_event = attach_handler(this.element, "keyup", function (_this) {
        return function (e) {
          e = e || window.event;
          return _this._receive_input(e, false);
        };
      }(this));
      this.blur_event = attach_handler(window, "blur", function (_this) {
        return function () {
          var key, _i, _len, _ref;
          _ref = _this._keys_down;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            _this._key_up(key, {});
          }
          return _this._keys_down = [];
        };
      }(this));
    }

    Listener.prototype.destroy = function () {
      var remove_handler;
      remove_handler = function remove_handler(target, event, handler) {
        if (target.removeEventListener != null) {
          return target.removeEventListener(event, handler);
        } else if (target.removeEvent != null) {
          return target.removeEvent("on" + event, handler);
        }
      };
      remove_handler(this.element, "keydown", this.keydown_event);
      remove_handler(this.element, "keyup", this.keyup_event);
      return remove_handler(window, "blur", this.blur_event);
    };

    Listener.prototype._bug_catcher = function (e) {
      var _ref, _ref1;
      if (_metakey === "cmd" && __indexOf.call(this._keys_down, "cmd") >= 0 && (_ref = _convert_key_to_readable((_ref1 = e.keyCode) != null ? _ref1 : e.key)) !== "cmd" && _ref !== "shift" && _ref !== "alt" && _ref !== "caps" && _ref !== "tab") {
        return this._receive_input(e, false);
      }
    };

    Listener.prototype._cmd_bug_check = function (combo_keys) {
      if (_metakey === "cmd" && __indexOf.call(this._keys_down, "cmd") >= 0 && __indexOf.call(combo_keys, "cmd") < 0) {
        return false;
      }
      return true;
    };

    Listener.prototype._prevent_default = function (e, should_prevent) {
      if ((should_prevent || this.should_suppress_event_defaults) && !this.should_force_event_defaults) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
        if (e.stopPropagation) {
          return e.stopPropagation();
        }
      }
    };

    Listener.prototype._get_active_combos = function (key) {
      var active_combos, keys_down;
      active_combos = [];
      keys_down = _filter_array(this._keys_down, function (down_key) {
        return down_key !== key;
      });
      keys_down.push(key);
      this._match_combo_arrays(keys_down, function (_this) {
        return function (match) {
          if (_this._cmd_bug_check(match.keys)) {
            return active_combos.push(match);
          }
        };
      }(this));
      this._fuzzy_match_combo_arrays(keys_down, function (_this) {
        return function (match) {
          if (__indexOf.call(active_combos, match) >= 0) {
            return;
          }
          if (!(match.is_solitary || !_this._cmd_bug_check(match.keys))) {
            return active_combos.push(match);
          }
        };
      }(this));
      return active_combos;
    };

    Listener.prototype._get_potential_combos = function (key) {
      var combo, potentials, _i, _len, _ref;
      potentials = [];
      _ref = this._registered_combos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        combo = _ref[_i];
        if (combo.is_sequence) {
          continue;
        }
        if (__indexOf.call(combo.keys, key) >= 0 && this._cmd_bug_check(combo.keys)) {
          potentials.push(combo);
        }
      }
      return potentials;
    };

    Listener.prototype._add_to_active_combos = function (combo) {
      var active_combo, active_key, active_keys, already_replaced, combo_key, i, should_prepend, should_replace, _i, _j, _k, _len, _len1, _ref, _ref1;
      should_replace = false;
      should_prepend = true;
      already_replaced = false;
      if (__indexOf.call(this._active_combos, combo) >= 0) {
        return true;
      } else if (this._active_combos.length) {
        for (i = _i = 0, _ref = this._active_combos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          active_combo = this._active_combos[i];
          if (!(active_combo && active_combo.is_exclusive && combo.is_exclusive)) {
            continue;
          }
          active_keys = active_combo.keys;
          if (!should_replace) {
            for (_j = 0, _len = active_keys.length; _j < _len; _j++) {
              active_key = active_keys[_j];
              should_replace = true;
              if (__indexOf.call(combo.keys, active_key) < 0) {
                should_replace = false;
                break;
              }
            }
          }
          if (should_prepend && !should_replace) {
            _ref1 = combo.keys;
            for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
              combo_key = _ref1[_k];
              should_prepend = false;
              if (__indexOf.call(active_keys, combo_key) < 0) {
                should_prepend = true;
                break;
              }
            }
          }
          if (should_replace) {
            if (already_replaced) {
              active_combo = this._active_combos.splice(i, 1)[0];
              if (active_combo != null) {
                active_combo.reset();
              }
            } else {
              active_combo = this._active_combos.splice(i, 1, combo)[0];
              if (active_combo != null) {
                active_combo.reset();
              }
              already_replaced = true;
            }
            should_prepend = false;
          }
        }
      }
      if (should_prepend) {
        this._active_combos.unshift(combo);
      }
      return should_replace || should_prepend;
    };

    Listener.prototype._remove_from_active_combos = function (combo) {
      var active_combo, i, _i, _ref;
      for (i = _i = 0, _ref = this._active_combos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        active_combo = this._active_combos[i];
        if (active_combo === combo) {
          combo = this._active_combos.splice(i, 1)[0];
          combo.reset();
          break;
        }
      }
    };

    Listener.prototype._get_possible_sequences = function () {
      var combo, i, j, match, matches, sequence, _i, _j, _k, _len, _ref, _ref1, _ref2;
      matches = [];
      _ref = this._registered_combos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        combo = _ref[_i];
        for (j = _j = 1, _ref1 = this._sequence.length; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          sequence = this._sequence.slice(-j);
          if (!combo.is_sequence) {
            continue;
          }
          if (__indexOf.call(combo.keys, "shift") < 0) {
            sequence = _filter_array(sequence, function (key) {
              return key !== "shift";
            });
            if (!sequence.length) {
              continue;
            }
          }
          for (i = _k = 0, _ref2 = sequence.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
            if (combo.keys[i] === sequence[i]) {
              match = true;
            } else {
              match = false;
              break;
            }
          }
          if (match) {
            matches.push(combo);
          }
        }
      }
      return matches;
    };

    Listener.prototype._add_key_to_sequence = function (key, e) {
      var combo, sequence_combos, _i, _len;
      this._sequence.push(key);
      sequence_combos = this._get_possible_sequences();
      if (sequence_combos.length) {
        for (_i = 0, _len = sequence_combos.length; _i < _len; _i++) {
          combo = sequence_combos[_i];
          this._prevent_default(e, combo.prevent_default);
        }
        if (this._sequence_timer) {
          clearTimeout(this._sequence_timer);
        }
        if (this.sequence_delay > -1) {
          this._sequence_timer = setTimeout(function () {
            return this._sequence = [];
          }, this.sequence_delay);
        }
      } else {
        this._sequence = [];
      }
    };

    Listener.prototype._get_sequence = function (key) {
      var combo, i, j, match, seq_key, sequence, _i, _j, _k, _len, _ref, _ref1, _ref2;
      _ref = this._registered_combos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        combo = _ref[_i];
        if (!combo.is_sequence) {
          continue;
        }
        for (j = _j = 1, _ref1 = this._sequence.length; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
          sequence = _filter_array(this._sequence, function (seq_key) {
            if (__indexOf.call(combo.keys, "shift") >= 0) {
              return true;
            }
            return seq_key !== "shift";
          }).slice(-j);
          if (combo.keys.length !== sequence.length) {
            continue;
          }
          for (i = _k = 0, _ref2 = sequence.length; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
            seq_key = sequence[i];
            if (__indexOf.call(combo.keys, "shift") < 0) {
              if (seq_key === "shift") {
                continue;
              }
            }
            if (key === "shift" && __indexOf.call(combo.keys, "shift") < 0) {
              continue;
            }
            if (combo.keys[i] === seq_key) {
              match = true;
            } else {
              match = false;
              break;
            }
          }
        }
        if (match) {
          if (combo.is_exclusive) {
            this._sequence = [];
          }
          return combo;
        }
      }
      return false;
    };

    Listener.prototype._receive_input = function (e, is_keydown) {
      var key, _ref;
      if (this._prevent_capture) {
        if (this._keys_down.length) {
          this._keys_down = [];
        }
        return;
      }
      key = _convert_key_to_readable((_ref = e.keyCode) != null ? _ref : e.key);
      if (!is_keydown && !this._keys_down.length && (key === "alt" || key === _metakey)) {
        return;
      }
      if (!key) {
        return;
      }
      if (is_keydown) {
        return this._key_down(key, e);
      } else {
        return this._key_up(key, e);
      }
    };

    Listener.prototype._fire = function (event, combo, key_event, is_autorepeat) {
      if (typeof combo["on_" + event] === "function") {
        this._prevent_default(key_event, combo["on_" + event].call(combo["this"], key_event, combo.count, is_autorepeat) !== true);
      }
      if (event === "release") {
        combo.count = 0;
      }
      if (event === "keyup") {
        return combo.keyup_fired = true;
      }
    };

    Listener.prototype._match_combo_arrays = function (potential_match, match_handler) {
      var source_combo, _i, _len, _ref;
      _ref = this._registered_combos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source_combo = _ref[_i];
        if (!source_combo.is_unordered && _compare_arrays_sorted(potential_match, source_combo.keys) || source_combo.is_unordered && _compare_arrays(potential_match, source_combo.keys)) {
          match_handler(source_combo);
        }
      }
    };

    Listener.prototype._fuzzy_match_combo_arrays = function (potential_match, match_handler) {
      var source_combo, _i, _len, _ref;
      _ref = this._registered_combos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source_combo = _ref[_i];
        if (!source_combo.is_unordered && _is_array_in_array_sorted(source_combo.keys, potential_match) || source_combo.is_unordered && _is_array_in_array(source_combo.keys, potential_match)) {
          match_handler(source_combo);
        }
      }
    };

    Listener.prototype._keys_remain = function (combo) {
      var key, keys_remain, _i, _len, _ref;
      _ref = combo.keys;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (__indexOf.call(this._keys_down, key) >= 0) {
          keys_remain = true;
          break;
        }
      }
      return keys_remain;
    };

    Listener.prototype._key_down = function (key, e) {
      var combo, combos, event_mod, i, mod, potential, potential_combos, sequence_combo, shifted_key, _i, _j, _k, _len, _len1, _ref;
      shifted_key = _convert_to_shifted_key(key, e);
      if (shifted_key) {
        key = shifted_key;
      }
      this._add_key_to_sequence(key, e);
      sequence_combo = this._get_sequence(key);
      if (sequence_combo) {
        this._fire("keydown", sequence_combo, e);
      }
      for (mod in _modifier_event_mapping) {
        event_mod = _modifier_event_mapping[mod];
        if (!e[event_mod]) {
          continue;
        }
        if (mod === key || __indexOf.call(this._keys_down, mod) >= 0) {
          continue;
        }
        this._keys_down.push(mod);
      }
      for (mod in _modifier_event_mapping) {
        event_mod = _modifier_event_mapping[mod];
        if (mod === key) {
          continue;
        }
        if (__indexOf.call(this._keys_down, mod) >= 0 && !e[event_mod]) {
          if (mod === "cmd" && _metakey !== "cmd") {
            continue;
          }
          for (i = _i = 0, _ref = this._keys_down.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (this._keys_down[i] === mod) {
              this._keys_down.splice(i, 1);
            }
          }
        }
      }
      combos = this._get_active_combos(key);
      potential_combos = this._get_potential_combos(key);
      for (_j = 0, _len = combos.length; _j < _len; _j++) {
        combo = combos[_j];
        this._handle_combo_down(combo, potential_combos, key, e);
      }
      if (potential_combos.length) {
        for (_k = 0, _len1 = potential_combos.length; _k < _len1; _k++) {
          potential = potential_combos[_k];
          this._prevent_default(e, potential.prevent_default);
        }
      }
      if (__indexOf.call(this._keys_down, key) < 0) {
        this._keys_down.push(key);
      }
    };

    Listener.prototype._handle_combo_down = function (combo, potential_combos, key, e) {
      var is_autorepeat, is_other_exclusive, potential_combo, result, _i, _len;
      if (__indexOf.call(combo.keys, key) < 0) {
        return false;
      }
      this._prevent_default(e, combo && combo.prevent_default);
      is_autorepeat = false;
      if (__indexOf.call(this._keys_down, key) >= 0) {
        is_autorepeat = true;
        if (!combo.allows_key_repeat()) {
          return false;
        }
      }
      result = this._add_to_active_combos(combo, key);
      combo.keyup_fired = false;
      is_other_exclusive = false;
      if (combo.is_exclusive) {
        for (_i = 0, _len = potential_combos.length; _i < _len; _i++) {
          potential_combo = potential_combos[_i];
          if (potential_combo.is_exclusive && potential_combo.keys.length > combo.keys.length) {
            is_other_exclusive = true;
            break;
          }
        }
      }
      if (!is_other_exclusive) {
        if (combo.is_counting && typeof combo.on_keydown === "function") {
          combo.count += 1;
        }
        if (result) {
          return this._fire("keydown", combo, e, is_autorepeat);
        }
      }
    };

    Listener.prototype._key_up = function (key, e) {
      var active_combo, active_combos_length, combo, combos, i, sequence_combo, shifted_key, unshifted_key, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
      unshifted_key = key;
      shifted_key = _convert_to_shifted_key(key, e);
      if (shifted_key) {
        key = shifted_key;
      }
      shifted_key = _keycode_shifted_keys[unshifted_key];
      if (e.shiftKey) {
        if (!(shifted_key && __indexOf.call(this._keys_down, shifted_key) >= 0)) {
          key = unshifted_key;
        }
      } else {
        if (!(unshifted_key && __indexOf.call(this._keys_down, unshifted_key) >= 0)) {
          key = shifted_key;
        }
      }
      sequence_combo = this._get_sequence(key);
      if (sequence_combo) {
        this._fire("keyup", sequence_combo, e);
      }
      if (__indexOf.call(this._keys_down, key) < 0) {
        return false;
      }
      for (i = _i = 0, _ref = this._keys_down.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        if ((_ref1 = this._keys_down[i]) === key || _ref1 === shifted_key || _ref1 === unshifted_key) {
          this._keys_down.splice(i, 1);
          break;
        }
      }
      active_combos_length = this._active_combos.length;
      combos = [];
      _ref2 = this._active_combos;
      for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
        active_combo = _ref2[_j];
        if (__indexOf.call(active_combo.keys, key) >= 0) {
          combos.push(active_combo);
        }
      }
      for (_k = 0, _len1 = combos.length; _k < _len1; _k++) {
        combo = combos[_k];
        this._handle_combo_up(combo, e, key);
      }
      if (active_combos_length > 1) {
        _ref3 = this._active_combos;
        for (_l = 0, _len2 = _ref3.length; _l < _len2; _l++) {
          active_combo = _ref3[_l];
          if (active_combo === void 0 || __indexOf.call(combos, active_combo) >= 0) {
            continue;
          }
          if (!this._keys_remain(active_combo)) {
            this._remove_from_active_combos(active_combo);
          }
        }
      }
    };

    Listener.prototype._handle_combo_up = function (combo, e, key) {
      var keys_down, keys_remaining;
      this._prevent_default(e, combo && combo.prevent_default);
      keys_remaining = this._keys_remain(combo);
      if (!combo.keyup_fired) {
        keys_down = this._keys_down.slice();
        keys_down.push(key);
        if (!combo.is_solitary || _compare_arrays(keys_down, combo.keys)) {
          this._fire("keyup", combo, e);
          if (combo.is_counting && typeof combo.on_keyup === "function" && typeof combo.on_keydown !== "function") {
            combo.count += 1;
          }
        }
      }
      if (!keys_remaining) {
        this._fire("release", combo, e);
        this._remove_from_active_combos(combo);
      }
    };

    Listener.prototype.simple_combo = function (keys, callback) {
      return this.register_combo({
        keys: keys,
        on_keydown: callback
      });
    };

    Listener.prototype.counting_combo = function (keys, count_callback) {
      return this.register_combo({
        keys: keys,
        is_counting: true,
        is_unordered: false,
        on_keydown: count_callback
      });
    };

    Listener.prototype.sequence_combo = function (keys, callback) {
      return this.register_combo({
        keys: keys,
        on_keydown: callback,
        is_sequence: true,
        is_exclusive: true
      });
    };

    Listener.prototype.register_combo = function (combo_dictionary) {
      var combo, property, value, _ref;
      if (typeof combo_dictionary["keys"] === "string") {
        combo_dictionary["keys"] = combo_dictionary["keys"].split(" ");
      }
      _ref = this._defaults;
      for (property in _ref) {
        if (!__hasProp.call(_ref, property)) continue;
        value = _ref[property];
        if (combo_dictionary[property] === void 0) {
          combo_dictionary[property] = value;
        }
      }
      combo = new Combo(combo_dictionary);
      if (_validate_combo(combo)) {
        this._registered_combos.push(combo);
        return combo;
      }
    };

    Listener.prototype.register_many = function (combo_array) {
      var combo, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = combo_array.length; _i < _len; _i++) {
        combo = combo_array[_i];
        _results.push(this.register_combo(combo));
      }
      return _results;
    };

    Listener.prototype.unregister_combo = function (keys_or_combo) {
      var combo, unregister_combo, _i, _len, _ref, _results;
      if (!keys_or_combo) {
        return false;
      }
      unregister_combo = function (_this) {
        return function (combo) {
          var i, _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = _this._registered_combos.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (combo === _this._registered_combos[i]) {
              _this._registered_combos.splice(i, 1);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      }(this);
      if (keys_or_combo instanceof Combo) {
        return unregister_combo(keys_or_combo);
      } else {
        if (typeof keys_or_combo === "string") {
          keys_or_combo = keys_or_combo.split(" ");
        }
        _ref = this._registered_combos;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          combo = _ref[_i];
          if (combo == null) {
            continue;
          }
          if (combo.is_unordered && _compare_arrays(keys_or_combo, combo.keys) || !combo.is_unordered && _compare_arrays_sorted(keys_or_combo, combo.keys)) {
            _results.push(unregister_combo(combo));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Listener.prototype.unregister_many = function (combo_array) {
      var combo, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = combo_array.length; _i < _len; _i++) {
        combo = combo_array[_i];
        _results.push(this.unregister_combo(combo));
      }
      return _results;
    };

    Listener.prototype.get_registered_combos = function () {
      return this._registered_combos;
    };

    Listener.prototype.reset = function () {
      return this._registered_combos = [];
    };

    Listener.prototype.listen = function () {
      return this._prevent_capture = false;
    };

    Listener.prototype.stop_listening = function () {
      return this._prevent_capture = true;
    };

    Listener.prototype.get_meta_key = function () {
      return _metakey;
    };

    return Listener;
  }();

  _decide_meta_key = function _decide_meta_key() {
    if (navigator.userAgent.indexOf("Mac OS X") !== -1) {
      _metakey = "cmd";
    }
  };

  _change_keycodes_by_browser = function _change_keycodes_by_browser() {
    if (navigator.userAgent.indexOf("Opera") !== -1) {
      _keycode_dictionary["17"] = "cmd";
    }
  };

  _convert_key_to_readable = function _convert_key_to_readable(k) {
    return _keycode_dictionary[k];
  };

  _filter_array = function _filter_array(array, callback) {
    var element;
    if (array.filter) {
      return array.filter(callback);
    } else {
      return function () {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          element = array[_i];
          if (callback(element)) {
            _results.push(element);
          }
        }
        return _results;
      }();
    }
  };

  _compare_arrays = function _compare_arrays(a1, a2) {
    var item, _i, _len;
    if (a1.length !== a2.length) {
      return false;
    }
    for (_i = 0, _len = a1.length; _i < _len; _i++) {
      item = a1[_i];
      if (__indexOf.call(a2, item) >= 0) {
        continue;
      }
      return false;
    }
    return true;
  };

  _compare_arrays_sorted = function _compare_arrays_sorted(a1, a2) {
    var i, _i, _ref;
    if (a1.length !== a2.length) {
      return false;
    }
    for (i = _i = 0, _ref = a1.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
    return true;
  };

  _is_array_in_array = function _is_array_in_array(a1, a2) {
    var item, _i, _len;
    for (_i = 0, _len = a1.length; _i < _len; _i++) {
      item = a1[_i];
      if (__indexOf.call(a2, item) < 0) {
        return false;
      }
    }
    return true;
  };

  _index_of_in_array = Array.prototype.indexOf || function (a, item) {
    var i, _i, _ref;
    for (i = _i = 0, _ref = a.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (a[i] === item) {
        return i;
      }
    }
    return -1;
  };

  _is_array_in_array_sorted = function _is_array_in_array_sorted(a1, a2) {
    var index, item, prev, _i, _len;
    prev = 0;
    for (_i = 0, _len = a1.length; _i < _len; _i++) {
      item = a1[_i];
      index = _index_of_in_array.call(a2, item);
      if (index >= prev) {
        prev = index;
      } else {
        return false;
      }
    }
    return true;
  };

  _log_error = function _log_error() {
    if (keypress.debug) {
      return console.log.apply(console, arguments);
    }
  };

  _key_is_valid = function _key_is_valid(key) {
    var valid, valid_key, _;
    valid = false;
    for (_ in _keycode_dictionary) {
      valid_key = _keycode_dictionary[_];
      if (key === valid_key) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      for (_ in _keycode_shifted_keys) {
        valid_key = _keycode_shifted_keys[_];
        if (key === valid_key) {
          valid = true;
          break;
        }
      }
    }
    return valid;
  };

  _validate_combo = function _validate_combo(combo) {
    var alt_name, i, key, mod_key, non_modifier_keys, property, validated, value, _i, _j, _k, _len, _len1, _ref, _ref1;
    validated = true;
    if (!combo.keys.length) {
      _log_error("You're trying to bind a combo with no keys:", combo);
    }
    for (i = _i = 0, _ref = combo.keys.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      key = combo.keys[i];
      alt_name = _keycode_alternate_names[key];
      if (alt_name) {
        key = combo.keys[i] = alt_name;
      }
      if (key === "meta") {
        combo.keys.splice(i, 1, _metakey);
      }
      if (key === "cmd") {
        _log_error("Warning: use the \"meta\" key rather than \"cmd\" for Windows compatibility");
      }
    }
    _ref1 = combo.keys;
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      key = _ref1[_j];
      if (!_key_is_valid(key)) {
        _log_error("Do not recognize the key \"" + key + "\"");
        validated = false;
      }
    }
    if (__indexOf.call(combo.keys, "meta") >= 0 || __indexOf.call(combo.keys, "cmd") >= 0) {
      non_modifier_keys = combo.keys.slice();
      for (_k = 0, _len1 = _modifier_keys.length; _k < _len1; _k++) {
        mod_key = _modifier_keys[_k];
        if ((i = _index_of_in_array.call(non_modifier_keys, mod_key)) > -1) {
          non_modifier_keys.splice(i, 1);
        }
      }
      if (non_modifier_keys.length > 1) {
        _log_error("META and CMD key combos cannot have more than 1 non-modifier keys", combo, non_modifier_keys);
        validated = false;
      }
    }
    for (property in combo) {
      value = combo[property];
      if (_factory_defaults[property] === "undefined") {
        _log_error("The property " + property + " is not a valid combo property. Your combo has still been registered.");
      }
    }
    return validated;
  };

  _convert_to_shifted_key = function _convert_to_shifted_key(key, e) {
    var k;
    if (!e.shiftKey) {
      return false;
    }
    k = _keycode_shifted_keys[key];
    if (k != null) {
      return k;
    }
    return false;
  };

  _modifier_event_mapping = {
    "cmd": "metaKey",
    "ctrl": "ctrlKey",
    "shift": "shiftKey",
    "alt": "altKey"
  };

  _keycode_alternate_names = {
    "escape": "esc",
    "control": "ctrl",
    "command": "cmd",
    "break": "pause",
    "windows": "cmd",
    "option": "alt",
    "caps_lock": "caps",
    "apostrophe": "\'",
    "semicolon": ";",
    "tilde": "~",
    "accent": "`",
    "scroll_lock": "scroll",
    "num_lock": "num"
  };

  _keycode_shifted_keys = {
    "/": "?",
    ".": ">",
    ",": "<",
    "\'": "\"",
    ";": ":",
    "[": "{",
    "]": "}",
    "\\": "|",
    "`": "~",
    "=": "+",
    "-": "_",
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")"
  };

  _keycode_dictionary = {
    0: "\\",
    8: "backspace",
    9: "tab",
    12: "num",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "caps",
    27: "esc",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    44: "print",
    45: "insert",
    46: "delete",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "cmd",
    92: "cmd",
    93: "cmd",
    96: "num_0",
    97: "num_1",
    98: "num_2",
    99: "num_3",
    100: "num_4",
    101: "num_5",
    102: "num_6",
    103: "num_7",
    104: "num_8",
    105: "num_9",
    106: "num_multiply",
    107: "num_add",
    108: "num_enter",
    109: "num_subtract",
    110: "num_decimal",
    111: "num_divide",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    124: "print",
    144: "num",
    145: "scroll",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "\'",
    223: "`",
    224: "cmd",
    225: "alt",
    57392: "ctrl",
    63289: "num",
    59: ";",
    61: "=",
    173: "-"
  };

  keypress._keycode_dictionary = _keycode_dictionary;

  keypress._is_array_in_array_sorted = _is_array_in_array_sorted;

  _decide_meta_key();

  _change_keycodes_by_browser();

  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return keypress;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined" && exports !== null) {
    exports.keypress = keypress;
  } else {
    window.keypress = keypress;
  }
}).call(undefined);

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = Quality;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    shadows: true,
    shadowMapType: THREE.PCFSoftShadowMap,
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

        this.params = _Utils2.default.AssignUndefined(params, defaultParams);
        this.renderer = new THREE.WebGLRenderer({ antialias: this.params.antialias });

        this.renderer.shadowMap.enabled = this.params.shadows;
        this.renderer.shadowMap.type = this.params.shadowMapType;
        this.renderer.shadowMap.autoUpdate = this.params.shadowsAutoUpdate;

        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.toneMapping = THREE.Uncharted2ToneMapping;
        this.renderer.toneMappingExposure = 1.4;
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

exports.default = Renderer;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finger swipe

THREE.OrbitControls = function (object, domElement) {

		this.object = object;

		this.domElement = domElement !== undefined ? domElement : document;

		// Set to false to disable this control
		this.enabled = true;

		// Rect areas that are ignored
		this.ignoredAreas = [];

		// "target" sets the location of focus, where the object orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = -Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.panningMode = THREE.ScreenSpacePanning; // alternate THREE.HorizontalPanning
		this.keyPanSpeed = 7.0; // pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		//
		// public methods
		//

		this.getPolarAngle = function () {

				return spherical.phi;
		};

		this.getAzimuthalAngle = function () {

				return spherical.theta;
		};

		this.saveState = function () {

				scope.target0.copy(scope.target);
				scope.position0.copy(scope.object.position);
				scope.zoom0 = scope.object.zoom;
		};

		this.reset = function () {

				scope.target.copy(scope.target0);
				scope.object.position.copy(scope.position0);
				scope.object.zoom = scope.zoom0;

				scope.object.updateProjectionMatrix();
				scope.dispatchEvent(changeEvent);

				scope.update();

				state = STATE.NONE;
		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

				var offset = new THREE.Vector3();

				// so camera.up is the orbit axis
				var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
				var quatInverse = quat.clone().inverse();

				var lastPosition = new THREE.Vector3();
				var lastQuaternion = new THREE.Quaternion();

				return function update() {

						var position = scope.object.position;

						offset.copy(position).sub(scope.target);

						// rotate offset to "y-axis-is-up" space
						offset.applyQuaternion(quat);

						// angle from z-axis around y-axis
						spherical.setFromVector3(offset);

						if (scope.autoRotate && state === STATE.NONE) {

								rotateLeft(getAutoRotationAngle());
						}

						spherical.theta += sphericalDelta.theta;
						spherical.phi += sphericalDelta.phi;

						// restrict theta to be between desired limits
						spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));

						// restrict phi to be between desired limits
						spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

						spherical.makeSafe();

						spherical.radius *= scale;

						// restrict radius to be between desired limits
						spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

						// move target to panned location
						scope.target.add(panOffset);

						offset.setFromSpherical(spherical);

						// rotate offset back to "camera-up-vector-is-up" space
						offset.applyQuaternion(quatInverse);

						position.copy(scope.target).add(offset);

						scope.object.lookAt(scope.target);

						if (scope.enableDamping === true) {

								sphericalDelta.theta *= 1 - scope.dampingFactor;
								sphericalDelta.phi *= 1 - scope.dampingFactor;

								panOffset.multiplyScalar(1 - scope.dampingFactor);
						} else {

								sphericalDelta.set(0, 0, 0);

								panOffset.set(0, 0, 0);
						}

						scale = 1;

						// update condition is:
						// min(camera displacement, camera rotation in radians)^2 > EPS
						// using small-angle approximation cos(x/2) = 1 - x^2 / 8

						if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {

								scope.dispatchEvent(changeEvent);

								lastPosition.copy(scope.object.position);
								lastQuaternion.copy(scope.object.quaternion);
								zoomChanged = false;

								return true;
						}

						return false;
				};
		}();

		this.dispose = function () {

				scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
				scope.domElement.removeEventListener('mousedown', onMouseDown, false);
				scope.domElement.removeEventListener('wheel', onMouseWheel, false);

				scope.domElement.removeEventListener('touchstart', onTouchStart, false);
				scope.domElement.removeEventListener('touchend', onTouchEnd, false);
				scope.domElement.removeEventListener('touchmove', onTouchMove, false);

				scope.domElement.removeEventListener('mousemove', onMouseMove, false);
				document.removeEventListener('mouseup', onMouseUp, false);

				window.removeEventListener('keydown', onKeyDown, false);

				//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
		};

		//
		// internals
		//

		var scope = this;

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

		var state = STATE.NONE;

		var EPS = 0.000001;

		// current position in spherical coordinates
		var spherical = new THREE.Spherical();
		var sphericalDelta = new THREE.Spherical();

		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		function getAutoRotationAngle() {

				return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
		}

		function getZoomScale() {

				return Math.pow(0.95, scope.zoomSpeed);
		}

		function rotateLeft(angle) {

				sphericalDelta.theta -= angle;
		}

		function rotateUp(angle) {

				sphericalDelta.phi -= angle;
		}

		var panLeft = function () {

				var v = new THREE.Vector3();

				return function panLeft(distance, objectMatrix) {

						v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
						v.multiplyScalar(-distance);

						panOffset.add(v);
				};
		}();

		var panUp = function () {

				var v = new THREE.Vector3();

				return function panUp(distance, objectMatrix) {

						switch (scope.panningMode) {

								case THREE.ScreenSpacePanning:

										v.setFromMatrixColumn(objectMatrix, 1);
										break;

								case THREE.HorizontalPanning:

										v.setFromMatrixColumn(objectMatrix, 0);
										v.crossVectors(scope.object.up, v);
										break;

						}

						v.multiplyScalar(distance);

						panOffset.add(v);
				};
		}();

		// deltaX and deltaY are in pixels; right and down are positive
		var pan = function () {

				var offset = new THREE.Vector3();

				return function pan(deltaX, deltaY) {

						var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

						if (scope.object.isPerspectiveCamera) {

								// perspective
								var position = scope.object.position;
								offset.copy(position).sub(scope.target);
								var targetDistance = offset.length();

								// half of the fov is center to top of screen
								targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180.0);

								// we actually don't use screenWidth, since perspective camera is fixed to screen height
								panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
								panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
						} else if (scope.object.isOrthographicCamera) {

								// orthographic
								panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
								panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
						} else {

								// camera neither orthographic nor perspective
								console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
								scope.enablePan = false;
						}
				};
		}();

		function dollyIn(dollyScale) {

				if (scope.object.isPerspectiveCamera) {

						scale /= dollyScale;
				} else if (scope.object.isOrthographicCamera) {

						scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
						scope.object.updateProjectionMatrix();
						zoomChanged = true;
				} else {

						console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
						scope.enableZoom = false;
				}
		}

		function dollyOut(dollyScale) {

				if (scope.object.isPerspectiveCamera) {

						scale *= dollyScale;
				} else if (scope.object.isOrthographicCamera) {

						scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
						scope.object.updateProjectionMatrix();
						zoomChanged = true;
				} else {

						console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
						scope.enableZoom = false;
				}
		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate(event) {

				//console.log( 'handleMouseDownRotate' );

				rotateStart.set(event.clientX, event.clientY);
		}

		function handleMouseDownDolly(event) {

				//console.log( 'handleMouseDownDolly' );

				dollyStart.set(event.clientX, event.clientY);
		}

		function handleMouseDownPan(event) {

				//console.log( 'handleMouseDownPan' );

				panStart.set(event.clientX, event.clientY);
		}

		function handleMouseMoveRotate(event) {

				//console.log( 'handleMouseMoveRotate' );

				rotateEnd.set(event.clientX, event.clientY);
				rotateDelta.subVectors(rotateEnd, rotateStart);

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				// rotating across whole screen goes 360 degrees around
				rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

				// rotating up and down along whole screen attempts to go 360, but limited to 180
				rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

				rotateStart.copy(rotateEnd);

				scope.update();
		}

		function handleMouseMoveDolly(event) {

				//console.log( 'handleMouseMoveDolly' );

				dollyEnd.set(event.clientX, event.clientY);

				dollyDelta.subVectors(dollyEnd, dollyStart);

				if (dollyDelta.y > 0) {

						dollyIn(getZoomScale());
				} else if (dollyDelta.y < 0) {

						dollyOut(getZoomScale());
				}

				dollyStart.copy(dollyEnd);

				scope.update();
		}

		function handleMouseMovePan(event) {

				//console.log( 'handleMouseMovePan' );

				panEnd.set(event.clientX, event.clientY);

				panDelta.subVectors(panEnd, panStart);

				pan(panDelta.x, panDelta.y);

				panStart.copy(panEnd);

				scope.update();
		}

		function handleMouseUp(event) {

				// console.log( 'handleMouseUp' );

		}

		function handleMouseWheel(event) {

				// console.log( 'handleMouseWheel' );

				if (event.deltaY < 0) {

						dollyOut(getZoomScale());
				} else if (event.deltaY > 0) {

						dollyIn(getZoomScale());
				}

				scope.update();
		}

		function handleKeyDown(event) {

				//console.log( 'handleKeyDown' );

				switch (event.keyCode) {

						case scope.keys.UP:
								pan(0, scope.keyPanSpeed);
								scope.update();
								break;

						case scope.keys.BOTTOM:
								pan(0, -scope.keyPanSpeed);
								scope.update();
								break;

						case scope.keys.LEFT:
								pan(scope.keyPanSpeed, 0);
								scope.update();
								break;

						case scope.keys.RIGHT:
								pan(-scope.keyPanSpeed, 0);
								scope.update();
								break;

				}
		}

		function handleTouchStartRotate(event) {

				//console.log( 'handleTouchStartRotate' );

				rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
		}

		function handleTouchStartDolly(event) {

				//console.log( 'handleTouchStartDolly' );

				var dx = event.touches[0].pageX - event.touches[1].pageX;
				var dy = event.touches[0].pageY - event.touches[1].pageY;

				var distance = Math.sqrt(dx * dx + dy * dy);

				dollyStart.set(0, distance);
		}

		function handleTouchStartPan(event) {

				//console.log( 'handleTouchStartPan' );

				panStart.set(event.touches[0].pageX, event.touches[0].pageY);
		}

		function handleTouchMoveRotate(event) {

				//console.log( 'handleTouchMoveRotate' );

				rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
				rotateDelta.subVectors(rotateEnd, rotateStart);

				var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

				// rotating across whole screen goes 360 degrees around
				rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);

				// rotating up and down along whole screen attempts to go 360, but limited to 180
				rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);

				rotateStart.copy(rotateEnd);

				scope.update();
		}

		function handleTouchMoveDolly(event) {

				//console.log( 'handleTouchMoveDolly' );

				var dx = event.touches[0].pageX - event.touches[1].pageX;
				var dy = event.touches[0].pageY - event.touches[1].pageY;

				var distance = Math.sqrt(dx * dx + dy * dy);

				dollyEnd.set(0, distance);

				dollyDelta.subVectors(dollyEnd, dollyStart);

				if (dollyDelta.y > 0) {

						dollyOut(getZoomScale());
				} else if (dollyDelta.y < 0) {

						dollyIn(getZoomScale());
				}

				dollyStart.copy(dollyEnd);

				scope.update();
		}

		function handleTouchMovePan(event) {

				//console.log( 'handleTouchMovePan' );

				panEnd.set(event.touches[0].pageX, event.touches[0].pageY);

				panDelta.subVectors(panEnd, panStart);

				pan(panDelta.x, panDelta.y);

				panStart.copy(panEnd);

				scope.update();
		}

		function handleTouchEnd(event) {

				//console.log( 'handleTouchEnd' );

		}

		function checkIgnoredAreas(event) {

				var rects = scope.ignoredAreas;
				for (var i = 0; i < rects.length; i++) {

						if (rects[i].ContainsPoint(event.clientX, event.clientY)) return true;
				}

				return false;
		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onMouseDown(event) {

				if (scope.enabled === false || checkIgnoredAreas(event)) return;

				event.preventDefault();

				switch (event.button) {

						case scope.mouseButtons.ORBIT:

								if (scope.enableRotate === false) return;

								handleMouseDownRotate(event);

								state = STATE.ROTATE;

								break;

						case scope.mouseButtons.ZOOM:

								if (scope.enableZoom === false) return;

								handleMouseDownDolly(event);

								state = STATE.DOLLY;

								break;

						case scope.mouseButtons.PAN:

								if (scope.enablePan === false) return;

								handleMouseDownPan(event);

								state = STATE.PAN;

								break;

				}

				if (state !== STATE.NONE) {

						scope.domElement.addEventListener('mousemove', onMouseMove, false);
						document.addEventListener('mouseup', onMouseUp, false);

						scope.dispatchEvent(startEvent);
				}
		}

		function onMouseMove(event) {

				if (scope.enabled === false) return;

				event.preventDefault();

				switch (state) {

						case STATE.ROTATE:

								if (scope.enableRotate === false) return;

								handleMouseMoveRotate(event);

								break;

						case STATE.DOLLY:

								if (scope.enableZoom === false) return;

								handleMouseMoveDolly(event);

								break;

						case STATE.PAN:

								if (scope.enablePan === false) return;

								handleMouseMovePan(event);

								break;

				}
		}

		function onMouseUp(event) {

				if (scope.enabled === false) return;

				handleMouseUp(event);

				scope.domElement.removeEventListener('mousemove', onMouseMove, false);
				document.removeEventListener('mouseup', onMouseUp, false);

				scope.dispatchEvent(endEvent);

				state = STATE.NONE;
		}

		function onMouseWheel(event) {

				if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) return;

				event.preventDefault();
				event.stopPropagation();

				scope.dispatchEvent(startEvent);

				handleMouseWheel(event);

				scope.dispatchEvent(endEvent);
		}

		function onKeyDown(event) {

				if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;

				handleKeyDown(event);
		}

		function onTouchStart(event) {

				if (scope.enabled === false || checkIgnoredAreas(event)) return;

				switch (event.touches.length) {

						case 1:
								// one-fingered touch: rotate

								if (scope.enableRotate === false) return;

								handleTouchStartRotate(event);

								state = STATE.TOUCH_ROTATE;

								break;

						case 2:
								// two-fingered touch: dolly

								if (scope.enableZoom === false) return;

								handleTouchStartDolly(event);

								state = STATE.TOUCH_DOLLY;

								break;

						case 3:
								// three-fingered touch: pan

								if (scope.enablePan === false) return;

								handleTouchStartPan(event);

								state = STATE.TOUCH_PAN;

								break;

						default:

								state = STATE.NONE;

				}

				if (state !== STATE.NONE) {

						scope.dispatchEvent(startEvent);
				}
		}

		function onTouchMove(event) {

				if (scope.enabled === false) return;

				event.preventDefault();
				event.stopPropagation();

				switch (event.touches.length) {

						case 1:
								// one-fingered touch: rotate

								if (scope.enableRotate === false) return;
								if (state !== STATE.TOUCH_ROTATE) return; // is this needed?...

								handleTouchMoveRotate(event);

								break;

						case 2:
								// two-fingered touch: dolly

								if (scope.enableZoom === false) return;
								if (state !== STATE.TOUCH_DOLLY) return; // is this needed?...

								handleTouchMoveDolly(event);

								break;

						case 3:
								// three-fingered touch: pan

								if (scope.enablePan === false) return;
								if (state !== STATE.TOUCH_PAN) return; // is this needed?...

								handleTouchMovePan(event);

								break;

						default:

								state = STATE.NONE;

				}
		}

		function onTouchEnd(event) {

				if (scope.enabled === false) return;

				handleTouchEnd(event);

				scope.dispatchEvent(endEvent);

				state = STATE.NONE;
		}

		function onContextMenu(event) {

				if (scope.enabled === false) return;

				event.preventDefault();
		}

		//

		scope.domElement.addEventListener('contextmenu', onContextMenu, false);

		scope.domElement.addEventListener('mousedown', onMouseDown, false);
		scope.domElement.addEventListener('wheel', onMouseWheel, false);

		scope.domElement.addEventListener('touchstart', onTouchStart, false);
		scope.domElement.addEventListener('touchend', onTouchEnd, false);
		scope.domElement.addEventListener('touchmove', onTouchMove, false);

		window.addEventListener('keydown', onKeyDown, false);

		// force an update at start

		this.update();
};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

Object.defineProperties(THREE.OrbitControls.prototype, {

		center: {

				get: function get() {

						console.warn('THREE.OrbitControls: .center has been renamed to .target');
						return this.target;
				}

		},

		// backward compatibility

		noZoom: {

				get: function get() {

						console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
						return !this.enableZoom;
				},

				set: function set(value) {

						console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
						this.enableZoom = !value;
				}

		},

		noRotate: {

				get: function get() {

						console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
						return !this.enableRotate;
				},

				set: function set(value) {

						console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
						this.enableRotate = !value;
				}

		},

		noPan: {

				get: function get() {

						console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
						return !this.enablePan;
				},

				set: function set(value) {

						console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
						this.enablePan = !value;
				}

		},

		noKeys: {

				get: function get() {

						console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
						return !this.enableKeys;
				},

				set: function set(value) {

						console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
						this.enableKeys = !value;
				}

		},

		staticMoving: {

				get: function get() {

						console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
						return !this.enableDamping;
				},

				set: function set(value) {

						console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
						this.enableDamping = !value;
				}

		},

		dynamicDampingFactor: {

				get: function get() {

						console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
						return this.dampingFactor;
				},

				set: function set(value) {

						console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
						this.dampingFactor = value;
				}

		}

});

THREE.ScreenSpacePanning = 0;
THREE.HorizontalPanning = 1;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Controller2 = __webpack_require__(42);

var _Controller3 = _interopRequireDefault(_Controller2);

var _Camera = __webpack_require__(18);

var _Camera2 = _interopRequireDefault(_Camera);

var _Transform = __webpack_require__(64);

var _Transform2 = _interopRequireDefault(_Transform);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _EntryInputView = __webpack_require__(43);

var _EntryInputView2 = _interopRequireDefault(_EntryInputView);

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

var _SceneSetup = __webpack_require__(17);

var _SceneSetup2 = _interopRequireDefault(_SceneSetup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef {Object} HUDViewParams
 * @property {import('../UX').default} ux
 * @property {SceneSetup} sceneSetup
 * @property {HTMLElement} container
 */

/** @type {HUDViewParams} */
var defaultParams = {};

// -11.3, 23.9, 215.5
var defaultCamTRS = new _Transform2.default(new THREE.Vector3(0, 100, 800), new THREE.Euler(0, Math.PI, 0));

var HUDView = function (_Controller) {
    _inherits(HUDView, _Controller);

    /**
     * @param {HUDViewParams} params 
     * @param {import('../scene/Camera').CameraParams} cameraParams 
     */
    function HUDView(params, cameraParams) {
        _classCallCheck(this, HUDView);

        var _this = _possibleConstructorReturn(this, (HUDView.__proto__ || Object.getPrototypeOf(HUDView)).call(this, params));

        _this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        var units = _this.params.ux.params.units;

        _this.cameraController = new _Camera2.default(cameraParams);

        _this.cameraTransform = defaultCamTRS.Clone();
        _this.cameraTransform.position.multiplyScalar(units);
        _this.cameraTransform.Apply(_this.cameraController);
        _this.cameraController.camera.updateMatrixWorld();
        _this.cameraController.OrbitControls(_this.params.container);
        _this.cameraController.SetTarget(new THREE.Vector3());
        _this.cameraController.Hold();

        //var gridHelper = new THREE.GridHelper(100 * units, 20);
        //this.AddDefault(gridHelper);

        /** @type {EntryInputViewParams} */
        var entryInputViewParams = { ux: _this.params.ux, sceneSetup: _this.params.sceneSetup, scaleFigure: _this.params.ux.params.scaleRefFigure };
        _this.entryInputView = new _EntryInputView2.default(entryInputViewParams);
        _this.AddDefault(_this.entryInputView.view);

        _this.lastUpdateTime = 0;

        _this.params.sceneSetup.input.onMouseUp.push(_this.OnMouseUp.bind(_this));
        return _this;
    }

    _createClass(HUDView, [{
        key: "OnMouseUp",
        value: function OnMouseUp() {
            if (this.entryInputView.previewing) {
                this.entryInputView.Preview(false);
            }
        }

        /**
         * @param {CargoEntry} entry 
         */

    }, {
        key: "Preview",
        value: function Preview(entry) {
            this.entryInputView.Preview(entry);
        }

        /** @param {Number} now */

    }, {
        key: "Update",
        value: function Update(now) {
            var deltaTime = now - this.lastUpdateTime;
            this.lastUpdateTime = now;
            this.cameraController.Update();

            this.entryInputView.Update(now, deltaTime);
        }
    }]);

    return HUDView;
}(_Controller3.default);

exports.default = HUDView;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = Transform;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TranslationConstraint = exports.RotationConstraint = exports.StackingProperty = exports.PackingProperty = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        /**
         * @param {PackingProperty} prop 
         */

    }, {
        key: 'Copy',
        value: function Copy(prop) {
            this.enabled = prop.enabled;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            _Logger2.default.Warn('PackingProperty.Clone is not implemented');
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

var StackingProperty = function (_PackingProperty) {
    _inherits(StackingProperty, _PackingProperty);

    function StackingProperty() {
        _classCallCheck(this, StackingProperty);

        /** Maximum stacking capacity (weight) */
        var _this = _possibleConstructorReturn(this, (StackingProperty.__proto__ || Object.getPrototypeOf(StackingProperty)).call(this));

        _this.capacity = Number.MAX_SAFE_INTEGER;
        return _this;
    }

    _createClass(StackingProperty, [{
        key: 'Reset',
        value: function Reset() {
            _get(StackingProperty.prototype.__proto__ || Object.getPrototypeOf(StackingProperty.prototype), 'Reset', this).call(this);
            this.capacity = Number.MAX_SAFE_INTEGER;
        }

        /**
         * @param {StackingProperty} prop 
         */

    }, {
        key: 'Copy',
        value: function Copy(prop) {
            _get(StackingProperty.prototype.__proto__ || Object.getPrototypeOf(StackingProperty.prototype), 'Copy', this).call(this, prop);
            this.capacity = prop.capacity;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var prop = new StackingProperty();
            prop.Copy(this);
            return prop;
        }
    }]);

    return StackingProperty;
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
            _get(Constraint.prototype.__proto__ || Object.getPrototypeOf(Constraint.prototype), 'Copy', this).call(this, prop);
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            _Logger2.default.Warn('Constraint.Clone is not implemented');
        }
    }]);

    return Constraint;
}(PackingProperty);

var orientations = { xyz: 'xyz', zyx: 'zyx', yxz: 'yxz', yzx: 'yzx', zxy: 'zxy', xzy: 'xzy' };
var _allowedOrientations = Symbol('allowedOrientations');

var RotationConstraint = function (_Constraint) {
    _inherits(RotationConstraint, _Constraint);

    function RotationConstraint() {
        _classCallCheck(this, RotationConstraint);

        return _possibleConstructorReturn(this, (RotationConstraint.__proto__ || Object.getPrototypeOf(RotationConstraint)).call(this));
    }

    /** Enables each orientation enumeration in array
     * @param {Array<orientations>} value */


    _createClass(RotationConstraint, [{
        key: 'Reset',
        value: function Reset() {
            _get(RotationConstraint.prototype.__proto__ || Object.getPrototypeOf(RotationConstraint.prototype), 'Reset', this).call(this);
            if (this.allowedOrientations instanceof Array) this.allowedOrientations.length = 0;
        }

        /** @param {Boolean} allowX @param {Boolean} allowY @param {Boolean} allowZ */

    }, {
        key: 'SetOrientationsByAxis',
        value: function SetOrientationsByAxis(allowX, allowY, allowZ) {
            var allowed = this.allowedOrientations;
            if (allowed) allowed.length = 0;else allowed = [];

            if (allowY) {
                allowed.push(orientations.xyz, orientations.zyx);

                if (allowX) allowed.push(orientations.yzx);
                if (allowZ) allowed.push(orientations.zxy);
            }
            if (allowX) allowed.push(orientations.xzy);
            if (allowZ) allowed.push(orientations.yxz);

            this.allowedOrientations = allowed;
        }

        /** @param {Boolean} allowWH @param {Boolean} allowLH @param {Boolean} allowWL */

    }, {
        key: 'SetOrientationsBySide',
        value: function SetOrientationsBySide(allowWH, allowLH, allowWL) {
            var allowed = this.allowedOrientations;
            if (allowed) allowed.length = 0;else allowed = [];

            if (allowWH) allowed.push(orientations.yxz, orientations.yzx);
            if (allowLH) allowed.push(orientations.xzy, orientations.zxy);
            if (allowWL) allowed.push(orientations.xyz, orientations.zyx);

            this.allowedOrientations = allowed;
        }

        /**
         * @param {RotationConstraint} prop 
         */

    }, {
        key: 'Copy',
        value: function Copy(prop) {
            _get(RotationConstraint.prototype.__proto__ || Object.getPrototypeOf(RotationConstraint.prototype), 'Copy', this).call(this, prop);
            this.allowedOrientations = prop.allowedOrientations instanceof Array ? prop.allowedOrientations.slice() : undefined;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var prop = new RotationConstraint();
            prop.Copy(this);
            return prop;
        }

        /** Enumerations of orientation values, do not modify directly */

    }, {
        key: 'allowedOrientations',
        set: function set(value) {
            this[_allowedOrientations] = value;
        },
        get: function get() {
            return this[_allowedOrientations];
        }
    }], [{
        key: 'orientations',
        get: function get() {
            return orientations;
        }
    }]);

    return RotationConstraint;
}(Constraint);

var TranslationConstraint = function (_Constraint2) {
    _inherits(TranslationConstraint, _Constraint2);

    function TranslationConstraint() {
        _classCallCheck(this, TranslationConstraint);

        /** Should be positioned on the platform surface (on the ground) */
        var _this4 = _possibleConstructorReturn(this, (TranslationConstraint.__proto__ || Object.getPrototypeOf(TranslationConstraint)).call(this));

        _this4.grounded = false;
        return _this4;
    }

    _createClass(TranslationConstraint, [{
        key: 'Reset',
        value: function Reset() {
            _get(TranslationConstraint.prototype.__proto__ || Object.getPrototypeOf(TranslationConstraint.prototype), 'Reset', this).call(this);
            this.grounded = false;
        }

        /**
         * @param {TranslationConstraint} prop 
         */

    }, {
        key: 'Copy',
        value: function Copy(prop) {
            _get(TranslationConstraint.prototype.__proto__ || Object.getPrototypeOf(TranslationConstraint.prototype), 'Copy', this).call(this, prop);
            this.grounded = prop.grounded;
        }
    }, {
        key: 'Clone',
        value: function Clone() {
            var prop = new TranslationConstraint();
            prop.Copy(this);
            return prop;
        }
    }]);

    return TranslationConstraint;
}(Constraint);

exports.PackingProperty = PackingProperty;
exports.StackingProperty = StackingProperty;
exports.RotationConstraint = RotationConstraint;
exports.TranslationConstraint = TranslationConstraint;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var typeofNumber = 'number';

/** @param {THREE.Color} source @param {Array<THREE.Color>} colors */
function findNearest(source, colors) {
    var dMin = Number.MAX_SAFE_INTEGER;
    var nearest = source;
    colors.forEach(function (color) {
        var vx = color.r - source.r,
            vy = color.g - source.g,
            vz = color.b - source.b;
        var d = vx * vx + vy * vy + vz * vz;
        if (d < dMin) {
            dMin = d;
            nearest = color;
        }
    });

    return nearest;
}

var tempColor = new THREE.Color();

var ColorTemplate = function () {
    /**
     * @param {Array<string|THREE.Color>} colors 
     */
    function ColorTemplate() {
        var _this = this;

        _classCallCheck(this, ColorTemplate);

        /** @type {Array<THREE.Color>} */
        this.colors = [];

        for (var _len = arguments.length, colors = Array(_len), _key = 0; _key < _len; _key++) {
            colors[_key] = arguments[_key];
        }

        colors.forEach(function (color) {
            if (!(color instanceof THREE.Color)) color = new THREE.Color(color);
            _this.colors.push(color);
        });
    }

    /**
     * @template T
     * @param {T} target 
     * @returns {T}
     */


    _createClass(ColorTemplate, [{
        key: 'Apply',
        value: function Apply(target) {
            var scope = this;
            if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === typeofNumber) {
                var mapColor = findNearest(tempColor.setHex(target), this.colors);
                target = mapColor.getHex();
            } else if (target instanceof THREE.Color) {
                var _mapColor = findNearest(target, this.colors);
                target.copy(_mapColor);
            } else if (target instanceof THREE.Material) {
                var color = target.color;
                if (color instanceof THREE.Color) {
                    var _mapColor2 = findNearest(color, this.colors);
                    color.copy(_mapColor2);
                }
            } else if (target instanceof THREE.Object3D) {
                target.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        scope.Apply(child.material);
                    }
                });
            }
            return target;
        }
    }]);

    return ColorTemplate;
}();

exports.default = ColorTemplate;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Slide = exports.Transition = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tween = __webpack_require__(19);

var _Tween2 = _interopRequireDefault(_Tween);

var _Signaler2 = __webpack_require__(1);

var _Signaler3 = _interopRequireDefault(_Signaler2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tempBox3 = new THREE.Box3();
var tempVec3 = new THREE.Vector3();
var clock = new THREE.Clock();

var TransitionController = function TransitionController() {
    _classCallCheck(this, TransitionController);
};

var Slide = function (_TransitionController) {
    _inherits(Slide, _TransitionController);

    /**
     * Slide from, to. ie: slideFromLeft -> from = 1 & to = 0
     * @param {string} property 
     * @param {Number} from 
     * @param {Number} to 
     */
    function Slide(property, from, to) {
        _classCallCheck(this, Slide);

        var _this = _possibleConstructorReturn(this, (Slide.__proto__ || Object.getPrototypeOf(Slide)).call(this));

        _this.tween = new _Tween2.default(_Tween2.default.functions.linear, 0, 0, 0);
        _this.property = property;
        _this.from = from;
        _this.to = to;
        return _this;
    }

    /** @param {Transition} transition */


    _createClass(Slide, [{
        key: "Init",
        value: function Init(transition) {

            transition.bounds.getSize(tempVec3);
            var offset = tempVec3.x;
            transition.bounds.getCenter(tempVec3);
            offset += transition.target.position.x - tempVec3.x;

            this.tween.startValue = offset * this.from;
            this.tween.delta = -(offset * this.from) + offset * this.to;
            this.tween.duration = transition.duration;
            this.tween.onComplete = transition.OnComplete.bind(transition);

            this.tween.Hook(transition.target.position, this.property);
        }
    }, {
        key: "Start",
        value: function Start() {
            this.tween.Update(0);
        }

        /** @param {Number} t */

    }, {
        key: "Update",
        value: function Update(t) {
            this.tween.Update(t);
        }
    }]);

    return Slide;
}(TransitionController);

var signals = {
    complete: 'complete'
};

var _controller = Symbol('controller');

var Transition = function (_Signaler) {
    _inherits(Transition, _Signaler);

    /**
     * @param {THREE.Object3D} boundsView object to calculate bounds from
     * @param {THREE.Object3D} transformView object to transform
     * @param {Number} duration
     */
    function Transition(boundsView, transformView, duration) {
        _classCallCheck(this, Transition);

        var _this2 = _possibleConstructorReturn(this, (Transition.__proto__ || Object.getPrototypeOf(Transition)).call(this));

        _this2.bounds = new THREE.Box3();
        _this2.bounds.setFromObject(boundsView);

        _this2.target = transformView;
        _this2.duration = duration;
        return _this2;
    }

    /** @param {TransitionController} value */


    _createClass(Transition, [{
        key: "OnComplete",
        value: function OnComplete() {
            this.Dispatch(signals.complete, this.controller);
        }
    }, {
        key: "Start",
        value: function Start() {
            this.startTime = clock.getElapsedTime();
            if (this.controller) this.controller.Start();
        }
    }, {
        key: "Update",
        value: function Update() {
            var t = clock.getElapsedTime() - this.startTime;
            if (this.controller) this.controller.Update(t);
        }
    }, {
        key: "controller",
        set: function set(value) {
            this[_controller] = value;
        },
        get: function get() {
            return this[_controller];
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return Transition;
}(_Signaler3.default);

exports.Transition = Transition;
exports.Slide = Slide;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _App = __webpack_require__(24);

var _App2 = _interopRequireDefault(_App);

var _LightDispatcher2 = __webpack_require__(14);

var _LightDispatcher3 = _interopRequireDefault(_LightDispatcher2);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _app = Symbol('app');

var typeofNumber = 'number';

var PackResults = function () {

    /** @param {App} app */
    function PackResults(app) {
        _classCallCheck(this, PackResults);

        this[_app] = app;
    }

    _createClass(PackResults, [{
        key: "SliceResults",


        /** Hides stacked boxes in viewer by vertical position
         * 0: None - 1: All (over y span)
         * @param {Number} value
         */
        value: function SliceResults(value) {

            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== typeofNumber) {
                _Logger2.default.Warn('PackResults.SliceResults error, parameter is not a number:', value);
                return;
            }

            /** @type {App} */
            var app = this[_app];
            app.view.packResultView.Slice(value);
        }
    }, {
        key: "animationDuration",
        get: function get() {
            /** @type {App} */
            var app = this[_app];
            return app.view.packResultView.params.animationDuration;
        },
        set: function set(value) {

            if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== typeofNumber) {
                _Logger2.default.Warn('PackResults.animationDuration error, parameter is not a number:', value);
                return;
            }

            /** @type {App} */
            var app = this[_app];
            app.view.packResultView.params.animationDuration = value;
        }
    }]);

    return PackResults;
}();

var visualizationSignals = {};

var Visualization = function (_LightDispatcher) {
    _inherits(Visualization, _LightDispatcher);

    /** @param {App} app */
    function Visualization(app) {
        _classCallCheck(this, Visualization);

        var _this = _possibleConstructorReturn(this, (Visualization.__proto__ || Object.getPrototypeOf(Visualization)).call(this));

        _this[_app] = app;

        _this.packResults = new PackResults(app);
        return _this;
    }

    /** Selects an entry in the scene, optionally highlighting packed instances
     *  @param {string | Boolean} [entryUID] default = false (deselect) @param {Boolean} [highlightPackedInstances] default = true */


    _createClass(Visualization, [{
        key: "SelectEntry",
        value: function SelectEntry(entryUID, highlightPackedInstances) {
            /** @type {App} */
            var app = this[_app];

            if (entryUID && !app.packer.cargoList.GetEntry(entryUID)) {
                _Logger2.default.Warn('Visualization.SelectEntry failed, entry not found for:', entryUID);
                return;
            }

            app.view.cargoListView.Select(entryUID);

            if (highlightPackedInstances === undefined) highlightPackedInstances = true;
            if (highlightPackedInstances || !entryUID) app.view.packResultView.SelectEntry(entryUID);
        }

        /** Enumeration of dispatched types */

    }], [{
        key: "signals",
        get: function get() {
            return visualizationSignals;
        }
    }]);

    return Visualization;
}(_LightDispatcher3.default);

exports.default = Visualization;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CargoGroup = __webpack_require__(35);

var _CargoGroup2 = _interopRequireDefault(_CargoGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

exports.default = Cargo;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dimensions = __webpack_require__(33);

var _Dimensions2 = _interopRequireDefault(_Dimensions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this.dimensions = new _Dimensions2.default();

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
            volume.dimensions = _Dimensions2.default.FromJSON(data.dimensions);

            return volume;
        }
    }]);

    return Volume;
}();

exports.default = Volume;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pack = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /** @author chadiik <http://chadiik.com/> */

/**
 * 
 * @param {Container} container 
 * @param {Array<Item>} items // this array (and content) will be changed/emptied
 * @param {CUBParams} params 
 */
var pack = function () {
    var _ref2 = _asyncToGenerator(function* (container, items, params) {

        params = _Utils2.default.AssignUndefined(params, defaultParams);

        var packingAssistant = new PackingAssistant(container, params);

        function heuLessWaste() {
            return new _HeuLessWaste2.default(Object.assign({}, packingAssistant.params));
        }

        function heuParametric1() {
            var heuParams = new _HeuParametric2.default.Params(params);
            return new _HeuParametric2.default(heuParams);
        }

        var heuristics = heuLessWaste();
        var result = yield packingAssistant.Solve(items, heuristics);

        return result;
    });

    return function pack(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}();

var _Components = __webpack_require__(8);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

var _RegionsTree = __webpack_require__(25);

var _RegionsTree2 = _interopRequireDefault(_RegionsTree);

var _PackedComponents = __webpack_require__(13);

var _CUBDebug = __webpack_require__(48);

var _HeuLessWaste = __webpack_require__(76);

var _HeuLessWaste2 = _interopRequireDefault(_HeuLessWaste);

var _Heuristic = __webpack_require__(26);

var _Heuristic2 = _interopRequireDefault(_Heuristic);

var _HeuRegular = __webpack_require__(77);

var _HeuRegular2 = _interopRequireDefault(_HeuRegular);

var _HeuParametric = __webpack_require__(78);

var _HeuParametric2 = _interopRequireDefault(_HeuParametric);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//#region typedefs
/** @typedef Vec2 @property {Number} x @property {Number} y */

/**
 * @typedef CUBParams
 * @property {Number} minZ_weight score for tightly packing in length (Z)
 * @property {Number} minWaste_weight score for minimizing wasted space
 */

/**
 * @typedef PackingAssistantParams extends CUBParams
 * @property {Array<Number>} minDimensionsNoWasteFactor
 * @property {Number} minZ_weight score for tightly packing in length (Z)
 * @property {Number} minWaste_weight score for minimizing wasted space
 */

//#endregion 

/** @type {CUBParams} */
var defaultParams = {
    minZ_weight: .9,
    minWaste_weight: .1
};

/** @type {PackingAssistantParams} */
var defaultPackingAssitantParams = {
    minDimensionsNoWasteFactor: [1, 1, 1]
};

var epsilon = Math.pow(2, -52);
var smallValue = .000001;

var tempRegion = new _Region2.default();
var tempRegion2 = new _Region2.default();

var PackingAssistant = function () {
    /**
     * 
     * @param {Container} container 
     * @param {PackingAssistantParams} params 
     */
    function PackingAssistant(container, params) {
        _classCallCheck(this, PackingAssistant);

        this.params = _Utils2.default.AssignUndefined(Object.assign({}, params), defaultPackingAssitantParams);
        this.container = container;
        this.packedContainer = new _PackedComponents.PackedContainer(container);

        var firstRegion = new _Region2.default(0, 0, 0, container.width, container.height, container.length, 0);
        firstRegion.SetWeights(0, container.weightCapacity, 0);
        this.regionsTree = new _RegionsTree2.default(firstRegion);

        /** @type {Item} */
        this.workingItem;
    }

    /** @param {PackedItem} packedItem @param {Boolean} [harsh] default = false */


    _createClass(PackingAssistant, [{
        key: "ProcessRegionsPerPackedItem",
        value: function ProcessRegionsPerPackedItem(packedItem, harsh) {
            var regions = this.regionsTree.regions;
            var itemVolume = packedItem.ref.volume;

            // Creates temporary region for following calculations
            var packedRegion = tempRegion.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, 0);
            packedRegion.SetWeights(packedItem.ref.weight, 0, packedItem.ref.stackingCapacity);

            for (var iRegion = 0; iRegion < regions.length; iRegion++) {
                var region = regions[iRegion];

                if (itemVolume > region.volume && packedRegion.ContainsRegion(smallValue, region)) {
                    regions.splice(iRegion, 1);
                    iRegion--;
                    console.log('Contained region' + iRegion + ' deleted');
                    continue;
                }

                if (packedRegion.Intersects(-smallValue, region)) {

                    if (harsh) {
                        console.log('\tIntersecting region' + iRegion + ' deleted (!)');
                        regions.slice(iRegion, 1);
                        iRegion--;
                        continue;
                    }

                    var regionRemains = this.regionsTree.Occupy(region, packedRegion);
                    iRegion--;
                }
            }
        }
    }, {
        key: "ProcessRegionsForPackedItems",
        value: function ProcessRegionsForPackedItems(harsh) {
            var packedItems = this.packedContainer.packedItems;
            var numPackedItems = packedItems.length;

            for (var iItem = 0; iItem < numPackedItems; iItem++) {
                var packedItem = packedItems[iItem];
                this.ProcessRegionsPerPackedItem(packedItem, harsh);
            }
        }
    }, {
        key: "ProcessRegions",
        value: function ProcessRegions() {

            var containerWidth = this.container.width,
                containerHeight = this.container.height;

            // Recalculate preferred insertion side per region (left or right)
            this.regionsTree.ProcessRegionsPreferredX(containerWidth);

            // Merge and expand free regions (can span several packed item tops)
            this.regionsTree.ProcessRegionsMergeExpand(containerWidth, containerHeight);

            // Removes regions that are completely enclosed in packed volumes, and correct any intersecting ones
            this.ProcessRegionsForPackedItems(false);

            // Removes unuseable regions
            this.regionsTree.ProcessRegionsForZeroRegions();

            // Removes regions that are completely enclosed in larger regions
            this.regionsTree.ProcessRegionsEnclosed();

            // Recalculate preferred insertion side per region (left or right)
            this.regionsTree.ProcessRegionsPreferredX(containerWidth);

            // Sort by z (first) and volume (second)
            this.regionsTree.Sort(_Region2.default.SortDeepestSmallest);
        }

        /** @param {Item} item @param {Heuristic} heuristics */

    }, {
        key: "FitUsingHeuristic",
        value: function FitUsingHeuristic(item, heuristics) {
            // General weight check
            if (this.packedContainer.WeightPass(item.weight) === false) return false;

            var result = heuristics.Fit(item);

            if (result) {
                var placement = result.packedRegion;
                placement.SetWeights(item.weight, 0, item.stackingCapacity);

                // Create a new packed item
                var packedItem = new _PackedComponents.PackedItem(item, placement.x, placement.y, placement.z, placement.width, placement.height, placement.length, result.orientation);

                // Reserve the tested sub region: regionFitTest from the containing region: region
                var regionRemains = this.regionsTree.Occupy(result.containingRegion, placement);

                return packedItem;
            }

            return false;
        }

        /** @param {Array<Item>} items @param {Heuristic} heuristics */

    }, {
        key: "Solve",
        value: function () {
            var _ref = _asyncToGenerator(function* (items, heuristics) {
                var packedContainer = this.packedContainer;
                var iItem = items.length - 1;

                // Helper function
                function unpackItem(index) {
                    var item = items[index];
                    packedContainer.Unpack(item);
                    items.splice(index, 1);
                    iItem--;
                }

                // Helper function
                /** @param {Number} index * @param {PackedItem} item */
                function packItem(index, item) {
                    packedContainer.Pack(item);

                    item.ref.quantity--;
                    if (item.ref.quantity === 0) {
                        items.splice(index, 1);
                        iItem--;
                    }
                }

                var workingSet = {
                    items: items,
                    packedContainer: packedContainer,
                    regionsTree: this.regionsTree
                };

                heuristics.workingSet = workingSet;

                var heuRegular = new _HeuRegular2.default(Object.assign({}, this.params));
                heuRegular.workingSet = workingSet;

                while (items.length > 0) {
                    var item = items[iItem];

                    this.ProcessRegions();
                    packedContainer.packedItems.sort(_PackedComponents.PackedItem.Sort);

                    // Try to pack item
                    var packedItem = this.FitUsingHeuristic(item, heuristics);
                    if (packedItem === false) {
                        // Fallback to regular fitting if failed
                        packedItem = this.FitUsingHeuristic(item, heuRegular);
                    }

                    if (packedItem === false) {

                        /**/(0, _CUBDebug.debugLog)('item fitting failed.');
                        unpackItem(iItem);
                    } else {

                        packItem(iItem, packedItem);
                    }

                    /**/yield (0, _CUBDebug.sleep)(16);
                }

                return packedContainer;
            });

            function Solve(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return Solve;
        }()
    }]);

    return PackingAssistant;
}();

exports.pack = pack;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AFitTest = __webpack_require__(73);

var _AFitTest2 = _interopRequireDefault(_AFitTest);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function delay(time, callback) {
    setTimeout(callback, time);
}

var debugGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
var debugMaterial = new THREE.MeshStandardMaterial({ color: 0xff7f00, transparent: true, opacity: .35 });
_Asset2.default.SetTextureMap('checkers.jpg', debugMaterial, 'map').then(function (map) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
});
var debugBox = new THREE.Mesh(debugGeometry, debugMaterial);

var tempVec = new THREE.Vector3();

var DebugBox = function () {
    function DebugBox() {
        _classCallCheck(this, DebugBox);
    }

    _createClass(DebugBox, null, [{
        key: "FromCenterSize",


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
        key: "FromBox3",
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

var alphaHexMask = 256 * 256 * 256;

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
        key: "SetViewParent",


        /**
         * @param {THREE.Object3D} parent
         */
        value: function SetViewParent(parent) {
            view = new THREE.Object3D();
            view.name = 'DebugViz view';
            console.log(view.name + ' created...');
            view.renderOrder = Number.MAX_SAFE_INTEGER - 10;
            parent.add(view);
        }
    }, {
        key: "DrawVolume",


        /**
         * @param {Number} x center x * @param {Number} y center y * @param {Number} z center z * @param {Number} w * @param {Number} h * @param {Number} l
         * @param {Number} [color] hex color
         * @param {Number} [duration] in milliseconds
         * @param {Boolean} [checkered] checkers map
         */
        value: function DrawVolume(x, y, z, w, h, l, color, duration, wireframe, checkered) {
            tPos.set(x, y, z);
            tScale.set(w, h, l);

            /** @type {THREE.Mesh} */
            var volume = debugBox.clone();
            view.add(volume);

            volume.position.copy(tPos);
            volume.scale.copy(tScale);

            if (color) {
                /** @type {THREE.MeshStandardMaterial} */
                var material = volume.material.clone();
                volume.material = material;
                material.color.setHex(color && 0xffffff);
                if (wireframe === true) {
                    material.wireframe = true;
                } else {
                    material.opacity = Math.floor(color / alphaHexMask) / 256;
                    material.transparent = material.opacity > 0 && material.opacity < .99;
                }

                if (!checkered) {
                    material.map = null;
                } else {
                    material.map.repeat.set(10, 10);
                }
            }

            var uid = THREE.Math.generateUUID();
            debugObjects.set(uid, volume);

            if (duration > 0) {
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
        key: "RemoveObjectByUID",
        value: function RemoveObjectByUID(uid) {
            var object = debugObjects.get(uid);
            if (object instanceof THREE.Object3D && object.parent) {
                object.parent.remove(object);
            }
        }
    }, {
        key: "ClearAll",
        value: function ClearAll() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = debugObjects.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var uid = _step.value;

                    DebugViz.RemoveObjectByUID(uid);
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

        /** @param {Boolean} visible */

    }, {
        key: "SetPackingSpaceVisibility",
        value: function SetPackingSpaceVisibility(visible) {
            Debug.app.view.packingSpaceView.view.visible = visible;
        }
    }, {
        key: "view",
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
        key: "MaterialEdit",
        value: function MaterialEdit(callback) {
            var objects = Debug.app.view.packResultView.cargoViews;
            objects.forEach(function (o) {
                var material = o.mesh.material;
                callback(material);
                material.needsUpdate = true;
            });
        }
    }, {
        key: "AFitTest",
        get: function get() {
            return _AFitTest2.default;
        }
    }]);

    return Debug;
}();

Debug.Box = DebugBox;
Debug.Viz = DebugViz;

/** @type {import('../../FreightPacker').default} */
Debug.api;
/** @type {import('../App').default} */
Debug.app;

exports.default = Debug;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Item = __webpack_require__(74);

var _Item2 = _interopRequireDefault(_Item);

var _Container = __webpack_require__(75);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @param {Array<Object>} objects 
 * @param {Array<string>} m - mapping to Item.constructor, ie: [ID, Length, ...]
 */
function toItems(objects, m) {
    var items = [];
    objects.forEach(function (o) {
        items.push(new _Item2.default(o[m[0]], o[m[1]], o[m[2]], o[m[3]], o[m[4]]));
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
    }

    _createClass(AFitTest, null, [{
        key: "GenerateDataSample1",
        value: function GenerateDataSample1() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 15, Width: 13, Height: 9 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 5, Width: 4, Height: 2, Quantity: 1 }, { ID: 1001, Name: 'Item2', Length: 2, Width: 1, Height: 1, Quantity: 3 }, { ID: 1002, Name: 'Item3', Length: 9, Width: 7, Height: 3, Quantity: 4 }, { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 8 }, { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 1 }, { ID: 1005, Name: 'Item6', Length: 3, Width: 3, Height: 2, Quantity: 2 }];

            var container = Object.assign(new _Container2.default(), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }, {
        key: "GenerateDataSample2",
        value: function GenerateDataSample2() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 60, Width: 35, Height: 25 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 30, Width: 50, Height: 20, Quantity: 1 }, { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 6 }, { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 3 }, { ID: 1005, Name: 'Item6', Length: 5, Width: 5, Height: 2, Quantity: 16 }];

            var container = Object.assign(new _Container2.default(), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }, {
        key: "GenerateDataSampleFlatdeck",
        value: function GenerateDataSampleFlatdeck() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 100, Width: 70, Height: 90, Quantity: 3 }, { ID: 1003, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7 }, { ID: 1004, Name: 'Item5', Length: 40, Width: 20, Height: 30, Quantity: 4 }, { ID: 1005, Name: 'Item6', Length: 30, Width: 20, Height: 30, Quantity: 20 }];

            var container = Object.assign(new _Container2.default(), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }, {
        key: "GenerateDataSampleFlatdeck2",
        value: function GenerateDataSampleFlatdeck2() {
            var containerData = { ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102, WeightCapacity: 48000 };
            var itemsData = [{ ID: 1000, Name: 'Item1', Length: 100, Width: 70, Height: 90, Quantity: 3 }, { ID: 1003, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7, StackingCapacity: 0 }, { ID: 1004, Name: 'Item5', Length: 40, Width: 28, Height: 30, Quantity: 4 }, { ID: 1005, Name: 'Item6', Length: 30, Width: 23, Height: 34, Quantity: 20 }, { ID: 1005, Name: 'Item6', Length: 45, Width: 20, Height: 30, Quantity: 30 }, { ID: 1005, Name: 'Item6', Length: 35, Width: 22, Height: 18, Quantity: 27 }];

            var container = Object.assign(new _Container2.default(), containerData);
            var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

            var data = new TestData(container, items);
            return data;
        }
    }]);

    return AFitTest;
}();

exports.default = AFitTest;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = Item;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = Container;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Heuristic2 = __webpack_require__(26);

var _Heuristic3 = _interopRequireDefault(_Heuristic2);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Components = __webpack_require__(8);

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

var _PackedComponents = __webpack_require__(13);

var _RegionsTree = __webpack_require__(25);

var _RegionsTree2 = _interopRequireDefault(_RegionsTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @typedef {import('./Heuristic').HeuristicParams HeuLessWasteParams} */
/** @typedef HeuLessWasteSet @property {HeuLessWasteParams} params @property {Array<Item>} items @property {PackedContainer} packedContainer @property {RegionsTree} regionsTree */

var smallValue = .000001;
var minRegionAxis = smallValue;

var tempRegion = new _Region2.default();
var tempRegion2 = new _Region2.default();

function sortByN(a, b) {
    if (isNaN(a.n) || isNaN(b.n)) return 0;

    if (a.n < b.n) return -1;
    if (a.n > b.n) return 1;
    return 0;
}

/**
 * @param {Region} fit 
 * @param {Array<Region>} newRegions 
 */
function rateFit(fit, newRegions) {

    /** @type {HeuLessWasteSet} */
    var w = this;

    // Try out a recursive deep rate fit
    var containerLength = w.packedContainer.container.length;
    var minDimensions = w.minDimensions;
    var minDimensionsNoWasteFactor = w.minDimensionsNoWasteFactor;
    var minZScore = 1 - (fit.z + fit.length) / containerLength; // 0-1
    // new regions usability score
    var minWasteScore = 1; // have completely filled the region if newRegions.length === 0
    if (newRegions.length > 0) {
        minWasteScore = 0;
        for (var iRegion = 0; iRegion < newRegions.length; iRegion++) {
            var region = newRegions[iRegion];

            var scoreW = 0,
                scoreH = 0,
                scoreL = 0;
            if (region.width >= minDimensions[0] && region.width - minDimensions[0] < minDimensions[0] * minDimensionsNoWasteFactor[0]) scoreW += 1;
            if (region.height >= minDimensions[1] && region.width - minDimensions[1] < minDimensions[1] * minDimensionsNoWasteFactor[1]) scoreH += 1;
            if (region.length >= minDimensions[2] && region.width - minDimensions[2] < minDimensions[2] * minDimensionsNoWasteFactor[2]) scoreL += 1;

            minWasteScore += scoreW * .5 + scoreH * .3 + scoreL * .2;
        }
        minWasteScore /= newRegions.length;
    }
    var minZ_weight = w.params.minZ_weight;
    var minWaste_weight = w.params.minWaste_weight;
    var score = minZScore * minZ_weight + minWasteScore * minWaste_weight;
    return score;
}

/** @param {Region} region */
function highestScoreFunction(region) {
    /** @type {Item} */
    var item = this.workingItem;

    /** @typedef PlacementScore @property {Region} region region @property {Number} orientation orientation index @property {Number} n score */
    /** @type {Array<PlacementScore>} */
    var regionScoreTable = this.regionScoreTable;

    var orientationScoreTable = this.orientationScoreTable;

    var volumeItem = item.volume,
        validOrientations = item.validOrientations;

    if (region.volume > volumeItem) {
        var dummyRegion = tempRegion2.Copy(region);

        orientationScoreTable.length = 0;
        for (var iOrient = 0; iOrient < validOrientations.length; iOrient++) {
            var orientation = validOrientations[iOrient];

            var dimensions = item.GetOrientedDimensions(orientation);
            var regionFitTest = region.FitTest(smallValue, dimensions[0], dimensions[1], dimensions[2], item.weight, item.grounded);

            if (regionFitTest !== false) {

                // Subtracts fit from region and calculates new bounding regions
                var newRegions = dummyRegion.Subtract(regionFitTest, minRegionAxis);
                if (newRegions === undefined) newRegions = [];
                if (dummyRegion.length > minRegionAxis) newRegions.push(dummyRegion);

                var orientationScore = {
                    region: region,
                    orientation: orientation,
                    n: rateFit.call(this, regionFitTest, newRegions)
                };
                orientationScoreTable.push(orientationScore);
            }
        }

        if (orientationScoreTable.length > 0) {
            orientationScoreTable.sort(sortByN);
            var regionScore = orientationScoreTable.pop();
            regionScoreTable.push(regionScore);
        }
    }

    return false;
}

var HeuLessWaste = function (_Heuristic) {
    _inherits(HeuLessWaste, _Heuristic);

    /** @param {HeuLessWasteParams} params */
    function HeuLessWaste(params) {
        _classCallCheck(this, HeuLessWaste);

        /** @type {HeuLessWasteSet} */
        var _this = _possibleConstructorReturn(this, (HeuLessWaste.__proto__ || Object.getPrototypeOf(HeuLessWaste)).call(this, params));

        _this.workingSet;
        return _this;
    }

    /** @param {Array<Item>} items */


    _createClass(HeuLessWaste, [{
        key: "GetMinDimensionsOverall",
        value: function GetMinDimensionsOverall(items) {
            var minDimensions = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

            for (var iItem = 0, numItems = items.length; iItem < numItems; iItem++) {
                var item = items[iItem];
                var validOrientations = item.validOrientations;
                for (var iOrient = 0; iOrient < validOrientations.length; iOrient++) {
                    var orientation = validOrientations[iOrient];
                    var dimensions = item.GetOrientedDimensions(orientation);
                    if (dimensions[0] < minDimensions[0]) minDimensions[0] = dimensions[0];
                    if (dimensions[1] < minDimensions[1]) minDimensions[1] = dimensions[1];
                    if (dimensions[2] < minDimensions[2]) minDimensions[2] = dimensions[2];
                }
            }

            return minDimensions;
        }
    }, {
        key: "Init",
        value: function Init() {
            _get(HeuLessWaste.prototype.__proto__ || Object.getPrototypeOf(HeuLessWaste.prototype), "Init", this).call(this);

            var minDimensionsNoWasteFactor = [1, 1, 1];

            var w = this.workingSet;
            var workingItems = w.items.slice();
            workingItems.sort(_Components.Item.VolumeSort);
            var minDimensions = this.GetMinDimensionsOverall(workingItems);

            w.params = this.params;
            w.minDimensions = minDimensions;
            w.minDimensionsNoWasteFactor = minDimensionsNoWasteFactor;
        }

        /** @param {Item} item */

    }, {
        key: "GetPlacementWithHighestScore",
        value: function GetPlacementWithHighestScore(item) {

            /** @typedef PlacementScore @property {Number} region region index @property {Number} orientation orientation index @property {Number} n score */
            /** @type {Array<PlacementScore>} */
            var regionScoreTable = [],
                orientationScoreTable = [];
            var testSuccessfulRegions = 4;

            var w = this.workingSet;
            w.workingItem = item;
            w.regionScoreTable = regionScoreTable;
            w.orientationScoreTable = orientationScoreTable;
            w.testSuccessfulRegions = testSuccessfulRegions;

            // Try to fit in sorted regions
            w.regionsTree.Find(highestScoreFunction, w);

            if (regionScoreTable.length === 0) {
                return false;
            }

            regionScoreTable.sort(sortByN);
            var highestScore = regionScoreTable.pop();
            var containingRegion = highestScore.region,
                orientation = item.validOrientations[highestScore.orientation];

            var dimensions = item.GetOrientedDimensions(orientation);

            // Fit test (success: Region, failure: false)
            var regionFitTest = containingRegion.FitTest(smallValue, dimensions[0], dimensions[1], dimensions[2], item.weight, item.grounded, tempRegion);
            if (regionFitTest !== false) {

                // Stacking & weight test 

                var result = new _Heuristic3.default.Result(containingRegion, regionFitTest, orientation);
                return result;
            }

            return false;
        }

        /** @param {Item} item */

    }, {
        key: "Fit",
        value: function Fit(item) {
            var result = _get(HeuLessWaste.prototype.__proto__ || Object.getPrototypeOf(HeuLessWaste.prototype), "Fit", this).call(this, item);

            var w = this.workingSet;

            // General weight check
            if (w.packedContainer.WeightPass(item.weight) === false) return false;

            var highestScored = this.GetPlacementWithHighestScore(item);

            if (highestScored) {
                if (result === undefined) result = new _Heuristic3.default.Result(highestScored.containingRegion, highestScored.packedRegion, highestScored.orientation);else result.Copy(highestScored);
            }

            return result || false;
        }
    }]);

    return HeuLessWaste;
}(_Heuristic3.default);

exports.default = HeuLessWaste;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Heuristic2 = __webpack_require__(26);

var _Heuristic3 = _interopRequireDefault(_Heuristic2);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Components = __webpack_require__(8);

var _Region = __webpack_require__(9);

var _Region2 = _interopRequireDefault(_Region);

var _PackedComponents = __webpack_require__(13);

var _RegionsTree = __webpack_require__(25);

var _RegionsTree2 = _interopRequireDefault(_RegionsTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @typedef {import('./Heuristic').HeuristicParams HeuRegularParams} */
/** @typedef HeuRegularSet @property {Array<Item>} items @property {PackedContainer} packedContainer @property {RegionsTree} regionsTree */

var epsilon = Math.pow(2, -52);
var smallValue = .000001;

var tempRegion = new _Region2.default();

/** @param {Region} region */
function firstFitFunction(region) {
    var item = this.workingItem;
    var validOrientations = item.validOrientations;
    for (var iOrient = 0; iOrient < validOrientations.length; iOrient++) {
        var orientation = validOrientations[iOrient];

        var dimensions = item.GetOrientedDimensions(orientation);

        // Fit test (success: Region, failure: false)
        var regionFitTest = region.FitTest(smallValue, dimensions[0], dimensions[1], dimensions[2], item.weight, item.grounded, tempRegion);
        if (regionFitTest !== false) {

            // Stacking & weight test 

            var result = new _Heuristic3.default.Result(region, regionFitTest, orientation);
            return result;
        }
    }

    return false;
}

var HeuRegular = function (_Heuristic) {
    _inherits(HeuRegular, _Heuristic);

    /** @param {HeuRegularParams} params */
    function HeuRegular(params) {
        _classCallCheck(this, HeuRegular);

        /** @type {HeuRegularSet} */
        var _this = _possibleConstructorReturn(this, (HeuRegular.__proto__ || Object.getPrototypeOf(HeuRegular)).call(this, params));

        _this.workingSet;
        return _this;
    }

    /** @param {Item} item */


    _createClass(HeuRegular, [{
        key: "Fit",
        value: function Fit(item) {
            var result = _get(HeuRegular.prototype.__proto__ || Object.getPrototypeOf(HeuRegular.prototype), "Fit", this).call(this, item);

            var w = this.workingSet;

            // General weight check
            if (w.packedContainer.WeightPass(item.weight) === false) return false;

            w.workingItem = item;
            /** @type {Heuristic.Result} */
            var firstFit = w.regionsTree.Find(firstFitFunction, w);
            if (firstFit) {
                if (result === undefined) result = new _Heuristic3.default.Result(firstFit.containingRegion, firstFit.packedRegion, firstFit.orientation);else result.Copy(firstFit);
            }

            return result || false;
        }
    }]);

    return HeuRegular;
}(_Heuristic3.default);

exports.default = HeuRegular;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Heuristic2 = __webpack_require__(26);

var _Heuristic3 = _interopRequireDefault(_Heuristic2);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Components = __webpack_require__(8);

var _PackedComponents = __webpack_require__(13);

var _RegionsTree = __webpack_require__(25);

var _RegionsTree2 = _interopRequireDefault(_RegionsTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @typedef {import('./CUB').CUBParams} CUBParams */

var HeuParametric1Params =
/** @param {CUBParams} cubParams */
function HeuParametric1Params(cubParams) {
    _classCallCheck(this, HeuParametric1Params);

    this.cub = cubParams;
};

var HeuParametric1Set =
/**
 * 
 * @param {Array<Item>} items 
 * @param {PackedContainer} packedContainer 
 * @param {RegionsTree} regionsTree 
 */
function HeuParametric1Set(items, packedContainer, regionsTree) {
    _classCallCheck(this, HeuParametric1Set);

    this.items = items;
    this.packedContainer = packedContainer;
    this.regionsTree = regionsTree;
};

var HeuParametric1 = function (_Heuristic) {
    _inherits(HeuParametric1, _Heuristic);

    /** @param {HeuParametric1Params} params */
    function HeuParametric1(params) {
        _classCallCheck(this, HeuParametric1);

        /** @type {HeuParametric1Params} */
        var _this = _possibleConstructorReturn(this, (HeuParametric1.__proto__ || Object.getPrototypeOf(HeuParametric1)).call(this, params));

        _this.params;
        /** @type {HeuParametric1Set} */
        _this.workingSet;
        return _this;
    }

    _createClass(HeuParametric1, [{
        key: "Init",
        value: function Init() {
            if (this.workingSet instanceof HeuParametric1Set === false) {
                _get(HeuParametric1.prototype.__proto__ || Object.getPrototypeOf(HeuParametric1.prototype), "Init", this).call(this);

                this.workingSet = new HeuParametric1Set(this.workingSet.items, this.workingSet.packedContainer, this.workingSet.regionsTree);
            }
        }

        /** @param {Item} item */

    }, {
        key: "GetBestFit",
        value: function GetBestFit(item) {
            if (false) return new _Heuristic3.default.Result();
            return false;
        }

        /** @param {Item} item */

    }, {
        key: "Fit",
        value: function Fit(item) {
            var result = _get(HeuParametric1.prototype.__proto__ || Object.getPrototypeOf(HeuParametric1.prototype), "Fit", this).call(this, item);

            var w = this.workingSet;

            // General weight check
            if (w.packedContainer.WeightPass(item.weight) === false) return false;

            var bestFit = this.GetBestFit(item);

            if (bestFit) {
                if (result === undefined) result = new _Heuristic3.default.Result(bestFit.containingRegion, bestFit.packedRegion, bestFit.orientation);else result.Copy(bestFit);
            }

            return result || false;
        }
    }]);

    return HeuParametric1;
}(_Heuristic3.default);

HeuParametric1.Params = HeuParametric1Params;
HeuParametric1.Set = HeuParametric1Set;

exports.default = HeuParametric1;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CargoListView = __webpack_require__(27);

var _CargoListView2 = _interopRequireDefault(_CargoListView);

var _Packer = __webpack_require__(12);

var _Packer2 = _interopRequireDefault(_Packer);

var _CargoList = __webpack_require__(34);

var _CargoList2 = _interopRequireDefault(_CargoList);

var _PackingSpaceView = __webpack_require__(49);

var _PackingSpaceView2 = _interopRequireDefault(_PackingSpaceView);

var _PackingSpace = __webpack_require__(36);

var _PackingSpace2 = _interopRequireDefault(_PackingSpace);

var _SceneSetup = __webpack_require__(17);

var _SceneSetup2 = _interopRequireDefault(_SceneSetup);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _PackResultView = __webpack_require__(51);

var _PackResultView2 = _interopRequireDefault(_PackResultView);

var _UpdateComponent = __webpack_require__(41);

var _UpdateComponent2 = _interopRequireDefault(_UpdateComponent);

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _DomUI = __webpack_require__(52);

var _DomUI2 = _interopRequireDefault(_DomUI);

var _OrthoviewsNavigator = __webpack_require__(84);

var _OrthoviewsNavigator2 = _interopRequireDefault(_OrthoviewsNavigator);

var _Camera = __webpack_require__(18);

var _Camera2 = _interopRequireDefault(_Camera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {Object} ViewParams
 * @property {import('../UX').default} ux
 * @property {Number} transitionDuration
 * @property {Object} cargoListView
 * @property {Number} cargoListView.paddingZ
 * @property {Number} cargoListView.paddingY
 * @property {import('./CargoListView').CargoListViewParams} cargoListView.params
 * @property {Object} packResultView
 * @property {import('./PackResultView').PackResultViewParams} packResultView.params
 */

/** @type {ViewParams} */
var defaultParams = {
    ux: undefined,
    transitionDuration: 1.5,
    cargoListView: {
        paddingZ: 120,
        paddingY: 40,
        params: {}
    },
    packResultView: {
        params: {
            animationDuration: 1
        }
    }
};

var tempBox3 = new THREE.Box3();
var tempVec = new THREE.Vector3();

var View = function () {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {DomUI} domUI; 
     * @param {SceneSetup} sceneSetup 
     * @param {ViewParams} params 
     */
    function View(packer, sceneSetup, domUI, params) {

        /** @param {Packer.PackingResult} packingResult */
        var onPackUpdate = function () {
            var _ref = _asyncToGenerator(function* (packingResult) {
                scope.orthoviewsNavigator.Navigate(_OrthoviewsNavigator2.default.orthoviews.home, false);
                yield scope.packResultView.DisplayPackingResult(packingResult);
            });

            return function onPackUpdate(_x) {
                return _ref.apply(this, arguments);
            };
        }();

        _classCallCheck(this, View);

        this.sceneSetup = sceneSetup;
        this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        this.domUI = domUI;
        this.domUI.CreateOrthoViewsIcons();
        this.domUI.On(_DomUI2.default.signals.orthoViewSelected, this.OnOrthoViewSelected.bind(this));

        var scope = this;
        var units = this.params.ux.params.units;

        // Fill lights
        if (true) {
            var lights = this.sceneSetup.DefaultLights(this.sceneSetup.sceneController, true, true);

            var dl = lights.filter(function (light) {
                return light instanceof THREE.DirectionalLight;
            })[0];
            var dlData = { "color": "0xfceeee", "intensity": 1, "castShadow": true, "shadow.bias": 0.00001, "shadow.radius": 4, "shadow.mapSize.x": 4096, "shadow.mapSize.y": 4096, "shadow.camera.left": -400, "shadow.camera.top": 300, "shadow.camera.right": 400, "shadow.camera.bottom": -300, "shadow.camera.near": 20, "shadow.camera.far": 800 };
            var Config = __webpack_require__(11).default;
            Config.Load(dl, dlData);

            if (this.sceneSetup.ux.params.hud) {
                this.sceneSetup.DefaultLights(this.sceneSetup.hud);
            }

            var dlComp = lights.filter(function (light) {
                return light instanceof THREE.DirectionalLight;
            })[1];
            dlComp.castShadow = true;
        }

        var orthoviewsNavParams = { ux: this.params.ux };
        this.orthoviewsNavigator = new _OrthoviewsNavigator2.default(this.sceneSetup.cameraController, orthoviewsNavParams);

        // Packing space
        this.packingSpaceView = new _PackingSpaceView2.default();
        this.sceneSetup.sceneController.AddDefault(this.packingSpaceView.view);
        /** @param {Container} container */
        function onContainerAdded(container) {
            /** @type {THREE.Box3} */
            var box3 = container.combinedVolume.box3;
            scope.sceneSetup.cameraController.TransitionToFrame(1, box3, scope.params.transitionDuration);

            scope.packingSpaceView.Add(container);

            tempBox3.setFromObject(scope.packingSpaceView.view);
            tempBox3.getSize(tempVec);

            var containerSize = Math.max(tempVec.x, tempVec.y, tempVec.z);
            scope.cargoListView.view.position.z = containerSize / 2 + scope.params.cargoListView.paddingZ * units;
            scope.cargoListView.view.position.y = scope.params.cargoListView.paddingY * units;
        }
        packer.packingSpace.On(_PackingSpace2.default.signals.containerAdded, onContainerAdded);

        // Cargo list
        this.params.cargoListView.params.ux = this.params.ux;
        this.cargoListView = new _CargoListView2.default(this.params.cargoListView.params);

        this.sceneSetup.input.AddRaycastGroup('OnClick', 'cargoListView', this.cargoListView.raycastGroup);

        this.sceneSetup.sceneController.AddDefault(this.cargoListView.view);

        function onCargoListViewChanged() {
            tempBox3.setFromObject(scope.cargoListView.view);
            tempBox3.getCenter(tempVec);
            var listViewCenterX = tempVec.x;
            scope.cargoListView.view.getWorldPosition(tempVec);
            var offsetX = listViewCenterX - tempVec.x;

            /** @type {THREE.Box3} */
            var box3 = tempBox3;
            scope.sceneSetup.cameraController.TransitionToFrame(1, box3, scope.params.transitionDuration);

            tempBox3.setFromObject(scope.packingSpaceView.view);
            tempBox3.getCenter(tempVec);
            var centerX = tempVec.x;

            scope.cargoListView.view.position.x = centerX - offsetX;
        }
        function onCargoGroupAdded(group) {
            scope.cargoListView.Add(group);
            onCargoListViewChanged();
        }
        packer.cargoList.On(_CargoList2.default.signals.groupAdded, onCargoGroupAdded);
        function onCargoGroupRemoved(group) {
            scope.cargoListView.Remove(group);
            onCargoListViewChanged();
        }
        packer.cargoList.On(_CargoList2.default.signals.groupRemoved, onCargoGroupRemoved);
        function onCargoGroupModified(group) {
            scope.cargoListView.UpdateGroup(group);
            onCargoListViewChanged();
        }
        packer.cargoList.On(_CargoList2.default.signals.groupModified, onCargoGroupModified);

        // Packing result
        this.params.packResultView.params.ux = this.params.ux;
        this.packResultView = new _PackResultView2.default(this.cargoListView, this.packingSpaceView, this.params.packResultView.params);
        this.sceneSetup.sceneController.AddDefault(this.packResultView.view);
        packer.On(_Packer2.default.signals.packUpdate, onPackUpdate);

        var updateComponent = new _UpdateComponent2.default(true, 1 / 30, this.Update.bind(this));
        this.sceneSetup.input.updateComponents.push(updateComponent);

        this.orthoviewsNavigator.boundingView = this.packingSpaceView.view;
        this.orthoviewsNavigator.cargoListView = this.cargoListView;

        if (this.params.ux.params.hud) {
            this.HUDSetup();
        }

        if (this.params.ux.params.configure) {
            this.Configure();
        }
    }

    /** @param {Number} now */


    _createClass(View, [{
        key: "Update",
        value: function Update(now) {
            this.packResultView.Update();
            this.cargoListView.Update();
        }
    }, {
        key: "HUDSetup",
        value: function HUDSetup() {
            var units = this.params.ux.params.units;
            var input = this.sceneSetup.input;
            var hud = this.sceneSetup.hud;
            var scope = this;
        }
    }, {
        key: "ClearPackingResults",
        value: function ClearPackingResults() {
            this.packResultView.Clear();
        }

        /** @param {DomUI.orthoviews} viewType */

    }, {
        key: "OnOrthoViewSelected",
        value: function OnOrthoViewSelected(viewType) {
            switch (viewType) {
                case _DomUI2.default.orthoviews.home:
                    this.orthoviewsNavigator.Navigate(_OrthoviewsNavigator2.default.orthoviews.home);break;
                case _DomUI2.default.orthoviews.top:
                    this.orthoviewsNavigator.Navigate(_OrthoviewsNavigator2.default.orthoviews.top);break;
                case _DomUI2.default.orthoviews.front:
                    this.orthoviewsNavigator.Navigate(_OrthoviewsNavigator2.default.orthoviews.front);break;
                case _DomUI2.default.orthoviews.side:
                    this.orthoviewsNavigator.Navigate(_OrthoviewsNavigator2.default.orthoviews.side);break;
            }
        }
    }, {
        key: "Configure",
        value: function Configure() {

            var Smart = __webpack_require__(28).default;
            var Config = __webpack_require__(11).default;
            var Control3D = __webpack_require__(29).default;

            var scope = this;
            var input = this.sceneSetup.input;

            if (this.params.ux.params.hud) {
                var hudControl3D = Control3D.Request('hud');

                Config.MakeShortcut('Configure', 'Show HUDControl3D', function () {
                    hudControl3D.Toggle(scope.cargoListView.view);
                });
            }
        }
    }]);

    return View;
}();

exports.default = View;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @typedef FloatingShelfParams @property {THREE.Vector3} padding x z for padding, y for thickness @property {Number} colorHex */
/** @type {FloatingShelfParams} */
var defaultParams = {
        padding: new THREE.Vector3(0, .001, 0),
        colorHex: 0xffffff
};

var box3 = new THREE.Box3();
var vec3 = new THREE.Vector3();

var FloatingShelf = function () {
        /** @param {THREE.Object3D} targetView @param {FloatingShelfParams} params */
        function FloatingShelf(targetView, params) {
                _classCallCheck(this, FloatingShelf);

                this.params = _Utils2.default.AssignUndefined(params, defaultParams);

                this.targetView = targetView;
                this.view = new THREE.Object3D();

                var planeGeom = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
                var planeMaterial = new _Asset2.default.CreateSolidMaterialMatte(this.params.colorHex);
                this.platformMesh = new THREE.Mesh(planeGeom, planeMaterial);
                _Asset2.default.ReceiveShadow(this.platformMesh);

                this.view.add(this.platformMesh);

                this.Update();
        }

        _createClass(FloatingShelf, [{
                key: "Update",
                value: function Update() {
                        box3.setFromObject(this.targetView);
                        var worldToLocal = new THREE.Matrix4().getInverse(this.targetView.matrixWorld);
                        box3.applyMatrix4(worldToLocal);
                        box3.getSize(vec3);
                        var height = vec3.y;

                        var padding = this.params.padding;
                        var thickness = Math.max(.0001, padding.y);
                        this.platformMesh.scale.set(Math.max(.0001, vec3.x + padding.x * 2), thickness, Math.max(.0001, vec3.z + padding.z * 2));

                        box3.getCenter(vec3);
                        this.platformMesh.position.set(vec3.x, vec3.y - height / 2 - thickness, vec3.z);
                }
        }]);

        return FloatingShelf;
}();

exports.default = FloatingShelf;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
var outlineMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide, depthWrite: false, depthTest: true });
var boxOutlineMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide });

/** @typedef OutlineParams @property {Number} color @property {Number} opacity @property {Number} offsetFactor @property {Number} offsetUnits */
/** @type {OutlineParams} */
var defaultParams = {
    color: 0x000000,
    opacity: 1,
    offsetFactor: 1,
    offsetUnits: 1
};

var tempBox3 = new THREE.Box3();
var tempMatrix4 = new THREE.Matrix4();

var Outline = function () {

    /** @param {OutlineParams} params */
    function Outline(params) {
        _classCallCheck(this, Outline);

        this.params = _Utils2.default.AssignUndefined(params, defaultParams);

        this.view = new THREE.Object3D();

        /** @type {Map<THREE.Object3D, THREE.Object3D>} */
        this.outlines = new Map();
    }

    /** @param {THREE.Object3D} value */


    _createClass(Outline, [{
        key: "Disable",
        value: function Disable() {
            this.view.visible = false;
        }
    }, {
        key: "object3d",
        set: function set(value) {
            if (!value) return this.Disable();

            this.view.visible = true;

            if (this.material === undefined) this.material = outlineMaterial.clone();
            var material = this.material;
            material.color.setHex(this.params.color);
            material.opacity = THREE.Math.clamp(this.params.opacity, 0, 1);
            material.transparent = true; //material.opacity < .999;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -this.params.offsetFactor;
            material.polygonOffsetUnits = this.params.offsetUnits;

            var outline = this.outlines.get(value);
            if (!outline) {
                outline = value.clone(true);
                if (outline instanceof THREE.Mesh) {
                    outline.material = material;
                } else {
                    outline.children.forEach(function (oChild) {
                        return oChild.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                var outlineReady = child.clone();
                                outlineReady.material = material;
                                if (child.parent) {
                                    // Assuming end of hierarchical tree
                                    child.parent.add(outlineReady);
                                    child.parent.remove(child);
                                }
                            }
                        });
                    });
                }

                this.outlines.set(value, outline);
            }

            value.updateMatrixWorld();
            outline.matrixWorld.copy(value.matrixWorld);

            while (this.view.children.length > 0) {
                this.view.remove(this.view.children[this.view.children.length - 1]);
            }this.view.add(outline);
        }

        /** @param {THREE.Object3D} value */

    }, {
        key: "box",
        set: function set(value) {
            if (!value) return this.Disable();

            this.view.visible = true;

            if (this.boxMaterial === undefined) this.boxMaterial = boxOutlineMaterial.clone();
            this.boxMaterial.color.setHex(this.params.color);
            this.boxMaterial.opacity = THREE.Math.clamp(this.params.opacity, 0, 1);
            this.boxMaterial.transparent = this.boxMaterial.opacity < .999;

            if (this.boxMesh === undefined) {
                this.boxMesh = new THREE.Mesh(cubeGeometry, this.boxMaterial);
            }

            value.updateMatrixWorld();
            tempBox3.setFromObject(value);
            tempBox3.getSize(this.view.scale);
            this.view.scale.addScalar(this.params.offsetFactor);
            tempBox3.getCenter(this.view.position);

            var parent = this.view.parent;
            if (parent) {
                parent.updateMatrixWorld();
                var inverse = tempMatrix4.getInverse(parent.matrixWorld);
                this.view.applyMatrix(inverse);
            }

            while (this.view.children.length > 0) {
                this.view.remove(this.view.children[this.view.children.length - 1]);
            }this.view.add(this.boxMesh);
        }
    }]);

    return Outline;
}();

exports.default = Outline;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CargoBoxView2 = __webpack_require__(21);

var _CargoBoxView3 = _interopRequireDefault(_CargoBoxView2);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var unitCubeEdgeGeometry = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1));
var wireframeMaterialTemplate = new THREE.LineBasicMaterial({ color: 0xffffff, flatShading: true });

var _wireMaterialSettings = Symbol('wireMatSet');

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
        meshMaterial.blending = THREE.NormalBlending;
        meshMaterial.depthTest = true;
        meshMaterial.depthWrite = false;

        _this.mesh.castShadow = _this.mesh.receiveShadow = true;

        var material = wireframeMaterialTemplate.clone();
        _this.wireMesh = new THREE.LineSegments(unitCubeEdgeGeometry, material);
        _this.wireMesh.renderOrder = Number.MAX_SAFE_INTEGER - 1;
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

        /** @param {Number} value */

    }, {
        key: "focus",
        set: function set(value) {
            _set(PackedCargoBoxView.prototype.__proto__ || Object.getPrototypeOf(PackedCargoBoxView.prototype), "focus", value, this);

            if (this[_wireMaterialSettings]) _Asset2.default.RestoreMaterial(this.wireMesh.material, this[_wireMaterialSettings]);

            if (Math.abs(1 - value) > .0001) {
                if (this[_wireMaterialSettings] === undefined) {
                    this.wireMesh.material = this.wireMesh.material.clone();
                    this[_wireMaterialSettings] = {};
                    _Asset2.default.SetMaterialFocus(this.wireMesh.material, value, this[_wireMaterialSettings]);
                } else {
                    _Asset2.default.SetMaterialFocus(this.wireMesh.material, value);
                }
            }
        },
        get: function get() {
            return _get(PackedCargoBoxView.prototype.__proto__ || Object.getPrototypeOf(PackedCargoBoxView.prototype), "focus", this);
        }
    }]);

    return PackedCargoBoxView;
}(_CargoBoxView3.default);

exports.default = PackedCargoBoxView;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PackResultView = __webpack_require__(51);

var _PackResultView2 = _interopRequireDefault(_PackResultView);

var _Packer = __webpack_require__(12);

var _Packer2 = _interopRequireDefault(_Packer);

var _Pool = __webpack_require__(20);

var _Pool2 = _interopRequireDefault(_Pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tempRange = [];

var Range = function () {
    /**
     * 
     * @param {Array<Number>} args [min,max...] pairs
     */
    function Range() {
        _classCallCheck(this, Range);

        /** @type {Array<Number>} */
        this.min = [];
        /** @type {Array<Number>} */
        this.max = [];

        for (var i = 0, halfLength = arguments.length; i < halfLength; i++) {
            this.min.push(arguments.length <= i * 2 ? undefined : arguments[i * 2]);
            this.max.push(arguments.length <= i * 2 + 1 ? undefined : arguments[i * 2 + 1]);
        }
    }

    /** @param {Array<Number>} args */


    _createClass(Range, [{
        key: "Min",
        value: function Min() {
            var _min;

            this.min.length = 0;
            (_min = this.min).push.apply(_min, arguments);
            return this;
        }

        /** @param {Array<Number>} args */

    }, {
        key: "Max",
        value: function Max() {
            var _max;

            this.max.length = 0;
            (_max = this.max).push.apply(_max, arguments);
            return this;
        }

        /** @param {Number} index @returns {Number} */

    }, {
        key: "Length",
        value: function Length(index) {
            return this.max[index] - this.min[index];
        }

        /** @param {Array<Number>} args */

    }, {
        key: "Evaluate",
        value: function Evaluate() {
            tempRange.length = 0;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            for (var i = 0; i < args.length; i++) {
                var min = this.min[i],
                    max = this.max[i],
                    v = args[i];
                var value = v * (max - min) + min;
                tempRange.push(value);
            }
            return tempRange;
        }
    }]);

    return Range;
}();

var range = {
    frequency: 0,
    volume: 1
};

var _playing = Symbol('playing');
var _iid = Symbol('iid');

var Note = function () {
    function Note() {
        _classCallCheck(this, Note);

        this.wave = new Pizzicato.Sound({
            source: 'wave',
            options: {
                type: 'sine',
                frequency: 440
            }
        });

        this[_playing] = false;
    }

    /** @param {Number} value */


    _createClass(Note, [{
        key: "Play",
        value: function Play(duration) {
            this[_playing] = true;
            this.wave.play();
            var scope = this;
            function onNoteComplete() {
                scope.Stop();
            }
            this[_iid] = window.setTimeout(onNoteComplete, Math.floor(duration * 1000));
        }
    }, {
        key: "Stop",
        value: function Stop() {
            if (this[_iid] !== undefined) window.clearTimeout(this[_iid]);
            this[_iid] = undefined;

            this.wave.stop();
            this[_playing] = false;
        }
    }, {
        key: "frequency",
        set: function set(value) {
            this.wave.frequency = value;
        }

        /** @returns {Boolean} */

    }, {
        key: "playing",
        get: function get() {
            return this[_playing];
        }
    }]);

    return Note;
}();

/**
 * @returns {Note}
 */


function poolNewFN() {
    var note = new Note();
    return note;
}

/**
 * @param {Note} object 
 * @returns {Note}
 */
function poolResetFN(object) {
    return object;
}

var Toner = function () {
    function Toner() {
        _classCallCheck(this, Toner);

        this.pool = new _Pool2.default(poolNewFN, poolResetFN);

        this.ranges = new Range(100, 900, // freq
        0, 1, // volume
        0.2, 0.8 // duration
        );

        window.Toner = this;
    }

    _createClass(Toner, [{
        key: "GetNote",
        value: function GetNote() {
            /** @type {Note} */
            var note = this.pool.Request();
            return note;
        }
    }, {
        key: "RelaseNote",
        value: function RelaseNote(note) {
            this.pool.Return(note);
        }

        /** @param {Number} x @param {Number} y @param {Number} z */

    }, {
        key: "Coords",
        value: function Coords(x, y, z) {

            var divs = 6;
            var divLength = this.ranges.Length(range.frequency) / divs;
            var values = this.ranges.Evaluate(x, y, z);

            var frequency = Math.floor(values[0]),
                volume = values[1],
                duration = values[2];

            var note = this.GetNote();
            note.frequency = frequency;
            note.Play(duration);

            var scope = this;
            function onNoteComplete() {
                scope.RelaseNote(note);
            }
            window.setInterval(onNoteComplete, Math.floor(duration * 1000));
        }
    }]);

    return Toner;
}();

var Musipack = function () {
    /**
     * 
     * @param {PackResultView} packResultView 
     */
    function Musipack(packResultView) {
        _classCallCheck(this, Musipack);

        console.log('Musicpack hooked in!');

        this.toner = new Toner();

        packResultView.Once(_PackResultView2.default.signals.packVizStart, function () {
            packResultView.params.animationDuration = 8;
        });

        packResultView.On(_PackResultView2.default.signals.cargoVizPack, this.OnItemPacked.bind(this));
        packResultView.On(_PackResultView2.default.signals.cargoVizUnpack, this.OnItemUnpacked.bind(this));
    }

    /** @param {Packer.PackedCargo} item */


    _createClass(Musipack, [{
        key: "OnItemPacked",
        value: function OnItemPacked(item) {
            this.EvaluateItem(item);
        }

        /** @param {Packer.PackedCargo} item */

    }, {
        key: "OnItemUnpacked",
        value: function OnItemUnpacked(item) {
            this.EvaluateItem(item);
        }

        /** @param {Packer.PackedCargo} item */

    }, {
        key: "EvaluateItem",
        value: function EvaluateItem(item) {
            if (item && item.position) {
                var x = item.position.x,
                    y = item.position.y,
                    z = item.position.z;

                var w = item.containingVolume.dimensions.width,
                    h = item.containingVolume.dimensions.height,
                    l = item.containingVolume.dimensions.length;

                this.toner.Coords(x / w, y / h, z / l);
            }
        }
    }]);

    return Musipack;
}();

exports.default = Musipack;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _UX = __webpack_require__(23);

var _UX2 = _interopRequireDefault(_UX);

var _Camera = __webpack_require__(18);

var _Camera2 = _interopRequireDefault(_Camera);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

var _CargoListView = __webpack_require__(27);

var _CargoListView2 = _interopRequireDefault(_CargoListView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @typedef OrthoviewsNavigatorParams @property {UX} ux @property {Number} transitionDuration */
/** @type {OrthoviewsNavigatorParams} */
var defaultParams = {
    transitionDuration: 1
};

var orthoviews = {
    home: 'home',
    top: 'top',
    front: 'front',
    side: 'side'
};

var tempBox3 = new THREE.Box3(),
    tempVec3 = new THREE.Vector3(),
    tempCamOffset = new THREE.Vector3();

/** @type {import('../scene/Camera').FrameCoords} */
var tempCoords = { position: new THREE.Vector3(), center: new THREE.Vector3() };

var _cargoListView = Symbol('cargoListView'),
    _boundingView = Symbol('boundingView');

var OrthoviewsNavigator = function () {
    /** @param {Camera} cameraController @param {OrthoviewsNavigatorParams} params */
    function OrthoviewsNavigator(cameraController, params) {
        _classCallCheck(this, OrthoviewsNavigator);

        this.params = _Utils2.default.AssignUndefined(params, defaultParams);
        this.cameraController = cameraController;

        var Smart = __webpack_require__(28).default;
        var Config = __webpack_require__(11).default;
        var Control3D = __webpack_require__(29).default;

        var scope = this;
        var smart = new Smart(this.cameraController.camera, 'FOV');
        smart.MakeShortcut('Configure');
        function onChange() {
            scope.cameraController.camera.updateProjectionMatrix();
        }
        smart.Config(null, this.cameraController.camera, onChange, Smart.serializeModes.none, 'fov');
    }

    /** @param {THREE.Object3D} boundingView */


    _createClass(OrthoviewsNavigator, [{
        key: "Navigate",


        /** @param {orthoviews} viewType @param {Boolean} changeFOV */
        value: function Navigate(viewType, changeFOV) {

            var duration = 1;

            var distanceMultiplier = .3;
            var fov = changeFOV === undefined || changeFOV === true ? 8 : this.params.ux.params.fov;
            var slideDown = true;

            tempBox3.setFromObject(this.boundingView);

            var orientation = tempCamOffset;
            switch (viewType) {
                case orthoviews.home:
                    orientation.set(1, -1, 1);
                    fov = this.params.ux.params.fov;
                    distanceMultiplier = .5;
                    break;

                case orthoviews.top:
                    orientation.set(0.01, -1, 0);
                    distanceMultiplier = .3;
                    break;

                case orthoviews.front:
                    this.cargoListView.SlideUp(tempBox3.max.y + 40 * this.params.ux.params.units, duration);
                    distanceMultiplier = .2;
                    slideDown = false;
                    orientation.set(0, 0, 1);
                    break;

                case orthoviews.side:
                    distanceMultiplier = .3;
                    orientation.set(1, 0, 0);
                    break;
            }

            if (slideDown) this.cargoListView.SlideDown(duration);

            this.cameraController.TransitionToFOV(duration * 1.5, fov);

            var endCoords = this.cameraController.CalcFrameCoords(tempBox3, distanceMultiplier, orientation, fov);
            this.cameraController.TransitionFromToCoords(this.params.transitionDuration, undefined, endCoords);
        }
    }, {
        key: "boundingView",
        set: function set(value) {
            this[_boundingView] = value;
        },
        get: function get() {
            return this[_boundingView];
        }

        /** @param {CargoListView} value */

    }, {
        key: "cargoListView",
        set: function set(value) {
            this[_cargoListView] = value;
        },
        get: function get() {
            return this[_cargoListView];
        }
    }], [{
        key: "orthoviews",
        get: function get() {
            return orthoviews;
        }
    }]);

    return OrthoviewsNavigator;
}();

exports.default = OrthoviewsNavigator;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @author arodic / https://github.com/arodic
 */

(function () {

			'use strict';

			var GizmoMaterial = function GizmoMaterial(parameters) {

						THREE.MeshBasicMaterial.call(this);

						this.depthTest = false;
						this.depthWrite = false;
						this.side = THREE.FrontSide;
						this.transparent = true;

						this.setValues(parameters);

						this.oldColor = this.color.clone();
						this.oldOpacity = this.opacity;

						this.highlight = function (highlighted) {

									if (highlighted) {

												this.color.setRGB(1, 1, 0);
												this.opacity = 1;
									} else {

												this.color.copy(this.oldColor);
												this.opacity = this.oldOpacity;
									}
						};
			};

			GizmoMaterial.prototype = Object.create(THREE.MeshBasicMaterial.prototype);
			GizmoMaterial.prototype.constructor = GizmoMaterial;

			var GizmoLineMaterial = function GizmoLineMaterial(parameters) {

						THREE.LineBasicMaterial.call(this);

						this.depthTest = false;
						this.depthWrite = false;
						this.transparent = true;
						this.linewidth = 1;

						this.setValues(parameters);

						this.oldColor = this.color.clone();
						this.oldOpacity = this.opacity;

						this.highlight = function (highlighted) {

									if (highlighted) {

												this.color.setRGB(1, 1, 0);
												this.opacity = 1;
									} else {

												this.color.copy(this.oldColor);
												this.opacity = this.oldOpacity;
									}
						};
			};

			GizmoLineMaterial.prototype = Object.create(THREE.LineBasicMaterial.prototype);
			GizmoLineMaterial.prototype.constructor = GizmoLineMaterial;

			var pickerMaterial = new GizmoMaterial({ visible: false, transparent: false });

			THREE.TransformGizmo = function () {

						this.init = function () {

									THREE.Object3D.call(this);

									this.handles = new THREE.Object3D();
									this.pickers = new THREE.Object3D();
									this.planes = new THREE.Object3D();

									this.add(this.handles);
									this.add(this.pickers);
									this.add(this.planes);

									//// PLANES

									var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);
									var planeMaterial = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });

									var planes = {
												"XY": new THREE.Mesh(planeGeometry, planeMaterial),
												"YZ": new THREE.Mesh(planeGeometry, planeMaterial),
												"XZ": new THREE.Mesh(planeGeometry, planeMaterial),
												"XYZE": new THREE.Mesh(planeGeometry, planeMaterial)
									};

									this.activePlane = planes["XYZE"];

									planes["YZ"].rotation.set(0, Math.PI / 2, 0);
									planes["XZ"].rotation.set(-Math.PI / 2, 0, 0);

									for (var i in planes) {

												planes[i].name = i;
												this.planes.add(planes[i]);
												this.planes[i] = planes[i];
									}

									//// HANDLES AND PICKERS

									var setupGizmos = function setupGizmos(gizmoMap, parent) {

												for (var name in gizmoMap) {

															for (i = gizmoMap[name].length; i--;) {

																		var object = gizmoMap[name][i][0];
																		var position = gizmoMap[name][i][1];
																		var rotation = gizmoMap[name][i][2];

																		object.name = name;

																		if (position) object.position.set(position[0], position[1], position[2]);
																		if (rotation) object.rotation.set(rotation[0], rotation[1], rotation[2]);

																		parent.add(object);
															}
												}
									};

									setupGizmos(this.handleGizmos, this.handles);
									setupGizmos(this.pickerGizmos, this.pickers);

									// reset Transformations

									this.traverse(function (child) {

												if (child instanceof THREE.Mesh) {

															child.updateMatrix();

															var tempGeometry = child.geometry.clone();
															tempGeometry.applyMatrix(child.matrix);
															child.geometry = tempGeometry;

															child.position.set(0, 0, 0);
															child.rotation.set(0, 0, 0);
															child.scale.set(1, 1, 1);
												}
									});
						};

						this.highlight = function (axis) {

									this.traverse(function (child) {

												if (child.material && child.material.highlight) {

															if (child.name === axis) {

																		child.material.highlight(true);
															} else {

																		child.material.highlight(false);
															}
												}
									});
						};
			};

			THREE.TransformGizmo.prototype = Object.create(THREE.Object3D.prototype);
			THREE.TransformGizmo.prototype.constructor = THREE.TransformGizmo;

			THREE.TransformGizmo.prototype.update = function (rotation, eye) {

						var vec1 = new THREE.Vector3(0, 0, 0);
						var vec2 = new THREE.Vector3(0, 1, 0);
						var lookAtMatrix = new THREE.Matrix4();

						this.traverse(function (child) {

									if (child.name.search("E") !== -1) {

												child.quaternion.setFromRotationMatrix(lookAtMatrix.lookAt(eye, vec1, vec2));
									} else if (child.name.search("X") !== -1 || child.name.search("Y") !== -1 || child.name.search("Z") !== -1) {

												child.quaternion.setFromEuler(rotation);
									}
						});
			};

			THREE.TransformGizmoTranslate = function () {

						THREE.TransformGizmo.call(this);

						var arrowGeometry = new THREE.Geometry();
						var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.05, 0.2, 12, 1, false));
						mesh.position.y = 0.5;
						mesh.updateMatrix();

						arrowGeometry.merge(mesh.geometry, mesh.matrix);

						var lineXGeometry = new THREE.BufferGeometry();
						lineXGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

						var lineYGeometry = new THREE.BufferGeometry();
						lineYGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));

						var lineZGeometry = new THREE.BufferGeometry();
						lineZGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 1], 3));

						this.handleGizmos = {

									X: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({ color: 0xff0000 })), [0.5, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Line(lineXGeometry, new GizmoLineMaterial({ color: 0xff0000 }))]],

									Y: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({ color: 0x00ff00 })), [0, 0.5, 0]], [new THREE.Line(lineYGeometry, new GizmoLineMaterial({ color: 0x00ff00 }))]],

									Z: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({ color: 0x0000ff })), [0, 0, 0.5], [Math.PI / 2, 0, 0]], [new THREE.Line(lineZGeometry, new GizmoLineMaterial({ color: 0x0000ff }))]],

									XYZ: [[new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new GizmoMaterial({ color: 0xffffff, opacity: 0.25 })), [0, 0, 0], [0, 0, 0]]],

									XY: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new GizmoMaterial({ color: 0xffff00, opacity: 0.25 })), [0.15, 0.15, 0]]],

									YZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new GizmoMaterial({ color: 0x00ffff, opacity: 0.25 })), [0, 0.15, 0.15], [0, Math.PI / 2, 0]]],

									XZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.29, 0.29), new GizmoMaterial({ color: 0xff00ff, opacity: 0.25 })), [0.15, 0, 0.15], [-Math.PI / 2, 0, 0]]]

						};

						this.pickerGizmos = {

									X: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0.6, 0, 0], [0, 0, -Math.PI / 2]]],

									Y: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0, 0.6, 0]]],

									Z: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],

									XYZ: [[new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), pickerMaterial)]],

									XY: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), pickerMaterial), [0.2, 0.2, 0]]],

									YZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), pickerMaterial), [0, 0.2, 0.2], [0, Math.PI / 2, 0]]],

									XZ: [[new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), pickerMaterial), [0.2, 0, 0.2], [-Math.PI / 2, 0, 0]]]

						};

						this.setActivePlane = function (axis, eye) {

									var tempMatrix = new THREE.Matrix4();
									eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

									if (axis === "X") {

												this.activePlane = this.planes["XY"];

												if (Math.abs(eye.y) > Math.abs(eye.z)) this.activePlane = this.planes["XZ"];
									}

									if (axis === "Y") {

												this.activePlane = this.planes["XY"];

												if (Math.abs(eye.x) > Math.abs(eye.z)) this.activePlane = this.planes["YZ"];
									}

									if (axis === "Z") {

												this.activePlane = this.planes["XZ"];

												if (Math.abs(eye.x) > Math.abs(eye.y)) this.activePlane = this.planes["YZ"];
									}

									if (axis === "XYZ") this.activePlane = this.planes["XYZE"];

									if (axis === "XY") this.activePlane = this.planes["XY"];

									if (axis === "YZ") this.activePlane = this.planes["YZ"];

									if (axis === "XZ") this.activePlane = this.planes["XZ"];
						};

						this.init();
			};

			THREE.TransformGizmoTranslate.prototype = Object.create(THREE.TransformGizmo.prototype);
			THREE.TransformGizmoTranslate.prototype.constructor = THREE.TransformGizmoTranslate;

			THREE.TransformGizmoRotate = function () {

						THREE.TransformGizmo.call(this);

						var CircleGeometry = function CircleGeometry(radius, facing, arc) {

									var geometry = new THREE.BufferGeometry();
									var vertices = [];
									arc = arc ? arc : 1;

									for (var i = 0; i <= 64 * arc; ++i) {

												if (facing === 'x') vertices.push(0, Math.cos(i / 32 * Math.PI) * radius, Math.sin(i / 32 * Math.PI) * radius);
												if (facing === 'y') vertices.push(Math.cos(i / 32 * Math.PI) * radius, 0, Math.sin(i / 32 * Math.PI) * radius);
												if (facing === 'z') vertices.push(Math.sin(i / 32 * Math.PI) * radius, Math.cos(i / 32 * Math.PI) * radius, 0);
									}

									geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
									return geometry;
						};

						this.handleGizmos = {

									X: [[new THREE.Line(new CircleGeometry(1, 'x', 0.5), new GizmoLineMaterial({ color: 0xff0000 }))]],

									Y: [[new THREE.Line(new CircleGeometry(1, 'y', 0.5), new GizmoLineMaterial({ color: 0x00ff00 }))]],

									Z: [[new THREE.Line(new CircleGeometry(1, 'z', 0.5), new GizmoLineMaterial({ color: 0x0000ff }))]],

									E: [[new THREE.Line(new CircleGeometry(1.25, 'z', 1), new GizmoLineMaterial({ color: 0xcccc00 }))]],

									XYZE: [[new THREE.Line(new CircleGeometry(1, 'z', 1), new GizmoLineMaterial({ color: 0x787878 }))]]

						};

						this.pickerGizmos = {

									X: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.12, 4, 12, Math.PI), pickerMaterial), [0, 0, 0], [0, -Math.PI / 2, -Math.PI / 2]]],

									Y: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.12, 4, 12, Math.PI), pickerMaterial), [0, 0, 0], [Math.PI / 2, 0, 0]]],

									Z: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.12, 4, 12, Math.PI), pickerMaterial), [0, 0, 0], [0, 0, -Math.PI / 2]]],

									E: [[new THREE.Mesh(new THREE.TorusBufferGeometry(1.25, 0.12, 2, 24), pickerMaterial)]],

									XYZE: [[new THREE.Mesh()] // TODO
									]

						};

						this.setActivePlane = function (axis) {

									if (axis === "E") this.activePlane = this.planes["XYZE"];

									if (axis === "X") this.activePlane = this.planes["YZ"];

									if (axis === "Y") this.activePlane = this.planes["XZ"];

									if (axis === "Z") this.activePlane = this.planes["XY"];
						};

						this.update = function (rotation, eye2) {

									THREE.TransformGizmo.prototype.update.apply(this, arguments);

									var tempMatrix = new THREE.Matrix4();
									var worldRotation = new THREE.Euler(0, 0, 1);
									var tempQuaternion = new THREE.Quaternion();
									var unitX = new THREE.Vector3(1, 0, 0);
									var unitY = new THREE.Vector3(0, 1, 0);
									var unitZ = new THREE.Vector3(0, 0, 1);
									var quaternionX = new THREE.Quaternion();
									var quaternionY = new THREE.Quaternion();
									var quaternionZ = new THREE.Quaternion();
									var eye = eye2.clone();

									worldRotation.copy(this.planes["XY"].rotation);
									tempQuaternion.setFromEuler(worldRotation);

									tempMatrix.makeRotationFromQuaternion(tempQuaternion).getInverse(tempMatrix);
									eye.applyMatrix4(tempMatrix);

									this.traverse(function (child) {

												tempQuaternion.setFromEuler(worldRotation);

												if (child.name === "X") {

															quaternionX.setFromAxisAngle(unitX, Math.atan2(-eye.y, eye.z));
															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
															child.quaternion.copy(tempQuaternion);
												}

												if (child.name === "Y") {

															quaternionY.setFromAxisAngle(unitY, Math.atan2(eye.x, eye.z));
															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
															child.quaternion.copy(tempQuaternion);
												}

												if (child.name === "Z") {

															quaternionZ.setFromAxisAngle(unitZ, Math.atan2(eye.y, eye.x));
															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);
															child.quaternion.copy(tempQuaternion);
												}
									});
						};

						this.init();
			};

			THREE.TransformGizmoRotate.prototype = Object.create(THREE.TransformGizmo.prototype);
			THREE.TransformGizmoRotate.prototype.constructor = THREE.TransformGizmoRotate;

			THREE.TransformGizmoScale = function () {

						THREE.TransformGizmo.call(this);

						var arrowGeometry = new THREE.Geometry();
						var mesh = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.125, 0.125));
						mesh.position.y = 0.5;
						mesh.updateMatrix();

						arrowGeometry.merge(mesh.geometry, mesh.matrix);

						var lineXGeometry = new THREE.BufferGeometry();
						lineXGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

						var lineYGeometry = new THREE.BufferGeometry();
						lineYGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));

						var lineZGeometry = new THREE.BufferGeometry();
						lineZGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 1], 3));

						this.handleGizmos = {

									X: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({ color: 0xff0000 })), [0.5, 0, 0], [0, 0, -Math.PI / 2]], [new THREE.Line(lineXGeometry, new GizmoLineMaterial({ color: 0xff0000 }))]],

									Y: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({ color: 0x00ff00 })), [0, 0.5, 0]], [new THREE.Line(lineYGeometry, new GizmoLineMaterial({ color: 0x00ff00 }))]],

									Z: [[new THREE.Mesh(arrowGeometry, new GizmoMaterial({ color: 0x0000ff })), [0, 0, 0.5], [Math.PI / 2, 0, 0]], [new THREE.Line(lineZGeometry, new GizmoLineMaterial({ color: 0x0000ff }))]],

									XYZ: [[new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 0.125, 0.125), new GizmoMaterial({ color: 0xffffff, opacity: 0.25 }))]]

						};

						this.pickerGizmos = {

									X: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0.6, 0, 0], [0, 0, -Math.PI / 2]]],

									Y: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0, 0.6, 0]]],

									Z: [[new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), pickerMaterial), [0, 0, 0.6], [Math.PI / 2, 0, 0]]],

									XYZ: [[new THREE.Mesh(new THREE.BoxBufferGeometry(0.4, 0.4, 0.4), pickerMaterial)]]

						};

						this.setActivePlane = function (axis, eye) {

									var tempMatrix = new THREE.Matrix4();
									eye.applyMatrix4(tempMatrix.getInverse(tempMatrix.extractRotation(this.planes["XY"].matrixWorld)));

									if (axis === "X") {

												this.activePlane = this.planes["XY"];
												if (Math.abs(eye.y) > Math.abs(eye.z)) this.activePlane = this.planes["XZ"];
									}

									if (axis === "Y") {

												this.activePlane = this.planes["XY"];
												if (Math.abs(eye.x) > Math.abs(eye.z)) this.activePlane = this.planes["YZ"];
									}

									if (axis === "Z") {

												this.activePlane = this.planes["XZ"];
												if (Math.abs(eye.x) > Math.abs(eye.y)) this.activePlane = this.planes["YZ"];
									}

									if (axis === "XYZ") this.activePlane = this.planes["XYZE"];
						};

						this.init();
			};

			THREE.TransformGizmoScale.prototype = Object.create(THREE.TransformGizmo.prototype);
			THREE.TransformGizmoScale.prototype.constructor = THREE.TransformGizmoScale;

			THREE.TransformControls = function (camera, domElement) {

						// TODO: Make non-uniform scale and rotate play nice in hierarchies
						// TODO: ADD RXYZ contol

						THREE.Object3D.call(this);

						domElement = domElement !== undefined ? domElement : document;

						this.camera = camera;
						this.object = undefined;
						this.visible = false;
						this.translationSnap = null;
						this.rotationSnap = null;
						this.space = "world";
						this.size = 1;
						this.axis = null;

						var scope = this;

						var _mode = "translate";
						var _dragging = false;
						var _gizmo = {

									"translate": new THREE.TransformGizmoTranslate(),
									"rotate": new THREE.TransformGizmoRotate(),
									"scale": new THREE.TransformGizmoScale()
						};

						for (var type in _gizmo) {

									var gizmoObj = _gizmo[type];

									gizmoObj.visible = type === _mode;
									this.add(gizmoObj);
						}

						var changeEvent = { type: "change" };
						var mouseDownEvent = { type: "mouseDown" };
						var mouseUpEvent = { type: "mouseUp", mode: _mode };
						var objectChangeEvent = { type: "objectChange" };

						var ray = new THREE.Raycaster();
						var pointerVector = new THREE.Vector2();

						var point = new THREE.Vector3();
						var offset = new THREE.Vector3();

						var rotation = new THREE.Vector3();
						var offsetRotation = new THREE.Vector3();
						var scale = 1;

						var lookAtMatrix = new THREE.Matrix4();
						var eye = new THREE.Vector3();

						var tempMatrix = new THREE.Matrix4();
						var tempVector = new THREE.Vector3();
						var tempQuaternion = new THREE.Quaternion();
						var unitX = new THREE.Vector3(1, 0, 0);
						var unitY = new THREE.Vector3(0, 1, 0);
						var unitZ = new THREE.Vector3(0, 0, 1);

						var quaternionXYZ = new THREE.Quaternion();
						var quaternionX = new THREE.Quaternion();
						var quaternionY = new THREE.Quaternion();
						var quaternionZ = new THREE.Quaternion();
						var quaternionE = new THREE.Quaternion();

						var oldPosition = new THREE.Vector3();
						var oldScale = new THREE.Vector3();
						var oldRotationMatrix = new THREE.Matrix4();

						var parentRotationMatrix = new THREE.Matrix4();
						var parentScale = new THREE.Vector3();

						var worldPosition = new THREE.Vector3();
						var worldRotation = new THREE.Euler();
						var worldRotationMatrix = new THREE.Matrix4();
						var camPosition = new THREE.Vector3();
						var camRotation = new THREE.Euler();

						domElement.addEventListener("mousedown", onPointerDown, false);
						domElement.addEventListener("touchstart", onPointerDown, false);

						domElement.addEventListener("mousemove", onPointerHover, false);
						domElement.addEventListener("touchmove", onPointerHover, false);

						domElement.addEventListener("mousemove", onPointerMove, false);
						domElement.addEventListener("touchmove", onPointerMove, false);

						domElement.addEventListener("mouseup", onPointerUp, false);
						domElement.addEventListener("mouseout", onPointerUp, false);
						domElement.addEventListener("touchend", onPointerUp, false);
						domElement.addEventListener("touchcancel", onPointerUp, false);
						domElement.addEventListener("touchleave", onPointerUp, false);

						this.dispose = function () {

									domElement.removeEventListener("mousedown", onPointerDown);
									domElement.removeEventListener("touchstart", onPointerDown);

									domElement.removeEventListener("mousemove", onPointerHover);
									domElement.removeEventListener("touchmove", onPointerHover);

									domElement.removeEventListener("mousemove", onPointerMove);
									domElement.removeEventListener("touchmove", onPointerMove);

									domElement.removeEventListener("mouseup", onPointerUp);
									domElement.removeEventListener("mouseout", onPointerUp);
									domElement.removeEventListener("touchend", onPointerUp);
									domElement.removeEventListener("touchcancel", onPointerUp);
									domElement.removeEventListener("touchleave", onPointerUp);
						};

						this.attach = function (object) {

									this.object = object;
									this.visible = true;
									this.update();
						};

						this.detach = function () {

									this.object = undefined;
									this.visible = false;
									this.axis = null;
						};

						this.getMode = function () {

									return _mode;
						};

						this.setMode = function (mode) {

									_mode = mode ? mode : _mode;

									if (_mode === "scale") scope.space = "local";

									for (var type in _gizmo) {
												_gizmo[type].visible = type === _mode;
									}this.update();
									scope.dispatchEvent(changeEvent);
						};

						this.setTranslationSnap = function (translationSnap) {

									scope.translationSnap = translationSnap;
						};

						this.setRotationSnap = function (rotationSnap) {

									scope.rotationSnap = rotationSnap;
						};

						this.setSize = function (size) {

									scope.size = size;
									this.update();
									scope.dispatchEvent(changeEvent);
						};

						this.setSpace = function (space) {

									scope.space = space;
									this.update();
									scope.dispatchEvent(changeEvent);
						};

						this.update = function () {

									if (scope.object === undefined) return;

									scope.object.updateMatrixWorld();
									worldPosition.setFromMatrixPosition(scope.object.matrixWorld);
									worldRotation.setFromRotationMatrix(tempMatrix.extractRotation(scope.object.matrixWorld));

									scope.camera.updateMatrixWorld();
									camPosition.setFromMatrixPosition(scope.camera.matrixWorld);
									camRotation.setFromRotationMatrix(tempMatrix.extractRotation(scope.camera.matrixWorld));

									scale = worldPosition.distanceTo(camPosition) / 6 * scope.size;
									this.position.copy(worldPosition);
									this.scale.set(scale, scale, scale);

									if (scope.camera instanceof THREE.PerspectiveCamera) {

												eye.copy(camPosition).sub(worldPosition).normalize();
									} else if (scope.camera instanceof THREE.OrthographicCamera) {

												eye.copy(camPosition).normalize();
									}

									if (scope.space === "local") {

												_gizmo[_mode].update(worldRotation, eye);
									} else if (scope.space === "world") {

												_gizmo[_mode].update(new THREE.Euler(), eye);
									}

									_gizmo[_mode].highlight(scope.axis);
						};

						function onPointerHover(event) {

									if (scope.object === undefined || _dragging === true || event.button !== undefined && event.button !== 0) return;

									var pointer = event.changedTouches ? event.changedTouches[0] : event;

									var intersect = intersectObjects(pointer, _gizmo[_mode].pickers.children);

									var axis = null;

									if (intersect) {

												axis = intersect.object.name;

												event.preventDefault();
									}

									if (scope.axis !== axis) {

												scope.axis = axis;
												scope.update();
												scope.dispatchEvent(changeEvent);
									}
						}

						function onPointerDown(event) {

									if (scope.object === undefined || _dragging === true || event.button !== undefined && event.button !== 0) return;

									var pointer = event.changedTouches ? event.changedTouches[0] : event;

									if (pointer.button === 0 || pointer.button === undefined) {

												var intersect = intersectObjects(pointer, _gizmo[_mode].pickers.children);

												if (intersect) {

															event.preventDefault();
															event.stopPropagation();

															scope.dispatchEvent(mouseDownEvent);

															scope.axis = intersect.object.name;

															scope.update();

															eye.copy(camPosition).sub(worldPosition).normalize();

															_gizmo[_mode].setActivePlane(scope.axis, eye);

															var planeIntersect = intersectObjects(pointer, [_gizmo[_mode].activePlane]);

															if (planeIntersect) {

																		oldPosition.copy(scope.object.position);
																		oldScale.copy(scope.object.scale);

																		oldRotationMatrix.extractRotation(scope.object.matrix);
																		worldRotationMatrix.extractRotation(scope.object.matrixWorld);

																		parentRotationMatrix.extractRotation(scope.object.parent.matrixWorld);
																		parentScale.setFromMatrixScale(tempMatrix.getInverse(scope.object.parent.matrixWorld));

																		offset.copy(planeIntersect.point);
															}
												}
									}

									_dragging = true;
						}

						function onPointerMove(event) {

									if (scope.object === undefined || scope.axis === null || _dragging === false || event.button !== undefined && event.button !== 0) return;

									var pointer = event.changedTouches ? event.changedTouches[0] : event;

									var planeIntersect = intersectObjects(pointer, [_gizmo[_mode].activePlane]);

									if (planeIntersect === false) return;

									event.preventDefault();
									event.stopPropagation();

									point.copy(planeIntersect.point);

									if (_mode === "translate") {

												point.sub(offset);
												point.multiply(parentScale);

												if (scope.space === "local") {

															point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

															if (scope.axis.search("X") === -1) point.x = 0;
															if (scope.axis.search("Y") === -1) point.y = 0;
															if (scope.axis.search("Z") === -1) point.z = 0;

															point.applyMatrix4(oldRotationMatrix);

															scope.object.position.copy(oldPosition);
															scope.object.position.add(point);
												}

												if (scope.space === "world" || scope.axis.search("XYZ") !== -1) {

															if (scope.axis.search("X") === -1) point.x = 0;
															if (scope.axis.search("Y") === -1) point.y = 0;
															if (scope.axis.search("Z") === -1) point.z = 0;

															point.applyMatrix4(tempMatrix.getInverse(parentRotationMatrix));

															scope.object.position.copy(oldPosition);
															scope.object.position.add(point);
												}

												if (scope.translationSnap !== null) {

															if (scope.space === "local") {

																		scope.object.position.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));
															}

															if (scope.axis.search("X") !== -1) scope.object.position.x = Math.round(scope.object.position.x / scope.translationSnap) * scope.translationSnap;
															if (scope.axis.search("Y") !== -1) scope.object.position.y = Math.round(scope.object.position.y / scope.translationSnap) * scope.translationSnap;
															if (scope.axis.search("Z") !== -1) scope.object.position.z = Math.round(scope.object.position.z / scope.translationSnap) * scope.translationSnap;

															if (scope.space === "local") {

																		scope.object.position.applyMatrix4(worldRotationMatrix);
															}
												}
									} else if (_mode === "scale") {

												point.sub(offset);
												point.multiply(parentScale);

												if (scope.space === "local") {

															if (scope.axis === "XYZ") {

																		scale = 1 + point.y / Math.max(oldScale.x, oldScale.y, oldScale.z);

																		scope.object.scale.x = oldScale.x * scale;
																		scope.object.scale.y = oldScale.y * scale;
																		scope.object.scale.z = oldScale.z * scale;
															} else {

																		point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

																		if (scope.axis === "X") scope.object.scale.x = oldScale.x * (1 + point.x / oldScale.x);
																		if (scope.axis === "Y") scope.object.scale.y = oldScale.y * (1 + point.y / oldScale.y);
																		if (scope.axis === "Z") scope.object.scale.z = oldScale.z * (1 + point.z / oldScale.z);
															}
												}
									} else if (_mode === "rotate") {

												point.sub(worldPosition);
												point.multiply(parentScale);
												tempVector.copy(offset).sub(worldPosition);
												tempVector.multiply(parentScale);

												if (scope.axis === "E") {

															point.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));
															tempVector.applyMatrix4(tempMatrix.getInverse(lookAtMatrix));

															rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
															offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

															tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));

															quaternionE.setFromAxisAngle(eye, rotation.z - offsetRotation.z);
															quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionE);
															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

															scope.object.quaternion.copy(tempQuaternion);
												} else if (scope.axis === "XYZE") {

															quaternionE.setFromEuler(point.clone().cross(tempVector).normalize()); // rotation axis

															tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));
															quaternionX.setFromAxisAngle(quaternionE, -point.clone().angleTo(tempVector));
															quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

															scope.object.quaternion.copy(tempQuaternion);
												} else if (scope.space === "local") {

															point.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

															tempVector.applyMatrix4(tempMatrix.getInverse(worldRotationMatrix));

															rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
															offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

															quaternionXYZ.setFromRotationMatrix(oldRotationMatrix);

															if (scope.rotationSnap !== null) {

																		quaternionX.setFromAxisAngle(unitX, Math.round((rotation.x - offsetRotation.x) / scope.rotationSnap) * scope.rotationSnap);
																		quaternionY.setFromAxisAngle(unitY, Math.round((rotation.y - offsetRotation.y) / scope.rotationSnap) * scope.rotationSnap);
																		quaternionZ.setFromAxisAngle(unitZ, Math.round((rotation.z - offsetRotation.z) / scope.rotationSnap) * scope.rotationSnap);
															} else {

																		quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
																		quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
																		quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
															}

															if (scope.axis === "X") quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionX);
															if (scope.axis === "Y") quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionY);
															if (scope.axis === "Z") quaternionXYZ.multiplyQuaternions(quaternionXYZ, quaternionZ);

															scope.object.quaternion.copy(quaternionXYZ);
												} else if (scope.space === "world") {

															rotation.set(Math.atan2(point.z, point.y), Math.atan2(point.x, point.z), Math.atan2(point.y, point.x));
															offsetRotation.set(Math.atan2(tempVector.z, tempVector.y), Math.atan2(tempVector.x, tempVector.z), Math.atan2(tempVector.y, tempVector.x));

															tempQuaternion.setFromRotationMatrix(tempMatrix.getInverse(parentRotationMatrix));

															if (scope.rotationSnap !== null) {

																		quaternionX.setFromAxisAngle(unitX, Math.round((rotation.x - offsetRotation.x) / scope.rotationSnap) * scope.rotationSnap);
																		quaternionY.setFromAxisAngle(unitY, Math.round((rotation.y - offsetRotation.y) / scope.rotationSnap) * scope.rotationSnap);
																		quaternionZ.setFromAxisAngle(unitZ, Math.round((rotation.z - offsetRotation.z) / scope.rotationSnap) * scope.rotationSnap);
															} else {

																		quaternionX.setFromAxisAngle(unitX, rotation.x - offsetRotation.x);
																		quaternionY.setFromAxisAngle(unitY, rotation.y - offsetRotation.y);
																		quaternionZ.setFromAxisAngle(unitZ, rotation.z - offsetRotation.z);
															}

															quaternionXYZ.setFromRotationMatrix(worldRotationMatrix);

															if (scope.axis === "X") tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionX);
															if (scope.axis === "Y") tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionY);
															if (scope.axis === "Z") tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionZ);

															tempQuaternion.multiplyQuaternions(tempQuaternion, quaternionXYZ);

															scope.object.quaternion.copy(tempQuaternion);
												}
									}

									scope.update();
									scope.dispatchEvent(changeEvent);
									scope.dispatchEvent(objectChangeEvent);
						}

						function onPointerUp(event) {

									event.preventDefault(); // Prevent MouseEvent on mobile

									if (event.button !== undefined && event.button !== 0) return;

									if (_dragging && scope.axis !== null) {

												mouseUpEvent.mode = _mode;
												scope.dispatchEvent(mouseUpEvent);
									}

									_dragging = false;

									if ('TouchEvent' in window && event instanceof TouchEvent) {

												// Force "rollover"

												scope.axis = null;
												scope.update();
												scope.dispatchEvent(changeEvent);
									} else {

												onPointerHover(event);
									}
						}

						function intersectObjects(pointer, objects) {

									var rect = domElement.getBoundingClientRect();
									var x = (pointer.clientX - rect.left) / rect.width;
									var y = (pointer.clientY - rect.top) / rect.height;

									pointerVector.set(x * 2 - 1, -(y * 2) + 1);
									ray.setFromCamera(pointerVector, scope.camera);

									var intersections = ray.intersectObjects(objects, true);
									return intersections[0] ? intersections[0] : false;
						}
			};

			THREE.TransformControls.prototype = Object.create(THREE.Object3D.prototype);
			THREE.TransformControls.prototype.constructor = THREE.TransformControls;
})();

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _BoxEntry = __webpack_require__(5);

var _BoxEntry2 = _interopRequireDefault(_BoxEntry);

var _Dimensions = __webpack_require__(33);

var _Dimensions2 = _interopRequireDefault(_Dimensions);

var _LightDispatcher2 = __webpack_require__(14);

var _LightDispatcher3 = _interopRequireDefault(_LightDispatcher2);

var _App = __webpack_require__(24);

var _App2 = _interopRequireDefault(_App);

var _CargoList = __webpack_require__(34);

var _CargoList2 = _interopRequireDefault(_CargoList);

var _CargoBoxView = __webpack_require__(21);

var _CargoBoxView2 = _interopRequireDefault(_CargoBoxView);

var _Pool = __webpack_require__(20);

var _Pool2 = _interopRequireDefault(_Pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var epsilon = Math.pow(2, -52);
var numberType = 'number';

var _cargoList = Symbol('cargoList');

function poolNewFN() {
    return new _BoxEntry2.default();
}
/** @param {BoxEntry} boxEntry */
function poolResetFN(boxEntry) {
    return boxEntry;
}
var boxEntryPool = new _Pool2.default(poolNewFN, poolResetFN);

var signals = {
    show: 'show',
    hide: 'hide',
    insert: 'insert',
    modify: 'modify',
    remove: 'remove'
};

/** Renews entry: modify uid and color
 * @param {BoxEntry} boxEntry */
function renewBoxEntry(boxEntry) {
    boxEntry.SetUID();
    boxEntry.Description('color', _CargoBoxView2.default.GetNextColor().getHex());
}

/**
 * @typedef {Object} CargoInputParams
 * @property {import('../UX').default} ux
 */

/**
 * Cubic volumes entry
 */

var CargoInput = function (_LightDispatcher) {
    _inherits(CargoInput, _LightDispatcher);

    /**
     * @param {CargoInputParams} params 
     */
    function CargoInput(params) {
        _classCallCheck(this, CargoInput);

        var _this = _possibleConstructorReturn(this, (CargoInput.__proto__ || Object.getPrototypeOf(CargoInput)).call(this));

        _this.params = params;
        return _this;
    }

    /** @ignore ignore */


    _createClass(CargoInput, [{
        key: '_Bind',
        value: function _Bind(value) {
            /** @type {App} */
            var app = value;

            this[_cargoList] = app.packer.cargoList;
        }

        /** Creates a new BoxEntry, required for inputs. (Can be reused) */

    }, {
        key: 'CreateBoxEntry',
        value: function CreateBoxEntry() {
            var boxEntry = new _BoxEntry2.default();
            renewBoxEntry(boxEntry);
            return boxEntry;
        }

        /** @param {string} entryUID @returns {BoxEntry} a copy of the entry if it exists */

    }, {
        key: 'GetEntry',
        value: function GetEntry(entryUID) {
            /** @type {CargoList} */
            var cargoList = this[_cargoList];
            var entry = cargoList.GetEntry(entryUID);
            var entryMirror = boxEntryPool.Request();
            entryMirror.Copy(entry);
            return entry;
        }

        /** @returns {Array<BoxEntry>} an array of copies of all entries */

    }, {
        key: 'GetEntries',
        value: function GetEntries() {
            /** @type {CargoList} */
            var cargoList = this[_cargoList];
            var entries = [];
            cargoList.groups.forEach(function (value) {
                var entryMirror = boxEntryPool.Request();
                entryMirror.Copy(value.entry);
                entries.push(entryMirror);
            });

            return entries;
        }

        /**
         * Return BoxEntry objects to object pool (less memory usage)
         * @param {BoxEntry | Array<BoxEntry>} objects 
         */

    }, {
        key: 'Recycle',
        value: function Recycle(objects) {
            if (objects instanceof Array) {
                objects.forEach(function (object) {
                    if (object instanceof _BoxEntry2.default) boxEntryPool.Return(object);
                });
            } else if (objects instanceof _BoxEntry2.default) {
                boxEntryPool.Return(objects);
            }
        }

        /** Shows/updates entry 3D display
         * @param {BoxEntry} entry 
         * @returns {Boolean}
         */

    }, {
        key: 'Show',
        value: function Show(entry) {
            if (_BoxEntry2.default.Assert(entry)) {
                try {
                    this.Dispatch(signals.show, entry);
                    return true;
                } catch (error) {
                    _Logger2.default.Warn('Error in CargoInput.Show, error/entry:', error, entry);
                }

                return false;
            }

            _Logger2.default.Warn('BoxEntry.Assert failed in CargoInput.Show, entry:', entry);
            return false;
        }

        /** Hides entry 3D display */

    }, {
        key: 'Hide',
        value: function Hide() {
            this.Dispatch(signals.hide);
        }

        /** Adds a new entry and obtain its uid
         * @param {BoxEntry} entry
         * @returns {Number|Boolean} uid or false if error
         */

    }, {
        key: 'Add',
        value: function Add(entry) {
            if (_BoxEntry2.default.Assert(entry)) {

                if (_Dimensions2.default.IsVolume(entry.dimensions.Abs()) === false) {
                    _Logger2.default.Warn('CargoInput.Add, entry rejected, dimensions != Volume:', entry.dimensions);
                    return false;
                }

                try {
                    var commitedEntry = entry.Clone();
                    var uid = commitedEntry.SetUID();

                    renewBoxEntry(entry);

                    this.Dispatch(signals.insert, commitedEntry);
                    return uid;
                } catch (error) {
                    _Logger2.default.Warn('Error in CargoInput.Add, error/entry:', error, entry);
                }

                return false;
            }

            _Logger2.default.Warn('BoxEntry.Assert failed in CargoInput.Add, entry:', entry);
            return false;
        }

        /** Modify an existing BoxEntry, referenced by its uid, using a modifed template
         * @param {string} entryUID
         * @param {BoxEntry} boxEntry
         * @returns {Boolean} success
         */

    }, {
        key: 'Modify',
        value: function Modify(entryUID, boxEntry) {
            var existing = this.GetEntry(entryUID);
            if (!existing) {
                _Logger2.default.Warn('CargoInput.Modify, entry not found for:', entryUID);
                return false;
            }

            if (_BoxEntry2.default.Assert(boxEntry)) {

                if (_Dimensions2.default.IsVolume(boxEntry.dimensions.Abs()) === false) {
                    _Logger2.default.Warn('CargoInput.Modify, entry rejected, dimensions != Volume:', boxEntry);
                    return false;
                }

                try {
                    existing.Copy(boxEntry);

                    this.Dispatch(signals.modify, existing);
                    return true;
                } catch (error) {
                    _Logger2.default.Warn('Error in CargoInput.Modify, error/entry:', error, boxEntry);
                }

                return false;
            }

            _Logger2.default.Warn('BoxEntry.Assert failed in CargoInput.Modify, entry:', boxEntry);
            return false;
        }

        /** Removes an existing box entry
         * @param {string} entryUID
         * @returns {Boolean} success
         */

    }, {
        key: 'Remove',
        value: function Remove(entryUID) {

            /** @type {CargoList} */
            var cargoList = this[_cargoList];
            var existing = cargoList.GetEntry(entryUID);

            if (!existing) {
                _Logger2.default.Warn('CargoInput.Remove, entry not found for:', entryUID);
                return false;
            }

            this.Dispatch(signals.remove, existing);
            return true;
        }

        /** Enumeration of dispatched types */

    }], [{
        key: 'signals',
        get: function get() {
            return signals;
        }
    }]);

    return CargoInput;
}(_LightDispatcher3.default);

CargoInput.BoxEntry = _BoxEntry2.default;

exports.default = CargoInput;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _PackingSpace = __webpack_require__(36);

var _PackingSpace2 = _interopRequireDefault(_PackingSpace);

var _ContainerView = __webpack_require__(50);

var _ContainerView2 = _interopRequireDefault(_ContainerView);

var _Asset = __webpack_require__(3);

var _Asset2 = _interopRequireDefault(_Asset);

var _LightDispatcher2 = __webpack_require__(14);

var _LightDispatcher3 = _interopRequireDefault(_LightDispatcher2);

var _Logger = __webpack_require__(2);

var _Logger2 = _interopRequireDefault(_Logger);

var _ContainingVolume = __webpack_require__(10);

var _ContainingVolume2 = _interopRequireDefault(_ContainingVolume);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef PackingSpaceJSON
 * @property {*} jsonObject.view json data
 * @property {Container} jsonObject.container json data
 */

var signals = {
    containerLoaded: 'containerLoaded',
    sliderValueChange: 'sliderValueChange',
    sliderValueStop: 'sliderValueStop'
};

/**
 * @typedef {Object} PackingSpaceInputParams
 * @property {import('../UX').default} ux
 */

/** @param {Container} container @param {THREE.Object3D} model */
function createContainerView(container, model, units) {
    var containerView = void 0;
    if (model) {
        containerView = new _ContainerView2.default(container, model);
    } else {
        containerView = _ContainerView2.default.Request(container);
    }

    var padding = 60 * units;
    var thickness = 2 * units;
    containerView.PlatformVisibility(true, new THREE.Vector3(padding, thickness, padding));
}

var PackingSpaceInput = function (_LightDispatcher) {
    _inherits(PackingSpaceInput, _LightDispatcher);

    /**
     * @param {PackingSpaceInputParams} params 
     */
    function PackingSpaceInput(params) {
        _classCallCheck(this, PackingSpaceInput);

        var _this = _possibleConstructorReturn(this, (PackingSpaceInput.__proto__ || Object.getPrototypeOf(PackingSpaceInput)).call(this));

        _this.params = params;

        _this.packingSpace = new _PackingSpace2.default();
        return _this;
    }

    /** @ignore ignore */


    _createClass(PackingSpaceInput, [{
        key: "_Bind",
        value: function _Bind(value) {
            /** @type {App} */
            var app = value;
        }

        /**
         * Creates a dummy container, get an uid for later changes (or false on error)
         * @param {Number} width
         * @param {Number} length
         * @param {Number} height
         * @param {Number} weightCapacity
         * @returns {Number|Boolean} uid or false if error
         */

    }, {
        key: "FromInput",
        value: function FromInput(width, length, height, weightCapacity) {
            var container = new _Container2.default();

            var containingVolume = new _ContainingVolume2.default(container);
            containingVolume.dimensions.Set(width, length, height);
            containingVolume.weightCapacity = weightCapacity;

            container.Add(containingVolume);

            var units = this.params.ux.params.units;
            createContainerView(container, null, units);

            this.packingSpace.AddContainer(container);

            this.Dispatch(signals.containerLoaded, container);
            return container.uid;
        }

        /**
         * Load packing config, get an uid for later changes (or false on error)
         * @param {PackingSpaceJSON} jsonObject 
         * @returns {Number|Boolean} uid or false if error
         */

    }, {
        key: "Load",
        value: function Load(jsonObject) {

            /** @type {PackingSpaceJSON} jsonObject */
            var data = void 0;
            try {
                data = typeof jsonObject === 'string' ? JSON.parse(jsonObject) : jsonObject;
            } catch (error) {
                _Logger2.default.Warn('Error in PackingSpaceInput.Load, error/jsonObject:', error, jsonObject);
                return false;
            }

            if (data.container) {
                var container = void 0;
                try {
                    container = _Container2.default.FromJSON(data.container);
                } catch (error) {
                    _Logger2.default.Warn('Error in PackingSpaceInput.Load, error/jsonObject.container:', error, data.container);
                    return false;
                }

                if (!container.uid) container.SetUID();
                var uid = container.uid;

                var model = void 0;
                if (data.view) {
                    try {
                        model = _Asset2.default.FromJSON(data.view);
                    } catch (error) {
                        _Logger2.default.Warn('Error in PackingSpaceInput.Load, error/jsonObject.view:', error, data.view);
                        return false;
                    }
                }

                var units = this.params.ux.params.units;
                createContainerView(container, model, units);

                this.packingSpace.AddContainer(container);

                this.Dispatch(signals.containerLoaded, container);
                return uid;
            }

            return false;
        }

        /** Enumeration of dispatched types */

    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return PackingSpaceInput;
}(_LightDispatcher3.default);

exports.default = PackingSpaceInput;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LightDispatcher2 = __webpack_require__(14);

var _LightDispatcher3 = _interopRequireDefault(_LightDispatcher2);

var _Packer = __webpack_require__(12);

var _Packer2 = _interopRequireDefault(_Packer);

var _Utils = __webpack_require__(0);

var _Utils2 = _interopRequireDefault(_Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @typedef {import('../packer/Packer').SolverParams} SolverParams */

/** @typedef {import('../packer/cub/CUB').CUBParams} CUBParams */

var ResultSpace =
/** @param {string} uid */
function ResultSpace(uid) {
    _classCallCheck(this, ResultSpace);

    this.uid = uid;
};

var ResultEntry =
/** @param {string} uid @param {ResultSpace} space @param {Number} quantity */
function ResultEntry(uid, space, quantity) {
    _classCallCheck(this, ResultEntry);

    this.uid = uid;
    this.space = space;
    this.quantity = quantity || 0;
};

var PackingResult = function PackingResult() {
    _classCallCheck(this, PackingResult);

    /** @type {Array<ResultSpace>} */
    this.packingSpaces = [];
    /** @type {Array<ResultEntry>} */
    this.packed = [];
    /** @type {Array<ResultEntry>} */
    this.unpacked = [];

    this.totalPacked = 0;
    this.totalUnpacked = 0;
    /** algorithm runtime in seconds */
    this.solveDuration = 1;
};

/** @param {Packer.PackingResult} packingResult */


function toInterfaceResults(packingResult) {
    var result = new PackingResult();

    /** @param {string} containerUID */
    function getSpace(containerUID) {
        for (var i = 0; i < result.packingSpaces.length; i++) {
            if (result.packingSpaces[i].uid === containerUID) {
                return result.packingSpaces[i];
            }
        }

        var ps = new ResultSpace(containerUID);
        result.packingSpaces.push(ps);
        return ps;
    }

    var totalPacked = 0,
        totalUnpacked = 0;

    /** @param {ResultEntry} resultEntry @param {Array<ResultEntry>} list */
    function packEntry(resultEntry, list) {
        var isFirst = true;
        for (var i = 0; i < list.length; i++) {
            if (list[i].uid === resultEntry.uid) {
                isFirst = false;
                list[i].quantity++;
                break;
            }
        }

        if (isFirst) {
            resultEntry.quantity = 1;
            list.push(resultEntry);
        }
    }

    packingResult.packed.forEach(function (p) {
        var uid = p.entry.uid;
        var space = getSpace(p.containingVolume.container.uid);
        packEntry(new ResultEntry(uid, space), result.packed);
        totalPacked++;
    });

    packingResult.unpacked.forEach(function (p) {
        var uid = p.entry.uid;
        var space = null;
        var unpackedQuantity = p.unpackedQuantity;
        result.unpacked.push(new ResultEntry(uid, space, unpackedQuantity));
        totalUnpacked += unpackedQuantity;
    });

    result.totalPacked = totalPacked;
    result.totalUnpacked = totalUnpacked;
    result.solveDuration = packingResult.runtime;

    return result;
}

var signals = {
    solveRequest: 'solveRequest',
    solved: 'solved',
    failed: 'failed'
};

/** @typedef PackerParams 
 * @property {Number} defaultStackingFactor default = 5, multiplier for stacking capacity (capacity = weight * defaultStackingFactor) if stackingProperty is not enabled */
var defaultParams = {
    defaultStackingFactor: 5
};

/** @type {SolverParams} */
var defaultSolverParams = {
    algorithm: 'cub'
};

var PackerInterface = function (_LightDispatcher) {
    _inherits(PackerInterface, _LightDispatcher);

    /** @param {PackerParams} params */
    function PackerInterface(params) {
        _classCallCheck(this, PackerInterface);

        var _this = _possibleConstructorReturn(this, (PackerInterface.__proto__ || Object.getPrototypeOf(PackerInterface)).call(this));

        _this.params = _Utils2.default.AssignUndefined(params, defaultParams);
        return _this;
    }

    /** Solve packing for current cargo list in loaded packing space 
     * @param {SolverParams} params */


    _createClass(PackerInterface, [{
        key: "Solve",
        value: function Solve(params) {
            params = _Utils2.default.AssignUndefined(params, defaultSolverParams);
            this.Dispatch(signals.solveRequest, params);
        }

        /** @ignore ignore */

    }, {
        key: "_Notify",
        value: function _Notify() {
            var value = arguments.length <= 0 ? undefined : arguments[0];
            switch (value) {
                case signals.solved:
                    var packingResult = arguments.length <= 1 ? undefined : arguments[1];
                    var result = toInterfaceResults(packingResult);
                    this.Dispatch(signals.solved, result);
                    break;
                case signals.failed:
                    var error = arguments.length <= 1 ? undefined : arguments[1];
                    this.Dispatch(signals.failed, error);
                    break;
            }
        }

        /** Enumeration of dispatched types */

    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return PackerInterface;
}(_LightDispatcher3.default);

exports.default = PackerInterface;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LightDispatcher2 = __webpack_require__(14);

var _LightDispatcher3 = _interopRequireDefault(_LightDispatcher2);

var _App = __webpack_require__(24);

var _App2 = _interopRequireDefault(_App);

var _CargoListView = __webpack_require__(27);

var _CargoListView2 = _interopRequireDefault(_CargoListView);

var _CargoEntry = __webpack_require__(6);

var _CargoEntry2 = _interopRequireDefault(_CargoEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _app = Symbol('app');

var signals = {
    boxEntryInteract: 'beInteract0'
};

var User = function (_LightDispatcher) {
    _inherits(User, _LightDispatcher);

    /** @param {App} app */
    function User(app) {
        _classCallCheck(this, User);

        var _this = _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this));

        _this[_app] = app;

        var scope = _this;
        /** @param {CargoEntry} cargoEntry */
        function onCargoInteract(cargoEntry) {
            scope.Dispatch(signals.boxEntryInteract, cargoEntry.uid);
        }

        app.view.cargoListView.On(_CargoListView2.default.signals.interact, onCargoInteract);
        return _this;
    }

    /** Enumeration of dispatched types */


    _createClass(User, null, [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return User;
}(_LightDispatcher3.default);

exports.default = User;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EntryInputView = __webpack_require__(43);

var _EntryInputView2 = _interopRequireDefault(_EntryInputView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = function () {
    function Constants() {
        _classCallCheck(this, Constants);
    }

    _createClass(Constants, null, [{
        key: "scaleRefFigure",
        get: function get() {
            return _EntryInputView2.default.scaleFigure;
        }
    }]);

    return Constants;
}();

exports.default = Constants;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ActiveEditor2 = __webpack_require__(92);

var _ActiveEditor3 = _interopRequireDefault(_ActiveEditor2);

var _ContainersEditorWizard = __webpack_require__(30);

var _ContainersEditorWizard2 = _interopRequireDefault(_ContainersEditorWizard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainersEditor = function (_ActiveEditor) {
    _inherits(ContainersEditor, _ActiveEditor);

    function ContainersEditor(gui) {
        _classCallCheck(this, ContainersEditor);

        var _this = _possibleConstructorReturn(this, (ContainersEditor.__proto__ || Object.getPrototypeOf(ContainersEditor)).call(this, gui));

        _this.Start();
        return _this;
    }

    _createClass(ContainersEditor, [{
        key: "Start",
        value: function Start() {
            var view = new THREE.Object3D();
            FPEditor.instance.sceneSetup.sceneController.Add(view);

            var wizard = new _ContainersEditorWizard2.default();
            wizard.Globals({
                view: view
            });
            wizard.Start();
        }
    }]);

    return ContainersEditor;
}(_ActiveEditor3.default);

exports.default = ContainersEditor;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ActiveEditor = function () {
    function ActiveEditor(gui) {
        _classCallCheck(this, ActiveEditor);

        this.folder;
    }

    _createClass(ActiveEditor, [{
        key: "Dispose",
        value: function Dispose() {}
    }]);

    return ActiveEditor;
}();

exports.default = ActiveEditor;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _WizardStep2 = __webpack_require__(15);

var _WizardStep3 = _interopRequireDefault(_WizardStep2);

var _IO = __webpack_require__(38);

var _IO2 = _interopRequireDefault(_IO);

var _Draggable = __webpack_require__(31);

var _Draggable2 = _interopRequireDefault(_Draggable);

var _Dom = __webpack_require__(16);

var _Dom2 = _interopRequireDefault(_Dom);

var _ContainersEditorWizard = __webpack_require__(30);

var _ContainersEditorWizard2 = _interopRequireDefault(_ContainersEditorWizard);

var _OptimizedMultiMat = __webpack_require__(94);

var _OptimizedMultiMat2 = _interopRequireDefault(_OptimizedMultiMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadRefStep = function (_WizardStep) {
    _inherits(LoadRefStep, _WizardStep);

    function LoadRefStep() {
        _classCallCheck(this, LoadRefStep);

        return _possibleConstructorReturn(this, (LoadRefStep.__proto__ || Object.getPrototypeOf(LoadRefStep)).call(this, 'loadRef'));
    }

    _createClass(LoadRefStep, [{
        key: "Start",
        value: function Start() {
            _get(LoadRefStep.prototype.__proto__ || Object.getPrototypeOf(LoadRefStep.prototype), "Start", this).call(this);

            var scope = this;

            var elements = document.getElementById('wizard-elements');
            var element = elements.querySelector('#loadRef');
            var loadBtn = element.querySelector('#loadBtn');
            loadBtn.onclick = function () {
                scope.Import3DModel();
            };

            this.modal = new _Draggable2.default(_ContainersEditorWizard2.default.title, _Draggable2.default.widths.medium);
            this.modal.Add(element);
            _Dom2.default.instance.Add(this.modal);
        }
    }, {
        key: "Import3DModel",
        value: function Import3DModel() {
            var scope = this;
            _IO2.default.GetFile(function (file) {
                var obj = new THREE.FBXLoader().parse(file);
                scope.SetRefModel(obj);
            }, true);
        }
    }, {
        key: "SetRefModel",
        value: function SetRefModel(obj) {
            console.log(obj);

            var optimizedRefObject = new _OptimizedMultiMat2.default(obj);
            var refObject = optimizedRefObject.obj;

            refObject.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    /** @type {THREE.BufferGeometry} */
                    var geometry = child.geometry;
                    console.log(geometry);
                    if (geometry.isBufferGeometry) {
                        geometry = new THREE.Geometry().fromBufferGeometry(geometry);
                        geometry.mergeVertices();
                        geometry.computeFaceNormals();
                        child.geometry = geometry;
                    }
                }
            });

            console.log(refObject);

            if (this.data.ref !== undefined) this.data.view.remove(this.data.ref);

            this.data.ref = refObject;
            this.data.view.add(this.data.ref);

            this.Complete(this.data);
        }
    }, {
        key: "Dispose",
        value: function Dispose() {
            _get(LoadRefStep.prototype.__proto__ || Object.getPrototypeOf(LoadRefStep.prototype), "Dispose", this).call(this);
            this.modal.Remove();
        }
    }]);

    return LoadRefStep;
}(_WizardStep3.default);

exports.default = LoadRefStep;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(55);

function extractBGGroup(geometry, group) {
    var g = new THREE.BufferGeometry();

    var position = new Float32Array(group.count * 3);
    var normal = new Float32Array(group.count * 3);
    var uv = new Float32Array(group.count * 2);

    var pArray = geometry.attributes.position.array;
    var nArray = geometry.attributes.normal.array;
    var uArray = geometry.attributes.uv.array;

    for (var i = 0; i < group.count; i++) {
        var i3 = i * 3;
        var i3Array = group.start * 3 + i3;

        position[i3] = pArray[i3Array];
        position[i3 + 1] = pArray[i3Array + 1];
        position[i3 + 2] = pArray[i3Array + 2];

        normal[i3] = nArray[i3Array];
        normal[i3 + 1] = nArray[i3Array + 1];
        normal[i3 + 2] = nArray[i3Array + 2];

        var i2 = i * 2;
        var i2Array = group.start * 2 + i2;
        uv[i2] = uArray[i2Array];
        uv[i2 + 1] = uArray[i2Array + 1];
    }

    g.addAttribute('position', new THREE.BufferAttribute(position, 3));
    g.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
    g.addAttribute('uv', new THREE.BufferAttribute(uv, 2));

    return g;
}

var OptimizedMultiMat = function () {
    /**
     * 
     * @param {THREE.Object3D} source 
     */
    function OptimizedMultiMat(source) {
        _classCallCheck(this, OptimizedMultiMat);

        this.obj = new THREE.Object3D(); // optimized object3D
        this.materialsMap = {};

        this.creationLog = {
            originalCallsNum: 0,
            newCallsNum: 0
        };

        var scope = this;
        if (source) {
            source.updateMatrixWorld(true);
            source.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var mesh = child.clone();
                    mesh.geometry = mesh.geometry.clone().applyMatrix(child.matrixWorld);
                    mesh.position.set(0, 0, 0);
                    mesh.rotation.set(0, 0, 0);
                    mesh.scale.set(1, 1, 1);

                    scope.AppendMesh(mesh);
                }
            });
        }
    }

    /**
     * @param {THREE.Mesh} mesh 
     */


    _createClass(OptimizedMultiMat, [{
        key: 'AppendMesh',
        value: function AppendMesh(mesh) {

            var geometry = mesh.geometry;
            var numGroups = geometry.groups.length;

            if (numGroups === 0) {
                var materialUUID = mesh.material.uuid + Object.keys(geometry.attributes).length;
                if (this.materialsMap[materialUUID] === undefined) {

                    this.creationLog.newCallsNum++;
                    this.creationLog.originalCallsNum++;

                    this.materialsMap[materialUUID] = mesh;
                    this.obj.add(mesh);
                } else {

                    this.creationLog.originalCallsNum++;

                    var merge = [this.materialsMap[materialUUID].geometry, mesh.geometry];
                    var mergeOp = THREE.BufferGeometryUtils.mergeBufferGeometries(merge);
                    if (mergeOp !== null) this.materialsMap[materialUUID].geometry = mergeOp;else console.log('merge error:' + this.sov.ToString(), merge, mergeOp);
                }
            } else {
                for (var iGroup = 0; iGroup < numGroups; iGroup++) {
                    var group = mesh.geometry.groups[iGroup];
                    var groupMaterial = mesh.material[group.materialIndex];
                    var groupGeometry = extractBGGroup(mesh.geometry, group);
                    var materialUUID = groupMaterial.uuid + Object.keys(groupGeometry.attributes).length;
                    if (this.materialsMap[materialUUID] === undefined) {

                        this.creationLog.newCallsNum++;
                        this.creationLog.originalCallsNum++;

                        var groupMesh = new THREE.Mesh(groupGeometry, groupMaterial);
                        this.materialsMap[materialUUID] = groupMesh;
                        this.obj.add(groupMesh);
                    } else {

                        this.creationLog.originalCallsNum++;

                        var merge = [this.materialsMap[materialUUID].geometry, groupGeometry];
                        this.materialsMap[materialUUID].geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(merge);
                    }
                }
            }
        }
    }]);

    return OptimizedMultiMat;
}();

exports.default = OptimizedMultiMat;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _RaycastGroup = __webpack_require__(32);

var _RaycastGroup2 = _interopRequireDefault(_RaycastGroup);

var _WizardStep2 = __webpack_require__(15);

var _WizardStep3 = _interopRequireDefault(_WizardStep2);

var _SurfaceUtils = __webpack_require__(96);

var _SurfaceUtils2 = _interopRequireDefault(_SurfaceUtils);

var _DirectedRect = __webpack_require__(97);

var _DirectedRect2 = _interopRequireDefault(_DirectedRect);

var _Draggable = __webpack_require__(31);

var _Draggable2 = _interopRequireDefault(_Draggable);

var _Dom = __webpack_require__(16);

var _Dom2 = _interopRequireDefault(_Dom);

var _Feedback = __webpack_require__(98);

var _Feedback2 = _interopRequireDefault(_Feedback);

var _Container = __webpack_require__(7);

var _Container2 = _interopRequireDefault(_Container);

var _ContainingVolume = __webpack_require__(10);

var _ContainingVolume2 = _interopRequireDefault(_ContainingVolume);

var _WizardAction = __webpack_require__(99);

var _WizardAction2 = _interopRequireDefault(_WizardAction);

var _ContainersEditorWizard = __webpack_require__(30);

var _ContainersEditorWizard2 = _interopRequireDefault(_ContainersEditorWizard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @typedef {Object} ConfigureSpaceData
 * 
 * @property {THREE.Object3D} view
 * @property {Container} container
 * @property {DirectedRect} platform
 */

var signals = {
    surfacePick: 'surfacePick',
    infoInput: 'infoInput',
    sidePick: 'sidePick'
};

var ConfigureSpaceStep = function (_WizardStep) {
    _inherits(ConfigureSpaceStep, _WizardStep);

    function ConfigureSpaceStep() {
        _classCallCheck(this, ConfigureSpaceStep);

        /**
         * @type {ConfigureSpaceData}
         */
        var _this = _possibleConstructorReturn(this, (ConfigureSpaceStep.__proto__ || Object.getPrototypeOf(ConfigureSpaceStep)).call(this, 'configureSpace'));

        _this.data;

        var container = new _Container2.default();
        var volume = new _ContainingVolume2.default(container);
        container.Add(volume);
        _this.data.container = container;

        return _this;
    }

    _createClass(ConfigureSpaceStep, [{
        key: "Start",
        value: function Start(dataPass) {
            _get(ConfigureSpaceStep.prototype.__proto__ || Object.getPrototypeOf(ConfigureSpaceStep.prototype), "Start", this).call(this);

            Object.assign(this.data, dataPass);

            /**
             * @type {THREE.Object3D}
             */
            this.obj = this.data.ref;

            var scope = this;

            var elements = document.getElementById('wizard-elements');
            var element = elements.querySelector('#configureSpace');

            var sideAction = new _WizardAction2.default(element.querySelector('#side'));
            sideAction.button.onclick = function () {
                scope.PickLoadingSide();
            };

            var inputAction = new _WizardAction2.default(element.querySelector('#input'));
            inputAction.button.onclick = function () {
                scope.InputInfo();
            };

            var surfaceAction = new _WizardAction2.default(element.querySelector('#surface'));
            surfaceAction.button.onclick = function () {
                scope.PickSurface();
            };

            var nextBtn = element.querySelector('#nextBtn');
            nextBtn.onclick = function () {
                scope.Complete();
            };

            this.modal = new _Draggable2.default(_ContainersEditorWizard2.default.title, _Draggable2.default.widths.medium);
            this.modal.Add(element);
            _Dom2.default.instance.Add(this.modal);

            this.On(signals.surfacePick, function () {
                surfaceAction.status = true;
                inputAction.disabled = false;
            });

            this.On(signals.infoInput, function () {
                inputAction.status = true;
                sideAction.disabled = false;
            });

            this.On(signals.sidePick, function () {
                sideAction.status = true;
                nextBtn.disabled = false;
            });
        }
    }, {
        key: "PickSurface",
        value: function PickSurface() {
            if (!this.raycastGroup) {
                var scope = this;
                this.raycastGroup = new _RaycastGroup2.default([this.obj], //items
                function (obj, intersection) {
                    if (scope.pickSurfaceMode) {
                        scope.OnClickPickSurface(obj, intersection);
                        scope.pickSurfaceMode = false;
                    }
                }, // callback

                undefined, false, //updateProperty
                true //recursive
                );

                var input = FPEditor.instance.sceneSetup.input;
                input.AddRaycastGroup('OnClick', 'Ref3D', this.raycastGroup);
            }

            this.pickSurfaceMode = true;
        }

        /**
         * 
         * @param {DirectedRect} platform 
         */

    }, {
        key: "ValidatePlatform",
        value: function ValidatePlatform(platform) {
            var up = new THREE.Vector3(0, 1, 0);
            var horizontalUp = up.dot(platform.normal) > .9;
            console.log(platform.normal, up.dot(platform.normal));
            if (horizontalUp === false) {
                alert('Please pick a horizontal surface facing up');
                return false;
            }

            if (platform.width < .0001) {
                alert('Platform\'s width is too small');
                return false;
            }

            if (platform.length < .0001) {
                alert('Platform\'s length is too small');
                return false;
            }

            return true;
        }
    }, {
        key: "OnClickPickSurface",
        value: function OnClickPickSurface(obj, intersection) {
            console.log(intersection);
            var geometry = intersection.object.geometry;
            var coplanar = _SurfaceUtils2.default.GetCoplanar(2, geometry, intersection.face, true);

            var gVertices = geometry.vertices;
            var vertices = [];
            for (var f in coplanar) {
                var face = coplanar[f];
                vertices.push(gVertices[face.a], gVertices[face.b], gVertices[face.c]);
            }

            var platform = _DirectedRect2.default.FromPoints(vertices);
            if (this.ValidatePlatform(platform) === false) {
                this.pickSurfaceMode = true;
                return;
            }

            this.platform = platform;
            var volume = this.data.container.volume;
            volume.position.copy(this.platform.center);

            vertices = _SurfaceUtils2.default.Clone(vertices);
            var surfaceGeometry = _SurfaceUtils2.default.FromVertices(vertices);
            var normal = _SurfaceUtils2.default.Normal(surfaceGeometry);
            _SurfaceUtils2.default.Add(vertices, normal.clone().multiplyScalar(.1));
            surfaceGeometry.verticesNeedUpdate = true;

            if (this.selectedSurface === undefined) {
                this.selectedSurface = new THREE.Mesh(surfaceGeometry, new THREE.MeshStandardMaterial({ color: 0xaa0000 }));
                this.selectedSurface.applyMatrix(this.obj.matrix);
                this.data.view.add(this.selectedSurface);

                var input = FPEditor.instance.sceneSetup.input;
                var scope = this;
                input.onClick.push(function (e) {
                    scope.selectedSurface.visible = false;
                });
            }
            this.selectedSurface.visible = true;

            this.selectedSurface.geometry = surfaceGeometry;

            var scope = this;
            var input = FPEditor.instance.sceneSetup.input;
            input.DelayedAction(function () {
                scope.SurfaceInfo();
            }, 200);

            this.On(signals.surfacePick, function () {
                scope.selectedSurface.visible = false;
            });
        }
    }, {
        key: "SurfaceInfo",
        value: function SurfaceInfo() {

            var scope = this;

            var platform = this.platform;
            var surfaceInfo = /*this.surfaceInfo =*/{ width: platform.width, length: platform.length };

            var obj = this.obj;
            var onChange = function onChange() {
                var sw = surfaceInfo.width / platform.width;
                var sl = surfaceInfo.length / platform.length;
                var sh = (sw + sl) / 2;
                obj.scale.set(sw, sh, sl);
                platform.Scale(sw, sl, sh);

                console.log(platform);
                if (platform.invert) {
                    var m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
                    obj.applyMatrix(m);
                    platform.center.applyMatrix4(m);
                }

                var offset = new THREE.Vector3().subVectors(platform.center, obj.position);
                offset.y = 0;
                obj.position.sub(offset);
                platform.center.x = platform.center.z = 0;

                var volume = scope.data.container.volume;
                volume.position.copy(platform.center);
            };

            _Feedback2.default.Prompt('Surface width', surfaceInfo.width).then(function (width) {
                surfaceInfo.width = Number.parseFloat(width);
                return _Feedback2.default.Prompt('Surface length', surfaceInfo.length);
            }).then(function (length) {
                surfaceInfo.length = Number.parseFloat(length);
                onChange();
                scope.Dispatch(signals.surfacePick);
            });
        }
    }, {
        key: "InputInfo",
        value: function InputInfo() {

            var scope = this;

            var containingVolume = this.data.container.volume;
            var dimensions = this.data.container.volume.dimensions;
            if (dimensions.volume < 1) {
                var platform = this.platform;
                dimensions.Set(platform.width, platform.length, platform.width);
            }
            var onChange = function onChange() {
                scope.DisplayVolume();
            };

            _Feedback2.default.Prompt('Volume width', dimensions.width).then(function (width) {
                dimensions.width = Number.parseFloat(width);
                onChange();
                return _Feedback2.default.Prompt('Volume length', dimensions.length);
            }).then(function (length) {
                dimensions.length = Number.parseFloat(length);
                onChange();
                return _Feedback2.default.Prompt('Volume height', dimensions.height);
            }).then(function (height) {
                dimensions.height = Number.parseFloat(height);
                onChange();
                return _Feedback2.default.Prompt('Weight capacity', dimensions.width * dimensions.length * dimensions.height / 1000);
            }).then(function (weightCapacity) {
                containingVolume.weightCapacity = weightCapacity;
                onChange();
                scope.Dispatch(signals.infoInput);
            });
        }
    }, {
        key: "DisplayVolume",
        value: function DisplayVolume() {
            var platform = this.platform;

            if (this.displayVolume === undefined) {
                this.displayVolume = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshStandardMaterial({
                    transparent: true,
                    opacity: .5
                }));
                this.displayVolume.scale.set(0.01, 0.01, 0.01);
                this.displayVolume.position.copy(platform.center);

                this.data.view.add(this.displayVolume);
            }

            var dimensions = this.data.container.volume.dimensions;
            this.displayVolume.scale.set(dimensions.width, dimensions.height, dimensions.length);
            this.displayVolume.position.y = platform.center.y + dimensions.height / 2;
        }
    }, {
        key: "PickLoadingSide",
        value: function PickLoadingSide() {
            if (!this.raycastGroupSide && this.displayVolume) {
                var scope = this;
                this.raycastGroupSide = new _RaycastGroup2.default([this.displayVolume], //items
                function (obj, intersection) {
                    if (scope.pickSideMode) {
                        scope.OnClickPickSide(obj, intersection);
                        scope.pickSideMode = false;
                    }
                }, // callback

                function (obj) {
                    //collectionQuery
                    return obj;
                }, true, //updateProperty
                true //recursive
                );

                var input = FPEditor.instance.sceneSetup.input;
                input.AddRaycastGroup('OnClick', 'Side', this.raycastGroupSide);
            }

            this.pickSideMode = true;
        }

        /**
         * 
         * @param {THREE.Mesh} obj 
         * @param {THREE.Intersection} intersection 
         */

    }, {
        key: "OnClickPickSide",
        value: function OnClickPickSide(obj, intersection) {

            /**
             * @type {Array<THREE.Vector3>}
             */
            var v = obj.geometry.vertices;
            var f = intersection.face;
            var vertices = [v[f.a], v[f.b], v[f.c]];
            f = obj.geometry.faces[intersection.faceIndex + (intersection.faceIndex % 2 === 1 ? -1 : 1)];
            vertices.push(v[f.a], v[f.b], v[f.c]);

            var side = new THREE.Vector3();
            for (var i = 0; i < 6; i++) {
                side.add(vertices[i]);
            }
            side.multiplyScalar(1 / 6).applyMatrix4(this.displayVolume.matrix);

            var center = this.displayVolume.position;
            var direction = new THREE.Vector3().subVectors(side, center);

            var platform = this.platform;
            platform.direction = _DirectedRect2.default.AxisDirection(direction);

            if (platform.direction.z < .99) {
                var m = new THREE.Matrix4();
                m.setPosition(this.obj.position.clone().multiplyScalar(-1));
                m.makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI));
                this.obj.applyMatrix(m);

                platform.direction.multiplyScalar(-1);
            }

            console.log(platform);

            if (this.axesHelper === undefined) {
                this.axesHelper = new THREE.AxesHelper(direction.length());
                this.data.view.add(this.axesHelper);
            }

            this.axesHelper.position.copy(center);

            this.Dispatch(signals.sidePick);
        }
    }, {
        key: "Complete",
        value: function Complete() {
            _SurfaceUtils2.default.BakeObject(this.obj);
            this.obj.position.set(0, 0, 0);
            this.obj.rotation.set(0, 0, 0);
            this.obj.scale.set(1, 1, 1);
            _get(ConfigureSpaceStep.prototype.__proto__ || Object.getPrototypeOf(ConfigureSpaceStep.prototype), "Complete", this).call(this, this.data);
        }
    }, {
        key: "Dispose",
        value: function Dispose() {
            _get(ConfigureSpaceStep.prototype.__proto__ || Object.getPrototypeOf(ConfigureSpaceStep.prototype), "Dispose", this).call(this);
            this.modal.Remove();
        }
    }]);

    return ConfigureSpaceStep;
}(_WizardStep3.default);

exports.default = ConfigureSpaceStep;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(55);

var radToDeg = 180.0 / Math.PI;
var vertexHash,
    pendingRecursive = 0;
var result;

var SurfaceUtils = function () {
    function SurfaceUtils() {
        _classCallCheck(this, SurfaceUtils);
    }

    _createClass(SurfaceUtils, null, [{
        key: 'MergeObject',


        /**
         * 
         * @param {THREE.Object3D} object 
         * @returns {THREE.BufferGeometry}
         */
        value: function MergeObject(object) {
            var geometries = [];

            object.updateMatrixWorld(true);
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var bg = child.geometry;
                    bg.applyMatrix(child.matrixWorld);
                    if (bg.isBufferGeometry === false) bg = new THREE.BufferGeometry().fromGeometry(bg);
                    geometries.push(bg);
                }
            });

            if (geometries.length === 1) return geometries[0];

            return SurfaceUtils.MergeBufferGeometries(geometries);
        }

        /**
         * 
         * @param {THREE.Object3D} object 
         */

    }, {
        key: 'BakeObject',
        value: function BakeObject(object) {
            object.updateMatrixWorld(true);
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var bg = child.geometry;
                    bg.applyMatrix(child.matrixWorld);
                }
            });
        }

        /**
         * 
         * @param {Array<THREE.BufferGeometry>} geometries 
         * @returns {THREE.BufferGeometry}
         */

    }, {
        key: 'MergeBufferGeometries',
        value: function MergeBufferGeometries(geometries) {
            var bg = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
            return bg;
        }
    }, {
        key: 'CreateVertexHash',
        value: function CreateVertexHash(geometry) {
            var vertexHash = [];
            var faces = geometry.faces;
            var vLen = geometry.vertices.length;
            for (var i = 0; i < vLen; i++) {
                vertexHash[i] = [];
                for (var f in faces) {
                    if (faces[f].a == i || faces[f].b == i || faces[f].c == i) {
                        vertexHash[i].push(faces[f]);
                    }
                }
            }
            return vertexHash;
        }
    }, {
        key: 'GetCoplanar',
        value: function GetCoplanar(maxAngle, geometry, face, clamp, out, originFace) {
            // Original by (https://stackoverflow.com/users/3311552/radio): http://jsfiddle.net/ta0g3mLc/10/

            if (clamp === undefined) clamp = true;
            if (originFace === undefined) originFace = face;

            result = out;
            if (out === undefined) result = { count: 0 };

            if (vertexHash === undefined) {
                if (geometry instanceof Array) vertexHash = geometry;else vertexHash = SurfaceUtils.CreateVertexHash(geometry);
            }

            pendingRecursive++;

            var vertices = ['a', 'b', 'c'];
            for (var v in vertices) {

                var vertexIndex = face[vertices[v]];
                var adjacentFaces = vertexHash[vertexIndex];

                for (var a in adjacentFaces) {
                    var newface = adjacentFaces[a];
                    var testFace = originFace;
                    if (clamp == false) testFace = face;

                    if (testFace.normal.angleTo(newface.normal) * radToDeg <= maxAngle) {
                        var key = newface.a + ',' + newface.b + ',' + newface.c;
                        if (result[key] === undefined) {
                            result[key] = newface;
                            result.count++;
                            SurfaceUtils.GetCoplanar(maxAngle, geometry, newface, clamp, result, originFace);
                        }
                    }
                }
            }

            pendingRecursive--;

            if (pendingRecursive === 0) {
                // reset
                vertexHash = undefined;
                pendingRecursive = 0;

                // output
                delete result.count;
                return result;
            }
        }
    }, {
        key: 'FromVertices',
        value: function FromVertices(vertices) {
            var geometry = new THREE.Geometry();
            geometry.vertices = vertices;

            for (var f = 0, numFaces = vertices.length / 3; f < numFaces; f++) {
                var v = f * 3;
                geometry.faces.push(new THREE.Face3(v, v + 1, v + 2));
            }

            geometry.mergeVertices();
            geometry.computeFaceNormals();
            geometry.computeBoundingSphere();
            return geometry;
        }

        /**
         * 
         * @param {THREE.Geometry} geometry 
         * @param {THREE.Vector3} [normal]
         */

    }, {
        key: 'Normal',
        value: function Normal(geometry, normal) {
            normal = normal || new THREE.Vector3();
            for (var f in geometry.faces) {
                var n = geometry.faces[f].normal;
                normal.add(n);
            }
            normal.normalize();
            return normal;
        }
    }, {
        key: 'Add',
        value: function Add(vertices, vector) {
            var numVertices = vertices.length;
            for (var v = 0; v < numVertices; v++) {
                vertices[v].add(vector);
            }

            return vertices;
        }
    }, {
        key: 'Clone',
        value: function Clone(source) {
            if (source instanceof Array) {
                var length = source.length;
                if (length === 0) return [];
                if (source[0] instanceof THREE.Vector3) {
                    var _result = [];
                    for (var v = 0; v < length; v++) {
                        _result[v] = source[v].clone();
                    }
                    return _result;
                }
            }
        }
    }]);

    return SurfaceUtils;
}();

exports.default = SurfaceUtils;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DirectedRect = function () {

    /**
     * 
     * @param {THREE.Vector3} center 
     * @param {THREE.Vector2} extent 
     * @param {THREE.Vector3} normal
     * @param {Boolean} invert
     */
    function DirectedRect(center, extent, normal, invert) {
        _classCallCheck(this, DirectedRect);

        this.center = center;
        this.extent = extent;
        this.normal = normal;
        this.invert = invert;

        /**
         * @type {THREE.Vector3}
         */
        this.direction;
    }

    _createClass(DirectedRect, [{
        key: "Scale",
        value: function Scale(width, length, height) {
            length = length || width;
            height = height || width;

            this.center.x *= width;
            this.center.y *= height;
            this.center.z *= length;

            this.extent.x *= width;
            this.extent.y *= length;
        }
    }, {
        key: "width",
        get: function get() {
            return this.extent.x;
        },
        set: function set(value) {
            this.extent.x = value;
        }
    }, {
        key: "length",
        get: function get() {
            return this.extent.y;
        },
        set: function set(value) {
            this.extent.y = value;
        }
    }], [{
        key: "FromPoints",
        value: function FromPoints(points) {
            var box = new THREE.Box3().setFromPoints(points);
            var y = (box.min.y + box.max.y) * .5;
            box.min.y = box.max.y = y;

            var center = new THREE.Vector3();
            box.getCenter(center);
            var size = new THREE.Vector3();
            box.getSize(size);

            var width,
                length,
                invert = false;
            if (size.x < size.z) {
                width = size.x;
                length = size.z;
            } else {
                width = size.z;
                length = size.x;
                invert = true;
            }
            var extent = new THREE.Vector2(width, length);
            var normal = new THREE.Vector3().crossVectors(new THREE.Vector3(width, 0, 0), new THREE.Vector3(0, 0, -length)).normalize();

            var dRect = new DirectedRect(center, extent, normal, invert);
            return dRect;
        }
    }, {
        key: "AxisDirection",
        value: function AxisDirection(direction) {
            var x = Math.abs(direction.x);
            var y = Math.abs(direction.y);
            var z = Math.abs(direction.z);
            if (x > y && x > z) {
                return new THREE.Vector3(Math.sign(direction.x), 0, 0);
            } else if (y > x && y > z) {
                return new THREE.Vector3(0, Math.sign(direction.y), 0);
            }

            return new THREE.Vector3(0, 0, Math.sign(direction.z));
        }
    }]);

    return DirectedRect;
}();

exports.default = DirectedRect;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = '';

var Feedback = function () {
    function Feedback() {
        _classCallCheck(this, Feedback);
    }

    _createClass(Feedback, null, [{
        key: 'Clear',
        value: function Clear() {
            log = '';
        }
    }, {
        key: 'AddLine',
        value: function AddLine(line, isList) {
            var prepend = isList ? ' - ' : '';
            log += prepend + line + '\n';
        }
    }, {
        key: 'Notify',
        value: function Notify(message) {
            if (message === undefined) {
                message = log;
                log = '';
            }

            if (InfoBar) InfoBar.Add(message);

            alert(message);
        }
    }, {
        key: 'Prompt',
        value: function Prompt(message, defaultValue) {
            var result = prompt(message, defaultValue ? defaultValue : '');
            return new Promise(function (resolve, reject) {
                if (result == null || result == '') {
                    reject();
                } else {
                    resolve(result);
                }
            });
        }
    }, {
        key: 'Confirm',
        value: function Confirm(message) {
            return new Promise(function (resolve, reject) {
                if (confirm(message)) {
                    resolve();
                } else {
                    reject();
                }
            });
        }
    }, {
        key: 'Reload',
        value: function Reload() {
            location.reload(false);
        }
    }]);

    return Feedback;
}();

exports.default = Feedback;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Element2 = __webpack_require__(39);

var _Element3 = _interopRequireDefault(_Element2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buttonStyle = "\
    background-color: #aaa;\
    border: none;\
    color: black;\
    padding: 4px;\
    margin: 4px;\
    text-decoration: none;\
    display: inline-block;\
";

/**
 * @typedef {HTMLDivElement} WizardActionElement
 */

var WizardAction = function (_Element) {
    _inherits(WizardAction, _Element);

    /**
     * @param {WizardActionElement} ref 
     */
    function WizardAction(ref) {
        _classCallCheck(this, WizardAction);

        var _this = _possibleConstructorReturn(this, (WizardAction.__proto__ || Object.getPrototypeOf(WizardAction)).call(this));

        var label = ref.attributes['label'];
        label = label ? label.value : '';
        var status = ref.attributes['status'];
        status = status ? status.value : false;
        var disabled = ref.attributes['disabled'];
        disabled = disabled ? disabled.value : false;

        /**
         * @type {HTMLInputElement}
         */
        _this.checkbox = crel('input', { type: 'checkbox' });
        _this.checkbox.disabled = true;
        _this.checkbox.checked = status;

        /**
         * @type {HTMLButtonElement}
         */
        _this.button = crel('button', undefined, label);

        /**
         * @type {HTMLElement}
         */
        _this.domElement = ref;
        _this.domElement.appendChild(_this.checkbox);
        _this.domElement.appendChild(_this.button);

        _this.disabled = disabled;
        console.log(_this);
        return _this;
    }

    _createClass(WizardAction, [{
        key: "status",
        get: function get() {
            return this.checkbox.checked;
        },
        set: function set(value) {
            this.checkbox.checked = Boolean(value);
        }
    }, {
        key: "disabled",
        get: function get() {
            return this.domElement.disabled;
        },
        set: function set(value) {
            this.domElement.disabled = Boolean(value);
            this.button.disabled = this.domElement.disabled;
        }
    }]);

    return WizardAction;
}(_Element3.default);

exports.default = WizardAction;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _WizardStep2 = __webpack_require__(15);

var _WizardStep3 = _interopRequireDefault(_WizardStep2);

var _IO = __webpack_require__(38);

var _IO2 = _interopRequireDefault(_IO);

var _Draggable = __webpack_require__(31);

var _Draggable2 = _interopRequireDefault(_Draggable);

var _Dom = __webpack_require__(16);

var _Dom2 = _interopRequireDefault(_Dom);

var _ContainersEditorWizard = __webpack_require__(30);

var _ContainersEditorWizard2 = _interopRequireDefault(_ContainersEditorWizard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExportStep = function (_WizardStep) {
    _inherits(ExportStep, _WizardStep);

    function ExportStep() {
        _classCallCheck(this, ExportStep);

        return _possibleConstructorReturn(this, (ExportStep.__proto__ || Object.getPrototypeOf(ExportStep)).call(this, 'export'));
    }

    _createClass(ExportStep, [{
        key: "Start",
        value: function Start(dataPass) {
            _get(ExportStep.prototype.__proto__ || Object.getPrototypeOf(ExportStep.prototype), "Start", this).call(this);

            Object.assign(this.data, dataPass);

            var scope = this;

            var elements = document.getElementById('wizard-elements');
            var element = elements.querySelector('#export');

            var exportBtn = element.querySelector('#exportBtn');
            exportBtn.onclick = function () {
                scope.Export();
            };

            this.modal = new _Draggable2.default(_ContainersEditorWizard2.default.title, _Draggable2.default.widths.medium);
            this.modal.Add(element);
            _Dom2.default.instance.Add(this.modal);
        }
    }, {
        key: "toJSON",
        value: function toJSON() {
            var view = this.data.ref;
            var container = this.data.container;
            console.log('exporting', view, container);
            return {
                view: view,
                container: container
            };
        }
    }, {
        key: "Export",
        value: function Export() {

            var decimals = 3;
            _IO2.default.SaveUTF(JSON.stringify(this, function (key, value) {
                // limit precision of floats
                if (typeof value === 'number') {
                    return parseFloat(value.toFixed(decimals));
                }
                return value;
            }), 'PackingSpace-config.json');
            this.Complete();
        }
    }, {
        key: "Dispose",
        value: function Dispose() {
            _get(ExportStep.prototype.__proto__ || Object.getPrototypeOf(ExportStep.prototype), "Dispose", this).call(this);
            this.modal.Remove();
        }
    }]);

    return ExportStep;
}(_WizardStep3.default);

exports.default = ExportStep;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _WizardStep3 = __webpack_require__(15);

var _WizardStep4 = _interopRequireDefault(_WizardStep3);

var _Wizard = __webpack_require__(54);

var _Wizard2 = _interopRequireDefault(_Wizard);

var _Dom = __webpack_require__(16);

var _Dom2 = _interopRequireDefault(_Dom);

var _Draggable = __webpack_require__(31);

var _Draggable2 = _interopRequireDefault(_Draggable);

var _Element = __webpack_require__(39);

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NameEntryStep = function (_WizardStep) {
    _inherits(NameEntryStep, _WizardStep);

    function NameEntryStep() {
        _classCallCheck(this, NameEntryStep);

        var input = FPEditor.instance.sceneSetup.input;
        return _possibleConstructorReturn(this, (NameEntryStep.__proto__ || Object.getPrototypeOf(NameEntryStep)).call(this, 'nameEntry', {
            input: input
        }));
    }

    _createClass(NameEntryStep, [{
        key: "Start",
        value: function Start() {
            _get(NameEntryStep.prototype.__proto__ || Object.getPrototypeOf(NameEntryStep.prototype), "Start", this).call(this);

            console.log('nameEntry.Start, this = ', this);

            var scope = this;
            var enterKeyHandler = this.data.input.keyboard.on('enter', function () {
                scope.Complete();
            });

            this.data.keyListeners = [enterKeyHandler];
        }
    }, {
        key: "Dispose",
        value: function Dispose() {
            var _this2 = this;

            _get(NameEntryStep.prototype.__proto__ || Object.getPrototypeOf(NameEntryStep.prototype), "Dispose", this).call(this);
            this.data.keyListeners.forEach(function (listener) {
                _this2.data.input.keyboard.unregister(listener);
            });
            delete this.data.keyListeners;
        }
    }, {
        key: "Complete",
        value: function Complete() {
            _get(NameEntryStep.prototype.__proto__ || Object.getPrototypeOf(NameEntryStep.prototype), "Complete", this).call(this);
            console.log('Enter key pressed.');
        }
    }]);

    return NameEntryStep;
}(_WizardStep4.default);

var SomethingStep = function (_WizardStep2) {
    _inherits(SomethingStep, _WizardStep2);

    function SomethingStep() {
        _classCallCheck(this, SomethingStep);

        var input = FPEditor.instance.sceneSetup.input;
        return _possibleConstructorReturn(this, (SomethingStep.__proto__ || Object.getPrototypeOf(SomethingStep)).call(this, 'something', {
            input: input
        }));
    }

    _createClass(SomethingStep, [{
        key: "Start",
        value: function Start() {
            _get(SomethingStep.prototype.__proto__ || Object.getPrototypeOf(SomethingStep.prototype), "Start", this).call(this);

            console.log('something.Start, this = ', this);

            var scope = this;
            this.data.spaceKeyHandler = this.data.input.keyboard.on('space', function () {
                scope.Complete();
            });
        }
    }, {
        key: "Dispose",
        value: function Dispose() {
            _get(SomethingStep.prototype.__proto__ || Object.getPrototypeOf(SomethingStep.prototype), "Dispose", this).call(this);
            this.data.input.keyboard.unregister(this.data.spaceKeyHandler);
        }
    }, {
        key: "Complete",
        value: function Complete() {
            _get(SomethingStep.prototype.__proto__ || Object.getPrototypeOf(SomethingStep.prototype), "Complete", this).call(this);
            console.log('Space key pressed.');
        }
    }]);

    return SomethingStep;
}(_WizardStep4.default);

var WizardTest = function WizardTest() {
    _classCallCheck(this, WizardTest);

    var elements = document.getElementById('wizard-elements');

    var nameEntry = new NameEntryStep();
    var something = new SomethingStep();

    nameEntry.On(_WizardStep4.default.signals.start, function () {
        console.log('nameEntry started, signal callback');
        var modal = new _Draggable2.default('Name entry', _Draggable2.default.widths.medium);
        modal.Add(elements.querySelector('#nameEntry'));
        _Dom2.default.instance.Add(modal);
    });

    nameEntry.On(_WizardStep4.default.signals.complete, function () {
        console.log('nameEntry completed, signal callback');
        something.data.nameEntry = 'enter key';
    });

    something.On(_WizardStep4.default.signals.start, function () {
        console.log('something started, signal callback');
    });

    something.On(_WizardStep4.default.signals.complete, function () {
        console.log('something completed, signal callback');
    });

    var steps = [nameEntry, something];
    var wizard = new _Wizard2.default(steps);

    wizard.On(_Wizard2.default.signals.change, function (step) {
        console.log('wizard changed to ' + step.key + ', signal callback');
    });

    wizard.On(_Wizard2.default.signals.complete, function (step) {
        console.log('wizard completed with ' + step.key + ', signal callback');
    });

    wizard.Start();
};

exports.default = WizardTest;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IO = undefined;

var _IO = __webpack_require__(38);

var _IO2 = _interopRequireDefault(_IO);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.IO = _IO2.default;

/***/ })
/******/ ]);
//# sourceMappingURL=FPEditor.js.map