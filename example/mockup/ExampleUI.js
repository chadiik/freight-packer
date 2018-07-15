
ExampleUI = function(app){
    this.app = app;

    this.gui = new dat.GUI({
        autoPlace: false
    });

    this.domElement = document.getElementById('fp-gui');
    this.domElement.appendChild(this.gui.domElement);

    this.CreateInputController();
};

Object.assign(ExampleUI.prototype, {
    CreateInputController: function(){
        var app = this.app;
        
        var boxRange = {w:[1, 12], l:[1, 12], h:[1, 12]};
        var boxInput = {width:0, length:0, height:0};
        
        var entry;
        var inputUpdate = function(){
            app.BoxInputDimensionsUpdate(boxInput);
        };
        var complete = function(){
            app.BoxInputComplete();
        };
        var abort = function(){
            app.BoxInputAbort();
        };

        var p = 4;
        var randomInput = function(){
            controller.Width    = Math.floor((boxRange.w[0] + Math.random() * (boxRange.w[1] - boxRange.w[0])) * p) / p;
            controller.Length   = Math.floor((boxRange.l[0] + Math.random() * (boxRange.l[1] - boxRange.l[0])) * p) / p;
            controller.Height   = Math.floor((boxRange.h[0] + Math.random() * (boxRange.h[1] - boxRange.h[0])) * p) / p;
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
            }
        });

        var inputFolder = this.gui.addFolder('Input');
        inputFolder.open();
        inputFolder.add(controller, 'Random');
        inputFolder.add(controller, 'Width' , boxRange.w[0], boxRange.w[1]).step(1/p).listen();
        inputFolder.add(controller, 'Length', boxRange.l[0], boxRange.l[1]).step(1/p).listen();
        inputFolder.add(controller, 'Height', boxRange.h[0], boxRange.h[1]).step(1/p).listen();
        inputFolder.add(controller, 'Insert');
        inputFolder.add(controller, 'Abort');

        controller.Random();
        
    }
});