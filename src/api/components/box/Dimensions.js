import RuntimeTester from "../../debug/RuntimeTester";

const type = 'Dimensions';
const _vec3 = Symbol('vec3');

const epsilon = Math.pow(2, -52);
const numberType = 'number';

RuntimeTester.Notify('Dimensions.FromJSON', 3);

class Dimensions {
    /**
     * @param {Number} width 
     * @param {Number} length 
     * @param {Number} height 
     */
    constructor(width, length, height){
        if(width === undefined) width = 0;
        if(length === undefined) length = 0;
        if(height === undefined) height = 0;
        
        this.Set(width, length, height);
        this[_vec3] = new THREE.Vector3();
    }

    /**
     * @param {Number} width 
     * @param {Number} length 
     * @param {Number} height 
     */
    Set(width, length, height){
        /** @type {Number} */
        this.width = width;
        /** @type {Number} */
        this.length = length;
        /** @type {Number} */
        this.height = height;
    }

    /**
     * Returns a THREE.Vector3 representation of the dimensions
     * Beware of ordering: x=width, y=height and z=length
     * @returns {THREE.Vector3}
     */
    get vec3(){
        return this[_vec3].set(this.width, this.height, this.length);
    }

    get volume(){
        return this.width * this.height * this.length;
    }

    Abs(){
        if(this.width < 0) this.width = -this.width;
        if(this.length < 0) this.length = -this.length;
        if(this.height < 0) this.height = -this.height;
        return this;
    }

    Compare(dimensions){
        var d = this.volume - dimensions.volume;
        if(d < -epsilon) return -1;
        if(d > epsilon) return 1;
        return 0;
    }

    Copy(dimensions){
        this.Set(dimensions.width, dimensions.length, dimensions.height);
    }

    Clone(){
        var dimensions = new Dimensions(this.width, this.length, this.height);
        return dimensions;
    }

    ToString(){
        return this.width.toFixed(2) + 'x' + this.length.toFixed(2) + 'x' + this.height.toFixed(2);
    }

    toJSON(){
        return {
            type: type,
            width: this.width,
            length: this.length,
            height: this.height
        };
    }

    static IsVolume(dimensions){
        return Dimensions.Assert(dimensions) 
            && dimensions.width > epsilon
            && dimensions.length > epsilon
            && dimensions.height > epsilon
        ;
    }

    static FromJSON(data){
        if(data.type !== type) console.warn('Data supplied is not: ' + type);

        var dimensions = new Dimensions(data.width, data.length, data.height).Abs();
        return dimensions;
    }

    static Assert(dimensions){
        return dimensions instanceof Dimensions
            && typeof dimensions.width === numberType
            && typeof dimensions.length === numberType
            && typeof dimensions.height === numberType
        ;
    }
}

export default Dimensions;