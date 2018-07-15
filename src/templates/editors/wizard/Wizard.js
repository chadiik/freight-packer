
import Signaler from '../../../api/utils/cik/Signaler';
import WizardStep from './WizardStep';

const signals = {
    change: 'change',
    complete: 'complete'
};

class Wizard extends Signaler {
    /**
     * 
     * @param {Array<WizardStep>} steps 
     */
    constructor(steps){
        super();

        this.current = -1;
        this.steps = steps;

        this.Link(...this.steps);
    }

    Globals(data){
        this.steps.forEach(step => {
            Object.assign(step.data, data);
        });
    }

    Link(...steps){
        var next = this.Next.bind(this);
        steps.forEach(step => {
            step.On(WizardStep.signals.complete, next);
        });
    }

    FindIndex(key){
        for(var i = 0, len = this.steps.length; i < len; i++){
            let step = this.steps[i];
            if(step.key === key)
                return i;
        }
        return -1;
    }

    Load(index, dataPass){
        if(this.current !== -1 && this.steps[this.current]){
            this.steps[this.current].Dispose();
        }

        if(typeof index === 'string') index = this.FindIndex(index);

        this.current = index;
        this.steps[this.current].Start(dataPass);

        this.Dispatch(signals.change, this.steps[this.current]);
    }

    Start(){
        this.Load(0);
    }

    Next(dataPass){

        var next = this.current + 1;

        if(next === this.steps.length){
            if(this.steps[this.current]){
                this.steps[this.current].Dispose();
            }

            let finalStep = this.steps[this.current];
            this.current++;
            this.Dispatch(signals.complete, finalStep);
            return;
        }

        this.Load(next, dataPass);

    }

    static get signals(){
        return signals;
    }

}

export default Wizard;