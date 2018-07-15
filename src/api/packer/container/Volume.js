import Dimensions from "../../components/box/Dimensions";

class Volume {
    constructor(){
        /**
         * @type {THREE.Vector3}
         */
        this.position = new THREE.Vector3();

        /**
         * @type {Dimensions}
         */
        this.dimensions = new Dimensions();
    }

    toJSON(){
        return {
            type: 'Volume',
            position: this.position,
            dimensions: this.dimensions
        };
    }
}

export default Volume;