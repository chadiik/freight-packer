
const _position = Symbol('position');
const _rotation = Symbol('rotation');

class Transform {

    /**
     * @param {THREE.Vector3} position 
     * @param {THREE.Euler} rotation 
     */
    constructor(position, rotation){
        this[_position] = position || new THREE.Vector3();
        this[_rotation] = rotation || new THREE.Euler();
    }

    /**
     * @returns {THREE.Vector3}
     */
    get position(){
        return this[_position];
    }

    set position(value){
        this[_position] = value;
    }

    /**
     * @returns {THREE.Euler}
     */
    get rotation(){
        return this[_rotation];
    }

    set rotation(value){
        this[_rotation] = value;
    }

    /**
     * 
     * @param {THREE.Object3D} target 
     */
    Apply(target){
        target.position.copy(this[_position]);
        target.rotation.copy(this[_rotation]);
    }

    Clone(){
        var transform = new Transform(this[_position].clone(), this[_rotation].clone());
        return transform;
    }
}

export default Transform;