import { Element, styles } from "../../utils/cik/config/UIUtils";
import Signaler from "../../utils/cik/Signaler";
import Asset from "../../components/assets/Asset";
import Utils from "../../utils/cik/Utils";

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
    d = typeof document === obj ? document : {},
    isType = function(a, type){
        return typeof a === type;
    },
    isNode = typeof Node === fn ? function (object) {
        return object instanceof Node;
    } :
    // in IE <= 8 Node is an object, obviously..
    function(object){
        return object &&
            isType(object, obj) &&
            (nodeType in object) &&
            isType(object.ownerDocument,obj);
    },
    isElement = function (object) {
        return crel[isNodeString](object) && object[nodeType] === 1;
    },
    isArray = function(a){
        return a instanceof Array;
    },
    appendChild = function(element, child) {
        if (isArray(child)) {
            child.map(function(subChild){
                appendChild(element, subChild);
            });
            return;
        }
        if(!crel[isNodeString](child)){
            child = d.createTextNode(child);
        }
        element.appendChild(child);
    };
function crel(){
    var args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
        element = args[0],
        child,
        settings = args[1],
        childIndex = 2,
        argumentsLength = args.length,
        attributeMap = crel[attrMapString];
    element = crel[isElementString](element) ? element : d.createElement(element);
    // shortcut
    if(argumentsLength === 1){
        return element;
    }
    if(!isType(settings,obj) || crel[isNodeString](settings) || isArray(settings)) {
        --childIndex;
        settings = null;
    }
    // shortcut if there is only one child that is a string
    if((argumentsLength - childIndex) === 1 && isType(args[childIndex], 'string') && element[textContent] !== undefined){
        element[textContent] = args[childIndex];
    }else{
        for(; childIndex < argumentsLength; ++childIndex){
            child = args[childIndex];
            if(child == null){
                continue;
            }
            if (isArray(child)) {
              for (var i=0; i < child.length; ++i) {
                appendChild(element, child[i]);
              }
            } else {
              appendChild(element, child);
            }
        }
    }
    for(var key in settings){
        if(!attributeMap[key]){
            if(isType(settings[key],fn)){
                element[key] = settings[key];
            }else{
                element[setAttribute](key, settings[key]);
            }
        }else{
            var attr = attributeMap[key];
            if(typeof attr === fn){
                attr(element, settings[key]);
            }else{
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
if(typeof Proxy !== 'undefined'){
    crel.proxy = new Proxy(crel, {
        get: function(target, key){
            !(key in crel) && (crel[key] = crel.bind(null, key));
            return crel[key];
        }
    });
}
//#endregion

function numberFormatDefault(n){ return n; }

function numberFormat(n, d){
    if(n > Number.MAX_SAFE_INTEGER - 2) return 'MAX';
    let nStr = Math.round(n) !== n ? n.toFixed(d) : n;
    return nStr;
}

/** @typedef FormatParams @property {Function} nf number formatting function */
/** @type {FormatParams} */
const defaultFormatParams = {
    nf: numberFormatDefault
};

/** @param {string} str string with (at) symbol an argument placeholder @param {FormatParams} params @param {Array<*>} args */
function format(str, params, ...args){
    params = Utils.AssignUndefined(params, defaultFormatParams);
    let index = 0;
    while( (index = str.indexOf('@', index)) !== -1 ){
        if(str[index - 1] !== '\\'){
            let a = args.shift();
            if(typeof a === 'number') a = params.nf(a);
            str = str.replace('@', a);
        }
        index += 1;
    }
    return str;
}

Element.CreateCSS([
]);

const signals = {
    orthoViewSelected: 'orthoViewSelected'
};

const orthoviews = {
    home: 'home',
    top: 'top',
    front: 'front',
    side: 'side'
};

class DomUI extends Signaler{
    /**
     * 
     * @param {HTMLDivElement} containerDiv 
     * @param {UX} ux 
     */
    constructor(containerDiv, ux){
        super();
        
        /** @type {HTMLDivElement} */
        //this.domElement = crel('div', {style: 'display: inline-block; position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;'});
        //containerDiv.appendChild(this.domElement);
        this.domElement = containerDiv;
        this.ux = ux;

        /** @type {HTMLDivElement} */
        //this.sideBar = crel('div', {style: 'float: right; right: 0px; width: 50%; height: 100%;'});
        //this.domElement.appendChild(this.sideBar);
    }

    CreateOrthoViewsIcons(){
        let scope = this;
        let texturesPath = Asset.resources.texturesPath;

        let icons = [
            {url: 'orthoviews-map.png', type: orthoviews.home},
            {url: 'orthoviews-map.png', type: orthoviews.top},
            {url: 'orthoviews-map.png', type: orthoviews.front},
            {url: 'orthoviews-map.png', type: orthoviews.side}
        ];

        /** @type {HTMLDivElement} */
        //this.orthoViewsIcons = crel('div', {style: 'display: inline-block; float: right; right: 0px; width: 100%; height: 100%;'});
        //this.sideBar.appendChild(this.orthoViewsIcons);

        const dimensions = {x: 52, y: 52};
        const margin = {x: 16, y: 16};
        const padding = 8;

        function dispatch(icon){
            scope.Dispatch(signals.orthoViewSelected, icon.type);
        }

        for(let i = 0; i < icons.length; i++){
            let icon = icons[i];

            let top = i * (dimensions.y + padding) + margin.y;
            let right = margin.x;
            let imageURL = texturesPath + icon.url;
            let style = format(
                'cursor: pointer; display: block; float: right; position: absolute; background-size: 200%; background-position: 0% @%; background-image: url("@"); width: @px; height: @px; right: @px; top: @px;', {
                    nf: function(n){
                        return Math.floor(n);
                    }
                }, 
                i / (icons.length - 1) * 100, imageURL, dimensions.x, dimensions.y, right, top);
            
            /** @type {HTMLDivElement} */
            let div = crel('div', {style: style});
            this.domElement.appendChild(div);

            div.onmouseover = function(){
                div.style.backgroundPositionX = '100%';
            }

            div.onmouseout = function(){
                div.style.backgroundPositionX = '0%';
            }

            div.onclick = function(e){
                e.preventDefault();
                dispatch(icon);
            };
        }
    }

    static get signals(){
        return signals;
    }

    static get orthoviews(){
        return orthoviews;
    }
}

export default DomUI;