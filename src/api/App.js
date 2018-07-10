
import View from './view/View';
import Logger from './utils/cik/Logger';

class App {
    constructor(containerDiv, components) {
        
        this.components = components;

        this.view = new View(containerDiv);
        this.view.Init().then(this.Start.bind(this));
    }

    Start(){
        this.view.Start();

        this.components.boxInput.On('completed', function(){
            Logger.Trace('insert box');
        });
    }
  
}

export default App;
  