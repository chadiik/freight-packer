import LightDispatcher from "./LightDispatcher";
import App from "../App";
import CargoListView from "../view/CargoListView";
import CargoEntry from "./common/CargoEntry";

const _app = Symbol('app');

const signals = {
    boxEntryInteract: 'beInteract0'
};

class User extends LightDispatcher{
    /** @param {App} app */
    constructor(app){
        super();

        this[_app] = app;

        let scope = this;
        /** @param {CargoEntry} cargoEntry */
        function onCargoInteract(cargoEntry){
            scope.Dispatch(signals.boxEntryInteract, cargoEntry.uid);
        }

        app.view.cargoListView.On(CargoListView.signals.interact, onCargoInteract);
    }

    /** Enumeration of dispatched types */
    static get signals(){
        return signals;
    }

}

export default User;