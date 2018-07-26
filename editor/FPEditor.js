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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(1);

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

        params = __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].AssignUndefined(params, defaultGUIParams);

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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Utils);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_Signaler__ = __webpack_require__(15);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
}(__WEBPACK_IMPORTED_MODULE_0__api_utils_cik_Signaler__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (WizardStep);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Dom);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_Wizard__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__LoadRefStep__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ConfigureSpaceStep__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ExportStep__ = __webpack_require__(43);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var title = 'Containers wizard...';

var ContainersEditorWizard = function (_Wizard) {
    _inherits(ContainersEditorWizard, _Wizard);

    function ContainersEditorWizard() {
        _classCallCheck(this, ContainersEditorWizard);

        var loadRef = new __WEBPACK_IMPORTED_MODULE_1__LoadRefStep__["a" /* default */]();
        var configureSpace = new __WEBPACK_IMPORTED_MODULE_2__ConfigureSpaceStep__["a" /* default */]();
        var exporter = new __WEBPACK_IMPORTED_MODULE_3__ExportStep__["a" /* default */]();

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
}(__WEBPACK_IMPORTED_MODULE_0__wizard_Wizard__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ContainersEditorWizard);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Element__ = __webpack_require__(7);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
}(__WEBPACK_IMPORTED_MODULE_0__Element__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (Draggable);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

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

/* harmony default export */ __webpack_exports__["a"] = (IO);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Element);

/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__ = __webpack_require__(1);
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

    this.params = __WEBPACK_IMPORTED_MODULE_0__utils_cik_Utils__["a" /* default */].AssignUndefined(params, defaultParams);
};

/* harmony default export */ __webpack_exports__["a"] = (UX);

/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



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
        key: "Multiple",
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

    key = key.split('.');
    var folder = isFolderGrouped ? key.slice(0, key.length - 1).join('.') : undefined;
    while (key.length > 1) {
        obj = obj[key.shift()];
    }return {
        id: (folder ? folder + '.' : '') + key[0],
        folder: folder,
        owner: obj,
        key: key[0]
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
    }return obj[key.shift()] = val;
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

var debug = new Map();

