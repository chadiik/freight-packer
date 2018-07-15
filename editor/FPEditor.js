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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_Signaler__ = __webpack_require__(3);
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
/* 2 */
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
        this.element = crel('div', { id: 'UIDom', class: 'UIOrigin UIExpand' });
    }

    /**
     * 
     * @param {HTMLElement} element 
     */


    _createClass(Dom, [{
        key: 'Add',
        value: function Add(element) {
            this.element.appendChild(element.domElement);
        }
    }], [{
        key: 'instance',
        get: function get() {
            return instance;
        }
    }]);

    return Dom;
}();

/* harmony default export */ __webpack_exports__["a"] = (Dom);

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_Wizard__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__LoadRefStep__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ConfigureSpaceStep__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ExportStep__ = __webpack_require__(47);
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_input_Input__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Quality__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Controller__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Renderer__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Camera__ = __webpack_require__(30);
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
/* 10 */
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
/* 11 */
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
    }]);

    return Utils;
}();

/* harmony default export */ __webpack_exports__["a"] = (Utils);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoList__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__PackingSpace__ = __webpack_require__(31);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Packer = function Packer() {
    _classCallCheck(this, Packer);

    this.packingSpace = new __WEBPACK_IMPORTED_MODULE_1__PackingSpace__["a" /* default */]();
    this.cargoList = new __WEBPACK_IMPORTED_MODULE_0__CargoList__["a" /* default */]();
};

/* harmony default export */ __webpack_exports__["a"] = (Packer);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Cargo__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_common_CargoEntry__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_cik_Logger__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var signals = {
    cargoAdded: 'cargoAdded',
    cargoRemoved: 'cargoRemoved'
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
            this.Dispatch(signals.cargoAdded, cargo);
        }
    }, {
        key: "Remove",
        value: function Remove(cargo) {
            var index = this.cargoes.indexOf(cargo);
            if (index != -1) {
                var removedCargoes = this.cargoes.splice(index, 1);
                this.Dispatch(signals.cargoRemoved, removedCargoes[0]);
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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_common_CargoEntry__ = __webpack_require__(6);
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ContainingVolume__ = __webpack_require__(16);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Container = function () {
    function Container() {
        _classCallCheck(this, Container);

        /**
         * Containing volumes array
         * @type {Array<ContainingVolume>}
         */
        this.volumes = [];
    }

    _createClass(Container, [{
        key: "toJSON",
        value: function toJSON() {
            return {
                type: 'Container',
                volumes: this.volumes
            };
        }
    }, {
        key: "volume",
        get: function get() {
            var index = this.volumes.length - 1;
            return this.volumes[index];
        }
    }]);

    return Container;
}();

/* harmony default export */ __webpack_exports__["a"] = (Container);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Volume__ = __webpack_require__(32);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var ContainingVolume = function (_Volume) {
    _inherits(ContainingVolume, _Volume);

    function ContainingVolume() {
        _classCallCheck(this, ContainingVolume);

        return _possibleConstructorReturn(this, (ContainingVolume.__proto__ || Object.getPrototypeOf(ContainingVolume)).call(this));
    }

    _createClass(ContainingVolume, [{
        key: "toJSON",
        value: function toJSON() {
            var json = _get(ContainingVolume.prototype.__proto__ || Object.getPrototypeOf(ContainingVolume.prototype), "toJSON", this).call(this);
            json.type = 'ContainingVolume';
            return json;
        }
    }]);

    return ContainingVolume;
}(__WEBPACK_IMPORTED_MODULE_0__Volume__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (ContainingVolume);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dimensions = function () {
    function Dimensions(width, length, height) {
        _classCallCheck(this, Dimensions);

        if (width === undefined) width = 0;
        if (length === undefined) length = 0;
        if (height === undefined) height = 0;

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
        key: 'toJSON',
        value: function toJSON() {
            return {
                type: 'Dimensions',
                width: this.width,
                length: this.length,
                height: this.height
            };
        }
    }, {
        key: 'vec3',
        get: function get() {
            return this._vec3.set(this.width, this.height, this.length);
        }
    }, {
        key: 'volume',
        get: function get() {
            return this.width * this.height * this.length;
        }
    }]);

    return Dimensions;
}();

/* harmony default export */ __webpack_exports__["a"] = (Dimensions);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_Signaler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WizardStep__ = __webpack_require__(1);
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
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// require FileSaver.js

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
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
        download(filename, text);
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
                    callback(file);
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
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(22);
module.exports = __webpack_require__(39);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FreightPacker__ = __webpack_require__(23);

global.FreightPacker = __WEBPACK_IMPORTED_MODULE_0__FreightPacker__["a" /* default */];
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_Capabilities__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_App__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_components_CargoInput__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_utils_cik_Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_utils_cik_Utils__ = __webpack_require__(11);
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
/* 24 */
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
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_SceneSetup__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_Packer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__view_View__ = __webpack_require__(33);
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
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RaycastGroup__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils__ = __webpack_require__(11);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




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
                if (numRaycastGroups > 1) raycastGroupsKeys.sort().reverse();

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
/* 27 */
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
/* 28 */
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
/* 29 */
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
            this.renderer.domElement.style.width = Math.floor(screen.width) + 'px';
            this.renderer.domElement.style.height = Math.floor(screen.height) + 'px';
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
/* 30 */
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
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__container_Container__ = __webpack_require__(15);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var PackingSpace = function () {
    function PackingSpace() {
        _classCallCheck(this, PackingSpace);

        this._current = -1;
        this.containers = [];
    }

    _createClass(PackingSpace, [{
        key: "current",
        get: function get() {
            if (this._current != -1) {
                return this.containers[this._current];
            }
        }
    }]);

    return PackingSpace;
}();

/* harmony default export */ __webpack_exports__["a"] = (PackingSpace);

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_box_Dimensions__ = __webpack_require__(17);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



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
        key: "toJSON",
        value: function toJSON() {
            return {
                type: 'Volume',
                position: this.position,
                dimensions: this.dimensions
            };
        }
    }]);

    return Volume;
}();

