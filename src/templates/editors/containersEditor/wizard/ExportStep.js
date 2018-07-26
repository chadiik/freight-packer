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
        var view = this.data.ref;
        var container = this.data.container;
        console.log('exporting', view, container);
        return {
            view: view,
            container: container
        };
    }

    Export(){
        
        var decimals = 3;
        IO.SaveUTF(JSON.stringify(this, 
            function(key, value) {
                // limit precision of floats
                if (typeof value === 'number') {
                    return parseFloat(value.toFixed(decimals));
                }
                return value;
            }),
            'PackingSpace-config.json');
        this.Complete();
    }

    Dispose(){
        super.Dispose();
        this.modal.Remove();
    }
}

export default ExportStep;