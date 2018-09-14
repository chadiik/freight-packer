import { epsilon, smallValue, smallValueSqrt } from "../core/Math2D";
import { Item } from "../core/Components";
import { PackedContainer } from "../core/PackedComponents";
import Region from "../core/Region";
import RegionsTree from "../core/RegionsTree";
import { debugLog, sleep } from '../CUBDebug';

class HeuristicParams {
    constructor(){
    }
}

class HeuristicResult{
    /** @param {Region} containingRegion @param {Region} packedRegion @param {Number} orientation */
    constructor(containingRegion, packedRegion, orientation){
        this.containingRegion = containingRegion;
        this.packedRegion = packedRegion;
        this.orientation = orientation;
    }
}

const _items = Symbol('items');
const _packedContainer = Symbol('packedContainer');
const _regionsTree = Symbol('regionsTree');
const _workingItem = Symbol('workingItem');

class HeuristicWorkingSet{
    /** @param {HeuristicParams} params */
    constructor(params){
        this.params = params;
    }

    /** @param {Array<Item>} items */
    SetItems(items){ this[_items] = items.slice(); }
    /** @param {Array<Item>} value */
    set items(value){ throw Error('Use HeuristicWorkingSet.SetItems(items) instead.'); }
    get items(){ return this[_items]; }

    /** @param {PackedContainer} packedContainer */
    SetPackedContainer(packedContainer){ this[_packedContainer] = packedContainer; }
    /** @param {PackedContainer} value */
    set packedContainer(value){ throw Error('Use HeuristicWorkingSet.SetPackedContainer(packedContainer) instead.'); }
    get packedContainer(){ return this[_packedContainer]; }

    /** @param {RegionsTree} regionsTree */
    SetRegionsTree(regionsTree){ this[_regionsTree] = regionsTree; }
    /** @param {RegionsTree} value */
    set regionsTree(value){ throw Error('Use HeuristicWorkingSet.SetRegionsTree(regionsTree) instead.'); }
    get regionsTree(){ return this[_regionsTree]; }

    /** @param {Item} item @returns {Boolean} */
    Validate(item){
        return item.volume > epsilon && this.packedContainer.WeightPass(item.weight);
    }

    /** Validates the item and assign it
     *  @param {Item} item @returns {Boolean} */
    SetWorkingItem(item){
        if(this.Validate(item)){
            this[_workingItem] = item;
            return true;
        }
        
        this[_workingItem] = undefined;
        return false;
    }

    /** @param {Item} value */
    set workingItem(value){ throw Error('Use HeuristicWorkingSet.SetWorkingItem(item) instead.'); }
    get workingItem(){ return this[_workingItem]; }

    /** @param {Region} region @returns {Heuristic.Result} */
    FitFunction(region){
        // Override this with heuristic algorithm
    }

    /** @returns {Heuristic.Result} */
    Fit(){
        let result = this.regionsTree.Find(this.FitFunction, this);
        return result;
    }

    /** @returns {false | Item} */
    async NextItem(){
        if(this.items === undefined || this.items.length === 0) return false;

        let index = this.items.length - 1;
        let item = this.items[index];
        if(item.quantity === 0){
            this.items.splice(index, 1);
            return this.NextItem();
        }

        return item;
    }

    /** @param {Item} item */
    RemoveItem(item){
        let index = this.items.indexOf(item);
        if(index !== -1) this.items.splice(index, 1);
    }
}

class Heuristic{
    /** @param {HeuristicParams} params @param {typeof HeuristicWorkingSet} workingSetType */
    constructor(params, workingSetType){
        this.params = params;

        this.workingSet = new workingSetType(this.params);
    }

    NextItem(){
        return this.workingSet.NextItem();
    }

    /** @param {Item} item */
    Unpack(item){
        this.workingSet.RemoveItem(item);
    }

    /** @param {Item} item @returns {HeuristicResult} */
    Fit(item){ return false; }
}

Heuristic.Params = HeuristicParams;
Heuristic.WorkingSet = HeuristicWorkingSet;
Heuristic.Result = HeuristicResult;

export default Heuristic;