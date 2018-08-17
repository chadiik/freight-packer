import Container from "../packer/container/Container";
import ContainerView from "./ContainerView";
import Logger from "../utils/cik/Logger";
import ContainingVolume from "../packer/container/ContainingVolume";

const typeofString = 'string';

var yRotation = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
var tempMatrix4 = new THREE.Matrix4();

class PackingSpaceView{
    constructor(){
        this.view = new THREE.Object3D();

        /**
         * @type {Array<ContainerView>}
         */
        this.containerViews = [];
    }

    /** 
     * @param {Container} container
     */
    Add(container){
        let containerView = ContainerView.Request(container);
        this.view.add(containerView.view);
        this.containerViews.push(containerView);
    }

    Clear(){
        for(let i = 0; i < this.containerViews.length; i++){
            let cv = this.containerViews[i];
            this.view.remove(cv.view);
        }
        this.containerViews.length = 0;
    }

    /**
     * @param {string} containingVolumeUID 
     */
    FindContainingVolume(containingVolumeUID){
        for(let iCView = 0; iCView < this.containerViews.length; iCView++){
            let volumes = this.containerViews[iCView].container.volumes;
            for(let iCVolume = 0; iCVolume < volumes.length; iCVolume++){
                if(volumes[iCVolume].uid === containingVolumeUID){
                    return volumes[iCVolume];
                }
            }
        }
    }

    /**
     * @param {ContainingVolume} containingVolume 
     */
    GetMatrix(containingVolume){
        if(typeof containingVolume === typeofString) containingVolume = this.FindContainingVolume(containingVolume);
        tempMatrix4.identity();
        tempMatrix4.makeTranslation(containingVolume.position.x - containingVolume.dimensions.width / 2, containingVolume.position.y, containingVolume.position.z - containingVolume.dimensions.length / 2);
        //tempMatrix4.premultiply(yRotation);
        return tempMatrix4;
    }
}

export default PackingSpaceView;