import WizardStep from "../../wizard/WizardStep";
import IO from '../../../utils/IO';
import Draggable from "../../../ui/elements/Draggable";
import Dom from "../../../ui/Dom";
import ContainersEditorWizard from "./ContainersEditorWizard";
import OptimizedMultiMat from "../../../utils/OptimizedMultiMat";

class LoadRefStep extends WizardStep {
    constructor(){
        super('loadRef');
    }

    Start(){
        super.Start();

        var scope = this;

        var elements = document.getElementById('wizard-elements');
        var element = elements.querySelector('#loadRef');
        var loadBtn = element.querySelector('#loadBtn');
        loadBtn.onclick = function(){
            scope.Import3DModel();
        };

        this.modal = new Draggable(ContainersEditorWizard.title, Draggable.widths.medium);
        this.modal.Add(element);
        Dom.instance.Add(this.modal);
    }

    Import3DModel(){
        var scope = this;
        IO.GetFile(function(file){
            var obj = new THREE.FBXLoader().parse(file);
            scope.SetRefModel(obj);
        }, true);
    }

    SetRefModel(obj){
        console.log(obj);

        var optimizedRefObject = new OptimizedMultiMat(obj);
        var refObject = optimizedRefObject.obj;

        refObject.traverse(function(child){
            if(child instanceof THREE.Mesh){
                /** @type {THREE.BufferGeometry} */
                var geometry = child.geometry;
                console.log(geometry);
                if(geometry.isBufferGeometry){
                    geometry = new THREE.Geometry().fromBufferGeometry(geometry);
                    geometry.mergeVertices();
                    geometry.computeFaceNormals();
                    child.geometry = geometry;
                }
            }
        });

        console.log(refObject);

        if(this.data.ref !== undefined)
            this.data.view.remove(this.data.ref);

        this.data.ref = refObject;
        this.data.view.add(this.data.ref);

        this.Complete(this.data);
    }

    Dispose(){
        super.Dispose();
        this.modal.Remove();
    }
}

export default LoadRefStep;