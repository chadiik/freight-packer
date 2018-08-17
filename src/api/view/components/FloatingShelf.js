import Utils from "../../utils/cik/Utils";
import Asset from "../../components/assets/Asset";

/** @typedef FloatingShelfParams @property {THREE.Vector3} padding x z for padding, y for thickness @property {Number} colorHex */
/** @type {FloatingShelfParams} */
const defaultParams = {
    padding: new THREE.Vector3(0, .001, 0),
    colorHex: 0xffffff
};

var box3 = new THREE.Box3();
var vec3 = new THREE.Vector3();

class FloatingShelf{
    /** @param {THREE.Object3D} targetView @param {FloatingShelfParams} params */
    constructor(targetView, params){

        this.params = Utils.AssignUndefined(params, defaultParams);

        this.targetView = targetView;
        this.view = new THREE.Object3D();

        let planeGeom = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        let planeMaterial = new Asset.CreateSolidMaterialMatte(this.params.colorHex);
        this.platformMesh = new THREE.Mesh(planeGeom, planeMaterial);
        Asset.ReceiveShadow(this.platformMesh);

        this.view.add(this.platformMesh);

        this.Update();
    }

    Update(){
        box3.setFromObject(this.targetView);
        const worldToLocal = new THREE.Matrix4().getInverse(this.targetView.matrixWorld);
        box3.applyMatrix4(worldToLocal);
        box3.getSize(vec3);
        let height = vec3.y;

        let padding = this.params.padding;
        let thickness = Math.max(.0001, padding.y);
        this.platformMesh.scale.set(Math.max(.0001, vec3.x + padding.x * 2), thickness, Math.max(.0001, vec3.z + padding.z * 2));

        box3.getCenter(vec3);
        this.platformMesh.position.set(vec3.x, vec3.y - height / 2 - thickness, vec3.z);
    }
}

export default FloatingShelf;