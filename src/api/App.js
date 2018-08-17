
import SceneSetup from './view/SceneSetup';
import Packer, { PackerParams } from './packer/Packer';
import View from './view/View';
import CargoInput from './components/CargoInput';
import PackingSpaceInput from './components/PackingSpaceInput';
import UX from './UX';
import Logger from './utils/cik/Logger';
import Signaler from './utils/cik/Signaler';
import PackerInterface, { SolverParams } from './components/PackerInterface';
import BoxEntry from './components/box/BoxEntry';
import Container from './packer/container/Container';

const signals = {
    start: 'start'
};

/**
 * @typedef AppParams
 * @property {UX} ux
 * @property {CargoInput} cargoInput
 * @property {PackingSpaceInput} packingSpaceInput
 * @property {PackerInterface} packerInterface
 */

class App extends Signaler{

    /**
     * 
     * @param {HTMLDivElement} containerDiv
     * @param {AppParams} params
     */
    constructor(containerDiv, params) {

        super();

        let scope = this;

        this.ux = params.ux;
        this.cargoInput = params.cargoInput;
        this.packingSpaceInput = params.packingSpaceInput;
        this.packerInterface = params.packerInterface;

        /** @type {PackerParams} */
        let packerParams = {ux: this.ux};
        this.packer = new Packer(packerParams);
        
        this.cargoInput.On(CargoInput.signals.insert, 
            /** @param {BoxEntry} boxEntry */
            function(boxEntry){
                scope.packer.cargoList.Add(boxEntry);
            });

        this.cargoInput.On(CargoInput.signals.modify, 
            /** @param {BoxEntry} boxEntry */
            function(boxEntry){
                scope.packer.cargoList.Modify(boxEntry);
                scope.SolveAgain();
            });

        this.cargoInput.On(CargoInput.signals.remove, 
            /** @param {BoxEntry} boxEntry */
            function(boxEntry){
                scope.packer.cargoList.Remove(boxEntry.uid);
                scope.SolveAgain();
            });
        
        this.packingSpaceInput.On(PackingSpaceInput.signals.containerLoaded, 
            /** @param {Container} container */
            function(container){
                scope.packer.packingSpace.AddContainer(container);
            });

        this.packerInterface.On(PackerInterface.signals.solveRequest, 
            /** @param {SolverParams} solverParams */
            function(solverParams){
                scope.Solve(solverParams);
            });

        this.sceneSetup = new SceneSetup(containerDiv, this.ux);
        this.sceneSetup.Init().then(this.Start.bind(this));
    }


    Start(){
        let scope = this;
        let packerInterface = this.packerInterface;

        /** @type {import('./view/View').ViewParams} */
        let viewParams = { ux: this.ux };
        this.view = new View(this.packer, this.sceneSetup, viewParams);
        this.sceneSetup.Start();

        this.ux._Bind(this);
        this.cargoInput._Bind(this);
        this.packingSpaceInput._Bind(this);

        /** @param {Packer.PackingResult} packingResult */
        function onPackUpdate(packingResult){
            Logger.Log('Packing result:', packingResult);
            packerInterface._Notify(PackerInterface.signals.solved, packingResult);
        }
        this.packer.On(Packer.signals.packUpdate, onPackUpdate);

        /** @param {*} error */
        function onPackFailed(error){
            packerInterface._Notify(PackerInterface.signals.failed, error);
        }
        this.packer.On(Packer.signals.packFailed, onPackFailed);

        this.Dispatch(signals.start);
    }

    SolveAgain(){
        if(this.ux.params.autoUpdatePack && this.packer.solveAgain) this.Solve();
    }

    /** @param {SolverParams} [solverParams] */
    Solve(solverParams){
        this.view.ClearPackingResults();
        this.packer.Solve(solverParams);
    }

    static get signals(){
        return signals;
    }
  
}

export default App;
  