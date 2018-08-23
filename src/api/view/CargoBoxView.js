import CargoView from "./CargoView";
import Utils from "../utils/cik/Utils";
import BoxEntry from "../components/box/BoxEntry";
import Asset from "../components/assets/Asset";

const unitCubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const materialTemplate = new Asset.SolidMaterialType({roughness: 1, metalness: 0, flatShading: true});

const brightnessRange = [.45, .55];
var hueBase = Math.random();
function nextColor(){
    let color = new THREE.Color();
    color.setHSL(hueBase, 1, brightnessRange[0] + Math.random() * (brightnessRange[1] - brightnessRange[0]));
    hueBase = Utils.GoldenSeries(hueBase);
    return color;
}

const _materialSettings = Symbol('matSet');
const _color = Symbol('color');

const typeofNumber = 'number',
    typeofString = 'string';

class CargoBoxView extends CargoView {
    /**
     * 
     * @param {BoxEntry} boxEntry 
     */
    constructor(boxEntry){
        super(boxEntry);

        var material = materialTemplate.clone();

        let colorHex = boxEntry.Description('color');
        this[_color] = colorHex ? new THREE.Color(colorHex) : nextColor();
        boxEntry.Description('color', this.color.getHex());

        material.color = this.color;
        this.mesh = new THREE.Mesh(unitCubeGeometry, material);
        this.mesh.scale.copy(boxEntry.dimensions.vec3);

        this.view.add(this.mesh);
    }

    /** @returns {BoxEntry} */
    get entry(){ return super.entry; }
    set entry(value){
        super.entry = value;
        var s = value.dimensions.vec3;
        this.SetScale(s.x, s.y, s.z);

        let colorHex = value.Description('color');
        if(colorHex) this.color = colorHex;
    }

    /** @param {Number} value */
    set focus(value){
        super.focus = value;

        if(this[_materialSettings]) Asset.RestoreMaterial(this.mesh.material, this[_materialSettings]);

        if(Math.abs(1 - value) > .0001){
            if(this[_materialSettings] === undefined){
                this.mesh.material = this.mesh.material.clone();
                this[_materialSettings] = {};
                Asset.SetMaterialFocus(this.mesh.material, value, this[_materialSettings]);
            }
            else{
                Asset.SetMaterialFocus(this.mesh.material, value);
            }
        }
    }

    get focus(){ return super.focus; }

    /** @returns {THREE.Color} */
    get color(){ return this[_color]; }

    /** @param {Number} value hex */
    set color(value){
        /** @type {THREE.Color} */
        let c = this[_color];
        if(typeof value === typeofNumber) c.setHex(value);
        else if(typeof value === typeofString) c.setHex(Number.parseInt(value));
        else c.copy(value);
        if(this[_materialSettings]) this[_materialSettings].color = c.getHex();
        else this.mesh.material.color = c;
        this.focus = super.focus;
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    SetScale(x, y, z){
        this.mesh.scale.set(x, y, z);

        if(this.labelView) this.labelView.view.position.z = params.width / 2 + this.entry.dimensions.length / 2;
    }

    ReflectEntry(){
        this.entry = this.entry;
    }

    /** 
     * @param {string} value 
     * @param {import('./CargoView').CargoViewLabelParams} params */
    SetLabel(value, params){
        super.SetLabel(value, params);

        this.labelView.view.scale.y = params.height;
        this.labelView.view.scale.x = params.width;
        this.labelView.view.position.z = params.width / 2 + this.entry.dimensions.length / 2;
        this.labelView.view.position.y = .001;
    }

    /**
     * @param {Number} x in radians
     * @param {Number} y in radians
     * @param {Number} z in radians
     */
    SetRotationAngles(x, y, z){
        this.mesh.rotation.set(x, y, z);
    }

    static GetNextColor(){
        return nextColor();
    }
}

export default CargoBoxView;