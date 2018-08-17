import Signaler from "../../utils/cik/Signaler";
import Utils from "../../utils/cik/Utils";

var tlWatchTimer, tlWatchEntries;
function tlWatchUpdater(){
    for(let i = 0; i < tlWatchEntries.length; i++){
        let entry = tlWatchEntries[i];
        let newValue = entry.owner[entry.propertyName];
        if(newValue !== entry.savedValue){
            entry.savedValue = newValue;
            entry.tl.value = newValue;
        }
    };
}
function addTLWatch(tl, owner, propertyName){
    if(tlWatchTimer === undefined){
        tlWatchEntries = [];
        tlWatchTimer = setInterval(tlWatchUpdater, 200);
    }
    tlWatchEntries.push({tl: tl, owner: owner, propertyName: propertyName, savedValue: null});
}

const _value = Symbol('value');
const typeofString = 'string';

const signals = {
    change: 'change'
};

class TextLabel extends Signaler{
    constructor(){
        super();

        this[_value] = '';
    }

    get value(){
        return this[_value];
    }

    /** @param {string} v */
    set value(v){
        if(v !== typeofString) v = this.GetString(v);

        let changed = this[_value] !== v;
        this[_value] = v;
        if(changed) this.Dispatch(signals.change, this);
    }

    GetString(v){
        return v.ToString ? v.ToString() : v.toString();
    }

    Watch(owner, propertyName){
        addTLWatch(this, owner, propertyName);
    }

    static get signals(){
        return signals;
    }
}

const defaultGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

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
const defaultParams = {
    font: '32px sans-serif',
    textAlign: 'center',
    sidePadding: 16,
    fontColor: 0x000000,
    backColor: 0xffffff,
    width: 256,
    height: 64
};

class TextLabelView{
    
    /** @param {TLVParams} params */
    constructor(params){
        
        this.params = Utils.AssignUndefined(params, defaultParams);

        let material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
        this.view = new THREE.Mesh(defaultGeometry, material);
    }

    /** @param {TextLabel} value */
    set textLabel(value){
        value.On(TextLabel.signals.change, this.OnChange.bind(this));
    }

    /** @param {TextLabel} textLabel */
    OnChange(textLabel){
        let text = textLabel.value;
        this.UpdateText(text);
    }

    /** @param {string} text */
    UpdateText(text){
        if(this.canvas2d === undefined)
            this.canvas2d = document.createElement('canvas');

        this.canvas2d.width = this.params.width;
        this.canvas2d.height = this.params.height;

        let context2d = this.canvas2d.getContext('2d');
            context2d.fillStyle = this.params.backColor;
            context2d.fillRect(0, 0, this.params.width + 2, this.params.height + 2);
            context2d.fillStyle = this.params.fontColor;
            context2d.font = this.params.font;
            context2d.textAlign = this.params.textAlign;
            context2d.textBaseline = 'middle';

        let x = this.params.textAlign === 'start' || this.params.textAlign === 'left' ? this.params.sidePadding :
            ( this.params.textAlign === 'end' || this.params.textAlign === 'right' ? this.params.width - this.params.sidePadding :
            ( this.params.width / 2 ) );
        context2d.fillText(text, x, this.params.height / 2);

        //
        let mesh = this.view;
        /** @type {THREE.MeshBasicMaterial} */
        let material = mesh.material;
        if(!material.map){
            material.map = new THREE.CanvasTexture(this.canvas2d);
            material.map.minFilter = THREE.LinearFilter;
            material.map.anisotropy = 1.4;
        }
        else{
            material.map.image = this.canvas2d;
        }
        material.map.needsUpdate = true;
    }

}

TextLabelView.Label = TextLabel;

export default TextLabelView;