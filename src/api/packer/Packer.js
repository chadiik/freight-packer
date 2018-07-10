import CargoList from "./CargoList";
import PackingSpace from "./PackingSpace";

class Packer {
    constructor(){

        this.packingSpace = new PackingSpace();
        this.cargoList = new CargoList();
    }


}

export default Packer;