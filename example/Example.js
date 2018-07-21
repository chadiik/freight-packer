
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
        /**
         * @type {import('../src/FreightPacker').InitializationParams}
         */
        var params = {
            debug: true,
            ux: {
                configure: true
            }
        };
        var containerDiv = document.getElementById('fp-view');
        
        this.api = new FreightPacker(containerDiv, params);
        this.boxEntry = this.api.cargoInput.CreateBoxEntry();

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
    /**
     * @param {IDimensions} dimensions 
     */
    BoxInputDimensionsUpdate(dimensions){
        this.boxEntry.dimensions.Set(dimensions.width, dimensions.length, dimensions.height);
        this.api.cargoInput.Update(this.boxEntry);
    }

    BoxInputComplete(){
        var dimensions = this.boxEntry.dimensions.Clone(); // Get dimensions
        this.api.cargoInput.Complete(this.boxEntry);

        this.BoxInputDimensionsUpdate(dimensions); // Start new entry 'session' with same values
    }

    BoxInputAbort(){
        this.api.cargoInput.Abort();
    }
}