/* harmony default export */ __webpack_exports__["a"] = (Volume);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CargoListView__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__packer_Packer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__packer_CargoList__ = __webpack_require__(13);
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

        this.cargoListView = new __WEBPACK_IMPORTED_MODULE_0__CargoListView__["a" /* default */]();
        this.Display(this.cargoListView);

        var onCargoAdded = this.cargoListView.Add.bind(this.cargoListView);
        packer.cargoList.On(__WEBPACK_IMPORTED_MODULE_2__packer_CargoList__["a" /* default */].signals.cargoAdded, onCargoAdded);
        var onCargoRemoved = this.cargoListView.Remove.bind(this.cargoListView);
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
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__packer_Cargo__ = __webpack_require__(14);
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
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_cik_Logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_cik_Signaler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__ = __webpack_require__(36);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var updated = 'updated',
    aborted = 'aborted',
    completed = 'completed';

/**
 * Cubic volumes entry
 */

var CargoInput = function (_Signaler) {
    _inherits(CargoInput, _Signaler);

    function CargoInput() {
        _classCallCheck(this, CargoInput);

        var _this = _possibleConstructorReturn(this, (CargoInput.__proto__ || Object.getPrototypeOf(CargoInput)).call(this));

        _this.entry = new __WEBPACK_IMPORTED_MODULE_2__box_BoxEntry__["a" /* default */]();
        return _this;
    }

    /**
     * Starts a new entry 'session', or, updates the current entry
     * @param {Object} params 
     */


    _createClass(CargoInput, [{
        key: 'Update',
        value: function Update(params) {
            this.entry.dimensions.Set(params.width, params.length, params.height);
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
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PackingProperty__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Dimensions__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_TextField__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_CargoEntry__ = __webpack_require__(6);
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
/* 37 */
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
/* 38 */
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

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_scene_SceneSetup__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editors_containersEditor_ContainersEditor__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editors_wizard_WizardTest__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_Dom__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






/**
 * @type {Editor}
 */
var instance;

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

        this.sceneSetup = new __WEBPACK_IMPORTED_MODULE_0__api_scene_SceneSetup__["a" /* default */](viewElement);
        this.sceneSetup.Init().then(this.Start.bind(this));

        this.dom = new __WEBPACK_IMPORTED_MODULE_3__ui_Dom__["a" /* default */]();
        viewElement.appendChild(this.dom.element);
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
    }]);

    return Editor;
}();

global.FPEditor = Editor;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ActiveEditor__ = __webpack_require__(41);
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
/* 41 */
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
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_WizardStep__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_IO__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_Dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_SurfaceUtils__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ContainersEditorWizard__ = __webpack_require__(4);
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
            var refGeometry = __WEBPACK_IMPORTED_MODULE_4__utils_SurfaceUtils__["a" /* default */].MergeObject(obj);
            refGeometry = new THREE.Geometry().fromBufferGeometry(refGeometry);
            refGeometry.mergeVertices();
            refGeometry.computeFaceNormals();
            this.vertexHash = __WEBPACK_IMPORTED_MODULE_4__utils_SurfaceUtils__["a" /* default */].CreateVertexHash(refGeometry);

            if (this.obj === undefined) {
                this.obj = new THREE.Mesh(refGeometry, new THREE.MeshStandardMaterial({ color: 0x999999 }));
                this.data.view.add(this.obj);
                this.data.ref = this.obj;
            } else {
                this.obj.geometry = refGeometry;
            }

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
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_utils_cik_input_RaycastGroup__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wizard_WizardStep__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_DirectedRect__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ui_Dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Feedback__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__api_packer_container_Container__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__api_packer_container_ContainingVolume__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ui_elements_WizardAction__ = __webpack_require__(46);
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
        container.volumes.push(volume);
        _this.data.container = container;

        return _this;
    }

    _createClass(ConfigureSpaceStep, [{
        key: "Start",
        value: function Start(dataPass) {
            _get(ConfigureSpaceStep.prototype.__proto__ || Object.getPrototypeOf(ConfigureSpaceStep.prototype), "Start", this).call(this);

            /**
             * @type {THREE.Object3D}
             */
            this.obj = dataPass.ref;

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
            var coplanar = __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].GetCoplanar(2, intersection.object.geometry, intersection.face, true);

            var gVertices = this.obj.geometry.vertices;
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

            this.data.platform = platform;
            var volume = this.data.container.volume;
            volume.position.copy(this.data.platform.center);

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

            var platform = this.data.platform;
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
                var platform = this.data.platform;
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
            var platform = this.data.platform;

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

            var scope = this;

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

            var platform = this.data.platform;
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
            this.obj.geometry = this.data.geometry = __WEBPACK_IMPORTED_MODULE_2__utils_SurfaceUtils__["a" /* default */].MergeObject(this.obj);
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
/* 44 */
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
/* 45 */
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
/* 46 */
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

var docHandler = document.registerElement('wizard-action', {
    prototype: Object.assign(Object.create(HTMLDivElement.prototype))
});

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
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wizard_WizardStep__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_IO__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_elements_Draggable__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ui_Dom__ = __webpack_require__(2);
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
            var geometry = this.data.geometry;
            var container = this.data.container;
            return {
                geometry: geometry,
                container: container
            };
        }
    }, {
        key: "Export",
        value: function Export() {
            __WEBPACK_IMPORTED_MODULE_1__utils_IO__["a" /* default */].SaveUTF(JSON.stringify(this), 'PackingSpace-config.json');
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
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__WizardStep__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Wizard__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ui_Dom__ = __webpack_require__(2);
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

/***/ })
/******/ ]);
//# sourceMappingURL=FPEditor.js.map