import Volume from "./Volume";

const type = 'ContainingVolume';

class ContainingVolume extends Volume {
    constructor(){
        super();
    }

    toJSON(){
        var json = super.toJSON();
        json.type = type;
        return json;
    }

    ToString(){
        return super.ToString();
    }

    static FromJSON(data){
        if(data.type !== type) console.warn('Data supplied is not: ' + type);

        var containingVolume = new ContainingVolume();
        Volume.FromJSON(data, containingVolume);

        return containingVolume;
    }
}

export default ContainingVolume;