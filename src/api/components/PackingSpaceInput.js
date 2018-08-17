import Container from "../packer/container/Container";
import PackingSpace from "../packer/PackingSpace";
import ContainerView from "../view/ContainerView";
import Asset from "./assets/Asset";
import LightDispatcher from "./LightDispatcher";
import Logger from "../utils/cik/Logger";

/**
 * @typedef PackingSpaceJSON
 * @property {THREE.Geometry} jsonObject.geometry
 * @property {Container} jsonObject.container
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
     * @param {PackingSpaceJSON} jsonObject 
     * @returns {Number|Boolean} uid or false if error
     */
    Load(jsonObject){

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

            if(model){
                let containerView = new ContainerView(container, model);
                let units = this.params.ux.params.units;
                let padding = 60 * units;
                let thickness = 2 * units;
                containerView.PlatformVisibility(true, new THREE.Vector3(padding, thickness, padding));
            }

            this.packingSpace.AddContainer(container);

            this.Dispatch(signals.containerLoaded, container);
            return uid;
        }

        return false;
    }

    static get signals(){
        return signals;
    }

}

export default PackingSpaceInput;