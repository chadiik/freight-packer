
// enable vscode intellisense
if(false){ var FreightPacker = require('../src/FreightPacker').default; }

/**
 * @typedef IDimensions
 * @property {Number} width
 * @property {Number} length
 * @property {Number} height
 */

class Example {
    constructor(){
        console.log('Freight Packer API Example');

        var scope = this;
        FreightPacker.CheckRequirements().then(
            () => { // success
                scope.Start();
            },
            (errorMsg) => { // failure
                console.warn('FreightPacker requirements not met, error:', errorMsg);
            }
        );
    }

    Start(){
        /** @type {import('../src/FreightPacker').InitializationParams} */
        var params = {
            debug: true,
            ux: {
                configure: true
            }
        };
        var containerDiv = document.getElementById('fp-view');
        
        this.api = new FreightPacker(containerDiv, params);
        this.boxEntry = this.api.cargoInput.CreateBoxEntry();

        /** @type {Map<Object, string>} */
        this.boxEntries = new Map();

        var ui = new ExampleUI();
        var signals = ExampleUI.signals;
        ui.On(signals.loadPSConfig, this.SetPackingSpace.bind(this));
        ui.On(signals.boxInputDimensionsUpdate, this.BoxInputDimensionsUpdate.bind(this));
        ui.On(signals.boxInputComplete, this.BoxInputComplete.bind(this));
        ui.On(signals.boxInputAbort, this.BoxInputAbort.bind(this));
    }

    // Packing space
    SetPackingSpace(jsonObject){
        this.api.packingSpaceInput.Load(jsonObject);
    }

    // Box input
    /** @param {IDimensions} dimensions */
    BoxInputDimensionsUpdate(dimensions){
        // Copy values into entry's dimensions object
        this.boxEntry.dimensions.Set(dimensions.width, dimensions.length, dimensions.height);
        // Shows/updates input in viewer
        var success = this.api.cargoInput.Show(this.boxEntry);
    }

    BoxInputComplete(){
        // Add entry, get an uid for later changes (or false on error)
        var uid = this.api.cargoInput.Add(this.boxEntry);
        if(uid){
            // Saves a copy of that entry (should be treated as read-only)
            var snapshot = this.boxEntry.Clone();
            this.boxEntries.set(snapshot, uid);
        }

        // Start new entry 'session' with same values
        this.BoxInputDimensionsUpdate(snapshot.dimensions);
    }

    BoxInputAbort(){
        // Hides input in viewer
        this.api.cargoInput.Hide();
    }
}