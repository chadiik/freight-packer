import CargoView from "./CargoView";
import Utils from "../utils/cik/Utils";
import BoxEntry from "../components/box/BoxEntry";

const unitCubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const materialTemplate = new THREE.MeshStandardMaterial();

const brightnessRange = [.45, .55];
var hueBase = Math.random();
function nextColor(){
    let color = new THREE.Color();
    color.setHSL(hueBase, 1, brightnessRange[0] + Math.random() * (brightnessRange[1] - brightnessRange[0]));
    hueBase = Utils.GoldenSeries(hueBase);
    return color;
}

class CargoBoxView extends CargoView {
    /**
     * 
     * @param {BoxEntry} boxEntry 
     */
    constructor(boxEntry){
        super(boxEntry);

        var material = materialTemplate.clone();
        material.color = nextColor();
        this.mesh = new THREE.Mesh(unitCubeGeometry, material);
        this.mesh.scale.copy(boxEntry.dimensions.vec3);

        this.view = new THREE.Object3D();
        this.view.add(this.mesh);
    }

    /** @returns {BoxEntry} */
    get entry(){ return super.entry; }
    set entry(value){
        super.entry = value;
        var s = value.dimensions.vec3;
        this.SetScale(s.x, s.y, s.z);
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    SetScale(x, y, z){
        this.mesh.scale.set(x, y, z);
    }

    /**
     * @param {Number} x in radians
     * @param {Number} y in radians
     * @param {Number} z in radians
     */
    SetRotationAngles(x, y, z){
        this.mesh.rotation.set(x, y, z);
    }
}

export default CargoBoxView;