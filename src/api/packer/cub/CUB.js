import { Container, Item } from "./Components";
import Debug from "../../debug/Debug";

const debugging = true;

var running = true;
if(debugging){
    Debug.app.sceneSetup.input.ListenKeys(['right', 'space']);
}

async function debugUser(){
    await sleep(16);
    var input = Debug.app.sceneSetup.input;
    if(input.keys['right']) running = false;
    if(input.keys['space']) running = true;
    while(!running){
        await sleep(200);
        if(input.keys['right']) break;
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        if(debugging) setTimeout(resolve, ms);
        else resolve();
    });
}

function click(ms) {
    return new Promise(resolve => {
        if(debugging){
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

const smallValue = .000001;

class Wall{
    /**
     * @param {Number} axis 0, 1 or 2 for x, y or z
     * @param {Number} distance 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(axis, distance, x, y, width, height){
        this.axis = axis;
        this.distance = distance;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Region{
    /**
     * @param {Number} x * @param {Number} y * @param {Number} z * @param {Number} width * @param {Number} height * @param {Number} length * @param {Number} preferredX 
     */
    constructor(x, y, z, width, height, length, preferredX){
        this.Set(x, y, z, width, height, length, preferredX);
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

    get volume(){
        return this.width * this.height * this.length;
    }

    /**
     * @param {Number} offset offsets the region by this before calculating corners 
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

    /** @param {Number} offset offsets the region by this before checking * @param {Number} width * @param {Number} height * @param {Number} length */
    FitTest(offset, width, height, length){
        // Check that all dimensions fit
        var fit = width < this.width + offset * 2 && height < this.height + offset * 2 && length < this.length + offset * 2;
        if(fit){
            // Calculate x based on preferred side
            let x = this.preferredX !== 0 ? this.x + this.width - width : this.x;
            tempRegion.Set(x, this.y, this.z, width, height, length, this.preferredX);
            return tempRegion;
        }

        return false;
    }

    /** @param {Region} region * @param {Number} minRegionAxis */
    async Subtract(region, minRegionAxis){
        var newRegions;

        /**/var debugUIDs = [];
        /**/debugUIDs.push(debugRegion(region, 0xff000000));
        
        // Calculate a new east region
        let axis = region.x + region.width;
        let size = this.x + this.width - axis;
        if(size > minRegionAxis){
            let east = new Region(axis, this.y, this.z, size, this.height, this.length, 0);
            if(newRegions === undefined) newRegions = [];
            newRegions.push(east);

            /**/debugUIDs.push(debugRegion(east, 0x7fff0000, true));
        }

        // Calculate a new west region
        axis = this.x;
        size = region.x - axis;
        if(size > minRegionAxis){
            let west = new Region(axis, this.y, this.z, size, this.height, this.length, 1);
            if(newRegions === undefined) newRegions = [];
            newRegions.push(west);

            /**/debugUIDs.push(debugRegion(west, 0x7f00ff00, true));
        }

        // Calculate a new over/up region
        axis = region.y + region.height;
        size = this.y + this.height - axis;
        if(size > minRegionAxis){
            let over = new Region(region.x, axis, region.z, region.width, size, region.length, 0); // add overhang var? // togglePreferredX based on pre-packed weight distribution?
            if(newRegions === undefined) newRegions = [];
            newRegions.push(over);

            /**/debugUIDs.push(debugRegion(over, 0x7f0000ff, true));
        }

        /*
        // Calculate a new south region
        axis = this.z;
        size = region.z - axis;
        if(size > minRegionAxis){
            let south = new Region(this.x, this.y, axis, this.width, this.height, size, 0); // togglePreferredX based on pre-packed weight distribution?
            if(newRegions === undefined) newRegions = [];
            newRegions.push(south);

            /** /debugUIDs.push(debugRegion(south, 0x7f0000ff, true, 100));
            /** /await sleep(200);
            /** /debugUIDs.push(debugRegion(south, 0x7f0000ff, true, 100));
            /** /await sleep(200);
            /** /debugUIDs.push(debugRegion(south, 0x7f0000ff, true));
            /** /debugLog('south region created');
            /** /await click();
        }
        */

        // Set this as new north/front region
        axis = region.z + region.length;
        size = this.z + this.length - axis;
        this.z = axis;
        this.length = size;

        if(size > minRegionAxis){
            /**/debugUIDs.push(debugRegion(this, 0x7faaffff, true));
        }

        //**/await click();

        /**/debugClear(debugUIDs);

        return newRegions;
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
var tempCorners = [0, 0, 0];

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
        if(a.z + smallValue < b.z) return -1;
        if(a.z > b.z + smallValue) return 1;
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

        var firstRegion = new Region(0, 0, 0, container.width, container.height, container.length, 0);
        /** @type {Array<Region>} */
        this.regions = [firstRegion];

        this.cumulatedWeight = 0;
    }

    /** @param {Array<Item>} items */
    set items(items){
        this.assistant = new PackingAssistant(this.regions, items);
    }

    /** @param {PackedItem} item */
    SetPacked(item){
        this.cumulatedWeight += item.ref.weight;
        this.packedItems.push(item);
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
    async Occupy(region, fit){
        // Subtracts fit from region and calculates new bounding regions
        var newRegions = /**/await region.Subtract(fit, this.assistant.minRegionAxis);

        // Add new bounding regions if any
        if(newRegions) this.regions.push(...newRegions);

        // Check that region is still valid, otherwise remove it
        if(region.length < this.assistant.minRegionAxis){
            let regionIndex = this.regions.indexOf(region);
            this.regions.splice(regionIndex, 1);
            return false;
        }

        return true;
    }

    /** @param {Item} item */
    async Fit(item){
        var numRegions = this.regions.length;
        var numPackedItems = this.packedItems.length;

        // Try orientations 'xyz', 'zyx', 'yxz', 'yzx', 'zxy', 'xzy'
        for(let iOrient = 0; iOrient < 6; iOrient++){
            let dimensions = item.GetOrientedDimensions(iOrient);

            // Check if orientation is permitted
            if(dimensions){

                // Try to fit in sorted regions
                for(let iRegion = 0; iRegion < numRegions; iRegion++){
                    let region = this.regions[iRegion];

                    // Fit test (success: Region, failure: false)
                    let regionFitTest = region.FitTest(smallValue, dimensions[0], dimensions[1], dimensions[2]);
                    this.assistant.Something(item, region, regionFitTest);
                    if(regionFitTest !== false){

                        for(let iPacked = 0; iPacked < numPackedItems; iPacked++){
                            let packedItem = this.packedItems[iPacked];
                            // Creates temporary region for following calculations
                            let packedRegion = tempRegion2.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, 0);
                            
                            let intersects = packedRegion.Intersects(-smallValue, regionFitTest);
                            if(intersects){
                                continue;
                            }
                        }

                        //**/debugLog('regionFitTest:', regionFitTest);

                        // Create a new packed item
                        let packedItem = new PackedItem(item, regionFitTest.x, regionFitTest.y, regionFitTest.z, regionFitTest.width, regionFitTest.height, regionFitTest.length, iOrient);
                        /**/let debugUID = debugRegion(regionFitTest, 0xffff0000, true);

                        // Reserve the tested sub region: regionFitTest from the containing region: region
                        let regionRemains = /**/await this.Occupy(region, regionFitTest);

                        // Clean-up regions
                        /**/await this.ProcessRegions();
                        /**/debugClear([debugUID]);
                        debugRegion(regionFitTest, 0xffffffff, false);

                        return packedItem;
                    }
                }
            }
        }

        return false;
    }

    async ProcessRegionsForZeroRegions(){
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

    async ProcessRegionsForPackedItems(){
        var regions = this.regions;
        var packedItems = this.packedItems;

        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let region = regions[iRegion];
            let volumeRegion = region.volume;

            for(let iPacked = 0; iPacked < packedItems.length; iPacked++){
                let packedItem = packedItems[iPacked];

                // Calculate preferred packing side based on center point relative to container
                let preferredX = (packedItem.x + packedItem.packedWidth / 2) < (this.container.width / 2) ? 0 : 1;
                // Creates temporary region for following calculations
                let packedRegion = tempRegion.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, preferredX);
                
                let volumePacked = packedRegion.volume;
                // Checks if packedRegion is larger then region, as it could be completely contained within
                if(volumePacked > volumeRegion){
                    // If the region is completely contained within the packed volume, remove the region
                    if(packedRegion.ContainsRegion(smallValue, region)){
                        /**/debugRegion(region, 0xff0000, true, 100);
                        /**/await sleep(50);
                        regions.splice(iRegion, 1);
                        iRegion--;
                        break;
                    }
                }

                // Checks if the region and packedRegion intersects
                /*let corners = packedRegion.GetCorners(-smallValue * 10);
                let intersects = false, iCorner = 0;
                while(iCorner < 27 && intersects === false){
                    intersects = region.ContainsPoint(-smallValue, corners[iCorner], corners[iCorner + 1], corners[iCorner + 2]);
                    iCorner += 3;
                }
                */

                let intersects = packedRegion.Intersects(-smallValue, region);

                if(intersects){
                    /**/debugLog('intersects');
                    /**/await click();

                    regions.splice(iRegion, 1);
                    iRegion--;
                    break;
                    
                    // Reserve the packedRegion from the containing region
                    let regionRemains = /**/await this.Occupy(region, packedRegion);

                    iRegion--;
                    // If the containing region: region, has been removed, then break
                    if(regionRemains === false){
                        break;
                    }
                }

                // also merge walls?
            }
        }
    }

    async ProcessRegionsEnclosed(){
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
                        /**/debugRegion(regionA, 0xff0000, true, 100);
                        /**/await sleep(50);
                        regions.splice(iRegion, 1);
                        iRegion--;
                        break;
                    }
                }
                else{
                    // If a B is completely contained within A, remove the B
                    if(regionA.ContainsRegion(smallValue, regionB)){
                        /**/debugRegion(regionB, 0xff0000, true, 100);
                        /**/await sleep(50);
                        regions.splice(jRegion, 1);
                        jRegion--;
                    }
                }
            }
        }
    }

    async ProcessRegions(){
        console.log('>>> ProcessRegions()');
        var regions = this.regions;

        // Removes unuseable regions
        /**/await this.ProcessRegionsForZeroRegions();

        // Removes regions that are completely enclosed in packed volumes, and correct any intersecting ones
        /**/await this.ProcessRegionsForPackedItems();

        // Removes regions that are completely enclosed in larger regions
        /**/await this.ProcessRegionsEnclosed();

        // Sort by z (first) and volume (second)
        regions.sort(Region.SortDeepestSmallest);

        this.packedItems.sort(PackedItem.DepthSort);
        /**/await this.ProcessRegionsForPackedItems();

        /**/var debugUIDs = [];
        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let region = regions[iRegion];
            /**/debugUIDs.push(debugRegion(region, 0xff0000, true, 100, true));
            /**/await sleep(16);
            /**/debugUIDs.push(debugRegion(region, 0xff0000, true, -1, true));
        }

        //**/await click();
        /**/await debugUser();

        /**/debugClear(debugUIDs);
    }
}

