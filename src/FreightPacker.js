import Capabilities from './api/utils/Capabilities';
import App from './api/App';
import CargoInput from './api/components/CargoInput';
import Logger from './api/utils/cik/Logger';
import Utils from './api/utils/cik/Utils';
import PackingSpaceInput from './api/components/PackingSpaceInput';
import UX from './api/UX';
import PackerInterface from './api/components/PackerInterface';

/**
 * @typedef InitializationParams
 * @property {Boolean} debug
 * @property {import('./api/UX').UXParams} ux
 */

/**
 * @type {InitializationParams}
 */
const defaultParams = {
	debug: false
};

const utils = {
	THREE: THREE,
	dat: (window.dat || require('./api/utils/cik/config/datGUIConsole').default),
	Signaler: require('./api/utils/cik/Signaler').default,
	Utils: require('./api/utils/cik/Utils').default,
	Debug: require('./api/debug/Debug').default,
	Config: require('./api/utils/cik/config/Config').default
};

class FreightPacker {
	/**
	 * Freight Packer API instance
	 * @param {HTMLDivElement} containerDiv
	 * @param {InitializationParams} params
	 */
	constructor( containerDiv, params ) {

		this.params = Utils.AssignUndefined(params, defaultParams);
		FreightPacker.DevSetup(this);

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

		var app = new App(containerDiv, this.ux, {
			cargoInput: this.cargoInput,
			packingSpaceInput: this.packingSpaceInput
		});

		FreightPacker.DevSetup(app);

		/**
		 * Manual solving and notification
		 * @type {PackerInterface}
		 */
		this.packer = new PackerInterface(app);

		if(this.params.debug){
			FreightPacker.Auto(this);
		}
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

	static get utils(){
		return utils;
	}

	/** @param {FreightPacker|App} domain */
	static DevSetup(domain){
		if(domain instanceof FreightPacker){
			let fp = domain;
			global.fp = fp;
			let params = fp.params;
			if(params.debug) {
				Logger.active = true;
				Logger.toConsole = true;
				Logger.traceToConsole = true;
			}

			//require('./api/debug/Tester').testPool();
			//utils.Debug.CLPTest.Test1();
		}

		if(domain instanceof App){
			const SceneSetup = require('./api/view/SceneSetup').default;
			let app = domain;
			app.sceneSetup.On(SceneSetup.signals.init, function(){
				FreightPacker.utils.Debug.Viz.scene = app.sceneSetup.sceneController.scene;
			});
		}
	}

	/** @param {FreightPacker} fp */
	static Auto(fp){
		
	}

}

export default FreightPacker;
