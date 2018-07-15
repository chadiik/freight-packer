import Container from "./container/Container";

class PackingSpace {
    constructor(){
        this._current = -1;
        this.containers = [];
    }

    get current(){
        if(this._current != -1){
            return this.containers[this._current];
        }
    }
}

export default PackingSpace;