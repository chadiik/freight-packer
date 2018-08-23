//#region api intellisense

// enable vscode intellisense on FreightPacker
if(false){ var FreightPacker = require('../src/FreightPacker').default; }
// expose typedefs for intellisense
/** @typedef {import('../src/api/Types').InitializationParams} InitializationParams */
/** @typedef {import('../src/api/Types').SolverParams} SolverParams */
/** @typedef {import('../src/api/Types').CUBParams} CUBParams */
/** @typedef {import('../src/api/Types').BoxEntry} BoxEntry */

//#endregion

//#region example intellisense

/** Parameters and data obtained from the UI mockup
 * 
 * @typedef UIEntry
 * @property {string} uid
 * @property {string} label
 * @property {Number} weight
 * @property {Number} quantity
 * @property {Number} width
 * @property {Number} length
 * @property {Number} height
 * @property {string} validOrientations orientations in csv format: 'xyz, zyx, yxz, yzx, zxy, xzy'
 * @property {Number} stackingCapacity
 * @property {Boolean} grounded
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

//#endregion

class Example {
    constructor(){
        console.log('Freight Packer API Example');

        let scope = this;
        // Check that webgl, etc are supported in this browser
        FreightPacker.CheckRequirements().then(
            () => { // success
                scope.Start();
            },
            (errorMsg) => { // failure
                console.warn('FreightPacker requirements not met, error:', errorMsg);
                document.getElementById('no-webgl').style.display = 'block';
            }
        );
    }

    Feedback(...args){
        console.log('UI >> ', ...args);
        ExampleUI.LogToPane(...args);
    }

    // Initialize API
    Start(){
        
        /** @type {InitializationParams} */
        let params = {
            debug: false, // set to false for deployment
            texturesPath: '../resources/textures/', // url to textures directory
            uxParams: {
                hud: true, // create hud (viz not in 3D scene, ie: scale ref)
                configure: false, // execute helpers that allow configuration
                units: 1, // conversion to unit employed, default=1 for inches, for meters: units=0.0254
                autoUpdatePack: true, // will auto-update the packing if entries are modified or deleted
                backgroundColor: 0xf0f0f0, // viewer background color
                scaleRefFigure: FreightPacker.Constants.scaleRefFigure.man // human figure to show as scale reference
            },
            packerParams: {
                defaultStackingFactor: 10 // multiplier for stacking capacity (capacity = weight * defaultStackingFactor) if stackingProperty is not enabled
            }
        };

        let containerDiv = document.getElementById('fp-view');
        
        this.api = new FreightPacker(containerDiv, params);
        // Only use when ready
        this.api.On(FreightPacker.signals.ready, this.OnAPIReady.bind(this));

        // Maps of uid to box cargo entries and packing space
        /** @type {Map<string, CustomBoxEntry>} */
        this.boxEntries = new Map();
        /** @type {Map<string, CustomPackingSpaceData>} */
        this.packingSpaces = new Map();

        // Mockup UI setup
        let signals = ExampleUI.signals;
        let ui = new ExampleUI();
            ui.On(signals.packRequest, this.SolvePacking.bind(this));
            ui.On(signals.sliceResults, this.SliceResults.bind(this));

            ui.On(signals.loadPSConfig, this.SetPackingSpace.bind(this));
            ui.On(signals.inputPSConfig, this.InputPackingSpace.bind(this));

            ui.On(signals.boxInputUpdate, this.BoxInputUpdate.bind(this));
            ui.On(signals.boxInputComplete, this.BoxInputComplete.bind(this));
            ui.On(signals.boxInputAbort, this.BoxInputAbort.bind(this));

            ui.On(signals.boxInputModify, this.OnBoxEntryModify.bind(this));
            ui.On(signals.boxInputRemove, this.OnBoxEntryRemove.bind(this));
    }

    /**
     * Initialization and events bindings
     */
    OnAPIReady(){
        // Request a BoxEntry object template, to populate and add entries
        this.boxEntry = this.api.cargoInput.CreateBoxEntry();

        // Bind to user selection of an entry
        this.api.ux.user.On(FreightPacker.UX.User.signals.boxEntryInteract, this.OnBoxEntryInteract.bind(this));

        let scope = this;
        // Bind to some of cargoInput events
        this.api.cargoInput.On(FreightPacker.CargoInput.signals.insert, (boxEntry) => scope.Feedback('BoxEntry inserted:', boxEntry));
        this.api.cargoInput.On(FreightPacker.CargoInput.signals.modify, (boxEntry) => scope.Feedback('BoxEntry modified:', boxEntry));

        // Bind to packing events
        this.api.packer.On(FreightPacker.Packer.signals.solved, (result) => scope.Feedback('Packing solved:', result));
        this.api.packer.On(FreightPacker.Packer.signals.failed, (error) => scope.Feedback('Packing failed:', error));

        // Update some parameters
        this.api.ux.visualization.packResults.animationDuration = .5;
    }

    /**
     * Load packing space
     * @param {Object|string} jsonObject
     */
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

    /**
     * Manual input to create a packing space without a 3D model
     * @param {Object} params
     */
    InputPackingSpace(params){
        let validInput = typeof params.width === typeofNumber
            && typeof params.length === typeofNumber
            && typeof params.height === typeofNumber
            && typeof params.weightCapacity === typeofNumber;
        let uid;
        if(validInput) uid = this.api.packingSpaceInput.FromInput(params.width, params.length, params.height, params.weightCapacity);
        
        if(uid){
            // Map data to some values, using its uid
            /** @type {CustomPackingSpaceData} */
            let someData = {
                extraData: 'Input packing space: ' + uid
            };
            this.packingSpaces.set(uid, someData);
        }
    }

    /** 
     * Box input update (optionally show in viewer (optionally with a scale reference))
     *  @param {UIEntry} uiEntry @param {Boolean} showUpdates */
    BoxInputUpdate(uiEntry, showUpdates){

        // Copy values into local boxEntry
        if(uiEntry){
            Example.CopyToLocal(uiEntry, this.boxEntry);
        }

        // Shows/updates input in viewer
        if(showUpdates){
            let success = this.api.cargoInput.Show(this.boxEntry);
        }
    }

    /**
     * Commit a populated BoxEntry, receiving a uid string for reference
     */
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
        this.BoxInputUpdate(undefined, false);
    }

    /**
     * Hides entry in viewer (if it was shown/live-updating)
     */
    BoxInputAbort(){
        // Hides input in viewer
        this.api.cargoInput.Hide();
    }

    /** 
     * Request a reference to the BoxEntry object using the uid
     * @param {string} entryUID @return {Promise<BoxEntry>} 
     * */
    BoxEntryRequest(entryUID){
        // Get entry
        let boxEntry = this.api.cargoInput.GetEntry(entryUID);

        // Get an array of all BoxEntry objects:
        if(false) var allBoxEntries = this.api.cargoInput.GetEntries();

        // Since CargoInput.GetEntry(uid) and CargoInput.GetEntries() create new BoxEntry instances,
        // You may want to return unneeded instances to the internal object pool for reuse if used frequently
        if(false) this.api.cargoInput.Recycle(boxEntry);
        if(false) this.api.cargoInput.Recycle(allBoxEntries);

        // Return Promise for ExampleUI
        return new Promise( (resolve, reject) => boxEntry ? resolve(boxEntry) : reject() );
    }

    /** 
     * Modify an existing BoxEntry, referenced by its uid, using a modifed template
     * @param {string} entryUID @param {UIEntry} uiEntry */
    OnBoxEntryModify(entryUID, uiEntry){

        // Copy values into local boxEntry
        Example.CopyToLocal(uiEntry, this.boxEntry);
        
        // Modify entry
        this.api.cargoInput.Modify(entryUID, this.boxEntry);
    }

    /** 
     * Remove entry from cargo list
     * @param {string} entryUID */
    OnBoxEntryRemove(entryUID){
        this.api.cargoInput.Remove(entryUID);
    }

    /** 
     * User interaction (currently: click) with BoxEntry in viewer
     * @param {string} entryUID */
    OnBoxEntryInteract(entryUID){

        // Get CustomBoxEntry using uid
        let someData = this.boxEntries.get(entryUID);

        // If same as previous selection, deselect
        if(entryUID === this.previousSelectionUID){
            this.previousSelectionUID = false;
            // Use parameter entry = false to deselect entry
            this.api.ux.visualization.SelectEntry(false);
            this.Feedback('Deselected -> ' + someData.extraData);
        }
        else{
            this.previousSelectionUID = entryUID;
            // Select entry in scene (optionally highlighting packed instances)
            this.api.ux.visualization.SelectEntry(entryUID, true);
            this.Feedback('Selected -> ' + someData.extraData);

            // Updates UI fields
            this.BoxEntryRequest(entryUID).then( (boxEntry) => ExampleUI.UpdateInput(boxEntry) );
        }
    }

    /** 
     * Solve packing for current cargo list in loaded packing space
     * @param {string} algorithm @param {CUBParams} algorithmParams */
    SolvePacking(algorithm, algorithmParams){

        /** @type {SolverParams} */
        let solverParams = {
            algorithm: algorithm,
            algorithmParams: algorithmParams
        };

        this.Feedback('Packing request using:', solverParams);
        this.api.packer.Solve(solverParams);
    }

    /**
     * Hides stacked boxes in viewer by vertical position
     * @param {Number} sliceValue [0 - 1]
     */
    SliceResults(sliceValue){
        sliceValue = Math.max(0, Math.min(1, sliceValue));
        this.api.ux.visualization.packResults.SliceResults(sliceValue);
    }

    /** 
     * Assert input values and types and populate the BoxEntry template
     * @param {UIEntry} uiEntry @param {BoxEntry} boxEntry */
    static CopyToLocal(uiEntry, boxEntry){
        if(typeof uiEntry.uid === typeofString) boxEntry.SetUID(uiEntry.uid);

        if(typeof uiEntry.label === typeofString) boxEntry.label = uiEntry.label;
        if(typeof uiEntry.weight === typeofNumber) boxEntry.weight = uiEntry.weight;
        if(typeof uiEntry.quantity === typeofNumber) boxEntry.quantity = uiEntry.quantity;

        if( typeof uiEntry.width === typeofNumber
            && typeof uiEntry.length === typeofNumber
            && typeof uiEntry.height === typeofNumber
        ){
            boxEntry.dimensions.Set(uiEntry.width, uiEntry.length, uiEntry.height);
        }

        let rotation = boxEntry.properties.rotation;
        rotation.enabled = uiEntry.validOrientations instanceof Array && uiEntry.validOrientations.length > 0;
        if(rotation.enabled) rotation.allowedOrientations = csv(uiEntry.validOrientations);

        let stacking = boxEntry.properties.stacking;
        stacking.enabled = typeof uiEntry.stackingCapacity === typeofNumber && uiEntry.stackingCapacity >= 0;
        if(stacking.enabled) stacking.capacity = uiEntry.stackingCapacity;

        let translation = boxEntry.properties.translation;
        translation.enabled = uiEntry.grounded;
        if(translation.enabled) translation.grounded = uiEntry.grounded;
    }
}

const spacesExp = new RegExp(' ', 'g');
/** @param {string} str */
function csv(str){
    return str.replace(spacesExp, '').split(',');
}