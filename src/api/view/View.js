import CargoListView from "./CargoListView";
import Packer from "../packer/Packer";
import CargoList from "../packer/CargoList";

class View {
    /**
     * Constructor
     * @param {Packer} packer 
     * @param {SceneSetup} sceneSetup 
     */
    constructor(packer, sceneSetup){
        this.sceneSetup = sceneSetup;

        this.cargoListView = new CargoListView();
        this.Display(this.cargoListView);

        var onCargoAdded = this.cargoListView.Add.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.cargoAdded, onCargoAdded);
        var onCargoRemoved = this.cargoListView.Remove.bind(this.cargoListView);
        packer.cargoList.On(CargoList.signals.cargoRemoved, onCargoRemoved);
    }

    Display(object){
        var sceneController = this.sceneSetup.sceneController;
        if(object instanceof CargoListView){
            sceneController.AddDefault(object.view);
        }
    }
}

export default View;