
function stopPropagation(e){
    e.stopPropagation();
}

var stylesheet;

/** @param {string|Array<string>} css */
function createCSS(css){
    if(stylesheet === undefined){
        stylesheet = document.createElement('style');
        stylesheet.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(stylesheet);
    }
    if(css instanceof Array)
        css = css.join('\n');
    
    if(css.length > 1) stylesheet.innerHTML += css + '\n';
}

createCSS([
    '@keyframes wiggle {',
    '    20% { transform: rotate(5deg); }',
    '    50% { transform: rotate(0deg); }',
    '    75% { transform: rotate(-5deg); }',
    '   100% { transform: rotate(0deg); }',
    '}'
]);

const styles = {
    UIFitContent: 'display: inline-block; padding-bottom: 1em;',
    UIHideMenu: 'display: none !important;',

    UIDraggable: 'position: absolute; -webkit-user-select: none; -moz-user-select: none; -o-user-select: none; \
                -ms-user-select: none; -khtml-user-select: none; user-select: none; z-index: 1; padding: 4px;',
    UIDHeader: 'color: #ffffff; display: inline-block; word-wrap: break-word; font-family: Monospace; font-size: 1.2em; height: 100%; width: 100%;',
    UIDCloseButton: 'background-color: rgb(19, 19, 19); border: none; color: white; padding: 8px 2px; text-align: center; \
                text-decoration: none; margin-left: -38px; margin-right: 10px; font-family: Monospace; font-size: small; cursor: pointer;',
    UIWiggleAnim: 'display: inline-block; animation: wiggle .15s;'
    
}

class Element {

    /**
     * @property {HTMLElement} domElement
     */

    constructor(){
        /**
         * @type {HTMLElement}
         */
        this._domElement;
    }

    set domElement(value){
        if(this._domElement){
            this._domElement.removeEventListener('mousedown', stopPropagation);
            this._domElement.removeEventListener('mouseup', stopPropagation);
        }

        this._domElement = value;

        this._domElement.addEventListener('mousedown', stopPropagation);
        this._domElement.addEventListener('mouseup', stopPropagation);
    }

    get domElement(){
        return this._domElement;
    }

    EnableChildInput(){
        if(this._domElement){
            this._domElement.removeEventListener('mousedown', stopPropagation);
            this._domElement.removeEventListener('mouseup', stopPropagation);
        }
    }

    Hide(){
        Element.AddStyle(this.domElement, styles.UIHideMenu);
    }
    
    Show(){
        Element.RemoveStyle(this.domElement, styles.UIHideMenu);
    }

    Remove(){
        if(this._domElement){
            this._domElement.removeEventListener('mousedown', stopPropagation);
            this._domElement.removeEventListener('mouseup', stopPropagation);

            this._domElement.remove();
            delete this._domElement;
        }
    }

    get opacity(){
        return parseFloat(this.domElement.style.opacity);
    }

    set opacity(value){
        this.domElement.style.opacity = value;
    }

    static _Span(text, attributes){
        return {
            type: 'span',
            label: text, 
            attributes: attributes
        };
    }

    static Span(text, attributes){
        var _span = this._Span(text, attributes);
        return crel(_span.type, _span.attributes, _span.label);
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} style 
     */
    static AddStyle(element, style){
        let eStyle = element.style.cssText;
        let index = eStyle.indexOf(style);
        if(index === -1){
            element.style.cssText += style;
        }
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {string} style 
     */
    static RemoveStyle(element, style){
        element.style.cssText = element.style.cssText.replace(style, '');
    }

    static get CreateCSS(){
        return createCSS;
    }

    static Add(element){
        document.body.appendChild(element.domElement);
    }
}

const widths = {
    small: 162,
    medium: 242,
    large: 362
};

class Draggable extends Element {
    constructor(title, width){

        super();

        var dom;

        var move = function(xpos, ypos){
            dom.style.left = xpos + 'px';
            dom.style.top = ypos + 'px';
        };

        var diffX = 0,
            diffY = 0;
        var eWi = 0,
            eHe = 0,
            cWi = 0,
            cHe = 0;

        var onMouseMove = function(evt){
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
                aX = posX - diffX,
                aY = posY - diffY;
                if (aX < 0) aX = 0;
                if (aY < 0) aY = 0;
                if (aX + eWi > cWi) aX = cWi - eWi;
                if (aY + eHe > cHe) aY = cHe -eHe;
            move(aX, aY);
        };
        
        var startMoving = function(evt){
            var p = dom.parentNode;
            var container = (p !== undefined && p !== null) ? p : window;
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

            container.style.cursor='move';
            divTop = divTop.replace('px','');
            divLeft = divLeft.replace('px','');
            diffX = posX - divLeft;
            diffY = posY - divTop;
            document.addEventListener('mousemove', onMouseMove);
        };
        
        var stopMoving = function(){
            var p = dom.parentNode;
            var container = (p !== undefined && p !== null) ? p : window;
            container = document.body;
            container.style.cursor = 'default';
            document.removeEventListener('mousemove', onMouseMove);
        };

        if(width === undefined) width = widths.medium;
        var left = 60 + Math.floor(Math.random() * 160),
            top = 60 + Math.floor(Math.random() * 60);
        var domStyle = 'left:' + left + 'px; top:' + top + 'px; width:' + width + 'px; background-color: rgba(0, 0, 0, .8);' + styles.UIFitContent + styles.UIDraggable;
        dom = crel('div', {style: domStyle});
        var head = crel('div', {style: 'display: flex;'});
        dom.appendChild(head);
        var header = crel('div', {onmousedown: startMoving, onmouseup: stopMoving, style: styles.UIDHeader}, title);
        
        var scope = this;
        var close = function(){
            scope.Close();
        };
        var closeBtn = crel('button', {onclick: close, style: styles.UIDCloseButton}, 'Close');
        head.appendChild(closeBtn);
        head.appendChild(header);

        dom.closeBtn = closeBtn;

        this.domElement = dom;
        this.EnableChildInput();
        this.closeBtn = closeBtn;
    }

    Close(){
        this.domElement.remove();
    }

    Add(elt){
        this.domElement.appendChild(elt);
    }

    GetPosition(){
        var style = window.getComputedStyle(this.domElement),
            left = parseFloat(style.left),
            top = parseFloat(style.top);
        
        return {x: left, y: top};
    }

    SetPosition(x, y){
        this.domElement.style.left = x + 'px';
        this.domElement.style.top = y + 'px';
    }

    static get widths(){
        return widths;
    }
}

export {
    styles,
    Element,
    Draggable
};