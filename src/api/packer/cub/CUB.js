/** @author chadiik <http://chadiik.com/> */

import { Container, Item } from "./Components";
import Utils from "../../utils/cik/Utils";
import Region from "./Region";
import RegionsTree from "./RegionsTree";
import { PackedItem, PackedContainer } from "./PackedComponents";

import { debugging, debugClear, debugLog, debugRegion, sleep, format } from './CUBDebug';
import HeuLessWaste from "./HeuLessWaste";
import Heuristic from "./Heuristic";
import HeuRegular from "./HeuRegular";
import HeuParametric1 from "./HeuParametric1";

//#region typedefs
/** @typedef Vec2 @property {Number} x @property {Number} y */

/**
 * @typedef CUBParams
 * @property {Number} minZ_weight score for tightly packing in length (Z)
 * @property {Number} minWaste_weight score for minimizing wasted space
 */

/**
 * @typedef PackingAssistantParams extends CUBParams
 * @property {Array<Number>} minDimensionsNoWasteFactor
 * @property {Number} minZ_weight score for tightly packing in length (Z)
 * @property {Number} minWaste_weight score for minimizing wasted space
 */

//#endregion 

/** @type {CUBParams} */
const defaultParams = {
    minZ_weight: .9,
    minWaste_weight: .1
};

/** @type {PackingAssistantParams} */
const defaultPackingAssitantParams = {
    minDimensionsNoWasteFactor: [1, 1, 1]
};

const epsilon = Math.pow(2, -52);
const smallValue = .000001;

var tempRegion = new Region();
var tempRegion2 = new Region();

class PackingAssistant{
    /**
     * 
     * @param {Container} container 
     * @param {PackingAssistantParams} params 
     */
    constructor(container, params){
        
        this.params = Utils.AssignUndefined(Object.assign({}, params), defaultPackingAssitantParams);
        this.container = container;
        this.packedContainer = new PackedContainer(container);

        let firstRegion = new Region(0, 0, 0, container.width, container.height, container.length, 0);
            firstRegion.SetWeights(0, container.weightCapacity, 0);
        this.regionsTree = new RegionsTree(firstRegion);



        /** @type {Item} */
        this.workingItem;
    }

    /** @param {PackedItem} packedItem @param {Boolean} [harsh] default = false */
    ProcessRegionsPerPackedItem(packedItem, harsh){
        let regions = this.regionsTree.regions;
        let itemVolume = packedItem.ref.volume;
        
        // Creates temporary region for following calculations
        let packedRegion = tempRegion.Set(packedItem.x, packedItem.y, packedItem.z, packedItem.packedWidth, packedItem.packedHeight, packedItem.packedLength, 0);
        packedRegion.SetWeights(packedItem.ref.weight, 0, packedItem.ref.stackingCapacity);

        for(let iRegion = 0; iRegion < regions.length; iRegion++){
            let region = regions[iRegion];

            if(itemVolume > region.volume && packedRegion.ContainsRegion(smallValue, region)){
                regions.splice(iRegion, 1);
                iRegion--;
                console.log('Contained region' + iRegion + ' deleted');
                continue;
            }

            if(packedRegion.Intersects(-smallValue, region)){

                if(harsh){
                    console.log('\tIntersecting region' + iRegion + ' deleted (!)');
                    regions.slice(iRegion, 1);
                    iRegion--;
                    continue;
                }
                
                let regionRemains = this.regionsTree.Occupy(region, packedRegion);
                iRegion --;
            }
        }
    }

    ProcessRegionsForPackedItems(harsh){
        let packedItems = this.packedContainer.packedItems;
        let numPackedItems = packedItems.length;

        for(let iItem = 0; iItem < numPackedItems; iItem++){
            let packedItem = packedItems[iItem];
            this.ProcessRegionsPerPackedItem(packedItem, harsh);
        }
    }

