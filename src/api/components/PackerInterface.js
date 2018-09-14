import LightDispatcher from "./LightDispatcher";
import Packer from "../packer/Packer";
import Utils from "../utils/cik/Utils";

/** @typedef {import('../packer/Packer').SolverParams} SolverParams */

/** @typedef {import('../packer/Packer').CUBParams} CUBParams */

class ResultSpace{
    /** @param {string} uid */
    constructor(uid){
        this.uid = uid;
    }
}

class ResultEntry{
    /** @param {string} uid @param {ResultSpace} space @param {Number} quantity */
    constructor(uid, space, quantity){
        this.uid = uid;
        this.space = space;
        this.quantity = quantity || 0;
    }
}

class PackingResult{
    constructor(){
        /** @type {Array<ResultSpace>} */
        this.packingSpaces = [];
        /** @type {Array<ResultEntry>} */
        this.packed = [];
        /** @type {Array<ResultEntry>} */
        this.unpacked = [];

        this.totalPacked = 0;
        this.totalUnpacked = 0;
        /** algorithm runtime in seconds */
        this.solveDuration = 1;
    }
}

/** @param {Packer.PackingResult} packingResult */
function toInterfaceResults(packingResult){
    let result = new PackingResult();
    
    /** @param {string} containerUID */
    function getSpace(containerUID){
        for(let i = 0; i < result.packingSpaces.length; i++){
            if(result.packingSpaces[i].uid === containerUID){
                return result.packingSpaces[i];
            }
        }

        let ps = new ResultSpace(containerUID);
        result.packingSpaces.push(ps);
        return ps;
    }

    let totalPacked = 0,
        totalUnpacked = 0;

    /** @param {ResultEntry} resultEntry @param {Array<ResultEntry>} list */
    function packEntry(resultEntry, list){
        let isFirst = true;
        for(let i = 0; i < list.length; i++){
            if(list[i].uid === resultEntry.uid){
                isFirst = false;
                list[i].quantity ++;
                break;
            }
        }

        if(isFirst){
            resultEntry.quantity = 1;
            list.push(resultEntry);
        }
    }

    packingResult.packed.forEach(p => {
        let uid = p.entry.uid;
        let space = getSpace(p.containingVolume.container.uid);
        packEntry(new ResultEntry(uid, space), result.packed);
        totalPacked++;
    });

    packingResult.unpacked.forEach(p => {
        let uid = p.entry.uid;
        let space = null;
        let unpackedQuantity = p.unpackedQuantity;
        result.unpacked.push(new ResultEntry(uid, space, unpackedQuantity));
        totalUnpacked += unpackedQuantity;
    });

    result.totalPacked = totalPacked;
    result.totalUnpacked = totalUnpacked;
    result.solveDuration = packingResult.runtime;

    return result;
}

const signals = {
    solveRequest: 'solveRequest',
    solved: 'solved',
    failed: 'failed'
};

/** @typedef PackerParams 
 * @property {Number} defaultStackingFactor default = 5, multiplier for stacking capacity (capacity = weight * defaultStackingFactor) if stackingProperty is not enabled */
const defaultParams = {
    defaultStackingFactor: 5
};

/** @type {SolverParams} */
const defaultSolverParams = {
    algorithm: 'cub'
};

class PackerInterface extends LightDispatcher {

    /** @param {PackerParams} params */
    constructor(params){
        super();
        
        this.params = Utils.AssignUndefined(params, defaultParams);
    }

    /** Solve packing for current cargo list in loaded packing space 
     * @param {SolverParams} params */
    Solve(params){
        params = Utils.AssignUndefined(params, defaultSolverParams);
        this.Dispatch(signals.solveRequest, params);
    }

    /** @ignore ignore */
    _Notify(...args){
        let value = args[0];
        switch(value){
            case signals.solved:
                let packingResult = args[1];
                let result = toInterfaceResults(packingResult);
                this.Dispatch(signals.solved, result);
                break;
            case signals.failed:
                let error = args[1];
                this.Dispatch(signals.failed, error);
                break;
        }
    }

    /** Enumeration of dispatched types */
    static get signals(){
        return signals;
    }
}

export default PackerInterface;