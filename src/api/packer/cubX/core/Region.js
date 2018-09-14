import { epsilon, smallValue, smallValueSqrt, rectanglesFromPoints, linesIntersect, rectangleContainsPoint, reduceRectangles } from "./Math2D";

/** @typedef Rectangle @property {Vec2} p1 @property {Vec2} p2 @property {Vec2} p3 @property {Vec2} p4 
 * @property {Number} weight @property {Number} weightCapacity @property {Number} stackingCapacity 
 */

/**
 * @param {Rectangle | Array<Rectangle>} rect 
 * @param {Number} weight 
 * @param {Number} weightCapacity 
 * @param {Number} stackingCapacity 
 */
function setRectangleWeights(rect, weight, weightCapacity, stackingCapacity){
    if(rect instanceof Array){
        for(let i = 0; i < rect.length; i++){
            rect[i].weight = weight;
            rect[i].weightCapacity = weightCapacity;
            rect[i].stackingCapacity = stackingCapacity;
        }
    }
    else{
        rect.weight = weight;
        rect.weightCapacity = weightCapacity;
        rect.stackingCapacity = stackingCapacity;
    }
}

const maxWeightValue = Number.MAX_SAFE_INTEGER;

class Region{
    /**
     * @param {Number} x * @param {Number} y * @param {Number} z * @param {Number} width * @param {Number} height * @param {Number} length * @param {Number} preferredX 
     */
    constructor(x, y, z, width, height, length, preferredX){
        this.Set(x, y, z, width, height, length, preferredX);
        this.SetWeights(0, maxWeightValue, maxWeightValue);
    }

    /**
     * @param {Number} x * @param {Number} y * @param {Number} z * @param {Number} width * @param {Number} height * @param {Number} length * @param {Number} preferredX 
     */
    Set(x, y, z, width, height, length, preferredX){
        this.x = x; this.y = y; this.z = z;
        this.width = width; this.height = height; this.length = length;
        this.preferredX = preferredX;
        return this;
    }
    
    /**
     * @param {Number} weight 
     * @param {Number} weightCapacity 
     * @param {Number} stackingCapacity 
     */
    SetWeights(weight, weightCapacity, stackingCapacity){
        this.weight = weight;
        this.weightCapacity = weightCapacity;
        this.stackingCapacity = stackingCapacity;
    }

    /** @param {Region} region */
    Copy(region){
        this.Set(region.x, region.y, region.z, region.width, region.height, region.length, region.preferredX);
        this.SetWeights(this.weight, this.weightCapacity, this.stackingCapacity);
        return this;
    }

    get volume(){
        return this.width * this.height * this.length;
    }

    /**
     * @param {Number} offset offsets the region by this before calculating corners 
     * @returns {Array<Number>} 8 corners, length = 24 + center point [24, 25, 26]
     */
    GetCorners(offset){
        var x = this.x - offset, y = this.y - offset, z = this.z - offset, w = this.width + offset * 2, h = this.height + offset * 2, l = this.length + offset * 2;

        tempCorners[0] = x;       tempCorners[1] = y;       tempCorners[2] = z;         // 0:
        tempCorners[3] = x + w;   tempCorners[4] = y;       tempCorners[5] = z;         // 0:w
        tempCorners[6] = x;       tempCorners[7] = y + h;   tempCorners[8] = z;         // 0:h
        tempCorners[9] = x + w;   tempCorners[10] = y + h;  tempCorners[11] = z;        // 0:wh

        tempCorners[12] = x;      tempCorners[13] = y;      tempCorners[14] = z + l;    // 1:
        tempCorners[15] = x + w;  tempCorners[16] = y;      tempCorners[17] = z + l;    // 1:w
        tempCorners[18] = x;      tempCorners[19] = y + h;  tempCorners[20] = z + l;    // 1:h
        tempCorners[21] = x + w;  tempCorners[22] = y + h;  tempCorners[23] = z + l;    // 1:wh

        tempCorners[24] = x + w/2;tempCorners[25] = y + h/2;tempCorners[26] = z + l/2;  // center

        return tempCorners;
    }

