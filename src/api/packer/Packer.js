import CargoList from "./CargoList";
import PackingSpace from "./PackingSpace";
import AFit from "./afit/AFit";
import BoxEntry from "../components/box/BoxEntry";
import Utils from "../utils/cik/Utils";
import Signaler from "../utils/cik/Signaler";
import Logger from "../utils/cik/Logger";
import ContainingVolume from "./container/ContainingVolume";
import Dimensions from "../components/box/Dimensions";

function almost(n1, n2){
    return Math.abs(n1 - n2) < .01;
}

/**
 * @typedef {Object} PackerParams
 * @property {import('../UX').default} ux
 */

///** @typedef {import('./afit/AFit').PackingResult} PackingResult */

class PackedCargo{
    /**
     * @param {BoxEntry} entry 
     * @param {ContainingVolume} containingVolume 
     * @param {THREE.Vector3} position 
     */
    constructor(entry, containingVolume, position, orientation){
        this.entry = entry;
        this.containingVolume = containingVolume;
        this.position = position;
        this.orientation = orientation;
    }
}

class PackingResult{
    constructor(){
        /** @type {Array<PackedCargo>} */
        this.packed = [];
    }
}

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

    Solve(arg){
        if(arg === 'sim')
            this.SolveSim();
        else if(arg === 'brb')
            this.SolveBRB();
        else
            this.SolveAFit();
    }

    SolveAFit(){
        /** @type {AFit} */
        var afit = this[_afit];

        var Container = require('./afit/components/Container').default;
        var Item = require('./afit/components/Item').default;

        var containingVolume = this.packingSpace.current.volume;
        console.warn('Currently solves for 1 ContainingVolume', containingVolume);

        var d = containingVolume.dimensions;
        var container = new Container(containingVolume.uid, d.width, d.length, d.height);

        /** @type {Array<Box>} */
        var items = [];
        var entries = {};
        for(var group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            entries[entry.uid] = entry;
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

        var packingResult = new PackingResult();
        result.PackedItems.forEach(packedItem => {
            if(packedItem.IsPacked){
                let entry = entries[packedItem.ID];
                let position = new THREE.Vector3(
                    packedItem.CoordX + packedItem.PackDimX / 2,
                    packedItem.CoordY + packedItem.PackDimY / 2,
                    packedItem.CoordZ + packedItem.PackDimZ / 2
                );
                let orientation = Item.ResolveOrientation(packedItem);
                let packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                packingResult.packed.push(packedCargo);
            }
        });
        
        this.Dispatch(signals.packUpdate, packingResult);
    }

    SolveCLP(){

        const CLPSolver = require('./clp/CLPSolver');

        var containingVolume = this.packingSpace.current.volume;
        console.warn('Currently solves for 1 ContainingVolume', containingVolume);

        var d = containingVolume.dimensions;
        /** @type {CLPSolver.ContainerData} */
        var container = {
            length: d.length, width: d.width, height: d.height,
            mandatory: 0, weightCapacity: d.volume / 1000, cost: 1,
            quantity: 1
        };

        /** @type {Array<CLPSolver.ItemData>} */
        var items = [];
        var entries = {};
        /** @type {Array<Dimensions>} */
        var dimensions = [];
        var itemType = 1;
        for(var group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            entries[itemType++] = entry;
            dimensions.push(entry.dimensions);
            d = entry.dimensions;

            /** @type {CLPSolver.ItemData} */
            let item = {
                length: d.length, width: d.width, height: d.height,
                xyRotatable: true, yzRotatable: true, mandatory: 1, profit: 0, weight: d.volume / 1000,
                quantity: entry.quantity
            };
            items.push(item);
        }

        console.log('entries:', entries);

        Logger.Log('Solving', items, ' in ', container);

        var scope = this;

        function findEntry(w, l, h){
            var matches = 0, matched = -1;
            var volume = w * l * h;
            for(var i = 0; i < dimensions.length; i++){
                if(almost(volume, dimensions[i].volume)){
                    matched = i;
                    matches++;
                }
            }

            if(matches === 1){
                return entries[matched + 1];
            }

            return undefined;
        }

        /** @param {CLPSolver.SolutionData} solution */
        function onSolution(solution){
            console.log(solution);
            let packedItems = solution.container.filter(container => container !== null)[0].items;
            var packingResult = new PackingResult();
            packedItems.forEach(packedItem => {
                if(packedItem && packedItem.item_type !== 0){
                    let w = packedItem.opposite_x - packedItem.origin_x,
                        h = packedItem.opposite_y - packedItem.origin_y,
                        l = packedItem.opposite_z - packedItem.origin_z;
                    let entry = entries[packedItem.item_type];
                    let position = new THREE.Vector3(
                        packedItem.origin_x + w / 2,
                        packedItem.origin_y + h / 2,
                        packedItem.origin_z + l / 2
                    );
                    let orientation = CLPSolver.ContainerItem.ResolveOrientation(packedItem.rotation);
                    let packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
                    packedCargo.solution = packedItem;
                    packingResult.packed.push(packedCargo);
                }
            });
            scope.Dispatch(signals.packUpdate, packingResult);
        }

        /** @type {CLPSolver.SolverOptions} */
        const solverOptions = {
            itemSortCriterion: 1,
            showProgress: false,
            cpuTimeLimit: 10
        };

        CLPSolver.signaler.On(CLPSolver.signals.solution, onSolution);
        CLPSolver.Execute(solverOptions, items, [container]);
    }

    SolveAAS(){
        const packedItems = [
            { id:"1003", position: { x:0, y:0, z:0 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1004", position: { x:60, y:0, z:0 }, dimensions: { width:30, depth:20, height:40 } },
            { id:"1004", position: { x:60, y:20, z:60 }, dimensions: { width:20, depth:30, height:40 } },
            { id:"1004", position: { x:80, y:20, z:60 }, dimensions: { width:20, depth:30, height:40 } },
            { id:"1003", position: { x:0, y:60, z:60 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1004", position: { x:60, y:60, z:60 }, dimensions: { width:30, depth:20, height:40 } },
            { id:"1005", position: { x:60, y:80, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:80, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1003", position: { x:0, y:120, z:60 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1005", position: { x:60, y:120, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:150, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:120, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:150, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1003", position: { x:0, y:180, z:60 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1005", position: { x:60, y:180, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:60, y:200, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:200, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1003", position: { x:0, y:240, z:60 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1005", position: { x:60, y:240, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:270, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:240, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:270, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1003", position: { x:0, y:300, z:60 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1005", position: { x:60, y:300, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:60, y:320, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:320, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1003", position: { x:0, y:360, z:60 }, dimensions: { width:60, depth:60, height:60 } },
            { id:"1005", position: { x:0, y:420, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:0, y:440, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:0, y:470, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:0, y:500, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:0, y:530, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:0, y:550, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:30, y:420, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:30, y:440, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:30, y:470, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:30, y:500, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:30, y:530, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:30, y:550, z:60 }, dimensions: { width:30, depth:20, height:30 } },
            { id:"1005", position: { x:60, y:360, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:390, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:420, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:450, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:480, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:510, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:60, y:540, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:360, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:390, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:420, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:450, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:480, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:510, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:80, y:540, z:60 }, dimensions: { width:20, depth:30, height:30 } },
            { id:"1005", position: { x:0, y:0, z:60 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:30, z:60 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:60, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:90, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:120, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:150, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:180, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:210, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:240, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:270, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:300, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:330, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:360, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:390, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:420, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:450, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:480, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:510, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:540, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:0, z:60 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:30, z:60 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:60, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:90, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:120, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:150, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:180, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:210, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:240, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:270, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:300, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:330, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:360, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:390, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:420, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:450, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:480, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:510, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:540, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:0, z:60 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:30, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:60, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:90, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:120, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:150, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:180, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:210, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:240, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:270, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:300, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:330, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:360, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:390, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:420, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:450, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:480, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:510, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:540, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:0, z:80 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:30, z:80 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:60, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:90, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:120, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:150, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:180, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:210, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:240, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:270, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:300, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:330, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:360, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:390, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:420, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:450, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:480, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:510, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:0, y:540, z:20 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:30, y:0, z:80 }, dimensions: { width:30, depth:30, height:20 } },
            { id:"1005", position: { x:60, y:0, z:80 }, dimensions: { width:30, depth:30, height:20 } }
        ];

        var containingVolume = this.packingSpace.current.volume;
        console.warn('Currently solves for 1 ContainingVolume', containingVolume);

        var entries = {};
        for(var group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            entries[entry.label] = entry;
        }

        const AASOrientation = require('./aas/AASOrientation');

        console.log('entries:', entries);
        
        var scope = this;
        var packingResult = new PackingResult();
        packedItems.forEach(packedItem => {
            let w = packedItem.dimensions.width,
                h = packedItem.dimensions.height,
                l = packedItem.dimensions.depth;
            /** @type {BoxEntry} */
            let entry = entries[packedItem.id];
            let position = new THREE.Vector3(
                packedItem.position.x + w / 2,
                packedItem.position.z + h / 2,
                packedItem.position.y + l / 2
            );
            let orientation = AASOrientation.resolve(w, l, h, entry.dimensions);
            let packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
            packedCargo.solution = packedItem;
            packingResult.packed.push(packedCargo);
        });
        scope.Dispatch(signals.packUpdate, packingResult);
    }

    SolveSim(){
        const Bin = require('./sim/Bin').default;
        const Item = require('./sim/Item').default;
        const SimPacker = require('./sim/Packer').default;

        var containingVolume = this.packingSpace.current.volume;
        console.warn('Currently solves for 1 ContainingVolume', containingVolume);

        var d = containingVolume.dimensions;
        var bin = new Bin(containingVolume.uid, d.width, d.height, d.length, containingVolume.weightCapacity);

        /** @type {Array<Box>} */
        var items = [];
        var entries = {};
        for(var group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            entries[entry.uid] = entry;
            d = entry.dimensions;
            for(var iQtt = 0; iQtt < entry.quantity; iQtt++){
                let item = new Item(entry.uid, d.width, d.height, d.length, entry.weight);
                items.push(item);
            }
        }

        Logger.Log('Solving', items, ' in ', bin);

        var startTime = performance.now();
        var simPacker = new SimPacker([bin], items).pack();
        /** @type {Array<Box>} */
        var packedItems = simPacker.bins[0].items;
        Logger.Log('Solved in ' + Math.ceil(performance.now() - startTime) + ':', packedItems);

        var packingResult = new PackingResult();
        packedItems.forEach(packedItem => {
            let entry = entries[packedItem.name];

            let d = packedItem.getDimension();
            let position = new THREE.Vector3(
                packedItem.position[0] + d[0] / 2,
                packedItem.position[1] + d[1] / 2,
                packedItem.position[2] + d[2] / 2
            );

            let orientation = packedItem.getRotationTypeString();

            let packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
            packingResult.packed.push(packedCargo);
        });
        
        this.Dispatch(signals.packUpdate, packingResult);
    }

    SolveBRB(){

        const BRB = require('./brb/BRB');

        var containingVolume = this.packingSpace.current.volume;
        console.warn('Currently solves for 1 ContainingVolume', containingVolume);

        var d = containingVolume.dimensions;

        /** @type {import('./brb/BRB').Container} */
        var container = {
            dimensions: [d.width, d.height, d.length],
            weight: containingVolume.weightCapacity
        };

        /** @type {Array<import('./brb/BRB').Item>} */
        var items = [];
        var entries = {};
        for(var group of this.cargoList.groups.values()){
            /** @type {BoxEntry} */
            let entry = group.entry;
            entries[entry.uid] = entry;
            d = entry.dimensions;
            for(var iQtt = 0; iQtt < entry.quantity; iQtt++){
                /** @type {import('./brb/BRB').Item} */
                let item = {
                    id: entry.uid,
                    dimensions: [d.width, d.height, d.length],
                    weight: entry.weight
                };
                items.push(item);
            }
        }

        Logger.Log('Solving', items, ' in ', container);

        var startTime = performance.now();
        var result = BRB.pack(container, items);

        if( result.failed ){
            console.log('BRB packing failed: ' + result.failed);
            return;
        }
        
        Logger.Log('Solved in ' + Math.ceil(performance.now() - startTime) + ':', result);

        var packingResult = new PackingResult();
        var iPackings = 0;
        /** @param {import('./brb/BRB').Placement} placement */
        function collectPlacements(placement) {
            /** @type {BoxEntry} */
            let entry = entries[placement.id];

            let containerOffset = iPackings * containingVolume.dimensions.width;
            let p = placement.position;
            let d = placement.dimensions;
            let position = new THREE.Vector3(
                p[0] + d[0] / 2,
                p[1] + d[1] / 2,
                p[2] + d[2] / 2
            );
            position.set(position.z, position.y, position.x);
            position.x += containerOffset;
            let packedDimensions = d;
            packedDimensions = [d[2], d[1], d[0]];

            let ed = entry.dimensions;
            let orientation = BRB.resolveOrientation(packedDimensions, [ed.width, ed.height, ed.length]);

            let packedCargo = new PackedCargo(entry, containingVolume, position, orientation);
            packingResult.packed.push(packedCargo);
        }

        /** @param {import('./brb/BRB').Packing} packing */
        function collectPackings(packing) {
            packing.placements.forEach(collectPlacements);
            iPackings++;
        }
        result.packings.forEach(collectPackings);
        
        this.Dispatch(signals.packUpdate, packingResult);
    }

    static get signals(){
        return signals;
    }

}

Packer.PackingResult = PackingResult;

export default Packer;