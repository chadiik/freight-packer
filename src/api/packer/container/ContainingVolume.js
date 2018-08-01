import Volume from "./Volume";

const type = 'ContainingVolume';

class ContainingVolume extends Volume {
    constructor(){
        super();

        this.SetUID();
    }

    get weightCapacity(){
        return this.dimensions.volume / 1000;
    }

    /**
     * @param {string} [uid] - You'll rarely need to provide this
     */
    SetUID(uid){
        this.uid = uid || THREE.Math.generateUUID();
        return this.uid;
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