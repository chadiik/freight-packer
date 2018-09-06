import Heuristic from "./Heuristic";
import { Item } from "./Components";
import { PackedContainer } from "./PackedComponents";
import RegionsTree from "./RegionsTree";

/** @typedef {import('./CUB').CUBParams} CUBParams */

class HeuParametricTemplateParams{
    /** @param {CUBParams} cubParams */
    constructor(cubParams){
        this.cub = cubParams;
    }
}

class HeuParametricTemplateSet{
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

class HeuParametricTemplate extends Heuristic{
    /** @param {HeuParametricTemplateParams} params */
    constructor(params){
        super(params);

        /** @type {HeuParametricTemplateParams} */
        this.params;
        /** @type {HeuParametricTemplateSet} */
        this.workingSet;
    }

    Init(){
        if( (this.workingSet instanceof HeuParametricTemplateSet) === false ){
            super.Init();

            this.workingSet = new HeuParametricTemplateSet(this.workingSet.items, this.workingSet.packedContainer, this.workingSet.regionsTree);


        }
    }

    /** @param {Item} item */
    GetBestFit(item){
        if(item.volume) return new Heuristic.Result();
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

HeuParametricTemplate.Params = HeuParametricTemplateParams;
HeuParametricTemplate.Set = HeuParametricTemplateSet;

export default HeuParametricTemplate;