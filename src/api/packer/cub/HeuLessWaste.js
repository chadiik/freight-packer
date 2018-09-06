import Heuristic from "./Heuristic";
import Utils from "../../utils/cik/Utils";
import { Item, Container } from "./Components";
import Region from "./Region";
import { PackedItem, PackedContainer } from "./PackedComponents";
import RegionsTree from "./RegionsTree";

/** @typedef {import('./Heuristic').HeuristicParams HeuLessWasteParams} */
/** @typedef HeuLessWasteSet @property {HeuLessWasteParams} params @property {Array<Item>} items @property {PackedContainer} packedContainer @property {RegionsTree} regionsTree */

const smallValue = .000001;
const minRegionAxis = smallValue;

var tempRegion = new Region();
var tempRegion2 = new Region();

function sortByN(a, b){
    if(isNaN(a.n) || isNaN(b.n)) return 0;

    if(a.n < b.n) return -1;
    if(a.n > b.n) return 1;
    return 0;
}

/**
 * @param {Region} fit 
 * @param {Array<Region>} newRegions 
 */
function rateFit(fit, newRegions){

    /** @type {HeuLessWasteSet} */
    const w = this;
    
    // Try out a recursive deep rate fit
    var containerLength = w.packedContainer.container.length;
    var minDimensions = w.minDimensions;
    var minDimensionsNoWasteFactor = w.minDimensionsNoWasteFactor;
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
    var minZ_weight = w.params.minZ_weight;
    var minWaste_weight = w.params.minWaste_weight;
    var score = minZScore * minZ_weight + minWasteScore * minWaste_weight;
    return score;
}

/** @param {Region} region */
function highestScoreFunction(region){
    /** @type {Item} */ 
    let item = this.workingItem;
    
    /** @typedef PlacementScore @property {Region} region region @property {Number} orientation orientation index @property {Number} n score */
    /** @type {Array<PlacementScore>} */ 
    let regionScoreTable = this.regionScoreTable;
    
    let orientationScoreTable = this.orientationScoreTable;

    let volumeItem = item.volume,
        validOrientations = item.validOrientations;
    
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

                // Subtracts fit from region and calculates new bounding regions
                let newRegions = dummyRegion.Subtract(regionFitTest, minRegionAxis);
                if(newRegions === undefined) newRegions = [];
                if(dummyRegion.length > minRegionAxis)
                    newRegions.push(dummyRegion);

                let orientationScore = {
                    region: region,
                    orientation: orientation, 
                    n: rateFit.call(this, regionFitTest, newRegions)
                };
                orientationScoreTable.push(orientationScore);
            }
        }

        if(orientationScoreTable.length > 0){
            orientationScoreTable.sort(sortByN);
            let regionScore = orientationScoreTable.pop();
            regionScoreTable.push(regionScore);
        }
    }

    return false;
}

class HeuLessWaste extends Heuristic{
    /** @param {HeuLessWasteParams} params */
    constructor(params){
        super(params);

        /** @type {HeuLessWasteSet} */
        this.workingSet;
    }

    /** @param {Array<Item>} items */
    GetMinDimensionsOverall(items){
        var minDimensions = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];

        for(let iItem = 0, numItems = items.length; iItem < numItems; iItem++){
            let item = items[iItem];
            let validOrientations = item.validOrientations;
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

    Init(){
        super.Init();

        const minDimensionsNoWasteFactor = [1, 1, 1];

        let w = this.workingSet;
        let workingItems = w.items.slice();
            workingItems.sort(Item.VolumeSort);
        let minDimensions = this.GetMinDimensionsOverall(workingItems);
        
        w.params = this.params;
        w.minDimensions = minDimensions;
        w.minDimensionsNoWasteFactor = minDimensionsNoWasteFactor;
    }

    /** @param {Item} item */
    GetPlacementWithHighestScore(item){

        /** @typedef PlacementScore @property {Number} region region index @property {Number} orientation orientation index @property {Number} n score */
        /** @type {Array<PlacementScore>} */
        let regionScoreTable = [],
            orientationScoreTable = [];
        let testSuccessfulRegions = 4;

        let w = this.workingSet;
            w.workingItem = item;
            w.regionScoreTable = regionScoreTable;
            w.orientationScoreTable = orientationScoreTable;
            w.testSuccessfulRegions = testSuccessfulRegions;

        // Try to fit in sorted regions
        w.regionsTree.Find(highestScoreFunction, w);

        if(regionScoreTable.length === 0){
            return false;
        }

        regionScoreTable.sort(sortByN);
        let highestScore = regionScoreTable.pop();
        let containingRegion = highestScore.region,
            orientation = item.validOrientations[highestScore.orientation];

        let dimensions = item.GetOrientedDimensions(orientation);

        // Fit test (success: Region, failure: false)
        let regionFitTest = containingRegion.FitTest(smallValue, 
            dimensions[0], dimensions[1], dimensions[2],
            item.weight, item.grounded,
            tempRegion);
        if(regionFitTest !== false){
    
            // Stacking & weight test 
    
            let result = new Heuristic.Result(containingRegion, regionFitTest, orientation);
            return result;
        }

        return false;
    }

    /** @param {Item} item */
    Fit(item){
        let result = super.Fit(item);
        
        let w = this.workingSet;

        // General weight check
        if(w.packedContainer.WeightPass(item.weight) === false) return false;
        
        let highestScored = this.GetPlacementWithHighestScore(item);

        if(highestScored){
            if(result === undefined) result = new Heuristic.Result(highestScored.containingRegion, highestScored.packedRegion, highestScored.orientation);
            else result.Copy(highestScored);
        }

        return result || false;
    }

}

export default HeuLessWaste;