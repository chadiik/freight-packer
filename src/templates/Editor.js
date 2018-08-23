import SceneSetup from "../api/view/SceneSetup";
import ContainersEditor from "./editors/containersEditor/ContainersEditor";
import WizardTest from "./editors/wizard/WizardTest";
import Dom from "./ui/Dom";
import UX from "../api/UX";

/**
 * @type {Editor}
 */
var instance;

/** @type {import('../src/FreightPacker').InitializationParams} */
var params = {
    debug: true,
    ux: {
        hud: false,
        configure: true
    }
};

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

		var ux = new UX(params.ux);

        this.sceneSetup = new SceneSetup(viewElement, ux);
        this.sceneSetup.Init().then(this.Start.bind(this));

        this.dom = new Dom();
        //viewElement.appendChild(this.dom.element);
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
        let lights = this.sceneSetup.DefaultLights(this.sceneSetup.sceneController, false, false);
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