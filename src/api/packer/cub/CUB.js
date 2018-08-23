/** @author chadiik <http://chadiik.com/> */

import { Container, Item } from "./Components";
import Debug from "../../debug/Debug";
import { rectanglesFromPoints, linesIntersect, rectangleContainsPoint, rectangleContainsRectangle, reduceRectangles } from "./Math2D";
import Utils from "../../utils/cik/Utils";

const debugging = false;

var running = true;
if(debugging){
    Debug.app.sceneSetup.input.ListenKeys(['right', 'space']);
}

function sleep(ms, force) {
    return new Promise(resolve => {
        if(debugging || force) setTimeout(resolve, ms);
        else resolve();
    });
}

function click(ms, force) {
    return new Promise(resolve => {
        if(debugging || force){
            let tid = undefined;
            function execute(){
                if(tid !== undefined) clearTimeout(tid);
                removeEventListener('mouseup', execute);
                resolve();
            }
            if(ms && ms > 0) tid = setTimeout(execute, ms);
            addEventListener('mouseup', execute);
        }
        else{
            resolve();
        }
    });
}

function keypress(ms, force) {
    return new Promise(resolve => {
        if(debugging || force){
            let tid = undefined;
            function execute(){
                if(tid !== undefined) clearTimeout(tid);
                removeEventListener('keydown', execute);
                resolve();
            }
            if(ms && ms > 0) tid = setTimeout(execute, ms);
            addEventListener('keydown', execute);
        }
        else{
            resolve();
        }
    });
}

function debugLog(...args){
    console.log(...args);
}

/**
 * @param {Region} region * @param {Number} color 
 */
function debugRegion(region, color, solid, duration, checkered){
    var x = region.x, y = region.y, z = region.z, w = region.width, h = region.height, l = region.length;
    var debugUID = Debug.Viz.DrawVolume(x + w/2, y + h/2, z + l/2, w, h, l, color || 0xaaffff, duration || -1, !Boolean(solid), checkered);
    return debugUID;
}

/**
 * @param {Region} region * @param {Number} color 
 */
async function debugRegionBlink(region, color, solid, checkered, blinks, onDuration, offDuration){
    for(let i = 0; i < blinks; i++){
        debugRegion(region, color, solid, onDuration, checkered);
        await sleep(onDuration + offDuration);
    }
}

/** @param {Array<string>} */
function debugClear(uids){
    if(uids){
        uids.forEach(uid => {
            Debug.Viz.RemoveObjectByUID(uid);
        });
    }
    else{
        Debug.Viz.ClearAll();
    }
}

function numberFormatDefault(n){ return n; }

function numberFormat(n, d){
    if(n > Number.MAX_SAFE_INTEGER - 2) return 'MAX';
    let nStr = Math.round(n) !== n ? n.toFixed(d) : n;
    return nStr;
}

/** @typedef FormatParams @property {Function} nf number formatting function */
/** @param {string} str @param {FormatParams} params @param {Array<*>} args */
function format(str, params, ...args){
    if(params.nf === undefined) params.nf = numberFormatDefault;
    let index = 0;
    while( (index = str.indexOf('@', index)) !== -1 ){
        if(str[index - 1] !== '\\'){
            let a = args.shift();
            if(typeof a === 'number') a = params.nf(a);
            str = str.replace('@', a);
        }
        index += 1;
    }
    return str;
}

