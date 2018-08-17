
// enable vscode intellisense
if(false){ var FreightPacker = require('../src/FreightPacker').default; }
// expose typedef s for intellisense
/** @typedef {import('../src/api/Types').InitializationParams} InitializationParams */
/** @typedef {import('../src/api/Types').SolverParams} SolverParams */
/** @typedef {import('../src/api/Types').CUBParams} CUBParams */
/** @typedef {import('../src/api/Types').BoxEntry} BoxEntry */

/**
 * Parameters and data obtained from the UI mockup
 * 
 * @typedef UIEntry
 * @property {string} label
 * @property {Number} weight
 * @property {Number} quantity
 * @property {Number} width
 * @property {Number} length
 * @property {Number} height
 */

/**
 * Custom data related to cargo entries
 * 
 * @typedef CustomBoxEntry
 * @property {BoxEntry} entry
 * @property {string} extraData
 */

/**
 * Custom data related to packing space configs
 * 
 * @typedef CustomPackingSpaceData
 * @property {string} extraData
 */

const typeofString = 'string',
    typeofNumber = 'number';

class Example {
    constructor(){
        console.log('Freight Packer API Example');

        let scope = this;
        FreightPacker.CheckRequirements().then(
            () => { // success
                scope.Start();
            },
            (errorMsg) => { // failure
                console.warn('FreightPacker requirements not met, error:', errorMsg);
            }
        );
    }

    Feedback(...args){
        console.log(' >> UI ', ...args);
    }

    Start(){
        /** @type {InitializationParams} */
        let params = {
            debug: true,
            uxParams: {
                hud: true,
                configure: false,
                units: 1,
                autoUpdatePack: true
            }
        };
        let containerDiv = document.getElementById('fp-view');
        
        this.api = new FreightPacker(containerDiv, params);
        this.api.On(FreightPacker.signals.ready, this.OnAPIReady.bind(this));
        this.boxEntry = this.api.cargoInput.CreateBoxEntry();

        /** @type {Map<string, CustomBoxEntry>} */
        this.boxEntries = new Map();

        /** @type {Map<string, CustomPackingSpaceData>} */
        this.packingSpaces = new Map();

        /** @type {UIEntry} */
        let initEntryData = {
            label: this.boxEntry.label, weight: this.boxEntry.weight, quantity: this.boxEntry.quantity
        };
        let ui = new ExampleUI(initEntryData);
        let signals = ExampleUI.signals;

        ui.On(signals.packRequest, this.SolvePacking.bind(this));
        ui.On(signals.sliceResults, this.SliceResults.bind(this));

        ui.On(signals.loadPSConfig, this.SetPackingSpace.bind(this));

        ui.On(signals.boxInputUpdate, this.BoxInputUpdate.bind(this));
        ui.On(signals.boxInputComplete, this.BoxInputComplete.bind(this));
        ui.On(signals.boxInputAbort, this.BoxInputAbort.bind(this));

        ui.On(signals.boxEntryRequest, this.OnBoxEntryRequest.bind(this));
        ui.On(signals.boxInputModify, this.OnBoxEntryModify.bind(this));
        ui.On(signals.boxInputRemove, this.OnBoxEntryRemove.bind(this));
    }

    OnAPIReady(){
        let scope = this;

        // Bind to user selection of an entry
        this.api.ux.user.On(FreightPacker.UX.User.signals.boxEntryInteract, this.OnBoxEntryInteract.bind(this));

        // Bind to packing events
        this.api.packer.On(FreightPacker.Packer.signals.solved, (result) => scope.Feedback('Packing solved:', result));
        this.api.packer.On(FreightPacker.Packer.signals.failed, (error) => scope.Feedback('Packing failed:', error));

        // Update some parameters
        this.api.ux.visualization.packResults.animationDuration = .5;
    }

    // Packing space
    SetPackingSpace(jsonObject){
        // Load packing config, get an uid for later changes (or false on error)
        let uid = this.api.packingSpaceInput.Load(jsonObject);
        if(uid){
            // Map data to some values, using its uid
            /** @type {CustomPackingSpaceData} */
            let someData = {
                extraData: 'Example packing space: ' + uid
            };
            this.packingSpaces.set(uid, someData);
        }
    }

