import WizardStep from "../../wizard/WizardStep";
import IO from '../../../utils/IO';
import Draggable from "../../../ui/elements/Draggable";
import Dom from "../../../ui/Dom";
import ContainersEditorWizard from "./ContainersEditorWizard";

class ExportStep extends WizardStep {
    constructor(){
        super('export');
    }

    Start(dataPass){
        super.Start();

        Object.assign(this.data, dataPass);

        var scope = this;

        var elements = document.getElementById('wizard-elements');
        var element = elements.querySelector('#export');

        var exportBtn = element.querySelector('#exportBtn');
        exportBtn.onclick = function(){
            scope.Export();
        };

        this.modal = new Draggable(ContainersEditorWizard.title, Draggable.widths.medium);
        this.modal.Add(element);
        Dom.instance.Add(this.modal);
    }

    toJSON(){
        var geometry = this.data.geometry;
        var container = this.data.container;
        return {
            geometry: geometry,
            container: container
        };
    }

    Export(){
        IO.SaveUTF(JSON.stringify(this), 'PackingSpace-config.json');
        this.Complete();
    }

    Dispose(){
        super.Dispose();
        this.modal.Remove();
    }
}

export default ExportStep;