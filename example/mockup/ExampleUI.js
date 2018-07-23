
// enable vscode intellisense on FreightPacker
if(false){ var FreightPacker = require('../../src/FreightPacker').default; }

const namespace = FPEditor.namespace;

const signals = {
    loadPSConfig: 'loadPSConfig',
    boxInputUpdate: 'boxInputUpdate',
    boxInputComplete: 'boxInputComplete',
    boxInputAbort: 'boxInputAbort'
};

console.log(FreightPacker.utils);

class ExampleUI extends FreightPacker.utils.Signaler {
    constructor(inputData){
        super();

        this.gui = new (window.dat || FreightPacker.utils.dat).GUI({
            autoPlace: false
        });

        this.domElement = document.getElementById('fp-gui');
        this.domElement.appendChild(this.gui.domElement);

        this.CreateSpaceController();
        this.CreateInputController(inputData);
    }

    CreateSpaceController(){
        var scope = this;

        var loadConfig = function(){
            namespace.IO.GetFile(function(file){
                var data = JSON.parse(file);
                scope.Dispatch(ExampleUI.signals.loadPSConfig, data);
            }, false);
        };

        var controller = {
            LoadPSConfig: loadConfig
        };

        var spaceFolder = this.gui.addFolder('Packing space');
        spaceFolder.open();
        spaceFolder.add(controller, 'LoadPSConfig');
    }

    CreateInputController(data){
        var scope = this;
        
        var boxRange = {w:[4, 20], l:[4, 20], h:[2, 16]};
        var boxInput = FreightPacker.utils.Utils.AssignUndefined(data || {}, {width:0, length:0, height:0, label: '', weight: 0, quantity: 1});
        
        var inputUpdate = function(){
            scope.Dispatch(ExampleUI.signals.boxInputUpdate, boxInput);
        };
        var complete = function(){
            scope.Dispatch(ExampleUI.signals.boxInputComplete);
        };
        var abort = function(){
            scope.Dispatch(ExampleUI.signals.boxInputAbort);
        };

        var p = 4;
        var randomInput = function(){
            controller.Width    = Math.floor((boxRange.w[0] + Math.random() * (boxRange.w[1] - boxRange.w[0])) * p) / p;
            controller.Length   = Math.floor((boxRange.l[0] + Math.random() * (boxRange.l[1] - boxRange.l[0])) * p) / p;
            controller.Height   = Math.floor((boxRange.h[0] + Math.random() * (boxRange.h[1] - boxRange.h[0])) * p) / p;
            complete();
        };
        var controller = {
            Random: randomInput,
            Insert: complete,
            Abort: abort
        };
        Object.defineProperties(controller, {
            Width: {
                get: function(){ return boxInput.width;},
                set: function(value){ boxInput.width = value; inputUpdate();}
            },
            Length: {
                get: function(){ return boxInput.length;},
                set: function(value){ boxInput.length = value; inputUpdate();}
            },
            Height: {
                get: function(){ return boxInput.height;},
                set: function(value){ boxInput.height = value; inputUpdate();}
            },
            Label: {
                get: function(){ return boxInput.label;},
                set: function(value){ boxInput.label = value; inputUpdate();}
            },
            Weight: {
                get: function(){ return boxInput.weight;},
                set: function(value){ boxInput.weight = value; inputUpdate();}
            },
            Quantity: {
                get: function(){ return boxInput.quantity;},
                set: function(value){ boxInput.quantity = value; inputUpdate();}
            }
        });

        var inputFolder = this.gui.addFolder('Cargo input');
        inputFolder.open();
        inputFolder.add(controller, 'Random');

        var infoFolder = inputFolder.addFolder('Info');
        infoFolder.open();
        infoFolder.add(controller, 'Label');
        infoFolder.add(controller, 'Weight');
        infoFolder.add(controller, 'Quantity');

        var dimensionsFolder = inputFolder.addFolder('Dimensions');
        dimensionsFolder.open();
        dimensionsFolder.add(controller, 'Width' , boxRange.w[0], boxRange.w[1]).step(1/p).listen();
        dimensionsFolder.add(controller, 'Length', boxRange.l[0], boxRange.l[1]).step(1/p).listen();
        dimensionsFolder.add(controller, 'Height', boxRange.h[0], boxRange.h[1]).step(1/p).listen();

        inputFolder.add(controller, 'Insert');
        inputFolder.add(controller, 'Abort');

        controller.Random();
        
    }

    static get signals(){
        return signals;
    }
}