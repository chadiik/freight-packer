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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tracing = 0,
    standard = 1,
    warning = 2;

var messages = [];

var Message = function () {
    function Message(type) {
        _classCallCheck(this, Message);

        this.type = type;
        var content = [];

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        args.forEach(function (arg) {
            if (typeof arg === 'string') {
                content.push(arg);
            } else {
                try {
                    var json = JSON.parse(JSON.stringify(arg));
                    content.push(json);
                } catch (err) {
                    content.push(err);
                }
            }
        });
    }

    _createClass(Message, [{
        key: 'ToString',
        value: function ToString() {}
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

                var message = new (Function.prototype.bind.apply(Message, [null].concat([tracing], args)))();
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

                var message = new (Function.prototype.bind.apply(Message, [null].concat([standard], args)))();
                this.AddLog(message);
                if (this._toConsole) {
                    var _console2;

                    (_console2 = console).groupCollapsed.apply(_console2, args);
                    console.trace('stack');
                    console.groupEnd();
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

                var message = new (Function.prototype.bind.apply(Message, [null].concat([warning], args)))();
                this.AddLog(message);
                if (this._toConsole) (_console3 = console).warn.apply(_console3, args);
            }
        }
    }, {
        key: 'Print',
        value: function Print(filter) {
            if (filter === undefined) {
                filter = {};
                filter[tracing] = filter[standard] = filter[warning] = true;
            }

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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CargoEntry = function () {
    function CargoEntry() {
        _classCallCheck(this, CargoEntry);

        this.type = 'CargoEntry';

        this.active = false;
        this.properties = {};
        this.descriptions = [];
    }

    _createClass(CargoEntry, [{
        key: 'Clone',
        value: function Clone(entry) {
            if (entry === undefined) entry = new CargoEntry();
            entry.active = this.active;
            entry.properties = {};
            entry.descriptions = [];
            return entry;
        }
    }, {
        key: 'ToString',
        value: function ToString() {}
    }]);

    return CargoEntry;
}();

/* harmony default export */ __webpack_exports__["a"] = (CargoEntry);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var trimVariableRegex = new RegExp(/(?:\d|_|-)+$/);
var twopi = 2 * Math.PI;

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
    }]);

    return Utils;
}();

/* harmony default export */ __webpack_exports__["a"] = (Utils);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoList__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PackingSpace__ = __webpack_require__(21);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Packer = function Packer() {
    _classCallCheck(this, Packer);

    this.packingSpace = new __WEBPACK_IMPORTED_MODULE_1__PackingSpace__["a" /* default */]();
    this.cargoList = new __WEBPACK_IMPORTED_MODULE_0__CargoList__["a" /* default */]();
};

/* harmony default export */ __webpack_exports__["a"] = (Packer);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Cargo__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_common_CargoEntry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_cik_Logger__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var cargoAdded = 'cargoAdded',
    cargoRemoved = 'cargoRemoved';

var signals = {
    cargoAdded: cargoAdded,
    cargoRemoved: cargoRemoved
};

var CargoList = function (_Signaler) {
    _inherits(CargoList, _Signaler);

    function CargoList() {
        _classCallCheck(this, CargoList);

        var _this = _possibleConstructorReturn(this, (CargoList.__proto__ || Object.getPrototypeOf(CargoList)).call(this));

        _this.cargoes = [];
        return _this;
    }

    _createClass(CargoList, [{
        key: "Add",
        value: function Add(entry) {
            var cargo;
            if (entry instanceof __WEBPACK_IMPORTED_MODULE_2__components_common_CargoEntry__["a" /* default */]) {
                cargo = __WEBPACK_IMPORTED_MODULE_0__Cargo__["a" /* default */].FromEntry(entry);
            } else {
                cargo = entry;
                __WEBPACK_IMPORTED_MODULE_3__utils_cik_Logger__["a" /* default */].Log(entry, 'used as Cargo');
            }

            this.cargoes.push(cargo);
            this.Dispatch(cargoAdded, cargo);
        }
    }, {
        key: "Remove",
        value: function Remove(cargo) {
            var index = this.cargoes.indexOf(cargo);
            if (index != -1) {
                var removedCargoes = this.cargoes.splice(index, 1);
                this.Dispatch(cargoRemoved, removedCargoes[0]);
            }
        }
    }], [{
        key: "signals",
        get: function get() {
            return signals;
        }
    }]);

    return CargoList;
}(__WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (CargoList);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_common_CargoEntry__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Cargo = function () {
    /**
     * 
     * @param {CargoEntry} entry
     */
    function Cargo(entry) {
        _classCallCheck(this, Cargo);

        this.entry = entry;
    }

    _createClass(Cargo, [{
        key: 'ToString',
        value: function ToString() {
            var output = 'Cargo(' + this.entry.ToString() + ')';

            return output;
        }
    }], [{
        key: 'FromEntry',
        value: function FromEntry(entry) {
            return new Cargo(entry);
        }
    }]);

    return Cargo;
}();

/* harmony default export */ __webpack_exports__["a"] = (Cargo);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Signaler);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dimensions = function () {
    function Dimensions(width, length, height) {
        _classCallCheck(this, Dimensions);

        this.Set(width, length, height);
        this._vec3 = new THREE.Vector3();
    }

    _createClass(Dimensions, [{
        key: 'Set',
        value: function Set(width, length, height) {
            this.width = width;
            this.length = length;
            this.height = height;
        }

        /**
         * Returns a THREE.Vector3 representation of the dimensions
         * Beware of ordering: y=height, z=length and x=width
         */

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
        key: 'vec3',
        get: function get() {
            return this._vec3.set(this.width, this.height, this.length);
        }
    }]);

    return Dimensions;
}();

