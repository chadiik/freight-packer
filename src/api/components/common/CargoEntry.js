class CargoEntry {
    constructor(){
        this.type = 'CargoEntry';

        this.active = false;
        this.properties = {};
        this.descriptions = [];
    }

    Clone(entry){
        if( entry === undefined) entry = new CargoEntry();
        entry.active = this.active;
        entry.properties = {};
        entry.descriptions = [];
        return entry;
    }

    ToString(){
        
    }
}

export default CargoEntry;