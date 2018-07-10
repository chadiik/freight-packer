//const THREE = require('./lib/three-91');
import Capabilities from './api/utils/Capabilities';
import App from './api/App';
import BoxInput from './api/components/BoxInput';
import Logger from './api/utils/cik/Logger';

class FreightPacker {
	/**
	 * Constructor
	 * @param {HTMLElement} containerDiv
	 * @param {Object} options
	 */
	constructor( containerDiv, options ) {

		options = options || {};
		if(options.debug) {
			Logger.active = true;
			Logger.toConsole = true;
			Logger.traceToConsole = true;
		}
		
		this.boxInput = new BoxInput();

		var components = {
			boxInput: this.boxInput
		};
		this.app = new App(containerDiv, components);
	}

	f(){}

	static CheckRequirements () {
		window.Capabilities = Capabilities;
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

	static get Utils(){
		return require('./api/utils/cik/Utils').default;
	}

}

export default FreightPacker;
