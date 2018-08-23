import Container from "../packer/container/Container";
import Asset from "../components/assets/Asset";
import Logger from "../utils/cik/Logger";
import ContainingVolume from "../packer/container/ContainingVolume";

class ContainerBox{
    /** @param {THREE.Mesh} mesh */
    constructor(mesh){
        this.mesh = mesh;
    }
}

/**
 * 
 * @param {Container} container 
 */
function createContainerBoxes(container){
    /**
     * @type {Map<ContainingVolume, ContainerBox>}
     */
    var boxes = new Map();

    container.volumes.forEach(cv => {
        let mesh = Asset.CreateMesh();
            
        let extent = cv.dimensions.vec3;
        mesh.scale.copy(extent);
        mesh.position.y += extent.y / 2;

        mesh.material = mesh.material.clone();
        mesh.material.color.setHex(0xffaaaa);
        mesh.material.transparent = true;
        mesh.material.opacity = .2;
        mesh.material.side = THREE.BackSide;
        mesh.material.polygonOffset = true;
        mesh.material.polygonOffsetFactor = 1;
        mesh.material.polygonOffsetUnits = 1;

        boxes.set(cv, new ContainerBox(mesh));
    });

    return boxes;
}

var tempVec3 = new THREE.Vector3();

/** @type {WeakMap<Container, ContainerView>} */
var views = new WeakMap();

class ContainerView {
    /**
     * 
     * @param {Container} container 
     * @param {THREE.Object3D} view
     */
    constructor(container, view){

        // Store original dimensions
        this.initializationBox3 = new THREE.Box3();
        this.initializationBox3.setFromObject(view);

        views.set(container, this);

        this.container = container;
        this.view = new THREE.Object3D();
        this.view.add(view);

        Asset.StandardSceneObject(this.view);
        Asset.ColorTemplates('Containers').Apply(this.view);

        this.containerBoxes = createContainerBoxes(container);
        for(var [cv, box] of this.containerBoxes){
            box.mesh.position.add(cv.position);
            this.view.add(box.mesh);
        }

    }

    //** @param {Input} input @param {Camera} cameraController */
    /*InitSliderBoxes(input, cameraController, changeCallback, stopCallback){
        for(var box of this.containerBoxes.values()){
            box.UseInput(input, cameraController);
            box.On(sliderSignals.change, changeCallback);
            box.On(sliderSignals.stop, stopCallback);
        }
    }*/

    /**
     * @param {Boolean} visible
     * @param {THREE.Vector3} [padding]
     */
    PlatformVisibility(visible, padding){

        if(visible && this.platformMesh === undefined){

            if(padding === undefined) padding = new THREE.Vector3(0, .01, 0);
        
            this.initializationBox3.getSize(tempVec3);

            let planeGeom = new THREE.BoxGeometry(tempVec3.x + padding.x * 2, padding.y, tempVec3.z + padding.z * 2, 1, 1, 1);
            let planeMaterial = new Asset.CreateSolidMaterialMatte(Asset.ColorTemplates('Containers').Apply(0xffffff));
            this.platformMesh = new THREE.Mesh(planeGeom, planeMaterial);
            Asset.ReceiveShadow(this.platformMesh);

            this.platformMesh.position.y = .001;
            this.view.add(this.platformMesh);
        }

        this.platformMesh.visible = visible;
    }

    /**
     * @param {Container} container
     * @returns {ContainerView}
     */
    static Request(container){
        var view = views.get(container);
        if( !view ){
            let boxes = createContainerBoxes(container);
            let object3d = new THREE.Object3D();
            for(var [cv, box] of boxes){
                box.mesh.position.add(cv.position);
                object3d.add(box.mesh);
            }

            view = new ContainerView(container, object3d);
            views.set(container, view);
            Logger.Warn('View not found for:', container);
        }
        return view;
    }
}

export default ContainerView;