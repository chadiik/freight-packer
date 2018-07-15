
/**
 * @type {Dom}
 */
var instance;

class Dom {

    constructor(){
        instance = this;
        this.element = crel('div', {id:'UIDom', class:'UIOrigin UIExpand'});
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    Add(element){
        this.element.appendChild(element.domElement);
    }

    static get instance(){
        return instance;
    }
}

export default Dom;