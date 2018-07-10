
// enable vscode intellisense on FreightPacker
if(false){ var FreightPacker = require('../src/FreightPacker').default; }

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
    BoxInputUpdate(dimensions){
        this.api.cargoInput.Update(dimensions.width, dimensions.length, dimensions.height);
    }

    BoxInputComplete(){
        var dimensions = this.api.cargoInput.currentEntry.dimensions.Clone(); // Get dimensions
        this.api.cargoInput.Complete();

        this.BoxInputUpdate(dimensions); // Start new entry 'session' with same values
    }

    BoxInputAbort(){
        this.api.cargoInput.Abort();
    }
}