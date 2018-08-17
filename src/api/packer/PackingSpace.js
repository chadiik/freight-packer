import Container from "./container/Container";
import Signaler from "../utils/cik/Signaler";

const signals = {
    containerAdded: 'containerAdded'
};

const _currentIndex = Symbol('currentIndex');

class PackingSpace extends Signaler {
    constructor(){
        super();
        
        this[_currentIndex] = -1;

        /**
         * @type {Container}
         */
        this.containers = [];
    }

    /** @param {Container} container */
    AddContainer(container){
        this.containers.push(container);
        this[_currentIndex]++;

        this.Dispatch(signals.containerAdded, container);
    }

    /** @returns {Container} */
    get current(){
        var currentIndex = this[_currentIndex];
        if(currentIndex !== -1){
            return this.containers[currentIndex];
        }
    }

    get ready(){
        return this[_currentIndex] !== -1;
    }

    static get signals(){
        return signals;
    }
}

export default PackingSpace;