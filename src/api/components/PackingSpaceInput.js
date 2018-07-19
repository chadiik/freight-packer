import Signaler from "../utils/cik/Signaler";
import Container from "../packer/container/Container";
import PackingSpace from "../packer/PackingSpace";
import ContainerView from "../view/ContainerView";
import Asset from "./assets/Asset";

/**
 * @typedef PackingSpaceJSON
 * @property {THREE.Geometry} jsonObject.geometry
 * @property {Container} jsonObject.container
 */

const signals = {
    containerLoaded: 'containerLoaded'
};

class PackingSpaceInput extends Signaler {
    constructor(){
        super();

        this.packingSpace = new PackingSpace();
    }

    /**
     * 
     * @param {PackingSpaceJSON} jsonObject 
     */
    Load(jsonObject){
        var data = typeof jsonObject === 'string' ? JSON.parse(jsonObject) : jsonObject;
        console.log(data);
        if(data.container){
            var container = Container.FromJSON(data.container);
            
            if(data.geometry){
                var geometry = Asset.FromGeometryJSON(data.geometry).geometry;
                var model = Asset.CreateMesh(geometry);
                var containerView = new ContainerView(container, model);
                console.log(containerView);
            }

            this.packingSpace.AddContainer(container);

            this.Dispatch(signals.containerLoaded, container);
        }
    }

    static get signals(){
        return signals;
    }

}

export default PackingSpaceInput;