import Heuristic from "./Heuristic";
import Utils from "../../utils/cik/Utils";
import { Item, Container } from "./Components";
import Region from "./Region";
import { PackedItem, PackedContainer } from "./PackedComponents";
import RegionsTree from "./RegionsTree";

/** @typedef {import('./Heuristic').HeuristicParams HeuRegularParams} */
/** @typedef HeuRegularSet @property {Array<Item>} items @property {PackedContainer} packedContainer @property {RegionsTree} regionsTree */

const epsilon = Math.pow(2, -52);
const smallValue = .000001;

var tempRegion = new Region();

/** @param {Region} region */
function firstFitFunction(region){
    let item = this.workingItem;
    let validOrientations = item.validOrientations;
    for(let iOrient = 0; iOrient < validOrientations.length; iOrient++){
        let orientation = validOrientations[iOrient];

        let dimensions = item.GetOrientedDimensions(orientation);

        // Fit test (success: Region, failure: false)
        let regionFitTest = region.FitTest(smallValue, 
            dimensions[0], dimensions[1], dimensions[2],
            item.weight, item.grounded,
            tempRegion);
        if(regionFitTest !== false){

            // Stacking & weight test 

            let result = new Heuristic.Result(region, regionFitTest, orientation);
            return result;
        }
    }

    return false;
}

class HeuRegular extends Heuristic{
    /** @param {HeuRegularParams} params */
    constructor(params){
        super(params);

        /** @type {HeuRegularSet} */
        this.workingSet;
    }

    /** @param {Item} item */
    Fit(item){
        let result = super.Fit(item);
        
        let w = this.workingSet;

        // General weight check
        if(w.packedContainer.WeightPass(item.weight) === false) return false;

        w.workingItem = item;
        /** @type {Heuristic.Result} */
        let firstFit = w.regionsTree.Find(firstFitFunction, w);
        if(firstFit){
            if(result === undefined) result = new Heuristic.Result(firstFit.containingRegion, firstFit.packedRegion, firstFit.orientation);
            else result.Copy(firstFit);
        }

        return result || false;
    }

}

export default HeuRegular;