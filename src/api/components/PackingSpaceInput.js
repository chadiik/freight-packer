import Container from "../packer/container/Container";
import PackingSpace from "../packer/PackingSpace";
import ContainerView from "../view/ContainerView";
import Asset from "./assets/Asset";
import LightDispatcher from "./LightDispatcher";
import Logger from "../utils/cik/Logger";
import ContainingVolume from "../packer/container/ContainingVolume";

/**
 * @typedef PackingSpaceJSON
 * @property {*} jsonObject.view json data
 * @property {Container} jsonObject.container json data
 */

const signals = {
    containerLoaded: 'containerLoaded',
    sliderValueChange: 'sliderValueChange',
    sliderValueStop: 'sliderValueStop'
};

/**
 * @typedef {Object} PackingSpaceInputParams
 * @property {import('../UX').default} ux
 */

/** @param {Container} container @param {THREE.Object3D} model */
function createContainerView(container, model, units){
    let containerView;
    if(model){
        containerView = new ContainerView(container, model);
    }
    else{
        containerView = ContainerView.Request(container);
    }
    
    let padding = 60 * units;
    let thickness = 2 * units;
    containerView.PlatformVisibility(true, new THREE.Vector3(padding, thickness, padding));
}

class PackingSpaceInput extends LightDispatcher {
    /**
     * @param {PackingSpaceInputParams} params 
     */
    constructor(params){
        super();

        this.params = params;

        this.packingSpace = new PackingSpace();
    }

    /** @ignore ignore */
    _Bind(value){
        /** @type {App} */
        let app = value;
    }

    /**
     * Creates a dummy container, get an uid for later changes (or false on error)
     * @param {Number} width
     * @param {Number} length
     * @param {Number} height
     * @param {Number} weightCapacity
     * @returns {Number|Boolean} uid or false if error
     */
    FromInput(width, length, height, weightCapacity){
        let container = new Container();

        let containingVolume = new ContainingVolume(container);
            containingVolume.dimensions.Set(width, length, height);
            containingVolume.weightCapacity = weightCapacity;

        container.Add(containingVolume);

        let units = this.params.ux.params.units;
        createContainerView(container, null, units);

        this.packingSpace.AddContainer(container);
        
        this.Dispatch(signals.containerLoaded, container);
        return container.uid;
    }

    /**
     * Load packing config, get an uid for later changes (or false on error)
     * @param {PackingSpaceJSON} jsonObject 
     * @returns {Number|Boolean} uid or false if error
     */
    Load(jsonObject){

        /** @type {PackingSpaceJSON} jsonObject */
        let data;
        try{
            data = typeof jsonObject === 'string' ? JSON.parse(jsonObject) : jsonObject;
        }
        catch(error){
            Logger.Warn('Error in PackingSpaceInput.Load, error/jsonObject:', error, jsonObject);
            return false;
        }

        if(data.container){
            let container;
            try{
                container = Container.FromJSON(data.container);
            }
            catch(error){
                Logger.Warn('Error in PackingSpaceInput.Load, error/jsonObject.container:', error, data.container);
                return false;
            }

            if(!container.uid) container.SetUID();
            let uid = container.uid;
            
            let model;
            if(data.view){
                try{
                    model = Asset.FromJSON(data.view);
                }
                catch(error){
                    Logger.Warn('Error in PackingSpaceInput.Load, error/jsonObject.view:', error, data.view);
                    return false;
                }
            }

            let units = this.params.ux.params.units;
            createContainerView(container, model, units);

            this.packingSpace.AddContainer(container);

            this.Dispatch(signals.containerLoaded, container);
            return uid;
        }

        return false;
    }

    /** Enumeration of dispatched types */
    static get signals(){
        return signals;
    }

}

export default PackingSpaceInput;