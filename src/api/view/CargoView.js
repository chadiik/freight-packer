import CargoEntry from "../components/common/CargoEntry";


const dummyGeometry = new THREE.SphereBufferGeometry(1, 4, 4);
const dummyMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, transparent: true, opacity: .5});

const _entry = Symbol('entry');

class CargoView {
    /**
     * @param {CargoEntry} entry 
     */
    constructor(entry){

        this[_entry] = entry;

        /**
         * @type {THREE.Mesh}
         */
        this.mesh;

        /**
         * @type {THREE.Object3D}
         */
        this.view;
    }

    /** @returns {CargoEntry} */
    get entry(){ return this[_entry]; }
    set entry(value){
        this[_entry] = value;
    }

    get position(){
        return this.view.position;
    }

    set position(value){
        this.view.position.copy(value);
    }

    /**
     * @param {CargoEntry} entry 
     */
    static Dummy(entry){
        var cargoView = new CargoView(entry);
        cargoView.view = new THREE.Mesh(dummyGeometry, dummyMaterial);
        return cargoView;
    }

}

export default CargoView;