const epsilon = Math.pow(2, -52);
const smallValue = .000001;
const smallValueSqrt = .001;
const maxWeightValue = Number.MAX_SAFE_INTEGER;

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
var tempRegion2 = new Region();
var tempCorners = [0];
var tempPoints = [0];
var tempPoints2 = [0];

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
     * @param {CUBParams} params
     */
    constructor(container, params){
        this.container = container;
        this.params = params;
        
        /** @type {Array<PackedItem>} */
        this.packedItems = [];
        /** @type {Array<Item>} */
        this.unpackedItems = [];

        var firstRegion = new Region(0, 0, 0, container.width, container.height, container.length, 0);
        firstRegion.SetWeights(0, this.container.weightCapacity, 0);
        /** @type {Array<Region>} */
        this.regions = [firstRegion];

        /** @type {Array<PackedItem>} */
        this.tops = [];

        this.cumulatedWeight = 0;
    }

    /** @param {Array<Item>} items */
    set items(items){
        this.assistant = new PackingAssistant(items, this);
    }

    /** @param {PackedItem} item */
    SetPacked(item){
        this.cumulatedWeight += item.ref.weight;
        this.packedItems.push(item);
        this.tops.push(item);
    }

    /** @param {Item} item */
    SetUnpacked(item){
        this.unpackedItems.push(item);
    }

    /** @param {Number} weight */
    WeightPass(weight){
        return this.cumulatedWeight + weight <= this.container.weightCapacity;
    }

    /** @param {Region} region * @param {Region} fit * @returns {Boolean} false if region has been deleted */
    Occupy(region, fit){

        /*console.group('Regions');
        this.regions.forEach(region => {
            console.log(region.ToString());
        });
        console.groupEnd();*/

        // Subtracts fit from region and calculates new bounding regions
        var newRegions = region.Subtract(fit, this.assistant.minRegionAxis);

        // Add new bounding regions if any
        if(newRegions) this.regions.push(...newRegions);

        // Check that region is still valid, otherwise remove it
        if(region.length < this.assistant.minRegionAxis){
            let regionIndex = this.regions.indexOf(region);
            this.regions.splice(regionIndex, 1);
            return false;
        }

        var debugUIDs = [];
        if(!newRegions) newRegions = [];
        newRegions.push(region);
        //console.group('Occupy');
        newRegions.forEach(region => {
            //console.log(region.ToString());
            debugUIDs.push(debugRegion(region, 0xffff0000, true, -1, true));
        });
        //console.groupEnd();

        debugClear(debugUIDs);

        return true;
    }

    static SortByN(a, b){
        if(isNaN(a.n) || isNaN(b.n)) return 0;

        if(a.n < b.n) return -1;
        if(a.n > b.n) return 1;
        return 0;
    }

    /** @param {Item} item */
    GetPlacementWithHighestScore(item){
        var numRegions = this.regions.length;
        var volumeItem = item.volume;
        var validOrientations = item.validOrientations;

        /** @typedef PlacementScore @property {Number} region region index @property {Number} orientation orientation index @property {Number} n score */
        /** @type {Array<PlacementScore>} */
        var regionScoreTable = [],
            orientationScoreTable = [];
        var testSuccessfulRegions = 4;
        // Try to fit in sorted regions
        for(let iRegion = 0; iRegion < numRegions && testSuccessfulRegions > 0; iRegion++){
            let region = this.regions[iRegion];

            if(region.volume > volumeItem){
                let dummyRegion = tempRegion2.Copy(region);

                orientationScoreTable.length = 0;
                for(let iOrient = 0; iOrient < validOrientations.length; iOrient++){
                    let orientation = validOrientations[iOrient];

                    let dimensions = item.GetOrientedDimensions(orientation);
                    let regionFitTest = region.FitTest(smallValue, 
                        dimensions[0], dimensions[1], dimensions[2], 
                        item.weight, item.grounded);
                    
                    if(regionFitTest !== false){

                        testSuccessfulRegions--;

                        // Subtracts fit from region and calculates new bounding regions
                        let newRegions = dummyRegion.Subtract(regionFitTest, this.assistant.minRegionAxis);
                        if(newRegions === undefined) newRegions = [];
                        if(dummyRegion.length > this.assistant.minRegionAxis)
                            newRegions.push(dummyRegion);

                        let orientationScore = {
                            region: iRegion,
                            orientation: orientation, 
                            n: this.assistant.RateFit(item, regionFitTest, newRegions)
                        };
                        orientationScoreTable.push(orientationScore);
                    }
                }

                if(orientationScoreTable.length > 0){
                    orientationScoreTable.sort(PackedContainer.SortByN);
                    let regionScore = orientationScoreTable.pop();
                    regionScoreTable.push(regionScore);
                }
            }
        }

        if(regionScoreTable.length === 0){
            return false;
        }

        regionScoreTable.sort(PackedContainer.SortByN);
        let highestScore = regionScoreTable.pop();
        return highestScore;
    }

    /** @param {Item} item */
    FitLessWaste(item){

        // General weight check
        if(this.WeightPass(item.weight) === false) return false;
        
        let highestScore = this.GetPlacementWithHighestScore(item);

        if(highestScore === false){
            console.log('revertedToRegular');
            return this.FitRegular(item);
        }

        let region = this.regions[highestScore.region];
        let orientation = item.validOrientations[highestScore.orientation];
        let dimensions = item.GetOrientedDimensions(orientation);
        let regionFitTest = region.FitTest(smallValue, 
            dimensions[0], dimensions[1], dimensions[2],
            item.weight, item.grounded);
        if(regionFitTest !== false){
            return this.CommitFit(item, region, regionFitTest, orientation);
        }

        return false;
    }

    /** @param {Item} item */
    GetFirstFit(item){
        var validOrientations = item.validOrientations;
        var numRegions = this.regions.length;

        // Try to fit in sorted regions
        for(let iRegion = 0; iRegion < numRegions; iRegion++){
            let region = this.regions[iRegion];

            for(let iOrient = 0; iOrient < validOrientations.length; iOrient++){
                let orientation = validOrientations[iOrient];

                let dimensions = item.GetOrientedDimensions(orientation);

                // Fit test (success: Region, failure: false)
                let regionFitTest = region.FitTest(smallValue, 
                    dimensions[0], dimensions[1], dimensions[2],
                    item.weight, item.grounded);
                if(regionFitTest !== false){

                    // Stacking & weight test 

                    /** @typedef Placement @property {Number} region region index @property {Number} orientation orientation index */
                    /** @type {Placement} */
                    let result = {region: iRegion, orientation: orientation};
                    return result;
                }
            }
        }

        return false;
    }

    /** @param {Item} item */
    FitRegular(item){

        // General weight check
        if(this.WeightPass(item.weight) === false) return false;

        var firstFit = this.GetFirstFit(item);
        if(firstFit){

            let region = this.regions[firstFit.region];
            let orientation = item.validOrientations[firstFit.orientation];
            let dimensions = item.GetOrientedDimensions(orientation);

            let regionFitTest = region.FitTest(smallValue, 
                dimensions[0], dimensions[1], dimensions[2],
                item.weight, item.grounded);
            if(regionFitTest !== false){

                return this.CommitFit(item, region, regionFitTest, orientation);
            }
        }

        return false;
    }

    /** @param {Item} item @param {Region} containingRegion @param {Region} placement @param {Number} orientation */
    CommitFit(item, containingRegion, placement, orientation){
        
        placement.SetWeights(item.weight, 0, item.stackingCapacity);

        let numPackedItems = this.packedItems.length;

        // Make sure that the new 'packed item to be' does not collide with a previous one
        for(let iPacked = 0; iPacked < numPackedItems; iPacked++){
            let packedItem = this.packedItems[iPacked];
            // Creates temporary region for following calculations
            let packedRegion = tempRegion2.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, 0);
            packedRegion.SetWeights(packedItem.ref.weight, 0, packedItem.ref.stackingCapacity);
            
            let intersects = packedRegion.Intersects(-smallValue, placement);
            if(intersects){
                console.log('revertedToRegular - CommitFit');
                return this.FitRegular(item);
            }
        }

        // Create a new packed item
        let packedItem = new PackedItem(item, placement.x, placement.y, placement.z, placement.width, placement.height, placement.length, orientation);
        /**/let debugUID = debugRegion(placement, 0xffff0000, true);

        // Reserve the tested sub region: regionFitTest from the containing region: region
        let regionRemains = this.Occupy(containingRegion, placement);

        /**/debugClear([debugUID]);
        debugRegion(placement, 0xffffffff, false);

        return packedItem;
    }

    ProcessRegionsPreferredX(){
        var regions = this.regions,
            numRegions = regions.length;
        var containerWidth = this.container.width;

        for(let iRegion = 0; iRegion < numRegions; iRegion++){
            let region = regions[iRegion];

            if(Math.abs(region.x) < smallValue) region.preferredX = 0;
            else if(Math.abs(region.x + region.width - containerWidth) < smallValue) region.preferredX = 1;
        }
    }

    ProcessRegionsMergeExpand(){
        var regions = this.regions,
            numRegions = regions.length;

        var toInt = 1 / smallValue;
        function coordID(value){
            return Math.floor(value * toInt);
        }

        /** @typedef Level @property {Number} y @property {Array<Rectangle>} rectangles */
        /** @type {Array<Level>} */
        var levels = {};

        var neighbours = [], rectangles = [];
        for(let iRegion = 0; iRegion < numRegions; iRegion++){
            let regionA = regions[iRegion];

            if(regionA.weightCapacity > smallValue){
                neighbours.length = 0;
                neighbours.push(iRegion);
                
                for(let jRegion = iRegion + 1; jRegion < numRegions; jRegion++){
                    let regionB = regions[jRegion];

                    if(regionB.weightCapacity > smallValue && Math.abs(regionA.y - regionB.y) < smallValue){
                        let intersects = regionA.Intersects(smallValue, regionB);
                        if(intersects){
                            neighbours.push(jRegion);
                        }
                    }
                }

                let numNeighbours = neighbours.length;
                if(numNeighbours > 1){
                    rectangles.length = 0;

                    for(let iNeighbour = 0; iNeighbour < numNeighbours; iNeighbour++){
                        let neighbourA = regions[neighbours[iNeighbour]];

                        for(let jNeighbour = iNeighbour + 1; jNeighbour < numNeighbours; jNeighbour++){
                            let neighbourB = regions[neighbours[jNeighbour]];

                            let connectedNeighbours = neighbourA.ConnectFloorRects(neighbourB);
                            rectangles.push(...connectedNeighbours);
                        }
                    }

                    if(rectangles.length > 0){
                        let yCat = coordID(regionA.y);
                        if(levels[yCat] === undefined) levels[yCat] = {y: regionA.y, rectangles: []};
                        levels[yCat].rectangles.push(...rectangles);
                    }
                }
            }
        }

        var levelsYCats = Object.keys(levels);
        for(let iYCat = 0, numYCats = levelsYCats.length; iYCat < numYCats; iYCat++){
            /** @type {Level} */
            let level = levels[levelsYCats[iYCat]];
            let rectangles = level.rectangles;
            let regionY = level.y;
            let regionHeight = this.container.height - regionY;
            
            reduceRectangles(rectangles);
            for(let iRect = 0, numRects = rectangles.length; iRect < numRects; iRect++){
                let rect = rectangles[iRect];
                let rx = rect.p1.x, ry = rect.p1.y;
                let rw = rect.p3.x - rx, rh = rect.p3.y - ry;

                // Calculate preferred packing side based on center point relative to container
                let preferredX = (rx.x + rw / 2) < (this.container.width / 2) ? 0 : 1;
                let newRegion = new Region(rx, regionY, ry, rw, regionHeight, rh, preferredX);
                newRegion.SetWeights(rect.weight, rect.weightCapacity, rect.stackingCapacity);
                this.regions.push(newRegion);
            }
        }
    }

    ProcessRegionsForZeroRegions(){
        var regions = this.regions;
        var minRegionAxis = this.assistant.minRegionAxis;
        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let region = regions[iRegion];
            if(region.width < minRegionAxis || region.height < minRegionAxis || region.length < minRegionAxis){
                regions.splice(iRegion, 1);
                iRegion--;
            }
        }
    }

    /** @param {PackedItem} packedItem @param {Boolean} [harsh] default = false */
    ProcessRegionsPerPackedItem(packedItem, harsh){
        var regions = this.regions;
        let itemVolume = packedItem.ref.volume;
        
        // Creates temporary region for following calculations
        let packedRegion = tempRegion.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, 0);
        packedRegion.SetWeights(packedItem.ref.weight, 0, packedItem.ref.stackingCapacity);

        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let region = regions[iRegion];

            if(itemVolume > region.volume && packedRegion.ContainsRegion(smallValue, region)){
                regions.splice(iRegion, 1);
                iRegion--;
                console.log('Contained region' + iRegion + ' deleted');
                continue;
            }

            if(packedRegion.Intersects(-smallValue, region)){

                if(harsh){
                    console.log('\tIntersecting region' + iRegion + ' deleted (!)');
                    regions.slice(iRegion, 1);
                    iRegion--;
                    continue;
                }
                
                let regionRemains = this.Occupy(region, packedRegion);
                iRegion --;
            }
        }
    }

    ProcessRegionsForPackedItems(harsh){
        var packedItems = this.packedItems,
            numPackedItems = packedItems.length;

        for(let iItem = 0; iItem < numPackedItems; iItem++){
            let packedItem = packedItems[iItem];
            this.ProcessRegionsPerPackedItem(packedItem, harsh);
        }
    }

    ProcessRegionsEnclosed(){
        var regions = this.regions;

        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let regionA = regions[iRegion];
            let volumeA = regionA.volume;

            for(let jRegion = iRegion + 1; jRegion < regions.length; jRegion++){
                let regionB = regions[jRegion];
                let volumeB = regionB.volume;

                if(volumeA < volumeB){
                    // If a A is completely contained within B, remove the A
                    if(regionB.ContainsRegion(smallValue, regionA)){
                        regions.splice(iRegion, 1);
                        iRegion--;
                        break;
                    }
                }
                else{
                    // If a B is completely contained within A, remove the B
                    if(regionA.ContainsRegion(smallValue, regionB)){
                        regions.splice(jRegion, 1);
                        jRegion--;
                    }
                }
            }
        }
    }

    ProcessRegions(){
        var regions = this.regions;

        if(global.processRegionsCount === undefined) global.processRegionsCount = 0;

        // Recalculate preferred insertion side per region (left or right)
        this.ProcessRegionsPreferredX();

        // Removes regions that are completely enclosed in packed volumes, and correct any intersecting ones
        this.ProcessRegionsForPackedItems();

        // Merge and expand free regions (can span several packed item tops)
        this.ProcessRegionsMergeExpand();

        // Removes unuseable regions
        this.ProcessRegionsForZeroRegions();

        // Removes regions that are completely enclosed in larger regions
        this.ProcessRegionsEnclosed();

        // Sort by z (first) and volume (second)
        regions.sort(Region.SortDeepestSmallest);

        this.packedItems.sort(PackedItem.Sort);

        /*console.group('ProcessRegions');
        regions.forEach(region => {
            console.log(region.ToString());
        });
        console.groupEnd();*/
    }
}

