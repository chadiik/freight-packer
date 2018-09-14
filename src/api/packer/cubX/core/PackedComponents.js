import { epsilon, smallValue, smallValueSqrt } from "./Math2D";
import { Item, Container } from "./Components";

class PackedItem{

    /**
     * @param {Item} ref 
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} packedWidth
     * @param {Number} packedHeight
     * @param {Number} packedLength
     * @param {Number} orientation 
     */
    constructor(ref, x, y, z, packedWidth, packedHeight, packedLength, orientation){
        this.ref = ref;
        this.x = x; this.y = y; this.z = z;
        this.packedWidth = packedWidth; this.packedHeight = packedHeight; this.packedLength = packedLength;
        this.orientation = orientation;
    }

    /** @param {PackedItem} a * @param {PackedItem} b */
    static DepthSort(a, b){
        let az = a.z + a.packedLength,
            bz = b.z + b.packedLength;
        if(az + smallValue < bz) return -1;
        if(az > bz + smallValue) return 1;
        if(a.y < b.y) return -1;
        if(a.y > b.y) return 1;
        if(a.ref.volume > b.ref.volume + smallValue) return -1;
        if(a.ref.volume + smallValue < b.ref.volume) return 1;
        return 0;
    }

    /** @param {PackedItem} a * @param {PackedItem} b */
    static Sort(a, b){
        if(a.z + smallValue < b.z){
            if(a.z + a.packedLength > b.z && a.y > b.y) return 1;
            return -1;
        }
        if(b.z + smallValue < a.z){
            if(b.z + b.packedLength > a.z && b.y > a.y) return 1;
            return 1;
        }
        if(a.y < b.y) return -1;
        if(a.y > b.y) return 1;
        if(a.ref.volume > b.ref.volume + smallValue) return -1;
        if(a.ref.volume + smallValue < b.ref.volume) return 1;
        return 0;
    }
}

class PackedContainer{
    /**
     * @param {Container} container 
     */
    constructor(container){
        this.container = container;
        
        /** @type {Array<PackedItem>} */
        this.packedItems = [];
        /** @type {Array<Item>} */
        this.unpackedItems = [];

        this.cumulatedWeight = 0;
    }

    /** @param {PackedItem} item */
    Pack(item){
        this.cumulatedWeight += item.ref.weight;
        this.packedItems.push(item);
    }

    /** @param {Item} item */
    Unpack(item){
        this.unpackedItems.push(item);
    }

    /** @param {Number} weight */
    WeightPass(weight){
        return this.cumulatedWeight + weight <= this.container.weightCapacity;
    }
}

export {
    PackedItem,
    PackedContainer
};