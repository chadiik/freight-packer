import Wizard from "../../wizard/Wizard";
import LoadRefStep from "./LoadRefStep";
import ConfigureSpaceStep from "./ConfigureSpaceStep";
import ExportStep from "./ExportStep";

const title = 'Containers wizard...';

class ContainersEditorWizard extends Wizard {
    constructor(){
        var loadRef = new LoadRefStep();
        var configureSpace = new ConfigureSpaceStep();
        var exporter = new ExportStep();

        var steps = [
            loadRef,
            configureSpace,
            exporter
        ];

        super(steps);
    }

    static get title(){
        return title;
    }
}

export default ContainersEditorWizard;