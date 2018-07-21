import CargoGroup from "./CargoGroup";

var _position = Symbol('position');
var _rotation = Symbol('rotation');

class PackingItem {
    constructor(){
        this[_position] = new THREE.Vector3();
        this[_rotation] = new THREE.Euler();
    }

    /** @returns {THREE.Vector3} */
    get position(){ return this[_position]; }
    set position(value){
        this[_position] = value;
    }

    /** @returns {THREE.Euler} */
    get rotation(){ return this[_position]; }
    set rotation(value){
        this[_rotation] = value;
    }
}

class Cargo extends PackingItem {
    /**
     * 
     * @param {CargoGroup} group
     */
    constructor(group){
        super();

        this.group = group;
    }

    get entry(){
        return this.group.entry;
    }

    Clone(){
        var cargo = new Cargo(this.group);
        return cargo;
    }

    ToString(){
        var output = 'Cargo(' + this.entry.ToString() + ')';

        return output;
    }
}

export default Cargo;