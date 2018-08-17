import Utils from "../../utils/cik/Utils";


const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const outlineMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide, depthWrite:false, depthTest:true});
const boxOutlineMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide});

/** @typedef OutlineParams @property {Number} color @property {Number} opacity @property {Number} offsetFactor @property {Number} offsetUnits */
/** @type {OutlineParams} */
const defaultParams = {
    color: 0x000000,
    opacity: 1,
    offsetFactor: 1,
    offsetUnits: 1
};

var tempBox3 = new THREE.Box3();
var tempMatrix4 = new THREE.Matrix4();

class Outline{

    /** @param {OutlineParams} params */
    constructor(params){

        this.params = Utils.AssignUndefined(params, defaultParams);

        this.view = new THREE.Object3D();

        /** @type {Map<THREE.Object3D, THREE.Object3D>} */
        this.outlines = new Map();
    }

    /** @param {THREE.Object3D} value */
    set object3d(value){
        if(!value) return this.Disable();

        this.view.visible = true;

        if(this.material === undefined) this.material = outlineMaterial.clone();
        let material = this.material;
            material.color.setHex(this.params.color);
            material.opacity = THREE.Math.clamp(this.params.opacity, 0, 1);
            material.transparent = true;//material.opacity < .999;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -this.params.offsetFactor;
            material.polygonOffsetUnits = this.params.offsetUnits;

        let outline = this.outlines.get(value);
        if(!outline){
            outline = value.clone(true);
            if(outline instanceof THREE.Mesh){
                outline.material = material;
            }
            else{
                outline.children.forEach(oChild => oChild.traverse(function(child){
                    if(child instanceof THREE.Mesh){
                        let outlineReady = child.clone();
                        outlineReady.material = material;
                        if(child.parent){
                            // Assuming end of hierarchical tree
                            child.parent.add(outlineReady);
                            child.parent.remove(child);
                        }
                    }
                }));
            }

            this.outlines.set(value, outline);
        }

        value.updateMatrixWorld();
        outline.matrixWorld.copy(value.matrixWorld);

        while(this.view.children.length > 0) this.view.remove(this.view.children[this.view.children.length - 1]);
        this.view.add(outline);
    }

    /** @param {THREE.Object3D} value */
    set box(value){
        if(!value) return this.Disable();

        this.view.visible = true;

        if(this.boxMaterial === undefined) this.boxMaterial = boxOutlineMaterial.clone();
        this.boxMaterial.color.setHex(this.params.color);
        this.boxMaterial.opacity = THREE.Math.clamp(this.params.opacity, 0, 1);
        this.boxMaterial.transparent = this.boxMaterial.opacity < .999;

        if(this.boxMesh === undefined){
            this.boxMesh = new THREE.Mesh(cubeGeometry, this.boxMaterial);
        }

        value.updateMatrixWorld();
        tempBox3.setFromObject(value);
        tempBox3.getSize(this.view.scale);
        this.view.scale.addScalar(this.params.offsetFactor);
        tempBox3.getCenter(this.view.position);

        let parent = this.view.parent;
        if(parent){
            parent.updateMatrixWorld();
            let inverse = tempMatrix4.getInverse(parent.matrixWorld);
            this.view.applyMatrix(inverse);
        }

        while(this.view.children.length > 0) this.view.remove(this.view.children[this.view.children.length - 1]);
        this.view.add(this.boxMesh);
    }

    Disable(){
        this.view.visible = false;
    }
    
}

export default Outline;