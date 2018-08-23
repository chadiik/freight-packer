import Capabilities from './api/utils/Capabilities';
import App, { AppParams } from './api/App';
import CargoInput, { CargoInputParams } from './api/components/CargoInput';
import Logger from './api/utils/cik/Logger';
import Utils from './api/utils/cik/Utils';
import PackingSpaceInput, { PackingSpaceInputParams } from './api/components/PackingSpaceInput';
import UX, { UXParams } from './api/UX';
import PackerInterface, { PackerParams } from './api/components/PackerInterface';
import LightDispatcher from './api/components/LightDispatcher';
import Constants from './api/Constants';
import Resources from './api/Resources';

//#region dev
const utils = {
	THREE: THREE,
	dat: (window.dat || require('./api/utils/cik/config/datGUIConsole').default),
	Signaler: require('./api/utils/cik/Signaler').default,
	Utils: require('./api/utils/cik/Utils').default,
	Debug: require('./api/debug/Debug').default,
	Config: require('./api/utils/cik/config/Config').default
};

/** @param {FreightPacker|App} domain */
function devSetup(domain){
	if(domain instanceof FreightPacker){
		let fp = domain;
		global.fp = fp;
		FreightPacker.utils.Debug.api = fp;
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
		FreightPacker.utils.Debug.app = app;
		app.sceneSetup.OnIncludingPrior(SceneSetup.signals.init, function(){
			FreightPacker.utils.Debug.Viz.SetViewParent(app.sceneSetup.sceneController.scene);
		});
	}
}

/** @param {FreightPacker} fp */
function auto(fp){
	
}

//#endregion

/**
 * @typedef InitializationParams
 * @property {Boolean} debug set to false for deployment
 * @property {string} texturesPath url to textures directory
 * @property {UXParams} uxParams UX parameters
 * @property {PackerParams} packerParams Packer general parameters
 */

/**
 * @type {InitializationParams}
 */
const defaultParams = {
	debug: false
};

const signals = {
	ready: 'ready'
};

class FreightPacker extends LightDispatcher {
	/**
	 * Freight Packer API instance
	 * @param {HTMLDivElement} containerDiv
	 * @param {InitializationParams} params
	 */
	constructor( containerDiv, params ) {

		super();
		let scope = this;

		this.params = Utils.AssignUndefined(params, defaultParams);
		devSetup(this);

		this.ux = new UX(this.params.uxParams);

		/** @type {CargoInputParams} */
		let cargoInputParams = {ux: this.ux};

		/** Handles input of: description fields (label, etc.), dimensions and constraints */
		this.cargoInput = new CargoInput(cargoInputParams);

		/** @type {PackingSpaceInputParams} */
		let packingSpaceInputParams = {ux: this.ux};

		/** Handles input of: packing spaces configurations and assets */
		this.packingSpaceInput = new PackingSpaceInput(packingSpaceInputParams);

		/** Manual solving and notification */
		this.packer = new PackerInterface(this.params.packerParams);

		let resources = new Resources();
			resources.texturesPath = this.params.texturesPath;

		/** @type {AppParams} */
		let appParams = {ux: this.ux, cargoInput: this.cargoInput, packingSpaceInput: this.packingSpaceInput, packerInterface: this.packer, resources: resources};
		let app = new App(containerDiv, appParams);
			app.On(App.signals.start, function(){
				scope.Dispatch(signals.ready);
			});

		devSetup(app);

		if(this.params.debug){
			auto(this);
		}
	}

	/**
	 * Check that webgl, etc are supported in this browser.
	 * Will resolve if requirements are met, otherwise rejects with an error message
	 * @return {Promise<Void>|Promise<string>} 
	 */
	static CheckRequirements () {
		let webgl = Capabilities.IsWebGLReady();

		return new Promise((resolve, reject) => {
			if(webgl){
				resolve();
			}
			else {
				let message = 'WebGL not supported.';
				reject(message);
			}
		});
	}

	/** Enumeration of dispatched types */
	static get signals(){
		return signals;
	}

	static get utils(){
		return utils;
	}

}

FreightPacker.UX = UX;
FreightPacker.CargoInput = CargoInput;
FreightPacker.PackingSpaceInput = PackingSpaceInput;
FreightPacker.Packer = PackerInterface;
FreightPacker.Constants = Constants;

export default FreightPacker;
