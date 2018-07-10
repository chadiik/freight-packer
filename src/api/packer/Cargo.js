import CargoEntry from "../components/common/CargoEntry";

class Cargo {
    /**
     * 
     * @param {CargoEntry} entry
     */
    constructor(entry){
        this.entry = entry;
    }

    ToString(){
        var output = 'Cargo(' + this.entry.ToString() + ')';

        return output;
    }

    static FromEntry(entry){
        return new Cargo(entry);
    }
}

export default Cargo;