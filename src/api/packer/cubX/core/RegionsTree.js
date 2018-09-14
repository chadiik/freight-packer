import { epsilon, smallValue, smallValueSqrt, reduceRectangles } from "./Math2D";
import Region from "./Region";

import { debugClear, debugLog, debugRegion, sleep, format } from '../CUBDebug';

/** RegionFindCallback
 * @callback RegionFindCallback
 * @param {Region} region
 * @returns {Object | Boolean}
 */

/** @typedef Vec2 @property {Number} x @property {Number} y */

/** @typedef Rectangle @property {Vec2} p1 @property {Vec2} p2 @property {Vec2} p3 @property {Vec2} p4 
 * @property {Number} weight @property {Number} weightCapacity @property {Number} stackingCapacity 
 */

const minRegionAxis = smallValue;

class RegionsTree{
    /** @param {Region} root */
    constructor(root){
        this.regions = [root];
    }

    /** @param {Number} index */
    Get(index){
        return this.regions[index];
    }

    /** @param {RegionFindCallback} callback @param {*} thisArg */
    Find(callback, thisArg){
        let numRegions = this.regions.length;

        for(let iRegion = 0; iRegion < numRegions; iRegion++){
            let region = this.regions[iRegion];
            let search = callback.call(thisArg, region);
            if(search) return search;
        }

        return false;
    }

    /** @param {Region} region * @param {Region} fit * @returns {Boolean} false if region has been deleted */
    Occupy(region, fit){

        // Subtracts fit from region and calculates new bounding regions
        var newRegions = region.Subtract(fit, minRegionAxis);

        // Add new bounding regions if any
        if(newRegions) this.regions.push(...newRegions);

        // Check that region is still valid, otherwise remove it
        if(region.length < minRegionAxis){
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

    /** @param {Number} width */
    ProcessRegionsPreferredX(width){
        let regions = this.regions,
            numRegions = regions.length;
        //let width = this.container.width;

        for(let iRegion = 0; iRegion < numRegions; iRegion++){
            let region = regions[iRegion];

            if(Math.abs(region.x) < smallValue) region.preferredX = 0;
            else if(Math.abs(region.x + region.width - width) < smallValue) region.preferredX = 1;
        }
    }

    /** @param {Number} width @param {Number} height */
    ProcessRegionsMergeExpand(width, height){
        let regions = this.regions,
            numRegions = regions.length;

        let toInt = 1 / smallValue;
        function coordID(value){
            return Math.floor(value * toInt);
        }

        /** @typedef Level @property {Number} y @property {Array<Rectangle>} rectangles */
        /** @type {Array<Level>} */
        let levels = {};

        let neighbours = [], rectangles = [];
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
            let regionHeight = height - regionY;
            
            reduceRectangles(rectangles);
            for(let iRect = 0, numRects = rectangles.length; iRect < numRects; iRect++){
                let rect = rectangles[iRect];
                let rx = rect.p1.x, ry = rect.p1.y;
                let rw = rect.p3.x - rx, rh = rect.p3.y - ry;

                // Calculate preferred packing side based on center point relative to container
                let preferredX = (rx.x + rw / 2) < (width / 2) ? 0 : 1;
                let newRegion = new Region(rx, regionY, ry, rw, regionHeight, rh, 0);
                newRegion.SetWeights(rect.weight, rect.weightCapacity, rect.stackingCapacity);
                this.regions.push(newRegion);
            }
        }
    }

    ProcessRegionsForZeroRegions(){
        let regions = this.regions;
        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let region = regions[iRegion];
            if(region.width < minRegionAxis || region.height < minRegionAxis || region.length < minRegionAxis){
                regions.splice(iRegion, 1);
                iRegion--;
            }
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

    /** @param {Function} sortFunction */
    Sort(sortFunction){
        this.regions.sort(sortFunction);
    }
}

export default RegionsTree;