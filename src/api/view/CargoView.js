import CargoEntry from "../components/common/CargoEntry";


const dummyGeometry = new THREE.SphereBufferGeometry(1, 4, 4);
const dummyMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, transparent: true, opacity: .5});

class CargoView {
    /**
     * @param {CargoEntry} entry 
     */
    constructor(entry){

        this.entry = entry;

        /**
         * @type {THREE.Object3D}
         */
        this.view;
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