    /**
     * @param {Array} result
     * @returns {Array<Number>} 4 corners, length = 12
     */
    GetFloorPoints(result){
        if(result === undefined) result = tempPoints;
        var x = this.x, y = this.y, z = this.z, w = this.width, l = this.length;

        result[0] = x;         result[1] = y;     result[2] = z;
        result[3] = x + w;     result[4] = y;     result[5] = z;
        result[6] = x + w;     result[7] = y;     result[8] = z + l;
        result[9] = x;         result[10] = y;    result[11] = z + l;

        return result;
    }

    /**
     * @param {Number} offset offsets the region by this before checking * @param {Number} px * @param {Number} py * @param {Number} pz 
     */
    ContainsPoint(offset, px, py, pz){
        var x = this.x - offset, y = this.y - offset, z = this.z - offset, w = this.width + offset * 2, h = this.height + offset * 2, l = this.length + offset * 2;
        return px > x && px < x + w
            && py > y && py < y + h
            && pz > z && pz < z + l;
    }

    /** @param {Number} offset offsets the region by this before checking * @param {Region} subRegion */
    ContainsRegion(offset, subRegion){
        var x = this.x - offset, y = this.y - offset, z = this.z - offset, w = this.width + offset * 2, h = this.height + offset * 2, l = this.length + offset * 2;
        var rx = subRegion.x, ry = subRegion.y, rz = subRegion.z, rw = subRegion.width, rh = subRegion.height, rl = subRegion.length;
        return rx > x && rx + rw < x + w
            && ry > y && ry + rh < y + h
            && rz > z && rz + rl < z + l;
    }

    /** @param {Number} offset offsets the region by this before checking * @param {Region} other */
    Intersects(offset, other){
        var x = this.x - offset, y = this.y - offset, z = this.z - offset, w = this.width + offset * 2, h = this.height + offset * 2, l = this.length + offset * 2;
    
        return x <= other.x + other.width && x + w >= other.x
                && y <= other.y + other.height && y + h >= other.y 
                && z <= other.z + other.length && z + l >= other.z;
    }

    /** @param {Number} offset offsets the region by this before checking * @param {Number} width * @param {Number} height * @param {Number} length
     * @param {Number} weight @param {Boolean} grounded
     * @param {Region} [result]
     */
    FitTest(offset, width, height, length, weight, grounded, result){
        if(!result) result = tempRegion;

        if(grounded && this.y > smallValue) return false;

        // Check that all dimensions fit
        let fit = width < this.width + offset * 2 && height < this.height + offset * 2 && length < this.length + offset * 2;
        if(fit){

            let weightFit = weight <= this.weightCapacity;
            if(weightFit){

                // Calculate x based on preferred side
                let x = this.preferredX !== 0 ? this.x + this.width - width : this.x;
                result.Set(x, this.y, this.z, width, height, length, this.preferredX);
                result.SetWeights(weight, 0, maxWeightValue);
                return result;
            }
        }

        return false;
    }

    /** @param {Region} region * @param {Number} minRegionAxis */
    Subtract(region, minRegionAxis){
        /** @type {Array<Region>} */
        var newRegions;
        
        // Calculate a new east region
        let axis = region.x + region.width;
        let size = this.x + this.width - axis;
        if(size > minRegionAxis){
            let east = new Region(axis, this.y, this.z, size, this.height, this.length, 0);
            east.SetWeights(0, this.weightCapacity, this.stackingCapacity);
            if(newRegions === undefined) newRegions = [];
            newRegions.push(east);
        }

        // Calculate a new west region
        axis = this.x;
        size = region.x - axis;
        if(size > minRegionAxis){
            let west = new Region(axis, this.y, this.z, size, this.height, this.length, 1);
            west.SetWeights(0, this.weightCapacity, this.stackingCapacity);
            if(newRegions === undefined) newRegions = [];
            newRegions.push(west);
        }

        // Calculate a new over/up region
        axis = region.y + region.height;
        size = this.y + this.height - axis;
        if(size > minRegionAxis){
            let over = new Region(region.x, axis, region.z, region.width, size, region.length, 0); // todo: add overhang var? // togglePreferredX based on pre-packed weight distribution?
            over.SetWeights(0, region.stackingCapacity, region.stackingCapacity);
            if(newRegions === undefined) newRegions = [];
            newRegions.push(over);
        }

        // Calculate a new south region
        axis = this.z;
        size = region.z - axis;
        if(false && size > minRegionAxis){
            let south = new Region(this.x, this.y, axis, this.width, this.height, size, 0); // todo togglePreferredX based on pre-packed weight distribution?
            south.SetWeights(0, this.weightCapacity, this.stackingCapacity);
            if(newRegions === undefined) newRegions = [];
            newRegions.push(south);
        }

        // Set this as new north/front region
        axis = region.z + region.length;
        size = this.z + this.length - axis;
        this.z = axis;
        this.length = size;
        this.SetWeights(0, this.weightCapacity, this.stackingCapacity);

        return newRegions;
    }

