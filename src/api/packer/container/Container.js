import ContainingVolume from "./ContainingVolume";
import Logger from "../../utils/cik/Logger";

const type = 'Container';

class Container {
    constructor(){
        /**
         * Containing volumes array
         * @type {Array<ContainingVolume>}
         */
        this.volumes = [];

        Logger.WarnOnce('Container.constructor', 'weight, label not implemented');
    }

    Add(volume){
        this.volumes.push(volume);
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