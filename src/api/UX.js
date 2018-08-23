import Utils from "./utils/cik/Utils";
import Visualization from "./components/Visualization";
import User from "./components/User";
import App from "./App";
import Constants from "./Constants";

/**
 * @typedef UXParams
 * @property {Boolean} hud default = true, create hud (hud currently disabled in api)
 * @property {Boolean} configure default = false, execute helpers that allow configuration
 * @property {Number} units default = 1, conversion to unit employed, default=1 for inches, for meters: units=0.0254
 * @property {Boolean} autoUpdatePack default = true, will auto-update the packing if entries are modified or deleted
 * @property {Number} backgroundColor default = 0xfefefe
 * @property {Constants.scaleRefFigure} scaleRefFigure default = man, human figure to show as scale reference
 * @property {Number} fov camera perspective fov
 */
const defaultParams = {
    hud: true,
    configure: false,
    units: 1,
    autoUpdatePack: true,
    backgroundColor: 0xfefefe,
    scaleRefFigure: Constants.scaleRefFigure.man,
    fov: 15
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