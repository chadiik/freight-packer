import Volume from "./Volume";

class ContainingVolume extends Volume {
    constructor(){
        super();
    }

    toJSON(){
        var json = super.toJSON();
        json.type = 'ContainingVolume';
        return json;
    }
}

export default ContainingVolume;