var Config = function () {
    function Config(target) {
        _classCallCheck(this, Config);

        if (!Config.debug) Config.debug = debug;
        debug.set(target, this);

        this.target = target;
        this.keys = [];
    }

    _createClass(Config, [{
        key: "Track",
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
        key: "Snapshot",
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
        key: "Save",
        value: function Save() {
            if (this.Update) {
                this.Update();
                this.data = this.Snapshot();
            }
        }
    }, {
        key: "Edit",
        value: function Edit(guiChanged, label, gui, params) {
            var _this = this;

            params = __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].AssignUndefined(params, defaultEditParams);

            var controllers = [];
            var target = this.target;
            if (gui === undefined) {

                gui = new (window.dat || __webpack_require__(0).default).GUI({
                    autoPlace: true
                });
            } else if (label) {
                gui = gui.addFolder(label);
            }

            if (this.editing === undefined) {
                this.editing = {};

                this.Update = function () {
                    __webpack_require__(13);

                    gui.updateAll();
                    guiChanged();
                };

                gui.add(this, 'Update');
            }

            this.keys.forEach(function (key) {
                var isController = key instanceof Controller;
                var keyInfo = createKeyInfo(target, isController ? key.property : key);
                if (_this.editing[keyInfo.id] !== true) {
                    var folder = gui;
                    if (keyInfo.folder) {
                        __webpack_require__(13);

                        if (gui.find) folder = gui.find(keyInfo.folder);else console.warn('gui extensions not found!');

                        if (!folder) folder = gui.addFolder(keyInfo.folder);
                    }
                    var addFunction = keyInfo.owner[keyInfo.key].isColor ? folder.addColor : folder.add;
                    controllers.push((isController && key.min !== undefined ? addFunction.call(folder, keyInfo.owner, keyInfo.key, key.min, key.max, key.step) : addFunction.call(folder, keyInfo.owner, keyInfo.key)).onChange(key.onChange === undefined ? guiChanged : function () {
                        key.onChange.call(keyInfo.owner);
                        guiChanged();
                    }));
                    _this.editing[keyInfo.id] = true;
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

            this.gui = gui;
        }
    }, {
        key: "toJSON",
        value: function toJSON() {
            if (this.data === undefined) console.warn(this.target, 'is being saved with undefined data.');
            return this.data;
        }
    }], [{
        key: "Unroll",
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
    }, {
        key: "Load",
        value: function Load(target, data) {
            var keys = Object.keys(data);
            keys.forEach(function (key) {
                setKey(target, key, data[key]);
            });
        }
    }]);

    return Config;
}();

Config.Controller = Controller;

/* harmony default export */ __webpack_exports__["default"] = (Config);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UIUtils__ = __webpack_require__(11);


__WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].CreateCSS(['.tooltip .tooltiptext {', '    visibility: hidden;', '    position: absolute;', '    width: 120px;', '    background-color: #111;', '    color: #fff;', '    text-align: center;', '    padding: 2px 0;', '    border-radius: 2px;', '    z-index: 1;', '    opacity: 0;', '    transition: opacity .6s;', '}', '.tooltip-top {', '    bottom: 125%;', '    left: 50%;', '    margin-left: -60px;', '}', '.tooltip:hover .tooltiptext {', '    visibility: visible;', '    opacity: 1;', '}']);

var styles = {
    datDisabled: 'color: #606060 !important; cursor: not-allowed !important;'
};

Object.defineProperty((window.dat || __webpack_require__(0).default).GUI.prototype, 'onGUIEvent', {
    get: function get() {
        if (!this._onGUIEvent) this._onGUIEvent = [];
        return this._onGUIEvent;
    }
});

// update all

(window.dat || __webpack_require__(0).default).GUI.prototype.updateAll = function () {
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

(window.dat || __webpack_require__(0).default).GUI.prototype.find = function (object, property) {
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
Object.defineProperty((window.dat || __webpack_require__(0).default).GUI.prototype, 'opening', {
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

Object.defineProperty((window.dat || __webpack_require__(0).default).controllers.Controller.prototype, "disabled", {
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

(window.dat || __webpack_require__(0).default).GUI.prototype.enable = function (object, property, value) {
    var controller = this.find(object, property);
    controller.disabled = !value;
};

// Tooltip

Object.defineProperty((window.dat || __webpack_require__(0).default).controllers.Controller.prototype, "tooltip", {
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

(window.dat || __webpack_require__(0).default).GUI.prototype.setTooltip = function (object, property, value) {
    var controller = this.find(object, property);
    controller.tooltip = value;
};

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_Signaler__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WizardStep__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
                step.On(__WEBPACK_IMPORTED_MODULE_1__WizardStep__["a" /* default */].signals.complete, next);
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
}(__WEBPACK_IMPORTED_MODULE_0__api_utils_cik_Signaler__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (Wizard);

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

/* harmony default export */ __webpack_exports__["a"] = (SurfaceUtils);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Volume__ = __webpack_require__(39);
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

    /**
     * @param {string} [uid] - You'll rarely need to provide this
     */


    _createClass(ContainingVolume, [{
        key: 'SetUID',
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_view_SceneSetup__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editors_containersEditor_ContainersEditor__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editors_wizard_WizardTest__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_Dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_UX__ = __webpack_require__(10);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

        var ux = new __WEBPACK_IMPORTED_MODULE_4__api_UX__["a" /* default */](params.ux);

        this.sceneSetup = new __WEBPACK_IMPORTED_MODULE_0__api_view_SceneSetup__["a" /* default */](viewElement, ux);
        this.sceneSetup.Init().then(this.Start.bind(this));

        this.dom = new __WEBPACK_IMPORTED_MODULE_3__ui_Dom__["a" /* default */]();
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
            this.activeEditor = new __WEBPACK_IMPORTED_MODULE_1__editors_containersEditor_ContainersEditor__["a" /* default */](this.gui);
        }
    }, {
        key: "Start",
        value: function Start() {
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
            return __webpack_require__(45);
        }
    }]);

    return Editor;
}();

global.FPEditor = Editor;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(20)))

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_input_Input__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_Controller__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scene_Renderer__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scene_Camera__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HUDView__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__UX__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }










var SceneSetup = function () {
    /**
     * 
     * @param {HTMLDivElement} containerDiv 
     * @param {UX} ux 
     */
    function SceneSetup(containerDiv, ux) {
        _classCallCheck(this, SceneSetup);

        this.domElement = containerDiv;
        this.ux = ux;
    }

    _createClass(SceneSetup, [{
        key: 'Init',
        value: function Init() {

            var quality = new __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__["a" /* default */]().Common(2);

            var units = this.ux.params.units;
            var controllerParams = {};
            this.sceneController = new __WEBPACK_IMPORTED_MODULE_2__scene_Controller__["a" /* default */](controllerParams);

            var rendererParams = { clearColor: 0xafafaf, renderSizeMul: 1 };
            Object.assign(rendererParams, quality);
            this.sceneRenderer = new __WEBPACK_IMPORTED_MODULE_3__scene_Renderer__["a" /* default */](rendererParams);
            this.domElement.appendChild(this.sceneRenderer.renderer.domElement);

            /** @type {import('./Camera').CameraParams} */
            var cameraParams = { fov: 30, aspect: 1, near: 0.1 * units, far: 10000 * units };
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
                var hudCameraParams = __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["a" /* default */].AssignUndefined({ fov: 15 }, cameraParams);
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
                fillLights: true,
                gridHelper: true

                // Initial camera move
            };this.cameraController.position.x = 100 * units;
            this.cameraController.position.y = 40 * units;
            this.cameraController.position.z = 100 * units;
            this.cameraController.SetTarget(new THREE.Vector3());

            // Fill lights
            if (setupParams.fillLights) {
                this.DefaultLights(this.sceneController);
                if (this.ux.params.hud) {
                    this.DefaultLights(this.hud);
                }
            }

            // Env
            if (setupParams.gridHelper) {
                var gridHelper = new THREE.GridHelper(200 * units, 20);
                this.sceneController.AddDefault(gridHelper);
            }

            if (this.ux.params.configure) {
                this.Configure();
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
        value: function DefaultLights(controller) {

            var units = this.ux.params.units;

            var ambient = new THREE.AmbientLight(0x404040);

            var directionalLight = new THREE.DirectionalLight(0xfeeedd);
            directionalLight.position.set(7 * units, 15 * units, 30 * units);

            controller.ambientContainer.add(ambient);
            controller.ambientContainer.add(directionalLight);
        }
    }, {
        key: 'Configure',
        value: function Configure() {

            var Smart = __webpack_require__(28).default;
            var Config = __webpack_require__(12).default;
            var Control3D = __webpack_require__(29).default;

            var scope = this;

            var appControl3D = Control3D.Configure('app', this.cameraController.camera, this.sceneRenderer.renderer.domElement);
            this.sceneController.AddDefault(appControl3D.control);

            if (this.ux.params.hud) {
                var hudControl3D = Control3D.Configure('hud', this.hud.cameraController.camera, this.sceneRenderer.renderer.domElement);
                this.hud.AddDefault(hudControl3D.control);

                var hud = this.hud;
                var onGUIChanged = function onGUIChanged() {
                    console.log('Camera changed');
                };

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
                        console.log('position', __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["a" /* default */].VecToString(hud.cameraController.position, 1));
                        console.log('rotation', __WEBPACK_IMPORTED_MODULE_7__utils_cik_Utils__["a" /* default */].VecToString(hud.cameraController.rotation, 3));
                        console.groupEnd();
                    }
                };

                control.toggleOrbitOwner();

                var smart = new Smart(this, 'HUDView');
                var rotationProperties = Config.Unroll('#hudCam.rotation', 'x', 'y', 'z');
                var rotationControllers = Config.Controller.Multiple(rotationProperties, 0, 2 * Math.PI, 2 * Math.PI / 360);
                smart.Config.apply(smart, [null, control, onGUIChanged, 'toggleOrbitOwner', 'print', 'hudCam.camera.fov'].concat(_toConsumableArray(Config.Unroll('#hudCam.position', 'x', 'y', 'z')), _toConsumableArray(rotationControllers)));

                this.input.keyboard.on('s', function () {
                    smart.Show();
                });

                console.log('HUDView config', smart.config.gui.list || smart);
            }
        }
    }]);

    return SceneSetup;
}();

/* harmony default export */ __webpack_exports__["a"] = (SceneSetup);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UpdateComponent__ = __webpack_require__(23);
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
/* 23 */
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
/* 24 */
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
/* 25 */
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
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_Controller__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scene_Camera__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_Transform__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_cik_Utils__ = __webpack_require__(1);
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

                _this.params = __WEBPACK_IMPORTED_MODULE_3__utils_cik_Utils__["a" /* default */].AssignUndefined(params, defaultParams);

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
/* 27 */
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
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UIUtils__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Config__ = __webpack_require__(12);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



//import dat from "./datGUIConsole";


var current = undefined,
    onFocus = [],
    onFocusLost = [];

var Smart = function () {
    function Smart(target, label) {
        _classCallCheck(this, Smart);

        this.target = target;
        this.label = label;

        var scope = this;

        this.gui = new (window.dat || __webpack_require__(0).default).GUI({ autoPlace: false });
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
            this.draggable.Show();
            __WEBPACK_IMPORTED_MODULE_0__UIUtils__["b" /* Element */].AddStyle(this.draggable.domElement, __WEBPACK_IMPORTED_MODULE_0__UIUtils__["c" /* styles */].UIWiggleAnim);
            Smart.SetCurrent(this);

            this.UpdateGUI();
        }
    }, {
        key: "Config",
        value: function Config(folderName, target, guiChanged) {
            var _config;

            this.config = new __WEBPACK_IMPORTED_MODULE_1__Config__["default"](target);

            for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                args[_key - 3] = arguments[_key];
            }

            (_config = this.config).Track.apply(_config, args);
            this.config.Edit(guiChanged, folderName, this.gui, { save: false });
            return this.config.gui;
        }
    }], [{
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
    }]);

    return Smart;
}();

