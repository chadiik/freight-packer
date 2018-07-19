import SceneSetup from "../api/scene/SceneSetup";
import ContainersEditor from "./editors/containersEditor/ContainersEditor";
import WizardTest from "./editors/wizard/WizardTest";
import Dom from "./ui/Dom";

/**
 * @type {Editor}
 */
var instance;

class Editor {
    /**
     * 
     * @param {HTMLElement} guiElement 
     * @param {HTMLElement} viewElement 
     */
    constructor(guiElement, viewElement){

        console.log('FP Editor');

        instance = this;

        this.domElement = guiElement;
        this.GUI();

        this.sceneSetup = new SceneSetup(viewElement);
        this.sceneSetup.Init().then(this.Start.bind(this));

        this.dom = new Dom();
        viewElement.appendChild(this.dom.element);
    }

    GUI(){
        this.gui = new dat.GUI({autoPlace: false});
        this.domElement.appendChild(this.gui.domElement);

        var controller = {
            EditContainers: this.EditContainers.bind(this)
        };
        this.gui.add(controller, 'EditContainers');
    }

    EditContainers(){
        this.activeEditor = new ContainersEditor(this.gui);
    }

    Start(){
        this.sceneSetup.Start();
    }

    static get instance(){
        return instance;
    }

    static get namespace(){
        return require('./Namespace');
    }
}

global.FPEditor = Editor;