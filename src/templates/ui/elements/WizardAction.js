import Element from "../Element";

const buttonStyle = "\
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

class WizardAction extends Element {
    /**
     * @param {WizardActionElement} ref 
     */
    constructor(ref){
        super();

        var label = ref.attributes['label'];
        label = label ? label.value : '';
        var status = ref.attributes['status'];
        status = status ? status.value : false;
        var disabled = ref.attributes['disabled'];
        disabled = disabled ? disabled.value : false;

        /**
         * @type {HTMLInputElement}
         */
        this.checkbox = crel('input', {type:'checkbox'});
        this.checkbox.disabled = true;
        this.checkbox.checked = status;

        /**
         * @type {HTMLButtonElement}
         */
        this.button = crel('button', undefined, label);

        /**
         * @type {HTMLElement}
         */
        this.domElement = ref;
        this.domElement.appendChild(this.checkbox);
        this.domElement.appendChild(this.button);

        this.disabled = disabled;
        console.log(this);
    }

    get status(){
        return this.checkbox.checked;
    }

    set status(value){
        this.checkbox.checked = Boolean(value);
    }

    get disabled(){
        return this.domElement.disabled;
    }

    set disabled(value){
        this.domElement.disabled = Boolean(value);
        this.button.disabled = this.domElement.disabled;
    }
}

export default WizardAction;