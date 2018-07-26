import CargoList from "./CargoList";
import PackingSpace from "./PackingSpace";
import AFit from "./afit/AFit";
import BoxEntry from "../components/box/BoxEntry";
import Utils from "../utils/cik/Utils";
import Signaler from "../utils/cik/Signaler";
import Logger from "../utils/cik/Logger";

/**
 * @typedef {Object} PackerParams
 * @property {import('../UX').default} ux
 */

/**
 * @typedef {import('./afit/AFit').PackingResult} PackingResult
 */

function sumOfVolumes(items){
    var sum = 0;
    for(var i = 0, len = items.length; i < len; i++) sum += items[i].Volume;
    return sum;
}

const _afit = Symbol('afit');
const defaultParams = {};
const signals = {
    packUpdate: 'packUpdate'
};

class Packer extends Signaler {
    /**
     * @param {PackerParams} params 
     */
    constructor(params){
        super();

        this.params = Utils.AssignUndefined(params, defaultParams);

        this[_afit] = new AFit();

        this.packingSpace = new PackingSpace();
        this.cargoList = new CargoList();
    }

    Solve(){
        /** @type {AFit} */
        var afit = this[_afit];

        var Container = require('./afit/components/Container').default;
        var Item = require('./afit/components/Item').default;

        var containingVolume = this.packingSpace.current.volume;
        console.warn('Currently solves for 1 ContainingVolume', containingVolume);

        var d = containingVolume.dimensions;
        var container = new Container(containingVolume.uid, d.width, d.length, d.height);

        /** @type {Array<Item>} */
        var items = [];
        for(var group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            d = entry.dimensions;
            let item = new Item(entry.uid, d.width, d.length, d.height, entry.quantity);
            items.push(item);
        }

        Logger.Log('Solving', items, ' in ', container);

        var startTime = performance.now();
        var result = afit.Solve(container, items);
        result.PackTimeInMilliseconds = Math.ceil(performance.now() - startTime);

        var containerVolume = container.Length * container.Width * container.Height;
        var itemVolumePacked = sumOfVolumes(result.PackedItems);
        var itemVolumeUnpacked = sumOfVolumes(result.UnpackedItems);

        result.PercentContainerVolumePacked = Math.floor(itemVolumePacked / containerVolume * 100 * 100) / 100;
        result.PercentItemVolumePacked = Math.floor(itemVolumePacked / (itemVolumePacked + itemVolumeUnpacked) * 100 * 100) / 100;
        
        this.Dispatch(signals.packUpdate, result);
    }

    static get signals(){
        return signals;
    }

}

export default Packer;