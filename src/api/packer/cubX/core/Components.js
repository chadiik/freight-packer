
const typeofNumber = 'number';

const _maxHeight = Symbol('maxHeight');
const _validOrientations = Symbol('validOrientations');

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
     * @param {Array<Number|string>} validOrientations
     * @param {Number} stackingCapacity 
     * @param {Boolean} grounded 
     */
    constructor(id, width, height, length, weight, quantity, validOrientations, stackingCapacity, grounded){
        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length;
        this.weight = weight;
        /** @type {Number} */
        this.volume = width * height * length;
        this.quantity = quantity;

        this.validOrientations = validOrientations;

        this.stackingCapacity = stackingCapacity;
        this.grounded = grounded;
    }

    /** @returns {Array<Number>} */
    get validOrientations(){ return this[_validOrientations]; }
    set validOrientations(value){
        if(!value) value = orientations;

        let validOrientations = [];
        for(let i = 0; i < value.length; i++){
            let vo = value[i];
            let orientation = (typeof vo === typeofNumber) ? vo : orientations.indexOf(vo.toLowerCase());
            if(orientation !== -1) validOrientations.push(orientation);
        }

        if(validOrientations.length === 0) validOrientations[0] = 'xyz' || orientations[0];

        this[_validOrientations] = validOrientations;
        this[_maxHeight] = undefined;
    }

    get xyz(){ dimensions[0] = this.width; dimensions[1] = this.height; dimensions[2] = this.length; return dimensions; }
    get zyx(){ dimensions[0] = this.length; dimensions[1] = this.height; dimensions[2] = this.width; return dimensions; }
    get yxz(){ dimensions[0] = this.height; dimensions[1] = this.width; dimensions[2] = this.length; return dimensions; }
    get yzx(){ dimensions[0] = this.height; dimensions[1] = this.length; dimensions[2] = this.width; return dimensions; }
    get zxy(){ dimensions[0] = this.length; dimensions[1] = this.width; dimensions[2] = this.height; return dimensions; }
    get xzy(){ dimensions[0] = this.width; dimensions[1] = this.length; dimensions[2] = this.height; return dimensions; }

    /** @returns {Number} */
    get maxHeight(){
        if(this[_maxHeight] === undefined){
            let maxHeight = 0;
            for(let i = 0; i < this.validOrientations.length; i++){
                let dimensions = this.GetOrientedDimensions(this.validOrientations[i]);
                if(dimensions[1] > maxHeight) maxHeight = dimensions[1];
            }
            this[_maxHeight] = maxHeight;
        }
        
        return this[_maxHeight];
    }

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

    ToString(){
        let q = this.quantity, 
            d = this.width.toFixed(2) + 'x' + this.height.toFixed(2) + 'x' + this.length.toFixed(2),
            id = this.id;
        return q + 'x (' + d + ') - ' + id;
    }

    /** @param {Number} orientation */
    static ResolveOrientation(orientation){
        return orientations[orientation];
    }

    /** @param {Array<Item>} items */
    static GetMinDimensions(items){
        var minDimensions = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

        for(let iItem = 0, numItems = items.length; iItem < numItems; iItem++){
            let item = items[iItem];
            var validOrientations = item.validOrientations;
            for(let iOrient = 0; iOrient < validOrientations.length; iOrient++){
                let orientation = validOrientations[iOrient];
                let dimensions = item.GetOrientedDimensions(orientation);
                if(dimensions[0] < minDimensions[0]) minDimensions[0] = dimensions[0];
                if(dimensions[1] < minDimensions[1]) minDimensions[1] = dimensions[1];
                if(dimensions[2] < minDimensions[2]) minDimensions[2] = dimensions[2];
            }
        }

        return minDimensions;
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

    /**
     * @param {Item} a 
     * @param {Item} b 
     */
    static HeightSort(a, b){
        if(a.maxHeight < b.maxHeight) return -1;
        if(a.maxHeight > b.maxHeight) return 1;
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