import Container from "../packer/container/Container";
import ContainerView from "./ContainerView";
import Logger from "../utils/cik/Logger";

class PackingSpaceView{
    constructor(){
        this.view = new THREE.Object3D();
        this.domain = Symbol('PackingSpaceView');

        /**
         * @type {Array<ContainerView>}
         */
        this.containers = [];
    }

    /**
     * 
     * @param {Container} container 
     */
    Add(container){
        Logger.Log('Adding container: ' + container.ToString() + ' to view', container);
        var containerView = ContainerView.Request(container);
        this.view.add(containerView.view);
        this.containers.push(containerView);
    }

    /**
     * 
     * @param {Container} container 
     */
    Remove(container){

    }
}

export default PackingSpaceView;