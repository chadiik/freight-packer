import { epsilon, smallValue, smallValueSqrt } from "../core/Math2D";
import Heuristic from "./Heuristic";
import { Item } from "../core/Components";
import Region from "../core/Region";

class HeuRegularParams extends Heuristic.Params{
    constructor(){ super(); }
}

var tempRegion = new Region();

class HeuRegularSet extends Heuristic.WorkingSet{
    constructor(...args){
        super(...args);
    }

    /** @param {Array<Item>} items */
    SetItems(items){
        super.SetItems(items);
        
        this.items.sort(Item.VolumeSort);
    }

    /** @param {Region} region */
    FitFunction(region){
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

                let result = new Heuristic.Result(region, regionFitTest, orientation);
                return result;
            }
        }

        return false;
    }
}

class HeuRegular extends Heuristic{
    constructor(){

        let params = undefined;
        super(params, HeuRegularSet);

        /** @type {HeuRegularSet} */
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

HeuRegular.Params = HeuRegularParams;
HeuRegular.WorkingSet = HeuRegularSet;

export default HeuRegular;