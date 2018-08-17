import Utils from "./utils/cik/Utils";
import Visualization from "./components/Visualization";
import User from "./components/User";
import App from "./App";

/**
 * @typedef UXParams
 * @property {Boolean} hud default = true, create a hud controller (Scene, camera, loop, etc.)
 * @property {Boolean} configure default = false, execute helpers that allow configuration
 * @property {Number} units default = 1, conversion to unit employed, default=1 for inches, for meters: units=0.0254
 * @property {Boolean} autoUpdatePack default = true, will auto-update the packing if entries are modified or deleted
 */
const defaultParams = {
    hud: true,
    configure: false,
    units: 1,
    autoUpdatePack: true
};

class UX{
    /**
     * 
     * @param {UXParams} params 
     */
    constructor(params){

        this.params = Utils.AssignUndefined(params, defaultParams);
    }

    /** @ignore ignore */
    _Bind(value){
        /** @type {App} */
        let app = value;
    
        /** Interface with visual elements */
		this.visualization = new Visualization(app);

		/** Interface with user input/output */
        this.user = new User(app);
    }

}

UX.User = User;
UX.Visualization = Visualization;

export default UX;