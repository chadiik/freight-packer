import Dimensions from "../../components/box/Dimensions";

const type = 'Volume';

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
            type: type,
            position: this.position,
            dimensions: this.dimensions
        };
    }

    ToString(){
        return this.dimensions.ToString();
    }

    static FromJSON(data, volume){
        if( ! volume ) {
            if(data.type !== type) console.warn('Data supplied is not: ' + type);

            volume = new Volume();
        }

        volume.position = new THREE.Vector3(data.position.x, data.position.y, data.position.z);
        volume.dimensions = Dimensions.FromJSON(data.dimensions);

        return volume;
    }
}

export default Volume;