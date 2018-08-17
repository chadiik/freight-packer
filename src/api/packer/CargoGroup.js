import CargoEntry from "../components/common/CargoEntry";
import Cargo from "./Cargo";


class CargoGroup {
    /**
     * 
     * @param {CargoEntry} entry
     */
    constructor(entry){
        this.entry = entry;

        /** @type {Array<Cargo>} */
        this.cargoes = [];

        this.template = new Cargo(this);
        this.quantity = this.entry.quantity;
    }

    get quantity(){
        return this.cargoes.length;
    }

    set quantity(value){
        var currentQuantity = this.cargoes.length;
        if(value < currentQuantity){
            this.cargoes.length = value;
            this.entry.quantity = value;
        }
        else if(value > currentQuantity){
            for(var i = currentQuantity; i < value; i++){
                this.cargoes[i] = this.template.Clone();
            }
        }
    }

    ToString(){
        var output = 'CargoGroup(' + this.quantity + ' x ' + this.entry.ToString() + ')';

        return output;
    }

}

export default CargoGroup;