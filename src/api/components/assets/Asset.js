
const defaultGeometry = new THREE.CubeGeometry(1, 1, 1);
const defaultMeshMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa});

const objectLoader = new THREE.ObjectLoader();
const jsonLoader = new THREE.JSONLoader();

class Asset {
    constructor(){

    }

    /**
     * 
     * @param {THREE.Geometry|THREE.BufferGeometry} geometry 
     * @param {THREE.Material} [material]
     */
    static CreateMesh(geometry, material){
        geometry = geometry || defaultGeometry;
        material = material || defaultMeshMaterial;

        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    /**
     * @typedef GeometryJSONReturn
     * @property {THREE.Geometry|THREE.BufferGeometry} geometry
     * @property {Array<THREE.Material>} [materials]
     * 
     * @param {Object} json - Representing Geometry or BufferGeometry json data
     * @param {string} [texturePath] - optional texture url 
     * @returns {GeometryJSONReturn}
     */
    static FromGeometryJSON(json, texturePath){
        return jsonLoader.parse(json, texturePath);
    }
}

export default Asset;