
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

const stringType = 'string',
    numberType = 'number';

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
                hud: false,
                configure: true
            }
        };
        var containerDiv = document.getElementById('fp-view');
        
        this.api = new FreightPacker(containerDiv, params);
        this.boxEntry = this.api.cargoInput.CreateBoxEntry();

        /** @type {Map<Object, string>} */
        this.boxEntries = new Map();

        var b = this.boxEntry;
        /** @type {UIEntry} */
        var initEntryData = {
            label: b.label, weight: b.weight, quantity: b.quantity
        };
        var ui = new ExampleUI(initEntryData);
        var signals = ExampleUI.signals;

        ui.On(signals.packRequest, this.SolvePacking.bind(this));

        ui.On(signals.loadPSConfig, this.SetPackingSpace.bind(this));

        ui.On(signals.boxInputUpdate, this.BoxInputUpdate.bind(this));
        ui.On(signals.boxInputComplete, this.BoxInputComplete.bind(this));
        ui.On(signals.boxInputAbort, this.BoxInputAbort.bind(this));
    }

    SolvePacking(algorithm){
        console.log('Packing request using ' + algorithm);
        this.api.packer.Solve(algorithm);
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
            if(typeof uiEntry.label === stringType) this.boxEntry.label = uiEntry.label;
            if(isNaN(uiEntry.weight) === false) this.boxEntry.weight = uiEntry.weight;
            if(isNaN(uiEntry.quantity) === false) this.boxEntry.quantity = uiEntry.quantity;

            if( isNaN(uiEntry.width) === false
                && isNaN(uiEntry.length) === false
                && isNaN(uiEntry.height) === false
            ){
                this.boxEntry.dimensions.Set(uiEntry.width, uiEntry.length, uiEntry.height);
            }
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