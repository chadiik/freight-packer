import ActiveEditor from "../ActiveEditor";
import ContainersEditorWizard from "./wizard/ContainersEditorWizard";

class ContainersEditor extends ActiveEditor {
    constructor(gui){
        super(gui);

        this.Start();
    }

    Start(){
        var view = new THREE.Object3D();
        FPEditor.instance.sceneSetup.sceneController.Add(view);

        var wizard = new ContainersEditorWizard();
        wizard.Globals({
            view: view
        });
        wizard.Start();
    }
}

export default ContainersEditor;