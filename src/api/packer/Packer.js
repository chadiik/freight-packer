import CargoList from "./CargoList";
import PackingSpace from "./PackingSpace";
import BoxEntry from "../components/box/BoxEntry";
import Utils from "../utils/cik/Utils";
import Signaler from "../utils/cik/Signaler";
import ContainingVolume from "./container/ContainingVolume";

const CUB = require('./cubX/CUB');

/** @typedef CUBParams
 * @property {Number} score_minLength [0, 1] influence position of cargo in length
 * 
 * (higher values means the algorithm will try to pack as tightly as possible in length)
 * 
 * @property {Number} score_minWastedSpace [0, 1] influence orientation of cargo 
 * 
 * (higher values means the algorithm will try to minimize orientation that results in 'unuseable' unpacked volumes)
 */

const typeofHeuristicParams = CUB.heuristics.HeuParametric1.Params;

/** @param {CUBParams} cubParams @param {typeofHeuristicParams} heuristicParams */
function extractHeuristicParams(cubParams, heuristicParams){
    if(heuristicParams === undefined) heuristicParams = new typeofHeuristicParams();

    let scoringWeight = cubParams.score_minLength + cubParams.score_minWastedSpace;

    heuristicParams.scoring.minZ = cubParams.score_minLength / scoringWeight;
    heuristicParams.scoring.minWaste = cubParams.score_minWastedSpace / scoringWeight;
    return heuristicParams;
}

/**
 * @typedef {Object} PackerParams
 * @property {import('../UX').default} ux
 * @property {Number} defaultStackingFactor
 */ 

/** @typedef SolverParams
 * @property {CUBParams} algorithmParams
 * @property {string} algorithm default = 'cub'
 */

class PackedCargo {
    /**
     * @param {BoxEntry} entry 
     * @param {ContainingVolume} containingVolume 
     * @param {THREE.Vector3} position 
     * @param {Number} orientation 
     */
    constructor(entry, containingVolume, position, orientation){
        this.entry = entry;
        this.containingVolume = containingVolume;
        this.position = position;
        this.orientation = orientation;
    }
}

class UnpackedCargo {
    /**
     * @param {BoxEntry} entry 
     * @param {Number} unpackedQuantity
     */
    constructor(entry, unpackedQuantity){
        this.entry = entry;
        this.unpackedQuantity = unpackedQuantity;
    }
}

class PackingResult{
    /** @param {Number} numTotalItem @param {Number} runtime */
    constructor(numTotalItems, runtime){
        /** @type {Array<PackedCargo>} */
        this.packed = [];

        /** @type {Array<UnpackedCargo>} */
        this.unpacked = [];

        this.numTotalItems = numTotalItems || 0;

        this.runtime = runtime || -1;
    }
}

/** @type {PackerParams} */
const defaultParams = {};
const signals = {
    packUpdate: 'packUpdate',
    packFailed: 'packFailed'
};

const _solverParams = Symbol('solverParams');

const epsilon = Math.pow(2, -52);

class Packer extends Signaler {
    /** @param {PackerParams} params */
    constructor(params){
        super();

        /** Shared object with PackerInterface's params  */
        this.params = params;

        this.packingSpace = new PackingSpace();
        this.cargoList = new CargoList();

        this.solverExecutionsCount = 0;
    }

    /** @param {SolverParams} params */
    Solve(params){
        params = params || this[_solverParams];
        this[_solverParams] = params;

        this.solverExecutionsCount++;

        let algorithm = params.algorithm;
        let algorithmParams = params.algorithmParams;
        if(algorithm === 'cub')
            this.SolveCUB(algorithmParams);
    }

    /** @param {CUBParams} params */
    async SolveCUB(params){

        if(this.packingSpace.ready === false){
            this.Dispatch(signals.packFailed, 'Packing space not ready');
            return;
        }

        if(this.cargoList.ready === false){
            this.Dispatch(signals.packFailed, 'Cargo list not ready');
            return;
        }

        const Container = CUB.Container;
        const Item = CUB.Item;

        var containingVolume = this.packingSpace.current.volume;
        var d = containingVolume.dimensions;
        var container = new Container(containingVolume.uid, d.width, d.height, d.length, containingVolume.weightCapacity);

        var numTotalItems = 0;

         /** @type {Array<Item>} */
         var items = [];
         var entries = {};
         for(let group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            entries[entry.uid] = entry;
            d = entry.dimensions;
            let validOrientations = entry.properties.rotation.enabled ? entry.properties.rotation.allowedOrientations : undefined;
            let stackingCapacity = entry.properties.stacking.enabled ? entry.properties.stacking.capacity : (entry.weight > epsilon ? entry.weight * this.params.defaultStackingFactor : Number.MAX_SAFE_INTEGER - 10);
            let grounded = entry.properties.translation.enabled ? entry.properties.translation.grounded : false;
            let item = new Item(entry.uid, d.width, d.height, d.length, entry.weight, entry.quantity, validOrientations, stackingCapacity, grounded);
            items.push(item);
            numTotalItems += entry.quantity;
        }

        var startTime = performance.now();
        let heuristicParams = extractHeuristicParams(params);
        let heuristic = new CUB.heuristics.HeuParametric1(heuristicParams);
        var result = await CUB.pack(container, items, heuristic);
        var cubRuntime = performance.now() - startTime;

        var cubRuntime2Dec = Math.round(cubRuntime / 1000 * 100) / 100;
        var packingResult = new PackingResult(numTotalItems, cubRuntime2Dec);
        result.packedItems.forEach(packedItem => {
            let entry = entries[packedItem.ref.id];
            let position = new THREE.Vector3(
                packedItem.x + packedItem.packedWidth / 2,
                packedItem.y + packedItem.packedHeight / 2,
                packedItem.z + packedItem.packedLength / 2
            );
            let orientation = Item.ResolveOrientation(packedItem.orientation);
            let packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
            packingResult.packed.push(packedCargo);
        });

        result.unpackedItems.forEach(unpackedItem => {
            let entry = entries[unpackedItem.id];
            let unpackedQuantity = unpackedItem.quantity;
            let unpackedCargo = new UnpackedCargo(entry, unpackedQuantity);
            packingResult.unpacked.push(unpackedCargo);
        });

        this.Dispatch(signals.packUpdate, packingResult);
    }

    get solveAgain(){
        return this.solverExecutionsCount > 0;
    }

    static get signals(){
        return signals;
    }

}

Packer.PackingResult = PackingResult;
Packer.PackedCargo = PackedCargo;
Packer.UnpackedCargo = UnpackedCargo;

export default Packer;