/* harmony default export */ __webpack_exports__["a"] = (Dimensions);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FreightPacker__ = __webpack_require__(11);

global.FreightPacker = __WEBPACK_IMPORTED_MODULE_0__FreightPacker__["a" /* default */];
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(10)))

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_Capabilities__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_App__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_components_CargoInput__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_utils_cik_Utils__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







var defaultOptions = {
	debug: false
};

var FreightPacker = function () {
	/**
  * Constructor
  * @param {HTMLElement} containerDiv
  * @param {Object} options
  */
	function FreightPacker(containerDiv, options) {
		_classCallCheck(this, FreightPacker);

		this.options = __WEBPACK_IMPORTED_MODULE_4__api_utils_cik_Utils__["a" /* default */].AssignUndefined(options, defaultOptions);
		FreightPacker.DevSetup(this.options);

		/**
   * Handles input of: description fields (label, etc.), dimensions and constraints
   * @type {CargoInput}
   */
		this.cargoInput = new __WEBPACK_IMPORTED_MODULE_2__api_components_CargoInput__["a" /* default */]();

		this.app = new __WEBPACK_IMPORTED_MODULE_1__api_App__["a" /* default */](containerDiv, {
			boxInput: this.cargoInput
		});
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
		value: function DevSetup(options) {
			if (options.debug) {
				__WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__["a" /* default */].active = true;
				__WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__["a" /* default */].toConsole = true;
				__WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__["a" /* default */].traceToConsole = true;
			}
		}
	}]);

	return FreightPacker;
}();

/* harmony default export */ __webpack_exports__["a"] = (FreightPacker);

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_SceneSetup__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_Packer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__view_View__ = __webpack_require__(25);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






var App = function () {
    function App(containerDiv, components) {
        _classCallCheck(this, App);

        this.components = components;

        this.packer = new __WEBPACK_IMPORTED_MODULE_2__packer_Packer__["a" /* default */]();

        this.sceneSetup = new __WEBPACK_IMPORTED_MODULE_0__scene_SceneSetup__["a" /* default */](containerDiv);
        this.sceneSetup.Init().then(this.Start.bind(this));
    }

    _createClass(App, [{
        key: 'Start',
        value: function Start() {
            var packer = this.packer;
            this.view = new __WEBPACK_IMPORTED_MODULE_3__view_View__["a" /* default */](packer, this.sceneSetup);
            this.sceneSetup.Start();

            this.components.boxInput.On('completed', function (boxEntry) {
                __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__["a" /* default */].Trace('insert box');
                packer.cargoList.Add(boxEntry.Clone());
            });
        }
    }]);

    return App;
}();

/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_input_Input__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Controller__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Renderer__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Camera__ = __webpack_require__(20);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







