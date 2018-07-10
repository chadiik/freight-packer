
class Controller {
    constructor(params){

        this.params = params;

        // Containers
        this.itemsContainer = new THREE.Object3D();
        this.itemsContainer.name = "itemsContainer";
        this.miscContainer = new THREE.Object3D();
        this.miscContainer.name = "miscContainer";
        this.ambientContainer = new THREE.Object3D();
        this.ambientContainer.name = "ambientContainer";
        this.defaults = new THREE.Object3D();
        this.defaults.name = "defaults";

        // Scene
        this.scene = new THREE.Scene();

        // Setup rest
        this.scene.add(this.itemsContainer);
        this.scene.add(this.miscContainer);
        this.scene.add(this.ambientContainer);
        this.scene.add(this.defaults);
    }

    Add(object, container){
        if(container === undefined) container = this.miscContainer;
        container.add(object);
    }

    AddDefault(object){
        this.defaults.add(object);
    }

    Remove(object){
        if(typeof object === 'string'){
            var objName = object;
            object = this.itemsContainer.getObjectByName(objName);
            if(object === undefined) object = this.miscContainer.getObjectByName(objName);
            if(object === undefined) return;
        }
        this.itemsContainer.remove(object);
        this.miscContainer.remove(object);
    }
}

export default Controller;