/**
 * @typedef CUBParams
 */

class PackingAssistant{
    /**
     * @param {Array<Region>} regions 
     * @param {Array<Item>} items 
     */
    constructor(regions, items){
        this.workingRegions = regions;
        this.workingItems = items;

        this.minRegionAxis = smallValue;

        // Sort items by volume ascending
        this.workingItems.sort(Item.VolumeSort);

        var smallestItem = this.workingItems[0];
        this.minItemSize = Math.min(smallestItem.width, smallestItem.height, smallestItem.length); // Should take valid orientations into consideration
    }

    Something(){
        
    }
}

/**
 * 
 * @param {Container} container 
 * @param {Array<Item>} items // this array (and content) will be changed/emptied
 * @param {CUBParams} params 
 */
async function pack(container, items, params){

    Debug.Viz.SetPackingSpaceVisibility(false);

    var packedContainer = new PackedContainer(container);
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

        // Check if container supports this item's weight
        let weightPass = packedContainer.WeightPass(item.weight);
        if( weightPass === false ){

            /**/debugLog('weight pass failed.');
            /**/await sleep(200);
            unpackItem(iItem);
        }
        else{

            // Try to pack item
            let packedItem = /**/await packedContainer.Fit(item);
            if( packedItem === false ){

                /**/debugLog('item fitting failed.');
                /**/await sleep(200);
                unpackItem(iItem);
            }
            else{

                packItem(iItem, packedItem);
            }
        }

        /**/await sleep(50);
    }

    packedContainer.packedItems.sort(PackedItem.DepthSort);

    debugClear();
    Debug.Viz.SetPackingSpaceVisibility(true);

    return packedContainer;
}

export {
    pack
};