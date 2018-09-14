import { epsilon, smallValue, smallValueSqrt } from "../core/Math2D";
import Heuristic from "./Heuristic";
import { Item } from "../core/Components";
import Region from "../core/Region";

class ScoringParams {
    /** Scoring weights
     * @param {Number} minZ score for tightly packing in length (Z)
     * @param {Number} minWaste score for minimizing wasted space
     */
    constructor(minZ, minWaste){
        this.minZ = minZ;
        this.minWaste = minWaste;
    }
}

class HeuParametric1Params extends Heuristic.Params{
    constructor(){
        super();

        /** Defaults minZ = .9, minWaste = .1 
         * @type {ScoringParams} */
        this.scoring = new ScoringParams(.9, .1);
    }
}

/** @typedef Score @property {Region} region region index @property {Number} orientation orientation index @property {Number} n score */
/** @param {Region} region region index @param {Number} orientation orientation index @param {Number} n score */
function scoreConstructor(region, orientation, n){ return { region: region, orientation: orientation, n: n }; }

function sortByN(a, b){
    if(isNaN(a.n) || isNaN(b.n)) return 0;

    if(a.n < b.n) return -1;
    if(a.n > b.n) return 1;
    return 0;
}

const minRegionAxis = smallValue;

var tempRegion = new Region();

/** @type {Array<Score>} */
var orientationScoreTable = [];

class HeuParametric1Set extends Heuristic.WorkingSet{
    constructor(...args){
        super(...args);

        /** @type {HeuParametric1Params} */
        this.params;
    }

    /** @param {Array<Item>} items */
    SetItems(items){
        super.SetItems(items);
        
        this.items.sort(Item.VolumeSort);

        this.minDimensions = Item.GetMinDimensions(this.items);
        this.minDimensionsNoWasteFactor = [1, 1, 1];

        /** @type {Array<Score>} */
        this.regionScoreTable = [];
    }

    /**
     * @param {Region} fit 
     * @param {Array<Region>} newRegions 
     */
    RateFit(fit, newRegions){
        
        // Try out a recursive deep rate fit
        let containerLength = this.packedContainer.container.length;
        let minDimensions = this.minDimensions;
        let minDimensionsNoWasteFactor = this.minDimensionsNoWasteFactor;
        let minZScore = 1 - (fit.z + fit.length) / containerLength; // 0-1

        // new regions usability score
        let minWasteScore = 1; // have completely filled the region if newRegions.length === 0
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

        let minZWeight = this.params.scoring.minZ;
        let minWasteWeight = this.params.scoring.minWaste;
        let score = minZScore * minZWeight + minWasteScore * minWasteWeight;
        return score;
    }

    /** @param {Region} region */
    FitFunction(region){

        let regionScoreTable = this.regionScoreTable;

        let item = this.workingItem;
        let validOrientations = item.validOrientations;
        
        if(region.volume > item.volume){
            let dummyRegion = tempRegion.Copy(region);

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

                    let score = this.RateFit(regionFitTest, newRegions)
                    let orientationScore = scoreConstructor(region, orientation, score);
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

    /** @returns {Heuristic.Result} */
    Fit(){
        
        this.regionsTree.Find(this.FitFunction, this);

        if(this.regionScoreTable.length > 0){

            this.regionScoreTable.sort(sortByN);
            let highestScore = this.regionScoreTable.pop();

            let containingRegion = highestScore.region,
                orientation = this.workingItem.validOrientations[highestScore.orientation];
            let dimensions = this.workingItem.GetOrientedDimensions(orientation);

            // Fit test (success: Region, failure: false)
            let regionFitTest = containingRegion.FitTest(smallValue, 
                dimensions[0], dimensions[1], dimensions[2],
                this.workingItem.weight, this.workingItem.grounded);
            
            if(regionFitTest !== false){
        
                let result = new Heuristic.Result(containingRegion, regionFitTest, orientation);
                return result;
            }
        }

        return false;
    }
}

class HeuParametric1 extends Heuristic{
    /** @param {HeuParametric1Params} params */
    constructor(params){

        super(params || (new HeuParametric1Params()), HeuParametric1Set);

        /** @type {HeuParametric1Set} */
        this.workingSet;
    }

    /** @param {Item} item */
    Fit(item){
        let result = false;
        let validItem = this.workingSet.SetWorkingItem(item);

        if(validItem){
            result = this.workingSet.Fit();
        }

        return result;
    }

}

HeuParametric1.Params = HeuParametric1Params;
HeuParametric1.WorkingSet = HeuParametric1Set;

export default HeuParametric1;