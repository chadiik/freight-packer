
// enable vscode intellisense
if(false){ var FreightPacker = require('../src/FreightPacker').default; }

/**
 * @typedef UIEntry
 * @property {string} label
 * @property {Number} weight
 * @property {Number} quantity
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

        var b = this.boxEntry;
        var initEntryData = {
            label: b.label, weight: b.weight, quantity: b.quantity, 
            width: b.dimensions.width, length: b.dimensions.length, height: b.dimensions.height
        };
        var ui = new ExampleUI(initEntryData);
        var signals = ExampleUI.signals;
        ui.On(signals.loadPSConfig, this.SetPackingSpace.bind(this));

        ui.On(signals.boxInputUpdate, this.BoxInputUpdate.bind(this));
        ui.On(signals.boxInputComplete, this.BoxInputComplete.bind(this));
        ui.On(signals.boxInputAbort, this.BoxInputAbort.bind(this));
    }

    // Packing space
    SetPackingSpace(jsonObject){
        this.api.packingSpaceInput.Load(jsonObject);
    }

    // Box input
    /** @param {UIEntry} uiEntry */
    BoxInputUpdate(uiEntry){

        // Copy values into entry
        if(uiEntry){
            this.boxEntry.label = uiEntry.label;
            this.boxEntry.weight = uiEntry.weight;
            this.boxEntry.quantity = uiEntry.quantity;
            this.boxEntry.dimensions.Set(uiEntry.width, uiEntry.length, uiEntry.height);
        }

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
        this.BoxInputUpdate(undefined);
    }

    BoxInputAbort(){
        // Hides input in viewer
        this.api.cargoInput.Hide();
    }
}