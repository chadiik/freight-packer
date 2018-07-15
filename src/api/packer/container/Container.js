import ContainingVolume from "./ContainingVolume";

class Container {
    constructor(){
        /**
         * Containing volumes array
         * @type {Array<ContainingVolume>}
         */
        this.volumes = [];
    }

    toJSON(){
        return {
            type: 'Container',
            volumes: this.volumes
        };
    }

    get volume(){
        var index = this.volumes.length - 1;
        return this.volumes[index];
    }
}

export default Container;