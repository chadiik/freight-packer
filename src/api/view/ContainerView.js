import Container from "../packer/container/Container";
import Asset from "../components/assets/Asset";
import Logger from "../utils/cik/Logger";
import ContainingVolume from "../packer/container/ContainingVolume";

/**
 * 
 * @param {Container} container 
 */
function createContainerBoxes(container){
    /**
     * @type {Map<ContainingVolume, THREE.Mesh>}
     */
    var meshes = new Map();

    container.volumes.forEach(cv => {
        let mesh = Asset.CreateMesh();
            
        let extent = cv.dimensions.vec3;
        mesh.scale.copy(extent);
        mesh.position.y += extent.y / 2;

        mesh.material = mesh.material.clone();
        mesh.material.color.setHex(0xffaaaa);
        mesh.material.transparent = true;
        mesh.material.opacity = .5;
        mesh.material.side = THREE.BackSide;
        mesh.material.polygonOffset = true;
        mesh.material.polygonOffsetFactor = 1;
        mesh.material.polygonOffsetUnits = 1;

        meshes.set(cv, mesh);
    });

    return meshes;
}

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
        this.view = new THREE.Object3D();
        this.view.add(view);

        var containerBoxes = createContainerBoxes(container);
        for(var [cv, mesh] of containerBoxes){
            mesh.position.add(cv.position);
            this.view.add(mesh);
        }

    }

    /*
    Set(object3d){
        this.view = object3d;
    }*/

    /**
     * @param {Container} container
     * @returns {ContainerView}
     */
    static Request(container){
        var view = views.get(container);
        if( ! view ){
            let meshes = createContainerBoxes(container);
            let view = new THREE.Object3D();
            for(var [cv, mesh] of meshes){
                mesh.position.add(cv.position);
                view.add(mesh);
            }

            containerView = new ContainerView(container, view);
            Logger.Warn('View not found for:', container);
        }
        return view;
    }
}

export default ContainerView;