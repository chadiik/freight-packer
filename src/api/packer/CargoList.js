import Cargo from "./Cargo";
import Signaler from "../utils/cik/Signaler";
import CargoEntry from "../components/common/CargoEntry";
import Logger from "../utils/cik/Logger";

const cargoAdded = 'cargoAdded',
    cargoRemoved = 'cargoRemoved';

const signals = {
    cargoAdded: cargoAdded,
    cargoRemoved: cargoRemoved
};

class CargoList extends Signaler{
    constructor(){
        super();

        this.cargoes = [];
    }

    Add(entry){
        var cargo;
        if(entry instanceof CargoEntry){
            cargo = Cargo.FromEntry(entry);
        }
        else{
            cargo = entry;
            Logger.Log(entry, 'used as Cargo');
        }

        this.cargoes.push(cargo);
        this.Dispatch(cargoAdded, cargo);
    }

    Remove(cargo){
        var index = this.cargoes.indexOf(cargo);
        if(index != -1){
            var removedCargoes = this.cargoes.splice(index, 1);
            this.Dispatch(cargoRemoved, removedCargoes[0]);
        }
    }

    static get signals(){
        return signals;
    }
}

export default CargoList;