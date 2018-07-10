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

        this.cargoList = new CargoListView();
        this.Display(this.cargoList);

        var onCargoAdded = this.cargoList.Add.bind(this.cargoList);
        packer.cargoList.On(CargoList.signals.cargoAdded, onCargoAdded);
        var onCargoRemoved = this.cargoList.Remove.bind(this.cargoList);
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