/* harmony default export */ __webpack_exports__["default"] = (Smart);

/***/ }),
/* 29 */
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
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ActiveEditor__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_ContainersEditorWizard__ = __webpack_require__(4);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

            var wizard = new __WEBPACK_IMPORTED_MODULE_1__wizard_ContainersEditorWizard__["a" /* default */]();
            wizard.Globals({
                view: view
            });
            wizard.Start();
        }
    }]);

    return ContainersEditor;
}(__WEBPACK_IMPORTED_MODULE_0__ActiveEditor__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ContainersEditor);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (ActiveEditor);

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_WizardStep__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_IO__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_Dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_SurfaceUtils__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ContainersEditorWizard__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_OptimizedMultiMat__ = __webpack_require__(33);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

            this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__["a" /* default */](__WEBPACK_IMPORTED_MODULE_5__ContainersEditorWizard__["a" /* default */].title, __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__["a" /* default */].widths.medium);
            this.modal.Add(element);
            __WEBPACK_IMPORTED_MODULE_3__ui_Dom__["a" /* default */].instance.Add(this.modal);
        }
    }, {
        key: "Import3DModel",
        value: function Import3DModel() {
            var scope = this;
            __WEBPACK_IMPORTED_MODULE_1__utils_IO__["a" /* default */].GetFile(function (file) {
                var obj = new THREE.FBXLoader().parse(file);
                scope.SetRefModel(obj);
            }, true);
        }
    }, {
        key: "SetRefModel",
        value: function SetRefModel(obj) {
            console.log(obj);

            var optimizedRefObject = new __WEBPACK_IMPORTED_MODULE_6__utils_OptimizedMultiMat__["a" /* default */](obj);
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
}(__WEBPACK_IMPORTED_MODULE_0__wizard_WizardStep__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (LoadRefStep);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

/* harmony default export */ __webpack_exports__["a"] = (OptimizedMultiMat);

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_input_RaycastGroup__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_WizardStep__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_DirectedRect__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ui_Dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__api_packer_container_Container__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__api_packer_container_ContainingVolume__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ui_elements_WizardAction__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ContainersEditorWizard__ = __webpack_require__(4);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
    dimensionsInput: 'dimensionsInput',
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

        var volume = new __WEBPACK_IMPORTED_MODULE_8__api_packer_container_ContainingVolume__["a" /* default */]();
        var container = new __WEBPACK_IMPORTED_MODULE_7__api_packer_container_Container__["a" /* default */]();
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

            var sideAction = new __WEBPACK_IMPORTED_MODULE_9__ui_elements_WizardAction__["a" /* default */](element.querySelector('#side'));
            sideAction.button.onclick = function () {
                scope.PickLoadingSide();
            };

            var inputAction = new __WEBPACK_IMPORTED_MODULE_9__ui_elements_WizardAction__["a" /* default */](element.querySelector('#input'));
            inputAction.button.onclick = function () {
                scope.InputDimensions();
            };

            var surfaceAction = new __WEBPACK_IMPORTED_MODULE_9__ui_elements_WizardAction__["a" /* default */](element.querySelector('#surface'));
            surfaceAction.button.onclick = function () {
                scope.PickSurface();
            };

            var nextBtn = element.querySelector('#nextBtn');
            nextBtn.onclick = function () {
                scope.Complete();
            };

            this.modal = new __WEBPACK_IMPORTED_MODULE_4__ui_elements_Draggable__["a" /* default */](__WEBPACK_IMPORTED_MODULE_10__ContainersEditorWizard__["a" /* default */].title, __WEBPACK_IMPORTED_MODULE_4__ui_elements_Draggable__["a" /* default */].widths.medium);
            this.modal.Add(element);
            __WEBPACK_IMPORTED_MODULE_5__ui_Dom__["a" /* default */].instance.Add(this.modal);

            this.On(signals.surfacePick, function () {
                surfaceAction.status = true;
                inputAction.disabled = false;
            });

            this.On(signals.dimensionsInput, function () {
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
                this.raycastGroup = new __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_input_RaycastGroup__["a" /* default */]([this.obj], //items
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
            var coplanar = __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].GetCoplanar(2, geometry, intersection.face, true);

            var gVertices = geometry.vertices;
            var vertices = [];
            for (var f in coplanar) {
                var face = coplanar[f];
                vertices.push(gVertices[face.a], gVertices[face.b], gVertices[face.c]);
            }

            var platform = __WEBPACK_IMPORTED_MODULE_3__utils_DirectedRect__["a" /* default */].FromPoints(vertices);
            if (this.ValidatePlatform(platform) === false) {
                this.pickSurfaceMode = true;
                return;
            }

            this.platform = platform;
            var volume = this.data.container.volume;
            volume.position.copy(this.platform.center);

            vertices = __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].Clone(vertices);
            var surfaceGeometry = __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].FromVertices(vertices);
            var normal = __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].Normal(surfaceGeometry);
            __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].Add(vertices, normal.clone().multiplyScalar(.1));
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
                scope.PlatformDimensions();
            }, 200);

            this.On(signals.surfacePick, function () {
                scope.selectedSurface.visible = false;
            });
        }
    }, {
        key: "PlatformDimensions",
        value: function PlatformDimensions() {

            var scope = this;

            var platform = this.platform;
            var platformDimensions = this.platformDimensions = { width: platform.width, length: platform.length };

            var obj = this.obj;
            var onChange = function onChange() {
                var sw = platformDimensions.width / platform.width;
                var sl = platformDimensions.length / platform.length;
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

            __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__["a" /* default */].Prompt('Platform width', platformDimensions.width).then(function (width) {
                platformDimensions.width = Number.parseFloat(width);
                return __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__["a" /* default */].Prompt('Platform length', platformDimensions.length);
            }).then(function (length) {
                platformDimensions.length = Number.parseFloat(length);
                onChange();
                scope.Dispatch(signals.surfacePick);
            });
        }
    }, {
        key: "InputDimensions",
        value: function InputDimensions() {

            var scope = this;

            var dimensions = this.data.container.volume.dimensions;
            if (dimensions.volume < 1) {
                var platform = this.platform;
                dimensions.Set(platform.width, platform.length, platform.width);
            }
            var onChange = function onChange() {
                scope.DisplayVolume();
            };

            __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__["a" /* default */].Prompt('Volume width', dimensions.width).then(function (width) {
                dimensions.width = Number.parseFloat(width);
                onChange();
                return __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__["a" /* default */].Prompt('Volume length', dimensions.length);
            }).then(function (length) {
                dimensions.length = Number.parseFloat(length);
                onChange();
                return __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__["a" /* default */].Prompt('Volume height', dimensions.height);
            }).then(function (height) {
                dimensions.height = Number.parseFloat(height);
                onChange();
                scope.Dispatch(signals.dimensionsInput);
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
                this.raycastGroupSide = new __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_input_RaycastGroup__["a" /* default */]([this.displayVolume], //items
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
            platform.direction = __WEBPACK_IMPORTED_MODULE_3__utils_DirectedRect__["a" /* default */].AxisDirection(direction);

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
            __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].BakeObject(this.obj);
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
}(__WEBPACK_IMPORTED_MODULE_1__wizard_WizardStep__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ConfigureSpaceStep);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (RaycastGroup);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (DirectedRect);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Feedback);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ContainingVolume__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__ = __webpack_require__(41);
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
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__ = __webpack_require__(40);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var type = 'Volume';

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
    }

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
/* 40 */
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
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(1);
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
            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].AssignUndefined(filter, defaultPrintFilter);

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
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Element__ = __webpack_require__(7);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
}(__WEBPACK_IMPORTED_MODULE_0__Element__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (WizardAction);

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_WizardStep__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_IO__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_Dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ContainersEditorWizard__ = __webpack_require__(4);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

            this.modal = new __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__["a" /* default */](__WEBPACK_IMPORTED_MODULE_4__ContainersEditorWizard__["a" /* default */].title, __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__["a" /* default */].widths.medium);
            this.modal.Add(element);
            __WEBPACK_IMPORTED_MODULE_3__ui_Dom__["a" /* default */].instance.Add(this.modal);
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
            __WEBPACK_IMPORTED_MODULE_1__utils_IO__["a" /* default */].SaveUTF(JSON.stringify(this, function (key, value) {
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
}(__WEBPACK_IMPORTED_MODULE_0__wizard_WizardStep__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ExportStep);

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WizardStep__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Wizard__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_Dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ui_Element__ = __webpack_require__(7);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
}(__WEBPACK_IMPORTED_MODULE_0__WizardStep__["a" /* default */]);

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
}(__WEBPACK_IMPORTED_MODULE_0__WizardStep__["a" /* default */]);

var WizardTest = function WizardTest() {
    _classCallCheck(this, WizardTest);

    var elements = document.getElementById('wizard-elements');

    var nameEntry = new NameEntryStep();
    var something = new SomethingStep();

    nameEntry.On(__WEBPACK_IMPORTED_MODULE_0__WizardStep__["a" /* default */].signals.start, function () {
        console.log('nameEntry started, signal callback');
        var modal = new __WEBPACK_IMPORTED_MODULE_3__ui_elements_Draggable__["a" /* default */]('Name entry', __WEBPACK_IMPORTED_MODULE_3__ui_elements_Draggable__["a" /* default */].widths.medium);
        modal.Add(elements.querySelector('#nameEntry'));
        __WEBPACK_IMPORTED_MODULE_2__ui_Dom__["a" /* default */].instance.Add(modal);
    });

    nameEntry.On(__WEBPACK_IMPORTED_MODULE_0__WizardStep__["a" /* default */].signals.complete, function () {
        console.log('nameEntry completed, signal callback');
        something.data.nameEntry = 'enter key';
    });

    something.On(__WEBPACK_IMPORTED_MODULE_0__WizardStep__["a" /* default */].signals.start, function () {
        console.log('something started, signal callback');
    });

    something.On(__WEBPACK_IMPORTED_MODULE_0__WizardStep__["a" /* default */].signals.complete, function () {
        console.log('something completed, signal callback');
    });

    var steps = [nameEntry, something];
    var wizard = new __WEBPACK_IMPORTED_MODULE_1__Wizard__["a" /* default */](steps);

    wizard.On(__WEBPACK_IMPORTED_MODULE_1__Wizard__["a" /* default */].signals.change, function (step) {
        console.log('wizard changed to ' + step.key + ', signal callback');
    });

    wizard.On(__WEBPACK_IMPORTED_MODULE_1__Wizard__["a" /* default */].signals.complete, function (step) {
        console.log('wizard completed with ' + step.key + ', signal callback');
    });

    wizard.Start();
};

/* unused harmony default export */ var _unused_webpack_default_export = (WizardTest);

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_IO__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "IO", function() { return __WEBPACK_IMPORTED_MODULE_0__utils_IO__["a"]; });




/***/ })
/******/ ]);
//# sourceMappingURL=FPEditor.js.map