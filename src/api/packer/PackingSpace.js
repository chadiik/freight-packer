import Container from "./container/Container";
import Signaler from "../utils/cik/Signaler";

const signals = {
    containerAdded: 'containerAdded'
};

class PackingSpace extends Signaler {
    constructor(){
        super();
        
        this._current = -1;

        /**
         * @type {Container}
         */
        this.containers = [];
    }

    AddContainer(container){
        this.containers.push(container);

        this.Dispatch(signals.containerAdded, container);
    }

    /**
     * @returns {Container}
     */
    get current(){
        if(this._current != -1){
            return this.containers[this._current];
        }
    }

    static get signals(){
        return signals;
    }
}

export default PackingSpace;