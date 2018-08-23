import Tween from "../Tween";
import Signaler from "../Signaler";

var tempBox3 = new THREE.Box3();
var tempVec3 = new THREE.Vector3();
var clock = new THREE.Clock();

class TransitionController{
    constructor(){

    }
}

class Slide extends TransitionController{
    /**
     * Slide from, to. ie: slideFromLeft -> from = 1 & to = 0
     * @param {string} property 
     * @param {Number} from 
     * @param {Number} to 
     */
    constructor(property, from, to){
        super();

        this.tween = new Tween(Tween.functions.linear, 0, 0, 0);
        this.property = property;
        this.from = from;
        this.to = to;
    }

    /** @param {Transition} transition */
    Init(transition){

        transition.bounds.getSize(tempVec3);
        let offset = tempVec3.x;
        transition.bounds.getCenter(tempVec3);
        offset += transition.target.position.x - tempVec3.x;

        this.tween.startValue = offset * this.from;
        this.tween.delta = -(offset * this.from) + offset * this.to;
        this.tween.duration = transition.duration;
        this.tween.onComplete = transition.OnComplete.bind(transition);

        this.tween.Hook(transition.target.position, this.property);
    }

    Start(){
        this.tween.Update(0);
    }

    /** @param {Number} t */
    Update(t){
        this.tween.Update(t);
    }
}

const signals = {
    complete: 'complete'
};

const _controller = Symbol('controller');

class Transition extends Signaler{
    /**
     * @param {THREE.Object3D} boundsView object to calculate bounds from
     * @param {THREE.Object3D} transformView object to transform
     * @param {Number} duration
     */
    constructor(boundsView, transformView, duration){
        super();
        
        this.bounds = new THREE.Box3();
        this.bounds.setFromObject(boundsView);

        this.target = transformView;
        this.duration = duration;
    }

    /** @param {TransitionController} value */
    set controller(value){
        this[_controller] = value;
    }

    get controller(){ return this[_controller]; }

    OnComplete(){
        this.Dispatch(signals.complete, this.controller);
    }

    Start(){
        this.startTime = clock.getElapsedTime();
        if(this.controller) this.controller.Start();
    }

    Update(){
        let t = clock.getElapsedTime() - this.startTime;
        if(this.controller) this.controller.Update(t);
    }

    static get signals(){
        return signals;
    }
}

export {
    Transition, 
    Slide
};