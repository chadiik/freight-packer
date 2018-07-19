
const spaces = {
    world: 'world',
    local: 'local'
};

const modes = {
    translate: 'translate',
    rotate: 'rotate',
    scale: 'scale'
};

/**
 * @type {Object<Control3D>}
 */
var defaultControls = {};

class Control3D {

    /**
     * @param {THREE.Camera} camera 
     * @param {HTMLElement} domElement 
     */
    constructor(camera, domElement){
        this.camera = camera;
        this.control = new THREE.TransformControls(this.camera, domElement);
        this.control.addEventListener('change', this.Update.bind(this));

        this.control.traverse(function(child){
            child.renderOrder = 2;
        });

        this.Hide();
    }

    Hide(){
        this.control.visible = false;
    }

    Show(){
        this.control.visible = true;
    }

    Attach(target){
        this.control.attach(target);
    }

    Detach(){
        this.control.detach();
    }

    Update(){
        this.control.update();
    }

    get space(){
        return this.control.space;
    }

    set space(value){
        this.control.space = value;
    }

    // translate || rotate || scale
    set mode(value){
        this.control.setMode(value);
    }

    static get spaces(){
        return spaces;
    }

    static get modes(){
        return modes;
    }

    /**
     * @param {string} id 
     * @param {THREE.Camera} camera 
     * @param {HTMLElement} domElement 
     * @returns {Control3D}
     */
    static Configure(id, camera, domElement){
        var control = new Control3D(camera, domElement);
        defaultControls[id] = control;
        return control;
    }

    /**
     * @returns {Control3D}
     */
    static Request(id){
        return defaultControls[id];
    }
}

export default Control3D;