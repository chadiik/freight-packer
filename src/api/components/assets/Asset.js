import ColorTemplate from "./ColorTemplate";
import Signaler from "../../utils/cik/Signaler";
import Resources from "../../Resources";

const SolidMaterialType = THREE.MeshStandardMaterial;
const TransparentMaterialType = THREE.MeshStandardMaterial;
const InvisibleMaterialType = THREE.MeshBasicMaterial;

const defaultGeometry = new THREE.CubeGeometry(1, 1, 1);
const defaultMeshMaterial = new SolidMaterialType({color: 0xaaaaaa});

const objectLoader = new THREE.ObjectLoader();
const jsonLoader = new THREE.JSONLoader();

const castShadow = true;
const receiveShadow = true;

/** @type {Map<string, ColorTemplate>} */
var colorTemplates = new Map();

var signaler = new Signaler();
const signals = {
    resourcesSet: 'resourcesSet'
};

const _resources = Symbol('resources');

class Asset {
    constructor(){

    }

    /** @param {Resources} value */
    static set resources(value){
        Asset[_resources] = value;
        signaler.Dispatch(signals.resourcesSet);
    }

    static get resources(){ return Asset[_resources]; }

    /**
     * @param {string} url 
     * @param {THREE.Material} material 
     * @param {string} mapName 
     * @returns {Promise<THREE.Texture>}
     */
    static SetTextureMap(url, material, mapName){
        return new Promise( (resolve, reject) => {
            signaler.OnIncludingPrior(signals.resourcesSet, () => {
                let texture = material[mapName];
                if(texture instanceof THREE.Texture || texture === null){
                    material[mapName] = new THREE.TextureLoader().load(Asset.resources.texturesPath + url, resolve, undefined, reject);
                }
            });
        });
    }

    /**
     * @param {Number} color hex
     */
    static CreateSolidMaterialMatte(color){
        return new Asset.SolidMaterialType({color: color, roughness: 1, metalness: .2});
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

    static RestoreMaterial(material, modified){
        if(modified === undefined) return;

        let keys = Object.keys(modified);
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            if(material[key] !== undefined){
                if(material[key].setHex){
                    /** @type {THREE.Color} */
                    let color = material.color;
                    color.setHex(modified[key]);
                }
                else{
                    material[key] = modified[key];
                }
            }
        }
    }

    static SetMaterialFocus(material, value, modified){

        /** @type {THREE.Color} */
        let color = material.color;
        if(color !== undefined){
            if(modified) modified.color = color.getHex();

            let reduce = (value - 1) / 4;
            color.r = THREE.Math.clamp(color.r - reduce, 0, 1);
            color.g = THREE.Math.clamp(color.g - reduce, 0, 1);
            color.b = THREE.Math.clamp(color.b - reduce, 0, 1);
        }

        /** @type {Number} */
        let opacity = material.opacity;
        if(opacity !== undefined){
            if(modified){
                modified.opacity = opacity;
                modified.transparent = material.transparent;
            }

            material.opacity = THREE.Math.clamp(material.opacity * value, 0, 1);;
            material.transparent = material.opacity < 1;
        }
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

    /**
     * @param {Object} json 
     * @returns {THREE.Object3D}
     */
    static FromJSON(json){
        return objectLoader.parse(json);
    }

    /** @param {THREE.Object3D} object */
    static StandardSceneObject(object){
        Asset.CastReceiveShadow(object);
    }

    /** @param {THREE.Object3D} object @param {Boolean} [value] */
    static CastReceiveShadow(object, value){
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                child.castShadow = value === undefined ? castShadow : value;
                child.receiveShadow = value === undefined ? receiveShadow : value;
            }
        });
    }

    /** @param {THREE.Object3D} object @param {Boolean} [value] */
    static ReceiveShadow(object, value){
        if(value === undefined) value = receiveShadow;
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                child.receiveShadow = value;
            }
        });
    }

    /** @param {THREE.Object3D} object @param {Boolean} [value] */
    static CastShadow(object, value){
        if(value === undefined) value = castShadow;
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                child.castShadow = value;
            }
        });
    }

    /**
     * @param {string} key 
     * @param {Array<string|THREE.Color>} colors 
     */
    static CreateColorTemplate(key, ...colors){
        var template = new ColorTemplate(...colors);
        colorTemplates.set(key, template);
    }

    /**
     * @param {string} key 
     */
    static ColorTemplates(key){
        return colorTemplates.get(key);
    }

}

Asset.SolidMaterialType = SolidMaterialType;
Asset.TransparentMaterialType = TransparentMaterialType;
Asset.InvisibleMaterialType = InvisibleMaterialType;

Asset.CreateColorTemplate('Containers', 0x020202, 0x7f7f7f, 0xffffff);

export default Asset;