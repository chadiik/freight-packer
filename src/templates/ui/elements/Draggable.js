import Element from "../Element";

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
            container.style.cursor='default';
            document.removeEventListener('mousemove', onMouseMove);
        };

        if(width === undefined) width = widths.medium;
        var left = 60 + Math.floor(Math.random() * 160),
            top = 60 + Math.floor(Math.random() * 60);
        var domStyle = 'left:' + left + 'px; top:' + top + 'px; width:' + width + 'px; background-color: rgba(0, 0, 0, .8)';
        dom = crel('div', {class:'UIFitContent UIDraggable', style: domStyle});
        var head = crel('div');
        dom.appendChild(head);
        var header = crel('div', {onmousedown: startMoving, onmouseup: stopMoving, class: 'UIDHeader'}, title);
        
        var scope = this;
        var close = function(){
            scope.Close();
        };
        var closeBtn = crel('button', {onmouseup: close, class:'UIDCloseButton'}, 'Close');
        head.appendChild(closeBtn);
        head.appendChild(header);

        dom.closeBtn = closeBtn;

        this.domElement = dom;
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

export default Draggable;