    /** @param {Region} other */
    ConnectFloorRects(other){
        var ptsA = this.GetFloorPoints(tempPoints),
            ptsB = other.GetFloorPoints(tempPoints2);

        var adjacent = 0;
        var intersections = [];
        for(let iA = 0; iA < 12; iA += 3){
            let nextA = iA + 3 === 12 ? 0 : iA + 3;
            let ax = ptsA[iA], az = ptsA[iA + 2], nax = ptsA[nextA], naz = ptsA[nextA + 2];

            for(let iB = 0; iB < 12; iB += 3){
                let nextB = iB + 3 === 12 ? 0 : iB + 3;
                let bx = ptsB[iB], bz = ptsB[iB + 2], nbx = ptsB[nextB], nbz = ptsB[nextB + 2];

                if(
                    rectangleContainsPoint(smallValue, ptsA[0], ptsA[2], ptsA[6] - ptsA[0], ptsA[8] - ptsA[2], bx, bz)
                    || rectangleContainsPoint(smallValue, ptsB[0], ptsB[2], ptsB[6] - ptsB[0], ptsB[8] - ptsB[2], ax, az)
                ){
                    adjacent++;
                }

                let intersection = linesIntersect(ax, az, nax, naz, bx, bz, nbx, nbz);
                if(intersection &&
                    (
                        rectangleContainsPoint(smallValue, ptsA[0], ptsA[2], ptsA[6] - ptsA[0], ptsA[8] - ptsA[2], intersection.x, intersection.y)
                        || rectangleContainsPoint(smallValue, ptsB[0], ptsB[2], ptsB[6] - ptsB[0], ptsB[8] - ptsB[2], intersection.x, intersection.y)
                    )
                ){
                    intersections.push(intersection);
                }
            }
        }

        if(adjacent > 1){
            for(let i = 0; i < 12; i += 3) intersections.push({x: ptsA[i], y: ptsA[i + 2]}, {x: ptsB[i], y: ptsB[i + 2]});
        }
        else{
            intersections.length = 0;
        }

        var rectangles = rectanglesFromPoints(intersections);

        let rectA = { p1: {x: ptsA[0], y: ptsA[2]}, p2: {x: ptsA[3], y: ptsA[5]}, p3: {x: ptsA[6], y: ptsA[8]}, p4: {x: ptsA[9], y: ptsA[11]} };
        let rectB = { p1: {x: ptsB[0], y: ptsB[2]}, p2: {x: ptsB[3], y: ptsB[5]}, p3: {x: ptsB[6], y: ptsB[8]}, p4: {x: ptsB[9], y: ptsB[11]} };
        rectangles.push(rectA, rectB);

        reduceRectangles(rectangles);

        setRectangleWeights(rectangles, this.weight + other.weight, this.weightCapacity + other.weightCapacity, this.stackingCapacity + other.stackingCapacity);
        
        return rectangles;
    }

    ToString(){
        return format('R(p:[@, @, @], d:[@, @, @], w:@, wCap:@, sCap:@)', {nf: function(n){
                return numberFormat(n, 2);
            }},
            this.x, this.y, this.z,
            this.width, this.height, this.length,
            this.weight, this.weightCapacity, this.stackingCapacity
        );
    }
    
    /**
     * Deepest to front, smallest to largest
     * @param {Region} a * @param {Region} b 
     */
    static SortDeepestSmallest(a, b){
        if(a.z < b.z) return -1;
        if(a.z > b.z)return 1;
        if(a.volume < b.volume) return -1;
        if(a.volume > b.volume) return 1;
        return 0;
    }
}

var tempRegion = new Region();
var tempCorners = [0];
var tempPoints = [0];
var tempPoints2 = [0];

export default Region;