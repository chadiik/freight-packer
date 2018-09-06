import Utils from "../../utils/cik/Utils";
import { Item, Container } from "./Components";
import Region from "./Region";
import { PackedItem, PackedContainer } from "./PackedComponents";


class HeuristicResult{
    /** @param {Region} containingRegion @param {Region} packedRegion @param {Number} orientation */
    constructor(containingRegion, packedRegion, orientation){
        this.containingRegion = containingRegion;
        this.packedRegion = packedRegion;
        this.orientation = orientation;
    }

    /** @param {HeuristicResult} value */
    Copy(value){
        this.containingRegion = value.containingRegion;
        this.packedRegion = value.packedRegion;
        this.orientation = value.orientation;
    }
}

/** @typedef {import('./CUB').PackingAssistantParams HeuristicParams} */

const _workingSet = Symbol('workingSet');

class Heuristic{
    /** @param {HeuristicParams} params */
    constructor(params){
        this.params = params;
    }

    Init(){}

    set workingSet(value){
        this[_workingSet] = value;
        this.Init();
    }

    get workingSet(){
        return this[_workingSet];
    }

    /** @param {Item} item @returns {HeuristicResult} */
    Fit(item){}
}

Heuristic.Result = HeuristicResult;

export default Heuristic;