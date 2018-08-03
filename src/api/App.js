
import SceneSetup from './view/SceneSetup';
import Packer from './packer/Packer';
import View from './view/View';
import CargoInput from './components/CargoInput';
import PackingSpaceInput from './components/PackingSpaceInput';
import UX from './UX';
import Logger from './utils/cik/Logger';

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

        /** @type {import('./packer/Packer').PackerParams} */
        var packerParams = {ux: this.ux};
        this.packer = new Packer(packerParams);

        this.sceneSetup = new SceneSetup(containerDiv, this.ux);
        this.sceneSetup.Init().then(this.Start.bind(this));
    }

    Start(){
        var packer = this.packer;

        /** @type {import('./view/View').ViewParams} */
        var viewParams = { ux: this.ux };
        this.view = new View(packer, this.sceneSetup, viewParams);
        this.sceneSetup.Start();

        this.components.cargoInput.On(CargoInput.signals.completed, function(boxEntry){
            packer.cargoList.Add(boxEntry);
        });

        this.components.packingSpaceInput.On(PackingSpaceInput.signals.containerLoaded, function(container){
            packer.packingSpace.AddContainer(container);
        });

        /** @param {import('./packer/Packer').PackingResult} packingResult */
        function onPackUpdate(packingResult){
            Logger.Log('Packing result:', packingResult);
        }

        packer.On(Packer.signals.packUpdate, onPackUpdate);
    }
  
}

export default App;
  