var SceneSetup = function () {
    function SceneSetup(containerDiv) {
        _classCallCheck(this, SceneSetup);

        this.domElement = containerDiv;
    }

    _createClass(SceneSetup, [{
        key: 'Init',
        value: function Init() {

            var quality = new __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__["a" /* default */]().Common(2);

            var units = 1;
            var controllerParams = { units: units };
            this.sceneController = new __WEBPACK_IMPORTED_MODULE_2__Controller__["a" /* default */](controllerParams);

            var cameraParams = { fov: 65, aspect: 1, near: 0.01 * units, far: 1000 * units, id: 'app' };
            this.cameraController = new __WEBPACK_IMPORTED_MODULE_4__Camera__["a" /* default */](cameraParams);
            this.cameraController.OrbitControls(this.domElement);

            var rendererParams = { clearColor: 0xafafaf, renderSizeMul: 1 };
            Object.assign(rendererParams, quality);
            this.sceneRenderer = new __WEBPACK_IMPORTED_MODULE_3__Renderer__["a" /* default */](rendererParams);
            this.domElement.appendChild(this.sceneRenderer.renderer.domElement);
            this.sceneRenderer.UseCamera(this.cameraController.camera);

            this.input = new __WEBPACK_IMPORTED_MODULE_0__utils_cik_input_Input__["a" /* default */](this.domElement);
            this.input.camera = this.cameraController.camera;
            this.input.onResize.push(this.sceneRenderer.ReconfigureViewport.bind(this.sceneRenderer));

            // Comeplete setup
            var setupParams = {
                fillLights: true,
                gridHelper: true

                // Initial camera move
            };this.cameraController.position.x = 100 * units;
            this.cameraController.position.y = 40 * units;
            this.cameraController.position.z = -100 * units;
            this.cameraController.SetTarget(new THREE.Vector3());

            // Fill lights
            if (setupParams.fillLights) {
                this.DefaultLights(this.sceneController);
            }

            // Env
            if (setupParams.gridHelper) {
                var gridHelper = new THREE.GridHelper(200 * units, 20);
                this.sceneController.AddDefault(gridHelper);
            }

            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
    }, {
        key: 'Start',
        value: function Start() {
            if (this.Update === undefined) {
                var scope = this;
                this.Update = function (timestamp) {
                    scope.animationFrameID = requestAnimationFrame(scope.Update);

                    scope.input.Update();
                    scope.cameraController.Update();
                    scope.sceneRenderer.Render(scope.sceneController.scene);
                };
            }

            this.Update();
        }
    }, {
        key: 'Pause',
        value: function Pause() {
            if (this.animationFrameID) {
                cancelAnimationFrame(this.animationFrameID);
            }
        }
    }, {
        key: 'Stop',
        value: function Stop() {
            if (this.animationFrameID) {
                cancelAnimationFrame(this.animationFrameID);
            }
            this.input.Dispose();
            this.sceneRenderer.Dispose();
        }
    }, {
        key: 'DefaultLights',
        value: function DefaultLights() {

            var units = this.sceneController.params.units;

            var ambient = new THREE.AmbientLight(0x404040);

            var directionalLight = new THREE.DirectionalLight(0xfeeedd);
            directionalLight.position.set(7 * units, 15 * units, 30 * units);

            this.sceneController.ambientContainer.add(ambient);
            this.sceneController.ambientContainer.add(directionalLight);
        }
    }]);

    return SceneSetup;
}();

/* harmony default export */ __webpack_exports__["a"] = (SceneSetup);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RaycastGroup__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Input = function () {
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
        this.screen = {};
        this.ComputeScreen();

        this.raycaster = new THREE.Raycaster();

        this.clock = new THREE.Clock();
        this.clock.start();

        this._raycastGroups = { Update: {}, Update25: {}, Update10: {}, OnMouseDown: {}, OnDoubleClick: {}, OnMouseUp: {}, OnRightClick: {}, OnClick: {} };
        this.update = [{ interval: 1 / 25, last: 0, callback: this.Update25.bind(this) }, { interval: 1 / 10, last: 0, callback: this.Update10.bind(this) }];

        this.fireOnce = [];

        this.onMouseDown = [];
        this.onMouseUp = [];
        this.onRightClick = [];
        this.onDoubleClick = [];
        this.onClick = [];

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

        this.keyboard = new window.keypress.Listener();
        this.keyboard.on = this.keyboard.simple_combo;
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
                keys = this.defaultKeysListen;
            } else {
                /*this.defaultKeysListen.forEach(key => {
                    if(keys.indexOf(key) === -1) keys.push(key);
                });*/
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

            var rectOffset = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].GetRectOffset(this.domContainer);
            this.screen.x += rectOffset.x;
            this.screen.left += rectOffset.x;
            this.screen.y += rectOffset.y;
            this.screen.top += rectOffset.y;
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
            for (var iUpdate = 0; iUpdate < this.update.length; iUpdate++) {
                var update = this.update[iUpdate];
                if (update.callback === undefined) {
                    update();
                } else if (now - update.last > update.interval) {
                    update.callback();
                    update.last = now;
                }
            }
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
                raycastGroupsKeys.sort().reverse();
                for (var iGroup = 0; iGroup < numRaycastGroups; iGroup++) {
                    var key = raycastGroupsKeys[iGroup];
                    this._raycastGroups[event][key].Raycast(this.raycaster);
                }
            }
        }
    }], [{
        key: 'defaultKeysListen',
        get: function get() {
            if (Input._defaultKeysListen === undefined) {
                Input._defaultKeysListen = 'abcdefghijklmnopqrtsuvwxyz'.split('').concat(['ctlr', 'shift', 'alt']);
            }
            return Input._defaultKeysListen;
        }
    }]);

    return Input;
}();

