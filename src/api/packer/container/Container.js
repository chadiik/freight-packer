import ContainingVolume from "./ContainingVolume";
import Logger from "../../utils/cik/Logger";

const type = 'Container';

var combinedVolume = new ContainingVolume();

class Container {
    constructor(){
        /**
         * Containing volumes array
         * @type {Array<ContainingVolume>}
         */
        this.volumes = [];

        Logger.WarnOnce('Container.constructor', 'label not implemented');
    }

    /** @param {ContainingVolume} volume */
    Add(volume){
        this.volumes.push(volume);
    }

    /**
     * @param {string} [uid] - You'll rarely need to provide this
     */
    SetUID(uid){
        this.uid = uid || THREE.Math.generateUUID();
        return this.uid;
    }

    get combinedVolume(){
        let minX = Number.MAX_SAFE_INTEGER,
            minY = Number.MAX_SAFE_INTEGER,
            minZ = Number.MAX_SAFE_INTEGER;

        let maxX = Number.MIN_SAFE_INTEGER,
            maxY = Number.MIN_SAFE_INTEGER,
            maxZ = Number.MIN_SAFE_INTEGER;

        let combinedWeightCapacity = 0;
        
        this.volumes.forEach(volume => {
            let pos = volume.position;
            let dim = volume.dimensions;
            if(pos.x < minX) minX = pos.x;
            if(pos.y < minY) minY = pos.y;
            if(pos.z < minZ) minZ = pos.z;
            if(pos.x + dim.width > maxX) maxX = pos.x + dim.width;
            if(pos.y + dim.height > maxY) maxY = pos.y + dim.height;
            if(pos.z + dim.length > maxZ) maxZ = pos.z + dim.length;

            combinedWeightCapacity += volume.weightCapacity;
        });

        combinedVolume.container = this;
        combinedVolume.dimensions.Set(maxX - minX, maxZ - minZ, maxY - minY);
        combinedVolume.position.set((maxX + minX) / 2, (maxZ + minZ) / 2, (maxY + minY) / 2);
        combinedVolume.weightCapacity = combinedWeightCapacity;
        
        return combinedVolume;
    }

    toJSON(){
        return {
            type: type,
            volumes: this.volumes
        };
    }

    ToString(){
        var result = type + '[';
        for(var i = 0, numVolumes = this.volumes.length; i < numVolumes; i++){
            result += this.volumes[i].ToString() + (i < numVolumes - 1 ? ', ' : ']');
        }
        return result;
    }

    static FromJSON(data){
        if(data.type !== type) console.warn('Data supplied is not: ' + type);

        var container = new Container();
        for(var i = 0, numVolumes = data.volumes.length; i < numVolumes; i++){
            var containingVolume = ContainingVolume.FromJSON(data.volumes[i]);
            containingVolume.container = container;
            container.Add(containingVolume);
        }

        return container;
    }

    get volume(){
        var index = this.volumes.length - 1;
        return this.volumes[index];
    }
}

export default Container;