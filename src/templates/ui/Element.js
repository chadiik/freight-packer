
function stopPropagation(e){
    e.stopPropagation();
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

    Hide(){
        this.domElement.classList.add('UIHideMenu');
    }
    
    Show(){
        this.domElement.classList.remove('UIHideMenu');
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
            attributes: typeof(attributes) === 'string' ? {
                class: attributes
            } : attributes
        };
    }

    static Span(text, attributes){
        var _span = this._Span(text, attributes);
        return crel(_span.type, _span.attributes, _span.label);
    }
}

export default Element;