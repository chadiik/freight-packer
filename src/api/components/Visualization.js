import App from "../App";
import LightDispatcher from "./LightDispatcher";
import Logger from "../utils/cik/Logger";

const _app = Symbol('app');

const typeofNumber = 'number';

class PackResults {
    
    /** @param {App} app */
    constructor(app){

        this[_app] = app;
    }

    get animationDuration(){ 
        /** @type {App} */
        let app = this[_app];
        return app.view.packResultView.params.animationDuration;
    }
    set animationDuration(value){

        if(typeof value !== typeofNumber){
            Logger.Warn('PackResults.animationDuration error, parameter is not a number:', value);
            return;
        }

        /** @type {App} */
        let app = this[_app];
        app.view.packResultView.params.animationDuration = value; 
    }

    /** 
     * 0: None - 1: All (over y span)
     * @param {Number} value
     */
    SliceResults(value){

        if(typeof value !== typeofNumber){
            Logger.Warn('PackResults.SliceResults error, parameter is not a number:', value);
            return;
        }

        /** @type {App} */
        let app = this[_app];
        app.view.packResultView.Slice(value);
    }

}

const visualizationSignals = {
    
};

class Visualization extends LightDispatcher{
    
    /** @param {App} app */
    constructor(app){
        super();

        this[_app] = app;

        this.packResults = new PackResults(app);
    }

    /** Selects an entry in the scene, optionally highlighting packed instances
     *  @param {string | Boolean} [entryUID] default = false (deselect) @param {Boolean} [highlightPackedInstances] default = true */
    SelectEntry(entryUID, highlightPackedInstances){
        /** @type {App} */
        let app = this[_app];

        if(entryUID && !app.packer.cargoList.GetEntry(entryUID)){
            Logger.Warn('Visualization.SelectEntry failed, entry not found for:', entryUID);
            return;
        }

        app.view.cargoListView.Select(entryUID);

        if(highlightPackedInstances === undefined) highlightPackedInstances = true;
        if(highlightPackedInstances || !entryUID) app.view.packResultView.SelectEntry(entryUID);
    }

    static get signals(){
        return visualizationSignals;
    }
}

export default Visualization;