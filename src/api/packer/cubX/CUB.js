/** @author chadiik <http://chadiik.com/> */

import { epsilon, smallValue, smallValueSqrt } from "./core/Math2D";
import Region from "./core/Region";
import RegionsTree from "./core/RegionsTree";
import { Container, Item } from "./core/Components";
import { PackedItem, PackedContainer } from "./core/PackedComponents";
import Heuristic from "./heuristics/Heuristic";
import { debugLog, sleep } from './CUBDebug';
import HeuRegular from "./heuristics/HeuRegular";
import HeuParametric1 from "./heuristics/HeuParametric1";

const heuristics = {
    HeuRegular: HeuRegular,
    HeuParametric1: HeuParametric1
};

var tempRegion = new Region();

class CUB{
    /**
     * @param {Container} container 
     */
    constructor(container){
        
        this.container = container;
        this.packedContainer = new PackedContainer(container);

        let firstRegion = new Region(0, 0, 0, container.width, container.height, container.length, 0);
            firstRegion.SetWeights(0, container.weightCapacity, 0);
        this.regionsTree = new RegionsTree(firstRegion);
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

    /** @param {Item} item @param {Heuristic} heuristic */
    FitUsingHeuristic(item, heuristic){
                
        let result = heuristic.Fit(item);

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

    /** @param {Heuristic} heuristic @param {Heuristic} fallback */
    async Solve(heuristic, fallback){
        let scope = this;
        let packedContainer = this.packedContainer;

        let log = { successful: 0, failed: 0, heuristic: 0, fallback: 0 };

        // Helper function
        /** @param {Item} item @param {Heuristic} workingHeuristic @param {Boolean} final */
        function unpackItem(item, workingHeuristic, final){
            if(final) packedContainer.Unpack(item);
            workingHeuristic.Unpack(item);

            if(final) log.failed++;
        }

        // Helper function
        /** @param {PackedItem} packedItem @param {Heuristic} workingHeuristic */
        function packItem(packedItem, workingHeuristic){
            packedContainer.Pack(packedItem);
            packedItem.ref.quantity--;

            if(workingHeuristic === heuristic) log.heuristic++;
            else log.fallback++;

            log.successful++;
        }

        let nextItem;

        /** @param {Heuristic} workingHeuristic @param {Boolean} final */
        async function fitWith(workingHeuristic, final){
            while( nextItem = await workingHeuristic.NextItem() ){

                scope.ProcessRegions();
                packedContainer.packedItems.sort(PackedItem.Sort);
    
                // Try to pack item
                let packedItem = scope.FitUsingHeuristic(nextItem, workingHeuristic);
    
                if( packedItem === false ){
                    unpackItem(nextItem, workingHeuristic, final);
                }
                else{
                    packItem(packedItem, workingHeuristic);
                }
    
                /**/await sleep(30);
            }
        }

        await fitWith(heuristic, false);
        if(fallback){
            await fitWith(fallback, true);
        }

        console.log('Solved:', log);

        return packedContainer;
    }

    /** @param {Heuristic} heuristic @param {Heuristic} fallback */
    async Solve1(heuristic, fallback){
        let packedContainer = this.packedContainer;

        // Helper function
        /** @param {Item} item */
        function unpackItem(item){
            packedContainer.Unpack(item);
            heuristic.Unpack(item);
            
            if(fallback) fallback.Unpack(item);
        }

        // Helper function
        /** @param {PackedItem} packedItem */
        function packItem(packedItem){
            packedContainer.Pack(packedItem);
            packedItem.ref.quantity--;
        }

        let log = { successful: 0, failed: 0, heuristic: 0, fallback: 0 };

        let nextItem;
        while( nextItem = await heuristic.NextItem() ){

            this.ProcessRegions();
            packedContainer.packedItems.sort(PackedItem.Sort);

            // Try to pack item
            let packedItem = this.FitUsingHeuristic(nextItem, heuristic);
            if( packedItem ){
                log.heuristic++;
            }
            else if( fallback ){
                // Fallback if failed
                // nextItem = await fallback.NextItem();
                packedItem = this.FitUsingHeuristic(nextItem, fallback);

                log.fallback++;
            }

            if( packedItem === false ){

                unpackItem(nextItem);
                log.failed++;
            }
            else{

                packItem(packedItem);
                log.successful++;
            }

            /**/await sleep(200);
        }

        console.log('Solved:', log);

        return packedContainer;
    }

}

/**
 * 
 * @param {Container} container 
 * @param {Array<Item>} items
 * @param {Heuristic} heuristic
 */
async function pack(container, items, heuristic){
    let cub = new CUB(container);

    heuristic.workingSet.SetItems(items);
    heuristic.workingSet.SetPackedContainer(cub.packedContainer);
    heuristic.workingSet.SetRegionsTree(cub.regionsTree);

    let fallback = new HeuRegular();
        fallback.workingSet.SetItems(items);
        fallback.workingSet.SetPackedContainer(cub.packedContainer);
        fallback.workingSet.SetRegionsTree(cub.regionsTree);

    let result = await cub.Solve(heuristic, fallback);
    
    return result;
}

export {
    Item,
    Container,
    pack,
    heuristics
};