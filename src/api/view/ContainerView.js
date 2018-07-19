import Container from "../packer/container/Container";
import Asset from "../components/assets/Asset";
import Logger from "../utils/cik/Logger";

var views = new WeakMap();

class ContainerView {
    /**
     * 
     * @param {Container} container 
     * @param {THREE.Object3D} view
     */
    constructor(container, view){

        views.set(container, this);

        this.container = container;
        this.view = view;
    }

    Set(object3d){
        this.view = object3d;
    }

    /**
     * @param {Container} container
     * @returns {ContainerView}
     */
    static Request(container){
        var view = views.get(container);
        if( ! view ){
            view = new ContainerView(container, Asset.CreateMesh());
            Logger.Warn('View not found for:', container);
        }
        return view;
    }
}

export default ContainerView;