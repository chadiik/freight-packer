import Capabilities from './api/utils/Capabilities';
import App from './api/App';
import CargoInput from './api/components/CargoInput';
import Logger from './api/utils/cik/Logger';
import Utils from './api/utils/cik/Utils';

const defaultOptions = {
	debug: false
};

class FreightPacker {
	/**
	 * Constructor
	 * @param {HTMLElement} containerDiv
	 * @param {Object} options
	 */
	constructor( containerDiv, options ) {

		this.options = Utils.AssignUndefined(options, defaultOptions);
		FreightPacker.DevSetup(this.options);

		/**
		 * Handles input of: description fields (label, etc.), dimensions and constraints
		 * @type {CargoInput}
		 */
		this.cargoInput = new CargoInput();

		this.app = new App(containerDiv, {
			boxInput: this.cargoInput
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

	static DevSetup(options){
		if(options.debug) {
			Logger.active = true;
			Logger.toConsole = true;
			Logger.traceToConsole = true;
		}
	}

}

export default FreightPacker;
