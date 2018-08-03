
const orientations = [ 'xyz', 'zyx', 'yxz', 'yzx', 'zxy', 'xzy' ];
var dimensions = [0, 0, 0];

class Item{
    /**
     * @param {string} id 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} length 
     * @param {Number} weight 
     * @param {Number} quantity 
     */
    constructor(id, width, height, length, weight, quantity){
        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length;
        this.weight = weight;
        this.volume = width * height * length;
        this.quantity = quantity;
    }

    get xyz(){ dimensions[0] = this.width; dimensions[1] = this.height; dimensions[2] = this.length; return dimensions; }
    get zyx(){ dimensions[0] = this.length; dimensions[1] = this.height; dimensions[2] = this.width; return dimensions; }
    get yxz(){ dimensions[0] = this.height; dimensions[1] = this.width; dimensions[2] = this.length; return dimensions; }
    get yzx(){ dimensions[0] = this.height; dimensions[1] = this.length; dimensions[2] = this.width; return dimensions; }
    get zxy(){ dimensions[0] = this.length; dimensions[1] = this.width; dimensions[2] = this.height; return dimensions; }
    get xzy(){ dimensions[0] = this.width; dimensions[1] = this.length; dimensions[2] = this.height; return dimensions; }

    /** @param {Number} orientation */
    GetOrientedDimensions(orientation){
        switch(orientation){
            case 0: return this.xyz;
            case 1: return this.zyx;
            case 2: return this.yxz;
            case 3: return this.yzx;
            case 4: return this.zxy;
            case 5: return this.xzy;
        }
    }

    /** @param {Item} item */
    Copy(item){
        this.id = item.id;
        this.width = item.width;
        this.height = item.height;
        this.length = item.length;
        this.weight = item.weight;
        this.volume = item.volume;
        this.quantity = item.quantity;
        
        return this;
    }

    /** @param {Number} orientation */
    static ResolveOrientation(orientation){
        return orientations[orientation];
    }

    /**
     * @param {Item} a 
     * @param {Item} b 
     */
    static VolumeSort(a, b){
        if(a.volume < b.volume) return -1;
        if(a.volume > b.volume) return 1;
        return 0;
    }
}

class Container{
    /**
     * @param {string} id 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} length 
     * @param {Number} weightCapacity 
     */
    constructor(id, width, height, length, weightCapacity){
        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length;
        this.weightCapacity = weightCapacity;
    }
}

export {
    Item,
    Container
}