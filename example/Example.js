
var Example = function(){
    console.log('Freight Packer API Example');

    var containerDiv = document.getElementById('fp-view');
    var options = {
        debug: true
    };

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
};

Object.assign(Example.prototype, {

    // Box input
    BoxInputUpdate: function(values){
        this.api.boxInput.Update(values.width, values.length, values.height);
    },

    BoxInputComplete: function(){
        var entry = this.api.boxInput.Complete();
        this.BoxInputUpdate(entry); // Start new entry 'session' with same values
    },

    BoxInputAbort: function(){
        this.api.boxInput.Abort();
    }
});