    // Box input
    /** @param {UIEntry} uiEntry */
    BoxInputUpdate(uiEntry){

        // Copy values into local boxEntry
        if(uiEntry){
            if(typeof uiEntry.label === typeofString) this.boxEntry.label = uiEntry.label;
            if(typeof uiEntry.weight === typeofNumber) this.boxEntry.weight = uiEntry.weight;
            if(typeof uiEntry.quantity === typeofNumber) this.boxEntry.quantity = uiEntry.quantity;

            if( typeof uiEntry.width === typeofNumber
                && typeof uiEntry.length === typeofNumber
                && typeof uiEntry.height === typeofNumber
            ){
                this.boxEntry.dimensions.Set(uiEntry.width, uiEntry.length, uiEntry.height);
            }
        }

        // Shows/updates input in viewer
        let success = this.api.cargoInput.Show(this.boxEntry);
    }

    BoxInputComplete(){
        // Add entry, get an uid for later changes (or false on error)
        let uid = this.api.cargoInput.Add(this.boxEntry);
        if(uid){
            // Map entry to some values, using its uid
            /** @type {CustomBoxEntry} */
            let someData = {
                entry: this.boxEntry.Clone(), // copy of values
                extraData: 'Example item: ' + uid
            };
            this.boxEntries.set(uid, someData);
        }

        // Start new entry 'session' with same values
        this.BoxInputUpdate(undefined);
    }

    BoxInputAbort(){
        // Hides input in viewer
        this.api.cargoInput.Hide();
    }

    /** @param {string} entryUID */
    OnBoxEntryRequest(entryUID, uiCallback){
        let boxEntry = this.api.cargoInput.GetEntry(entryUID);
        if(boxEntry){
            uiCallback(boxEntry);
        }
    }

    /** @param {string} entryUID @param {UIEntry} uiEntry */
    OnBoxEntryModify(entryUID, uiEntry){

        // Copy values into local boxEntry
        if(typeof uiEntry.label === typeofString) this.boxEntry.label = uiEntry.label;
        if(typeof uiEntry.weight === typeofNumber) this.boxEntry.weight = uiEntry.weight;
        if(typeof uiEntry.quantity === typeofNumber) this.boxEntry.quantity = uiEntry.quantity;

        if( typeof uiEntry.width === typeofNumber
            && typeof uiEntry.length === typeofNumber
            && typeof uiEntry.height === typeofNumber
        ){
            this.boxEntry.dimensions.Set(uiEntry.width, uiEntry.length, uiEntry.height);
        }
        
        // Modify entry
        this.api.cargoInput.Modify(entryUID, this.boxEntry);
    }

    /** @param {string} entryUID */
    OnBoxEntryRemove(entryUID){
        this.api.cargoInput.Remove(entryUID);
    }

    /** @param {string} entryUID */
    OnBoxEntryInteract(entryUID){

        // Get CustomBoxEntry using uid
        let someData = this.boxEntries.get(entryUID);

        // If same as previous selection, deselect (or anything else)
        if(entryUID === this.selectedBoxEntryUID){
            this.selectedBoxEntryUID = false;
            this.api.ux.visualization.SelectEntry(false);
            this.Feedback('Deselected -> ' + someData.extraData);
        }
        else{
            this.selectedBoxEntryUID = entryUID;
            // Select entry in scene
            this.api.ux.visualization.SelectEntry(entryUID);
            this.Feedback('Selected -> ' + someData.extraData);
        }
    }

    /** @param {string} algorithm @param {CUBParams} algorithmParams */
    SolvePacking(algorithm, algorithmParams){

        /** @type {SolverParams} */
        let solverParams = {
            algorithm: algorithm,
            algorithmParams: algorithmParams
        };

        this.Feedback('Packing request using:', solverParams);
        this.api.packer.Solve(solverParams);
    }

    SliceResults(sliceValue){
        sliceValue = Math.max(0, Math.min(1, sliceValue));
        this.api.ux.visualization.packResults.SliceResults(sliceValue);
    }
}