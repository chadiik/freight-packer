
// enable vscode intellisense
if(false){ var FreightPacker = require('../../src/FreightPacker').default; }
// expose typedef s for intellisense
/** @typedef {import('../../src/api/Types').InitializationParams} InitializationParams */
/** @typedef {import('../../src/api/Types').SolverParams} SolverParams */
/** @typedef {import('../../src/api/Types').CUBParams} CUBParams */
/** @typedef {import('../../src/api/Types').BoxEntry} BoxEntry */

var fileLoader = new FreightPacker.utils.THREE.FileLoader();
function loadFile(url){
    return new Promise((resolve, reject) => {
        fileLoader.load(url, resolve, undefined, reject);
    });
}

const namespace = FPEditor.namespace;

const signals = {
    // automate

    // packer
    packRequest: 'packRequest',
    sliceResults: 'sliceResults',

    // packing space
    loadPSConfig: 'loadPSConfig',

    // box input
    boxInputUpdate: 'boxInputUpdate',
    boxInputComplete: 'boxInputComplete',
    boxInputAbort: 'boxInputAbort',
    boxInputModify: 'boxInputModify',
    boxInputRemove: 'boxInputRemove',
    boxEntryRequest: 'boxEntryRequest'
};

class ExampleUI extends FreightPacker.utils.Signaler {
    constructor(inputData){
        super();

        this.domElement = document.getElementById('fp-gui');

        var shortcutsGUI = FreightPacker.utils.Config.shortcutsGUI;
        shortcutsGUI.domElement.style.marginBottom = '40px';
        this.domElement.appendChild(shortcutsGUI.domElement);

        this.gui = new (window.dat || FreightPacker.utils.dat).GUI({
            autoPlace: false
        });

        this.domElement.appendChild(this.gui.domElement);

        var autoFolder = this.CreateAutoController();
        autoFolder.open();

        var packerFolder = this.CreatePackerController();
        packerFolder.open();

        var spaceFolder = this.CreateSpaceController();
        //spaceFolder.open();
        
        var inputFolder = this.CreateInputController(inputData);
        //inputFolder.open();
    }

    CreateAutoController(){
        var scope = this;

        var testDataFlatdeck = FreightPacker.utils.Debug.AFitTest.GenerateDataSampleFlatdeck2();
        var testData;

        var itemQttMultiplier = 1;
        function testDataCargoAdd(){
            var items = testData.items;
            return new Promise((resolve, reject) => {
                let iid = setInterval(roll, 100);
                function roll(){
                    let item = items.pop();
                    if(item){
                        let boxInput = {
                            label: item.ID.toString(),
                            width: item.Dim1,
                            length: item.Dim2,
                            height: item.Dim3,
                            quantity: Math.floor(item.Quantity * itemQttMultiplier)
                        };
                        scope.Dispatch(ExampleUI.signals.boxInputUpdate, boxInput);
                        scope.Dispatch(ExampleUI.signals.boxInputComplete);
                    }
                    else if(items.length <= 0){
                        clearInterval(iid);
                        setTimeout(resolve, 500);
                        //resolve();
                    }
                }
            });
        }

        var algorithm = 'cub';
        var algorithmArgs = [];
        function pack(){
            scope.Dispatch(signals.packRequest, algorithm, algorithmArgs);
        }

        function packingTestFlatdeck48CUB(){
            testData = testDataFlatdeck;
            algorithm = 'cub';
            algorithmArgs = ExampleUI.getCUBParams();

            samplePackingSpace()
            .then(testDataCargoAdd)
            .then(pack);
        }
        

        function samplePackingSpace(){
            let psConfigs = [
                '../resources/config/flatdeck48.json',
                '../resources/config/flatdeck48-d3.json'
            ];
            return new Promise((resolve, reject) => {
                loadFile(psConfigs[1])
                .then(function(data){
                    scope.Dispatch(ExampleUI.signals.loadPSConfig, data);
                    setTimeout(resolve, 500);
                    //resolve();
                });
            });
        }

        var controller = {
            Flatdeck48_CUB: packingTestFlatdeck48CUB,
            LoadPackingSpace: samplePackingSpace,
        };

        var autoFolder = this.gui.addFolder('Automate');
        autoFolder.add(controller, 'Flatdeck48_CUB');
        autoFolder.add(controller, 'LoadPackingSpace');

        return autoFolder;
    }

