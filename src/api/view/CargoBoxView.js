import CargoView from "./CargoView";
import Utils from "../utils/cik/Utils";
import BoxEntry from "../components/box/BoxEntry";

const unitCubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const materialTemplate = new THREE.MeshStandardMaterial();

const brightnessRange = [.4, .6];
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
}

export default CargoBoxView;