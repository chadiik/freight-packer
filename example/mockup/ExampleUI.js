
// enable vscode intellisense on FreightPacker
if(false){ var FreightPacker = require('../../src/FreightPacker').default; }

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

    // packing space
    loadPSConfig: 'loadPSConfig',

    // box input
    boxInputUpdate: 'boxInputUpdate',
    boxInputComplete: 'boxInputComplete',
    boxInputAbort: 'boxInputAbort'
};

class ExampleUI extends FreightPacker.utils.Signaler {
    constructor(inputData){
        super();

        this.domElement = document.getElementById('fp-gui');

        var shortcutsGUI = FreightPacker.utils.Config.shortcutsGUI;
        this.domElement.appendChild(shortcutsGUI.domElement);
        console.log(shortcutsGUI);

        this.gui = new (window.dat || FreightPacker.utils.dat).GUI({
            autoPlace: false
        });

        this.domElement.appendChild(this.gui.domElement);

        var autoFolder = this.CreateAutoController();
        autoFolder.open();

        var packerFolder = this.CreatePackerController();

        var spaceFolder = this.CreateSpaceController();
        //spaceFolder.open();
        
        var inputFolder = this.CreateInputController(inputData);
        //inputFolder.open();
    }

    CreateAutoController(){
        var scope = this;

        var testData1 = FreightPacker.utils.Debug.AFitTest.GenerateDataSample1();
        var testData2 = FreightPacker.utils.Debug.AFitTest.GenerateDataSample2();
        var testDataFlatdeck = FreightPacker.utils.Debug.AFitTest.GenerateDataSampleFlatdeck2();
        var testData;

        function testDataPSLoad(){
            return new Promise((resolve, reject) => {
                var container = testData.container;
                var data = {
                    container: {
                        type: 'Container',
                        volumes: [{
                            type: 'ContainingVolume',
                            position: {x: 0, y: 0, z: 0},
                            dimensions: {
                                type:'Dimensions',
                                width: container.Width,
                                length: container.Length,
                                height: container.Height
                            }
                        }]
                    }
                };

                scope.Dispatch(ExampleUI.signals.loadPSConfig, data);
                resolve();
            });
        }

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
                        resolve();
                    }
                }
            });
        }

        var algorithm = 'afit';
        function pack(){
            scope.Dispatch(signals.packRequest, algorithm);
        }

        function packingTest1(){
            testData = testData1;

            testDataPSLoad()
            .then(testDataCargoAdd)
            .then(pack);
        }

        function packingTest2(){
            testData = testData2;
            
            testDataPSLoad()
            .then(testDataCargoAdd)
            .then(pack);
        }

        function packingTestFlatdeck48(){
            testData = testDataFlatdeck;
            algorithm = 'afit';
            
            samplePackingSpace()
            .then(testDataCargoAdd)
            .then(pack);
        }

        function packingTestFlatdeck48Sim(){
            testData = testDataFlatdeck;
            algorithm = 'sim';

            samplePackingSpace()
            .then(testDataCargoAdd)
            .then(pack);
        }

        function packingTestFlatdeck48CUB(){
            testData = testDataFlatdeck;
            algorithm = 'cub';

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
                loadFile(psConfigs[0])
                .then(function(data){
                    scope.Dispatch(ExampleUI.signals.loadPSConfig, data);
                    resolve();
                });
            });
        }

        function sampleCargo2(){
            testData = testData2;
            return testDataCargoAdd();
        }

        var controller = {
            PackingTest1: packingTest1,
            PackingTest2: packingTest2,
            Flatdeck48_T1: packingTestFlatdeck48,
            Flatdeck48_Sim: packingTestFlatdeck48Sim,
            Flatdeck48_CUB: packingTestFlatdeck48CUB,
            LoadPackingSpace: samplePackingSpace,
            SampleCargo2: sampleCargo2
        };

        var autoFolder = this.gui.addFolder('Automate');
        autoFolder.add(controller, 'Flatdeck48_T1');
        autoFolder.add(controller, 'Flatdeck48_Sim');
        autoFolder.add(controller, 'Flatdeck48_CUB');
        autoFolder.add(controller, 'PackingTest2');
        autoFolder.add(controller, 'LoadPackingSpace');
        autoFolder.add(controller, 'SampleCargo2');

        return autoFolder;
    }

    CreatePackerController(){
        var scope = this;

        function pack(){
            scope.Dispatch(signals.packRequest);
        }

        var controller = {
            Solve: pack
        };

        var packerFolder = this.gui.addFolder('Packer');
        packerFolder.add(controller, 'Solve');

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
        
        var boxRange = {w:[4, 20], l:[4, 20], h:[2, 16]};
        var boxInput = FreightPacker.utils.Utils.AssignUndefined(data || {}, {width:0, length:0, height:0, label: '', weight: 0, quantity: 1});
        
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
        
        return inputFolder;
    }

    static get signals(){
        return signals;
    }
}