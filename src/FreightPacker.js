import Capabilities from './api/utils/Capabilities';
import App from './api/App';
import CargoInput from './api/components/CargoInput';
import Logger from './api/utils/cik/Logger';
import Utils from './api/utils/cik/Utils';
import PackingSpaceInput from './api/components/PackingSpaceInput';
import UX from './api/UX';

/**
 * @typedef InitializationParams
 * @property {Boolean} debug
 * @property {import('./api/UX').UXParams} ux
 */

/**
 * @type {InitializationParams}
 */
const defaultParams = {
	debug: false,
	ux: { // defaults from './api/UX'
	}
};

const utils = {
	dat: (window.dat || require("./api/utils/cik/config/datGUIConsole").default)
};

var instance;

class FreightPacker {
	/**
	 * Freight Packer API instance
	 * @param {HTMLDivElement} containerDiv
	 * @param {InitializationParams} params
	 */
	constructor( containerDiv, params ) {

		instance = this;

		this.params = Utils.AssignUndefined(params, defaultParams);
		FreightPacker.DevSetup(this.params);

		this.ux = new UX(this.params.ux);

		/**
		 * Handles input of: description fields (label, etc.), dimensions and constraints
		 * @type {CargoInput}
		 */
		this.cargoInput = new CargoInput();

		/**
		 * Handles input of: packing spaces configurations and assets
		 * @type {PackingSpaceInput}
		 */
		this.packingSpaceInput = new PackingSpaceInput();

		new App(containerDiv, this.ux, {
			cargoInput: this.cargoInput,
			packingSpaceInput: this.packingSpaceInput
		});
	}

	/**
	 * Will resolve if requirements are met, otherwise rejects with an error message
	 * @return {Promise<Void>|Promise<string>} 
	 */
	static CheckRequirements () {
		var webgl = Capabilities.IsWebGLReady();

		return new Promise((resolve, reject) => {
			if(webgl){
				resolve();
			}
			else {
				var message = 'WebGL not supported.';
				reject(message);
			}
		});
	}

	/**
	 * @returns {FreightPacker}
	 */
	static get instance(){
		return instance;
	}

	static DevSetup(params){
		if(params.debug) {
			Logger.active = true;
			Logger.toConsole = true;
			Logger.traceToConsole = true;

			//require('./api/debug/Tester').testConfig();
		}
	}

	static get Utils(){
		return utils;
	}

}

export default FreightPacker;
