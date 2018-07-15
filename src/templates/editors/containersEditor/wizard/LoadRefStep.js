import WizardStep from "../../wizard/WizardStep";
import IO from '../../../utils/IO';
import Draggable from "../../../ui/elements/Draggable";
import Dom from "../../../ui/Dom";
import SurfaceUtils from "../../../utils/SurfaceUtils";
import ContainersEditorWizard from "./ContainersEditorWizard";

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
        var refGeometry = SurfaceUtils.MergeObject(obj);
        refGeometry = new THREE.Geometry().fromBufferGeometry(refGeometry);
        refGeometry.mergeVertices();
        refGeometry.computeFaceNormals();
        this.vertexHash = SurfaceUtils.CreateVertexHash(refGeometry);

        if(this.obj === undefined){
            this.obj = new THREE.Mesh(refGeometry, new THREE.MeshStandardMaterial({color: 0x999999}));
            this.data.view.add(this.obj);
            this.data.ref = this.obj;
        }
        else{
            this.obj.geometry = refGeometry;
        }

        this.Complete(this.data);
    }

    Dispose(){
        super.Dispose();
        this.modal.Remove();
    }
}

export default LoadRefStep;