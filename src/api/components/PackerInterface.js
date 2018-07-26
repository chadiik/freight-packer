import App from "../App";
import Signaler from "../utils/cik/Signaler";
import Packer from "../packer/Packer";

const _app = Symbol('app');

const signals = {
    packUpdate: 'packUpdate'
};

class PackerInterface extends Signaler {
    /**
     * @param {App} app 
     */
    constructor(app){
        super();
        
        var scope = this;
        function onPackUpdate(){
            scope.Dispatch(signals.packUpdate);
        }

        app.packer.On(Packer.signals.packUpdate, onPackUpdate);
        this[_app] = app;
    }

    Solve(){
        /** @type {App} */
        var app = this[_app];
        app.packer.Solve();
    }

    static get signals(){
        return signals;
    }
}

export default PackerInterface;