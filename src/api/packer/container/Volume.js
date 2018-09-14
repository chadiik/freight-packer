import Dimensions from "../../components/box/Dimensions";
import RuntimeTester from "../../debug/RuntimeTester";

const type = 'Volume';
const _box3 = Symbol('box3');

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

        this[_box3] = new THREE.Box3();
    }

    /** @returns {THREE.Box3} */
    get box3(){
        /** @type {THREE.Box3} */
        let b = this[_box3];
        b.setFromCenterAndSize(this.position, this.dimensions.vec3);
        return b;
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

        RuntimeTester.Test('Dimensions.FromJSON', () => {
            return Dimensions.Assert(volume.dimensions);
        }, true);

        return volume;
    }
}

export default Volume;