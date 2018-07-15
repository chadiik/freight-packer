
class DirectedRect {

    /**
     * 
     * @param {THREE.Vector3} center 
     * @param {THREE.Vector2} extent 
     * @param {THREE.Vector3} normal
     * @param {Boolean} invert
     */
    constructor(center, extent, normal, invert){
        this.center = center;
        this.extent = extent;
        this.normal = normal;
        this.invert = invert;

        /**
         * @type {THREE.Vector3}
         */
        this.direction;
    }

    Scale(width, length, height){
        length = length || width;
        height = height || width;
        
        this.center.x *= width;
        this.center.y *= height;
        this.center.z *= length;

        this.extent.x *= width;
        this.extent.y *= length;
    }

    get width(){
        return this.extent.x;
    }

    set width(value){
        this.extent.x = value;
    }

    get length(){
        return this.extent.y;
    }

    set length(value){
        this.extent.y = value;
    }

    static FromPoints(points){
        var box = new THREE.Box3().setFromPoints(points);
        var y = (box.min.y + box.max.y) * .5;
        box.min.y = box.max.y = y;

        var center = new THREE.Vector3();
        box.getCenter(center);
        var size = new THREE.Vector3();
        box.getSize(size);
        
        var width, length, invert = false;
        if(size.x < size.z){
            width = size.x;
            length = size.z;
        }
        else{
            width = size.z;
            length = size.x;
            invert = true;
        }
        var extent = new THREE.Vector2(width, length);
        var normal = new THREE.Vector3().crossVectors(new THREE.Vector3(width, 0, 0), new THREE.Vector3(0, 0, -length)).normalize();

        var dRect = new DirectedRect(center, extent, normal, invert);
        return dRect;
    }

    static AxisDirection(direction){
        var x = Math.abs(direction.x);
        var y = Math.abs(direction.y);
        var z = Math.abs(direction.z);
        if (x > y && x > z){
            return new THREE.Vector3(Math.sign(direction.x), 0, 0);
        } else if (y > x && y > z){
            return new THREE.Vector3(0, Math.sign(direction.y), 0);
        }

        return new THREE.Vector3(0, 0, Math.sign(direction.z));
    }
}

export default DirectedRect;