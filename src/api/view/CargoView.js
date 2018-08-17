import CargoEntry from "../components/common/CargoEntry";
import Asset from "../components/assets/Asset";
import TextLabelView from "./components/TextLabelView";

/**
 * @typedef CargoViewLabelParams
 * @property {Number} width
 * @property {Number} height
 */

const dummyGeometry = new THREE.SphereBufferGeometry(1, 4, 4);
const dummyMaterial = new Asset.TransparentMaterialType({color: 0xff0000, transparent: true, opacity: .5});

const _entry = Symbol('entry');
const _focus = Symbol('focus');

class CargoView {
    /**
     * @param {CargoEntry} entry 
     */
    constructor(entry){

        this[_entry] = entry;

        /** @type {THREE.Mesh} */
        this.mesh;

        this.view = new THREE.Object3D();

        this[_focus] = 1;
    }

    /** @returns {CargoEntry} */
    get entry(){ return this[_entry]; }
    set entry(value){
        this[_entry] = value;
    }

    get position(){
        return this.view.position;
    }

    set position(value){
        this.view.position.copy(value);
    }

    /** @param {Number} value */
    set focus(value){
        this[_focus] = value;
    }

    get focus(){ return this[_focus]; }

    ReflectEntry(){
        
    }

    /** @param {string} value @param {CargoViewLabelParams} params */
    SetLabel(value, params){
        const height = 64;
        let width = Math.floor( params.width / params.height * height );
        if(this.labelView === undefined){
            /** @type {import('./TextLabelView').TLVParams} */
            let tlvParams = { font: '32px sans serif', backColor: 'rgb(0, 0, 0)', fontColor: 'rgb(255, 255, 255)', 
                textAlign: 'right', sidePadding: 16, width: width, height: height
            };
            let ratioToX = 64

            this.labelView = new TextLabelView(tlvParams);
            this.labelView.view.rotateY( 90 * Math.PI / 180 );
            this.labelView.view.rotateX( -90 * Math.PI / 180 );
            this.view.add(this.labelView.view);
        }

        this.labelView.UpdateText(value);
    }

    /**
     * @param {CargoEntry} entry 
     */
    static Dummy(entry){
        var cargoView = new CargoView(entry);
        cargoView.view = new THREE.Mesh(dummyGeometry, dummyMaterial);
        return cargoView;
    }

}

export default CargoView;