    CreatePackerController(){
        var scope = this;

        function pack(){
            let algorithm = 'cub';
            console.log('controller:', controller);
            scope.Dispatch(signals.packRequest, algorithm, ExampleUI.getCUBParams());
        }

        var controller = {
            minZToWasteRatio: .9,
            skipTop: false,
            Solve: pack,
            resultSlice: 1
        };

        let resultSlice = 1;
        Object.defineProperties(controller, {
            ResultSlice: {
                get: function(){ return controller.resultSlice;},
                set: function(value){ 
                    controller.resultSlice = value;
                    scope.Dispatch(signals.sliceResults, value);
                }
            }
        });

        function getCUBParams(){
            return {minZ_weight: controller.minZToWasteRatio, minWaste_weight: (1 - controller.minZToWasteRatio), skipTop: controller.skipTop};
        }

        ExampleUI.getCUBParams = getCUBParams;

        var packerFolder = this.gui.addFolder('Packer');
        packerFolder.add(controller, 'minZToWasteRatio', 0, 1).step(.1);
        packerFolder.add(controller, 'skipTop');
        packerFolder.add(controller, 'Solve');
        packerFolder.add(controller, 'ResultSlice', 0, 1).step(.1);

        return packerFolder;
    }

    CreateSpaceController(){
        var scope = this;

        function loadConfig(){
            namespace.IO.GetFile(function(file){
                var data = JSON.parse(file);
                scope.Dispatch(ExampleUI.signals.loadPSConfig, data);
            }, false);
        }

        var controller = {
            LoadPSConfig: loadConfig
        };

        var spaceFolder = this.gui.addFolder('Packing space');
        spaceFolder.add(controller, 'LoadPSConfig');

        return spaceFolder;
    }

    CreateInputController(data){
        var scope = this;
        
        var boxRange = {w:[10, 120], l:[10, 120], h:[10, 120]};
        var boxInput = FreightPacker.utils.Utils.AssignUndefined(data, {
            width:0, length:0, height:0, label: '', weight: 0, quantity: 1, 
            entryUID: ''
        });
        
        function inputUpdate(){
            scope.Dispatch(ExampleUI.signals.boxInputUpdate, boxInput);
        }
        function complete(){
            scope.Dispatch(ExampleUI.signals.boxInputComplete);
        }
        function abort(){
            scope.Dispatch(ExampleUI.signals.boxInputAbort);
        }

        var p = 4;
        function randomInput(){
            controller.Width    = Math.floor((boxRange.w[0] + Math.random() * (boxRange.w[1] - boxRange.w[0])) * p) / p;
            controller.Length   = Math.floor((boxRange.l[0] + Math.random() * (boxRange.l[1] - boxRange.l[0])) * p) / p;
            controller.Height   = Math.floor((boxRange.h[0] + Math.random() * (boxRange.h[1] - boxRange.h[0])) * p) / p;
            complete();
        }

        /** @param {BoxEntry} entry */
        function updateForEntry(entry){
            controller.Width = entry.dimensions.width;
            controller.Length = entry.dimensions.length;
            controller.Height = entry.dimensions.height;
            controller.Label = entry.label;
            controller.Quantity = entry.quantity;
            controller.Weight = entry.weight;
            
            inputFolder.updateAll();
        }

        function getEntryByUID(){
            scope.Dispatch(ExampleUI.signals.boxEntryRequest, controller.EntryUID, updateForEntry, boxInput);
        }

        function modifyEntry(){
            scope.Dispatch(ExampleUI.signals.boxInputModify, controller.EntryUID, boxInput);
        }

        function removeEntry(){
            scope.Dispatch(ExampleUI.signals.boxInputRemove, controller.EntryUID);
        }

        var controller = {
            Random: randomInput,
            Insert: complete,
            Abort: abort,
            Modify: modifyEntry,
            Remove: removeEntry
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
            },

            EntryUID: {
                get: function(){ return boxInput.entryUID;},
                set: function(value){ boxInput.entryUID = value; getEntryByUID();}
            }
        });

        var inputFolder = this.gui.addFolder('Cargo input');
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

        var modifyFolder = inputFolder.addFolder('Modify entry');
        var entryUID = modifyFolder.add(controller, 'EntryUID');
        entryUID.onChange(getEntryByUID);
        modifyFolder.add(controller, 'Modify');
        modifyFolder.add(controller, 'Remove');

        inputFolder.add(controller, 'Insert');
        inputFolder.add(controller, 'Abort');
        
        return inputFolder;
    }

    static get signals(){
        return signals;
    }
}