
import SceneSetup from './scene/SceneSetup';
import Logger from './utils/cik/Logger';
import Packer from './packer/Packer';
import View from './view/View';
import CargoInput from './components/CargoInput';
import PackingSpaceInput from './components/PackingSpaceInput';
import UX from './UX';

/**
 * @typedef AppComponents
 * @property {CargoInput} cargoInput
 * @property {PackingSpaceInput} packingSpaceInput
 */

class App {

    /**
     * 
     * @param {HTMLDivElement} containerDiv
     * @param {UX} ux
     * @param {AppComponents} components 
     */
    constructor(containerDiv, ux, components) {
        this.ux = ux;
        this.components = components;

        this.packer = new Packer();

        this.sceneSetup = new SceneSetup(containerDiv, this.ux);
        this.sceneSetup.Init().then(this.Start.bind(this));
    }

    Start(){
        var packer = this.packer;
        this.view = new View(packer, this.sceneSetup);
        this.sceneSetup.Start();

        this.components.cargoInput.On(CargoInput.signals.completed, function(boxEntry){
            Logger.Log('insert box');
            packer.cargoList.Add(boxEntry);
        });

        this.components.packingSpaceInput.On(PackingSpaceInput.signals.containerLoaded, function(container){
            Logger.Log('insert container');
            packer.packingSpace.AddContainer(container);
        });
    }
  
}

export default App;
  