/* harmony default export */ __webpack_exports__["a"] = (Input);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RaycastGroup = function () {
    function RaycastGroup(items, callback, collectionQuery, updateProperty, recursive, continuous) {
        _classCallCheck(this, RaycastGroup);

        this.enabled = true;

        this.items = items;
        this.callback = callback;
        this.updateProperty = updateProperty !== undefined ? updateProperty : false;
        this.recursive = recursive !== undefined ? recursive : false;
        this.continuous = continuous !== undefined ? continuous : false;

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
        key: 'Raycast',
        value: function Raycast(raycaster) {
            if (this.enabled === false) return;

            var raycastItems;
            if (this.updateProperty) {
                raycastItems = [];
                for (var i = 0; i < this.raycastItems.length; i++) {
                    raycastItems[i] = this.collectionQuery(this.items[i]);
                }
            } else {
                raycastItems = this.raycastItems;
            }
            // if ( object.visible === false || object.parent === null) return; in THREE.Raycaster.intersectObject()
            var intersects = raycaster.intersectObjects(raycastItems, this.recursive);
            if (intersects.length > 0) {
                var raycastItemIndex = this.BubbleUpForIndex(intersects[0].object, raycastItems);
                if (raycastItemIndex !== -1) this.callback(this.items[raycastItemIndex], intersects[0]);
            } else if (this.continuous) {
                this.callback(false);
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

/* unused harmony default export */ var _unused_webpack_default_export = (RaycastGroup);

/***/ }),
/* 17 */
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
/* 18 */
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
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
    function Renderer(params) {
        _classCallCheck(this, Renderer);

        this.params = params;
        this.renderer = new THREE.WebGLRenderer({ antialias: this.params.antialias });

        if (this.params.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMap.autoUpdate = false;
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

        this.UseCamera = function (camera) {
            this.camera = camera;
        };

        this.ResizeRenderer = function (screen) {
            var newWidth = screen.width * this.params.renderSizeMul;
            var newHeight = screen.height * this.params.renderSizeMul;
            this.renderer.setSize(newWidth, newHeight);
        };

        this.Render = function (scene) {
            this.renderer.render(scene, this.camera);
        };

        this.UpdateShadowMaps = function () {
            this.renderer.shadowMap.needsUpdate = true;
        };

        this.ResizeDomElement = function (screen) {
            this.renderer.domElement.style.width = screen.width + 'px';
            this.renderer.domElement.style.height = screen.height + 'px';
        };

        this.ReconfigureViewport = function (screen) {
            this.camera.aspect = screen.width / screen.height;
            this.camera.updateProjectionMatrix();

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
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Camera = function () {
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
                this.orbitControls.target = lookTarget;

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
    }]);

    return Camera;
}();

/* harmony default export */ __webpack_exports__["a"] = (Camera);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__container_Container__ = __webpack_require__(22);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var PackingSpace = function PackingSpace() {
    _classCallCheck(this, PackingSpace);

    this.container = new __WEBPACK_IMPORTED_MODULE_0__container_Container__["a" /* default */]();
};

/* harmony default export */ __webpack_exports__["a"] = (PackingSpace);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ContainingVolume__ = __webpack_require__(23);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Container = function Container() {
    _classCallCheck(this, Container);

    /**
     * Containing volumes array
     * @type ContainingVolume
     */
    this.volumes = [];
};

/* harmony default export */ __webpack_exports__["a"] = (Container);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Volume__ = __webpack_require__(24);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var ContainingVolume = function (_Volume) {
    _inherits(ContainingVolume, _Volume);

    function ContainingVolume() {
        _classCallCheck(this, ContainingVolume);

        return _possibleConstructorReturn(this, (ContainingVolume.__proto__ || Object.getPrototypeOf(ContainingVolume)).call(this));
    }

    return ContainingVolume;
}(__WEBPACK_IMPORTED_MODULE_0__Volume__["a" /* default */]);

/* unused harmony default export */ var _unused_webpack_default_export = (ContainingVolume);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__ = __webpack_require__(7);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Volume = function Volume() {
    _classCallCheck(this, Volume);

    this.position = new THREE.Vector3();
    this.dimensions = new __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__["a" /* default */]();
};

/* harmony default export */ __webpack_exports__["a"] = (Volume);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoListView__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__packer_Packer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_CargoList__ = __webpack_require__(4);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var View = function () {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {SceneSetup} sceneSetup 
     */
    function View(packer, sceneSetup) {
        _classCallCheck(this, View);

        this.sceneSetup = sceneSetup;

        this.cargoList = new __WEBPACK_IMPORTED_MODULE_0__CargoListView__["a" /* default */]();
        this.Display(this.cargoList);

        var onCargoAdded = this.cargoList.Add.bind(this.cargoList);
        packer.cargoList.On(__WEBPACK_IMPORTED_MODULE_2__packer_CargoList__["a" /* default */].signals.cargoAdded, onCargoAdded);
        var onCargoRemoved = this.cargoList.Remove.bind(this.cargoList);
        packer.cargoList.On(__WEBPACK_IMPORTED_MODULE_2__packer_CargoList__["a" /* default */].signals.cargoRemoved, onCargoRemoved);
    }

    _createClass(View, [{
        key: "Display",
        value: function Display(object) {
            var sceneController = this.sceneSetup.sceneController;
            if (object instanceof __WEBPACK_IMPORTED_MODULE_0__CargoListView__["a" /* default */]) {
                sceneController.AddDefault(object.view);
            }
        }
    }]);

    return View;
}();

/* harmony default export */ __webpack_exports__["a"] = (View);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__packer_Cargo__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var CargoListView = function () {
    function CargoListView() {
        _classCallCheck(this, CargoListView);

        this.view = new THREE.Object3D();
    }

    /**
     * 
     * @param {Cargo} cargo 
     */


    _createClass(CargoListView, [{
        key: "Add",
        value: function Add(cargo) {
            __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__["a" /* default */].Trace('Adding cargo: ' + cargo.ToString() + ' to view', cargo);
        }

        /**
         * 
         * @param {Cargo} cargo 
         */

    }, {
        key: "Remove",
        value: function Remove(cargo) {}
    }]);

    return CargoListView;
}();

/* harmony default export */ __webpack_exports__["a"] = (CargoListView);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__ = __webpack_require__(28);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var updated = 'updated',
    aborted = 'aborted',
    completed = 'completed';

var CargoInput = function (_Signaler) {
    _inherits(CargoInput, _Signaler);

    function CargoInput() {
        _classCallCheck(this, CargoInput);

        var _this = _possibleConstructorReturn(this, (CargoInput.__proto__ || Object.getPrototypeOf(CargoInput)).call(this));

        _this.entry = new __WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__["a" /* default */]();
        return _this;
    }

    _createClass(CargoInput, [{
        key: 'Update',
        value: function Update(width, length, height) {
            this.entry.dimensions.Set(width, length, height);
            __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Trace('entry updated', this.entry);
            this.entry.active = true;
            this.Dispatch(updated, this.entry);
        }
    }, {
        key: 'Abort',
        value: function Abort() {
            this.entry.active = false;
            this.entry.Reset();
            __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__["a" /* default */].Trace('entry deleted');
            this.Dispatch(aborted);
        }
    }, {
        key: 'Complete',
        value: function Complete() {
            if (this.entry.active) {
                this.Dispatch(completed, this.entry);
                this.entry.Reset();
            }
            return this.entry;
        }
    }, {
        key: 'currentEntry',
        get: function get() {
            return this.entry;
        }
    }]);

    return CargoInput;
}(__WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (CargoInput);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PackingProperty__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Dimensions__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_TextField__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_CargoEntry__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var BoxEntry = function (_CargoEntry) {
    _inherits(BoxEntry, _CargoEntry);

    function BoxEntry() {
        _classCallCheck(this, BoxEntry);

        var _this = _possibleConstructorReturn(this, (BoxEntry.__proto__ || Object.getPrototypeOf(BoxEntry)).call(this));

        _this.type = 'BoxEntry';

        _this.dimensions = new __WEBPACK_IMPORTED_MODULE_1__Dimensions__["a" /* default */](0, 0, 0);

        _this.properties.stacking = new __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["b" /* SupportsStacking */]();
        _this.properties.rotation = new __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["a" /* RotationConstraint */]();
        _this.properties.translation = new __WEBPACK_IMPORTED_MODULE_0__PackingProperty__["c" /* TranslationConstraint */]();

        _this.descriptions.push(new __WEBPACK_IMPORTED_MODULE_2__common_TextField__["a" /* default */]('label', __WEBPACK_IMPORTED_MODULE_2__common_TextField__["a" /* default */].defaultContent));
        return _this;
    }

    _createClass(BoxEntry, [{
        key: "Reset",
        value: function Reset() {
            this.active = false;
            this.properties.stacking.Reset();
            this.properties.rotation.Reset();
            this.properties.translation.Reset();
            this.descriptions.length = 1;
            this.descriptions[0].content = __WEBPACK_IMPORTED_MODULE_2__common_TextField__["a" /* default */].defaultContent;
        }
    }, {
        key: "Clone",
        value: function Clone() {
            var entry = _get(BoxEntry.prototype.__proto__ || Object.getPrototypeOf(BoxEntry.prototype), "Clone", this).call(this, new BoxEntry());

            entry.dimensions = this.dimensions.Clone();

            entry.properties.statcking = this.properties.stacking.Clone();
            entry.properties.rotation = this.properties.rotation.Clone();
            entry.properties.translation = this.properties.translation.Clone();

            for (var i = 0; i < this.descriptions.length; i++) {
                entry.descriptions.push(this.descriptions[i].Clone());
            }

            return entry;
        }
    }, {
        key: "ToString",
        value: function ToString() {
            return '\'' + this.descriptions[0].content + '\': ' + this.dimensions.ToString();
        }
    }]);

    return BoxEntry;
}(__WEBPACK_IMPORTED_MODULE_3__common_CargoEntry__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (BoxEntry);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SupportsStacking; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RotationConstraint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TranslationConstraint; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PackingProperty = function () {
    function PackingProperty() {
        _classCallCheck(this, PackingProperty);

        this.enabled = false;
    }

    _createClass(PackingProperty, [{
        key: "Reset",
        value: function Reset() {
            this.enabled = false;
        }
    }, {
        key: "Clone",
        value: function Clone() {
            var property = new PackingProperty();
            property.enabled = this.enabled;
            return property;
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

    return SupportsStacking;
}(PackingProperty);

var Constraint = function (_PackingProperty2) {
    _inherits(Constraint, _PackingProperty2);

    function Constraint() {
        _classCallCheck(this, Constraint);

        return _possibleConstructorReturn(this, (Constraint.__proto__ || Object.getPrototypeOf(Constraint)).call(this));
    }

    return Constraint;
}(PackingProperty);

var RotationConstraint = function (_Constraint) {
    _inherits(RotationConstraint, _Constraint);

    function RotationConstraint() {
        _classCallCheck(this, RotationConstraint);

        return _possibleConstructorReturn(this, (RotationConstraint.__proto__ || Object.getPrototypeOf(RotationConstraint)).call(this));
    }

    return RotationConstraint;
}(Constraint);

var TranslationConstraint = function (_Constraint2) {
    _inherits(TranslationConstraint, _Constraint2);

    function TranslationConstraint() {
        _classCallCheck(this, TranslationConstraint);

        return _possibleConstructorReturn(this, (TranslationConstraint.__proto__ || Object.getPrototypeOf(TranslationConstraint)).call(this));
    }

    return TranslationConstraint;
}(Constraint);



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextField = function () {
    function TextField(label, content) {
        _classCallCheck(this, TextField);

        this.label = label;
        this.content = content;
    }

    _createClass(TextField, [{
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

/***/ })
/******/ ]);
//# sourceMappingURL=FreightPacker.js.map