
// enable vscode intellisense on FreightPacker
if(false){ var FreightPacker = require('../src/FreightPacker').default; }

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
        var options = {
            debug: true
        };

        /**
         * @type {FreightPacker}
         */
        this.api;

        var scope = this;
        FreightPacker.CheckRequirements().then(
            () => { // success
                scope.api = new FreightPacker(containerDiv, options);
                new ExampleUI(scope);
            },
            (errorMsg) => { // failure
                console.warn('FreightPacker requirements not met', errorMsg);
            }
        );
    }

    // Box input
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