import Heuristic from "./Heuristic";
import Utils from "../../utils/cik/Utils";
import { Item } from "./Components";
import { PackedContainer } from "./PackedComponents";
import RegionsTree from "./RegionsTree";

/** @typedef {import('./CUB').CUBParams} CUBParams */

class HeuParametric1Params{
    /** @param {CUBParams} cubParams */
    constructor(cubParams){
        this.cub = cubParams;
    }
}

class HeuParametric1Set{
    /**
     * 
     * @param {Array<Item>} items 
     * @param {PackedContainer} packedContainer 
     * @param {RegionsTree} regionsTree 
     */
    constructor(items, packedContainer, regionsTree){
        this.items = items;
        this.packedContainer = packedContainer;
        this.regionsTree = regionsTree;
    }
}

class HeuParametric1 extends Heuristic{
    /** @param {HeuParametric1Params} params */
    constructor(params){
        super(params);

        /** @type {HeuParametric1Params} */
        this.params;
        /** @type {HeuParametric1Set} */
        this.workingSet;
    }

    Init(){
        if( (this.workingSet instanceof HeuParametric1Set) === false ){
            super.Init();

            this.workingSet = new HeuParametric1Set(this.workingSet.items, this.workingSet.packedContainer, this.workingSet.regionsTree);


        }
    }

    /** @param {Item} item */
    GetBestFit(item){
        if(false) return new Heuristic.Result();
        return false;
    }

    /** @param {Item} item */
    Fit(item){
        let result = super.Fit(item);
        
        let w = this.workingSet;

        // General weight check
        if(w.packedContainer.WeightPass(item.weight) === false) return false;
        
        let bestFit = this.GetBestFit(item);

        if(bestFit){
            if(result === undefined) result = new Heuristic.Result(bestFit.containingRegion, bestFit.packedRegion, bestFit.orientation);
            else result.Copy(bestFit);
        }

        return result || false;
    }
}

HeuParametric1.Params = HeuParametric1Params;
HeuParametric1.Set = HeuParametric1Set;

export default HeuParametric1;