    ProcessRegions(){

        let containerWidth = this.container.width,
            containerHeight = this.container.height;

        // Recalculate preferred insertion side per region (left or right)
        this.regionsTree.ProcessRegionsPreferredX(containerWidth);

        // Merge and expand free regions (can span several packed item tops)
        this.regionsTree.ProcessRegionsMergeExpand(containerWidth, containerHeight);

        // Removes regions that are completely enclosed in packed volumes, and correct any intersecting ones
        this.ProcessRegionsForPackedItems(false);

        // Removes unuseable regions
        this.regionsTree.ProcessRegionsForZeroRegions();

        // Removes regions that are completely enclosed in larger regions
        this.regionsTree.ProcessRegionsEnclosed();

        // Recalculate preferred insertion side per region (left or right)
        this.regionsTree.ProcessRegionsPreferredX(containerWidth);

        // Sort by z (first) and volume (second)
        this.regionsTree.Sort(Region.SortDeepestSmallest);
    }

    /** @param {Item} item @param {Heuristic} heuristics */
    FitUsingHeuristic(item, heuristics){
        // General weight check
        if(this.packedContainer.WeightPass(item.weight) === false) return false;
                
        let result = heuristics.Fit(item);

        if(result){
            let placement = result.packedRegion;
            placement.SetWeights(item.weight, 0, item.stackingCapacity);

            // Create a new packed item
            let packedItem = new PackedItem(item, placement.x, placement.y, placement.z, placement.width, placement.height, placement.length, result.orientation);

            // Reserve the tested sub region: regionFitTest from the containing region: region
            let regionRemains = this.regionsTree.Occupy(result.containingRegion, placement);

            return packedItem;
        }

        return false;
    }

    /** @param {Array<Item>} items @param {Heuristic} heuristics */
    async Solve(items, heuristics){
        let packedContainer = this.packedContainer;
        let iItem = items.length - 1;

        // Helper function
        function unpackItem(index){
            let item = items[index];
            packedContainer.Unpack(item);
            items.splice(index, 1);
            iItem--;
        }

        // Helper function
        /** @param {Number} index * @param {PackedItem} item */
        function packItem(index, item){
            packedContainer.Pack(item);
            
            item.ref.quantity--;
            if(item.ref.quantity === 0){
                items.splice(index, 1);
                iItem--;
            }
        }

        const workingSet = {
            items: items,
            packedContainer: packedContainer,
            regionsTree: this.regionsTree
        };

        heuristics.workingSet = workingSet;

        let heuRegular = new HeuRegular(Object.assign({}, this.params));
            heuRegular.workingSet = workingSet;

        while(items.length > 0){
            let item = items[iItem];

            this.ProcessRegions();
            packedContainer.packedItems.sort(PackedItem.Sort);

            // Try to pack item
            let packedItem = this.FitUsingHeuristic(item, heuristics);
            if( packedItem === false ){
                // Fallback to regular fitting if failed
                packedItem = this.FitUsingHeuristic(item, heuRegular);
            }

            if( packedItem === false ){

                /**/debugLog('item fitting failed.');
                unpackItem(iItem);
            }
            else{

                packItem(iItem, packedItem);
            }

            /**/await sleep(16);
        }

        return packedContainer;
    }

}

/**
 * 
 * @param {Container} container 
 * @param {Array<Item>} items // this array (and content) will be changed/emptied
 * @param {CUBParams} params 
 */
async function pack(container, items, params){

    params = Utils.AssignUndefined(params, defaultParams);

    let packingAssistant = new PackingAssistant(container, params);

    function heuLessWaste(){
        return new HeuLessWaste(Object.assign({}, packingAssistant.params));
    }

    function heuParametric1(){
        let heuParams = new HeuParametric1.Params(params);
        return new HeuParametric1(heuParams);
    }

    let heuristics = heuLessWaste();
    let result = await packingAssistant.Solve(items, heuristics);
    
    return result;
}

export {
    pack
};