class PackingAssistant{
    /**
     * @param {Array<Item>} items 
     * @param {PackedContainer} packedContainer 
     */
    constructor(items, packedContainer){

        global.assistant = this;
        this.debugRegion = function(regionIndex){

        }

        this.params = {
            minDimensionsNoWasteFactor: [1, 1, 1]
        };

        this.workingItems = items;
        this.packedContainer = packedContainer;
        this.workingRegions = this.packedContainer.regions;

        this.minRegionAxis = smallValue;

        this.workingItemsSortFunction = Item.VolumeSort;

        // Sort items by volume ascending
        this.workingItems.sort(this.workingItemsSortFunction);

        var minDimensionsSearchSet = this.workingItems;
        //minDimensionsSearchSet = [this.workingItems[0]];
        this.minDimensions = this.GetMinDimensionsOverall(minDimensionsSearchSet);
    }

    /** @param {Array<Item>} items */
    GetMinDimensionsOverall(items){
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
     * 
     * @param {Item} fittedItem 
     * @param {Region} fit 
     * @param {Array<Region>} newRegions 
     */
    RateFit(fittedItem, fit, newRegions){
        
        // Try out a recursive deep rate fit

        var containerLength = this.packedContainer.container.length;
        var minDimensions = this.minDimensions;
        var minDimensionsNoWasteFactor = this.params.minDimensionsNoWasteFactor;

        var minZScore = 1 - (fit.z + fit.length) / containerLength; // 0-1

        // new regions usability score
        var minWasteScore = 1; // have completely filled the region if newRegions.length === 0
        if(newRegions.length > 0){
            minWasteScore = 0;
            for(let iRegion = 0; iRegion < newRegions.length; iRegion++){
                let region = newRegions[iRegion];
                
                let scoreW = 0, scoreH = 0, scoreL = 0;
                if(region.width >= minDimensions[0] && (region.width - minDimensions[0]) < minDimensions[0] * minDimensionsNoWasteFactor[0]) scoreW += 1;
                if(region.height >= minDimensions[1] && (region.width - minDimensions[1]) < minDimensions[1] * minDimensionsNoWasteFactor[1]) scoreH += 1;
                if(region.length >= minDimensions[2] && (region.width - minDimensions[2]) < minDimensions[2] * minDimensionsNoWasteFactor[2]) scoreL += 1;
                
                minWasteScore += scoreW * .5 + scoreH * .3 + scoreL * .2;
            }
            minWasteScore /= newRegions.length;
        }

        var minZ_weight = this.packedContainer.params.minZ_weight;
        var minWaste_weight = this.packedContainer.params.minWaste_weight;
        var score = minZScore * minZ_weight + minWasteScore * minWaste_weight;
        return score;
    }
}

/**
 * @typedef CUBParams
 * @property {Number} minZ_weight score for tightly packing in length (Z)
 * @property {Number} minWaste_weight score for minimizing wasted space
 */

/** @type {CUBParams} */
const defaultParams = {
    minZ_weight: .9,
    minWaste_weight: .1
};

/**
 * 
 * @param {Container} container 
 * @param {Array<Item>} items // this array (and content) will be changed/emptied
 * @param {CUBParams} params 
 */
async function pack(container, items, params){

    this.params = Utils.AssignUndefined(params, defaultParams);
    console.log('CUBParams:', this.params);

    Debug.Viz.SetPackingSpaceVisibility(false);

    var packedContainer = new PackedContainer(container, this.params);
    packedContainer.items = items;

    var iItem = items.length - 1;

    // Helper function
    function unpackItem(index){
        let item = items[index];
        packedContainer.SetUnpacked(item);
        items.splice(index, 1);
        iItem--;
    }

    // Helper function
    /** @param {Number} index * @param {PackedItem} item */
    function packItem(index, item){
        packedContainer.SetPacked(item);
        
        item.ref.quantity--;
        if(item.ref.quantity === 0){
            items.splice(index, 1);
            iItem--;
        }
    }

    while(items.length > 0){
        let item = items[iItem];

        // Clean-up regions
        packedContainer.ProcessRegions();
        /**/await sleep(16);

        // Try to pack item
        let packedItem = packedContainer.FitLessWaste(item);
        if( packedItem === false ){

            /**/debugLog('item fitting failed.');
            unpackItem(iItem);
        }
        else{

            packItem(iItem, packedItem);
        }

        /**/await sleep(16);
    }

    packedContainer.packedItems.sort(PackedItem.Sort);

    debugClear();
    Debug.Viz.SetPackingSpaceVisibility(true);

    return packedContainer;
}

export {
    pack
};