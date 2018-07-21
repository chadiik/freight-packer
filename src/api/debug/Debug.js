
const debugGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const debugMaterial = new THREE.MeshStandardMaterial({color: 0xff7f00, transparent: true, opacity: .35});
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

class Debug {

    
}

Debug.Box = DebugBox;

export default Debug;