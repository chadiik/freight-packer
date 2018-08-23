import Volume from "./Volume";
import Container from "./Container";

const _weightCapacity = Symbol('weightCapacity');
const type = 'ContainingVolume';

class ContainingVolume extends Volume {
    /** @param {Container} container */
    constructor(container){
        super();
        
        this.container = container;
        this.weightCapacity = 0;

        this.SetUID();
    }

    set weightCapacity(value){ this[_weightCapacity] = value; }
    get weightCapacity(){ return this[_weightCapacity]; }

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
        json.weightCapacity = this.weightCapacity;
        return json;
    }

    ToString(){
        return super.ToString();
    }

    static FromJSON(data){
        if(data.type !== type) console.warn('Data supplied is not: ' + type);

        var containingVolume = new ContainingVolume();
        containingVolume.weightCapacity = data.weightCapacity;
        Volume.FromJSON(data, containingVolume);

        return containingVolume;
    }
}

export default ContainingVolume;