import Cargo from "../packer/Cargo";

const dummyGeometry = new THREE.SphereBufferGeometry(1, 4, 4);
const dummyMaterial = new THREE.MeshStandardMaterial({color: 0xff0000, transparent: true, opacity: .5});

class CargoView {
    /**
     * 
     * @param {Cargo} cargo 
     */
    constructor(cargo){

        this.cargo = cargo;

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

    static Dummy(cargo){
        var cargoView = new CargoView(cargo);
        cargoView.view = new THREE.Mesh(dummyGeometry, dummyMaterial);
        return cargoView;
    }

}

export default CargoView;