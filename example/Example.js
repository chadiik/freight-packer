
// enable vscode intellisense on FreightPacker
if(false){ var FreightPacker = require('../src/FreightPacker').default; }

/**
 * @typedef Dimensions
 * @property {Number} width
 * @property {Number} length
 * @property {Number} height
 */

var cargoInputParams = {
    width: 0,
    length: 0,
    height: 0,
    fields: {
        label: '-'
    }
};

class Example {
    constructor(){
        console.log('Freight Packer API Example');

        var containerDiv = document.getElementById('fp-view');

        /**
         * @type {import('../src/FreightPacker').InitializationParams}
         */
        var params = {
            debug: true,
            ux: {
                configure: true
            }
        };

        /**
         * @type {FreightPacker}
         */
        this.api;

        var scope = this;
        FreightPacker.CheckRequirements().then(
            () => { // success
                scope.api = new FreightPacker(containerDiv, params);
                new ExampleUI(scope);
            },
            (errorMsg) => { // failure
                console.warn('FreightPacker requirements not met', errorMsg);
            }
        );
    }

    // Packing space
    SetPackingSpace(jsonObject){
        this.api.packingSpaceInput.Load(jsonObject);
    }

    // Box input
    /**
     * @param {Dimensions} dimensions 
     */
    BoxInputDimensionsUpdate(dimensions){
        Object.assign(cargoInputParams, dimensions);
        this.api.cargoInput.Update(cargoInputParams);
    }

    BoxInputComplete(){
        var dimensions = this.api.cargoInput.currentEntry.dimensions.Clone(); // Get dimensions
        this.api.cargoInput.Complete();

        this.BoxInputDimensionsUpdate(dimensions); // Start new entry 'session' with same values
    }

    BoxInputAbort(){
        this.api.cargoInput.Abort();
    }
}