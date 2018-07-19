import CargoListView from "./CargoListView";
import Packer from "../packer/Packer";
import CargoList from "../packer/CargoList";
import PackingSpaceView from "./PackingSpaceView";
import PackingSpace from "../packer/PackingSpace";
import SceneSetup from "../scene/SceneSetup";

class View {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {SceneSetup} sceneSetup 
     */
    constructor(packer, sceneSetup){
        this.sceneSetup = sceneSetup;

        this.packingSpaceView = new PackingSpaceView();
        this.sceneSetup.sceneController.AddDefault(this.packingSpaceView.view);

        var onContainerAdded = this.packingSpaceView.Add.bind(this.packingSpaceView);
        packer.packingSpace.On(PackingSpace.signals.containerAdded, onContainerAdded);

        this.cargoListView = new CargoListView();
        this.sceneSetup.hud.Add(this.cargoListView.view);

        var onCargoAdded = this.cargoListView.Add.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.cargoAdded, onCargoAdded);
        var onCargoRemoved = this.cargoListView.Remove.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.cargoRemoved, onCargoRemoved);

        if(FreightPacker.instance.ux.params.configure){
            this.Configure();
        }
    }

    Configure(){

        var Smart = require('../utils/cik/config/Smart').default;
        var Config = require('../utils/cik/config/Config').default;
        var Control3D = require('../utils/cik/config/Control3D').default;

        var hudControl3D = Control3D.Request('hud');
        hudControl3D.Attach(this.cargoListView.view);
        hudControl3D.Show();
    }
}

export default View;