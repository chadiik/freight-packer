import AFitTest from "../packer/afit/AFitTest";
import Asset from "../components/assets/Asset";
import RuntimeTester from "./RuntimeTester";

function delay(time, callback){
    setTimeout(callback, time);
}

const debugGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
var debugMaterial = new THREE.MeshStandardMaterial({color: 0xff7f00, transparent: true, opacity: .35});
Asset.SetTextureMap('checkers.jpg', debugMaterial, 'map').then( (map) => {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
});
const debugBox = new THREE.Mesh(debugGeometry, debugMaterial);

var tempVec = new THREE.Vector3();

class DebugBox {

    /**
     * @param {THREE.Vector3} center 
     * @param {Number|THREE.Vector3} size 
     */
    static FromCenterSize(center, size){
        var box = debugBox.clone();
        box.position.copy(center);
        
        if(size instanceof THREE.Vector3)
            box.scale.copy(size);
        else
            box.scale.set(size, size, size);

        return box;
    }

    /**
     * @param {THREE.Box3} box3 
     */
    static FromBox3(box3){
        var box = debugBox.clone();

        box3.getCenter(tempVec);
        box.position.copy(tempVec);
        box3.getSize(tempVec);
        box.scale.copy(tempVec);

        return box;
    }
}

/**
 * DebugViz
 */

const alphaHexMask = 256 * 256 * 256;

/** @type {THREE.Object3D} */
var view;

/** @type {Map<string, *>} */
var debugObjects = new Map();

var tVec3 = new THREE.Vector3(),
    tPos = new THREE.Vector3(),
    tScale = new THREE.Vector3();

class DebugViz {

    /**
     * @param {THREE.Object3D} parent
     */
    static SetViewParent(parent){
        view = new THREE.Object3D();
        view.name = 'DebugViz view';
        view.renderOrder = Number.MAX_SAFE_INTEGER - 10;
        parent.add(view);
    }

    static get view(){ return view; }

    /**
     * @param {Number} x center x * @param {Number} y center y * @param {Number} z center z * @param {Number} w * @param {Number} h * @param {Number} l
     * @param {Number} [color] hex color
     * @param {Number} [duration] in milliseconds
     * @param {Boolean} [checkered] checkers map
     */
    static DrawVolume(x, y, z, w, h, l, color, duration, wireframe, checkered){
        tPos.set(x, y, z);
        tScale.set(w, h, l);

        /** @type {THREE.Mesh} */
        var volume = debugBox.clone();
        view.add(volume);

        volume.position.copy(tPos);
        volume.scale.copy(tScale);

        if(color){
            /** @type {THREE.MeshStandardMaterial} */
            let material = volume.material.clone();
            volume.material = material;
            material.color.setHex(color && 0xffffff);
            if(wireframe === true){
                material.wireframe = true;
            }
            else{
                material.opacity = Math.floor(color / alphaHexMask) / 256;
                material.transparent = material.opacity > 0 && material.opacity < .99;
            }

            if(!checkered){
                material.map = null;
            }
            else{
                material.map.repeat.set(10, 10);
            }
        }

        let uid = THREE.Math.generateUUID();
        debugObjects.set(uid, volume);

        if(duration > 0){
            delay(duration, function(){
                DebugViz.RemoveObjectByUID(uid);
            });
        }

        return uid;
    }

    /**
     * @param {string} uid 
     */
    static RemoveObjectByUID(uid){
        var object = debugObjects.get(uid);
        if(object instanceof THREE.Object3D && object.parent){
            object.parent.remove(object);
        }
    }

    static ClearAll(){
        for(var uid of debugObjects.keys()){
            DebugViz.RemoveObjectByUID(uid);
        }
    }

    /** @param {Boolean} visible */
    static SetPackingSpaceVisibility(visible){
        Debug.app.view.packingSpaceView.view.visible = visible;
    }
}

/**
 * DebugViz
 */

class Debug {

    static get Runtime(){
        return RuntimeTester;
    }

    static MaterialEdit(callback){
        let objects = Debug.app.view.packResultView.cargoViews;
        objects.forEach(o => {
            let material = o.mesh.material;
            callback(material);
            material.needsUpdate = true;
        });
    }

    static get AFitTest(){
        return AFitTest;
    }
}

Debug.Box = DebugBox;
Debug.Viz = DebugViz;

/** @type {import('../../FreightPacker').default} */
Debug.api;
/** @type {import('../App').default} */
Debug.app;

export default Debug;