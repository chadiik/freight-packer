
import SceneSetup from './scene/SceneSetup';
import Logger from './utils/cik/Logger';
import Packer from './packer/Packer';
import View from './view/View';

class App {
    constructor(containerDiv, components) {
        
        this.components = components;

        this.packer = new Packer();

        this.sceneSetup = new SceneSetup(containerDiv);
        this.sceneSetup.Init().then(this.Start.bind(this));
    }

    Start(){
        var packer = this.packer;
        this.view = new View(packer, this.sceneSetup);
        this.sceneSetup.Start();

        this.components.boxInput.On('completed', function(boxEntry){
            Logger.Trace('insert box');
            packer.cargoList.Add(boxEntry.Clone());
        });
    }
  
}

export default App;
  