import WizardStep from "./WizardStep";
import Wizard from "./Wizard";
import Dom from "../../ui/Dom";
import Draggable from "../../ui/elements/Draggable";
import Element from "../../ui/Element";

class NameEntryStep extends WizardStep {
    constructor(){
        var input = FPEditor.instance.sceneSetup.input;
        super('nameEntry', {
            input: input
        });
    }

    Start(){
        super.Start();

        console.log('nameEntry.Start, this = ', this);

        var scope = this;
        var enterKeyHandler = this.data.input.keyboard.on('enter', function(){
            scope.Complete();
        });

        this.data.keyListeners = [enterKeyHandler];
    }

    Dispose(){
        super.Dispose();
        this.data.keyListeners.forEach(listener => {
            this.data.input.keyboard.unregister(listener); 
        });
        delete this.data.keyListeners;
    }

    Complete(){
        super.Complete();
        console.log('Enter key pressed.');
    }
    
}

class SomethingStep extends WizardStep {
    constructor(){
        var input = FPEditor.instance.sceneSetup.input;
        super('something', {
            input: input
        });
    }

    Start(){
        super.Start();

        console.log('something.Start, this = ', this);

        var scope = this;
        this.data.spaceKeyHandler = this.data.input.keyboard.on('space', function(){
            scope.Complete();
        });
    }

    Dispose(){
        super.Dispose();
        this.data.input.keyboard.unregister(this.data.spaceKeyHandler);
    }

    Complete(){
        super.Complete();
        console.log('Space key pressed.');
    }
    
}

class WizardTest {
    constructor(){

        var elements = document.getElementById('wizard-elements');

        var nameEntry = new NameEntryStep();
        var something = new SomethingStep();

        nameEntry.On(WizardStep.signals.start, function(){
            console.log('nameEntry started, signal callback');
            var modal = new Draggable('Name entry', Draggable.widths.medium);
            modal.Add(elements.querySelector('#nameEntry'));
            Dom.instance.Add(modal);
        });

        nameEntry.On(WizardStep.signals.complete, function(){
            console.log('nameEntry completed, signal callback');
            something.data.nameEntry = 'enter key';
        });

        something.On(WizardStep.signals.start, function(){
            console.log('something started, signal callback');
        });

        something.On(WizardStep.signals.complete, function(){
            console.log('something completed, signal callback');
        });

        var steps = [nameEntry, something];
        var wizard = new Wizard(steps);

        wizard.On(Wizard.signals.change, function(step){
            console.log('wizard changed to ' + step.key + ', signal callback');
        });

        wizard.On(Wizard.signals.complete, function(step){
            console.log('wizard completed with ' + step.key + ', signal callback');
        });

        wizard.Start();
    }
}

export default WizardTest;