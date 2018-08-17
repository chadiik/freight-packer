
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
     */
    constructor(id, width, height, length, weight, quantity, validOrientations){
        this.id = id;
        this.width = width;
        this.height = height;
        this.length = length;
        this.weight = weight;
        /** @type {Number} */
        this.volume = width * height * length;
        this.quantity = quantity;

        this.validOrientations = validOrientations;
    }

    /** @returns {Array<Number>} */
    get validOrientations(){ return this[_validOrientations]; }
    set validOrientations(value){
        if(value === undefined) value = orientations;

        let validOrientations = [];
        for(let i = 0; i < value.length; i++){
            let vo = value[i];
            let orientation = (typeof vo === typeofNumber) ? vo : orientations.indexOf(vo.toLowerCase());
            if(orientation !== -1) validOrientations.push(orientation);
        }

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