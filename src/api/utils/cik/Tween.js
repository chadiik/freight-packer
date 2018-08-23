import Pool from "./Pool";

/** 
 * Tween update function
 * @param {Number} time 
 * @param {Number} startValue 
 * @param {Number} delta 
 * @param {Number} duration
 * @returns {Number} value
 */
function TweenCallback(time, startValue, delta, duration){}

/**
 * On completed callback
 * @param {Tween} target
 */
function TweenCompletedCallback(target){}

var clock = new THREE.Clock();

function poolNewFN(){
    return new Tween();
}
/** @param {Tween} tween */
function poolResetFN(tween){
    return tween;
}
var pool = new Pool(poolNewFN, poolResetFN);

const functions = {
    /** @type {TweenCallback} */
    linear: function(t, b, c, d){
        return b + c * (t / d);
    },

    ease: {
        /** @type {TweenCallback} */
        easeOutElastic: function(t, b, c, d) {
            var ts=(t/=d)*t;
            var tc=ts*t;
            return b+c*(33*tc*ts + -106*ts*ts + 126*tc + -67*ts + 15*t);
        },

        /** @type {TweenCallback} */
        easeOutQuad: function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },

        /** @type {TweenCallback} */
        easeOutCubic: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        easeInOutQuad: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },

    special: {
        /** @type {TweenCallback} */
        pingPong: function (t, b, c, d) {
            return Math.sin(t / d * Math.PI) * c + b;
        }
    }
};

/**
 * On completed callback
 * @param {TweenCombo} target
 */
function TweenComboCompletedCallback(target){}

class TweenCombo{
    /**
     * 
     * @param {Array<Tween>} tweens 
     */
    constructor(...tweens){
        this.tweens = tweens;

        /** @type {TweenComboCompletedCallback} */
        this.onComplete;
        this.completed = false;
    }

    /** @param {Array<Number>} args */
    SetDurations(...args){ for(var i = 0; i < this.tweens.length; i++) this.tweens[i].duration = args[i]; }

    /** @param {Array<Number>} args */
    SetDeltas(...args){ for(var i = 0; i < this.tweens.length; i++) this.tweens[i].delta = args[i]; }

    /** @param {Array<Number>} args */
    SetStartValues(...args){ for(var i = 0; i < this.tweens.length; i++) this.tweens[i].startValue = args[i]; }

    /**
     * @param {Object} object 
     * @param {Array<string>} properties 
     */
    Hook(object, ...properties){
        for(var i = 0; i < this.tweens.length; i++){
            this.tweens[i].Hook(object, properties[i]);
        };
    }

    Unhook(){
        this.tweens.forEach(tween => tween.Unhook());
    }

    /** Restarts time */
    Restart(){
        this.tweens.forEach(tween => tween.Restart());
    }

    /**
     * Update tween
     * @param {Number} [t] [0, duration]
     */
    Update(t){
        var completed = true;
        this.tweens.forEach(tween => {
            if(tween.completed === false)
                tween.Update(t);

            completed = completed && tween.completed;
        });

        this.completed = completed;
        if(this.completed && this.onComplete)
            this.onComplete(this);
    }

    /**
     * Returns tweens to pool
     */
    Return(){
        this.tweens.forEach(tween => {
            pool.Return(tween);
        });
    }

    /**
     * @param {TweenCallback} callback 
     * @param {Number} startValue0
     * @param {Number} startValue1
     * @param {Number} startValue2
     * @param {Number} delta0
     * @param {Number} delta1
     * @param {Number} delta2
     * @param {Number} duration
     */
    static Request3(callback, duration, startValue0, delta0, startValue1, delta1, startValue2, delta2){
        var tween0 = pool.Request();
        tween0.Reset(callback, startValue0, delta0, duration);

        var tween1 = pool.Request();
        tween1.Reset(callback, startValue1, delta1, duration);

        var tween2 = pool.Request();
        tween2.Reset(callback, startValue2, delta2, duration);

        var combo = new TweenCombo(tween0, tween1, tween2);
        return combo;
    }

    /**
     * @param {TweenCallback} callback 
     * @param {Number} duration 
     * @param {Array<Number>} args startValueN, deltaN
     */
    static RequestN(callback, duration, ...args){

        let tweens = [];
        for(let i = 0; i < args.length; i += 2){
            let tween = pool.Request();
            tween.Reset(callback, args[i], args[i + 1], duration);
            tweens.push(tween);
        }

        let combo = new TweenCombo(...tweens);
        return combo;
    }
}

class Tween{
    /**
     * @param {TweenCallback} callback 
     * @param {Number} [startValue] 
     * @param {Number} delta 
     * @param {Number} duration 
     */
    constructor(callback, startValue, delta, duration){
        this.Reset(callback, startValue, delta, duration);
        
        /** @type {TweenCompletedCallback} */
        this.onComplete;
    }

    /**
     * @param {TweenCallback} callback 
     * @param {Number} [startValue]
     * @param {Number} delta 
     * @param {Number} duration 
     */
    Reset(callback, startValue, delta, duration){
        this.callback = callback;
        this.startValue = startValue;
        this.delta = delta;
        this.duration = duration;

        if(this.startValue === undefined && this.object && this.property){
            this.startValue = this.object[this.property];
        }

        this.Restart();
    }

    /** Restarts time */
    Restart(){
        this.completed = false;
        this.startTime = clock.getElapsedTime();
    }

    /**
     * @param {Object} object 
     * @param {string} property 
     */
    Hook(object, property){
        this.object = object;
        this.property = property;

        if(this.startValue === undefined){
            this.startValue = this.object[this.property];
        }
    }

    Unhook(){
        this.object = this.property = undefined;
    }

    /**
     * Update tween
     * @param {Number} [t] [0, duration]
     */
    Update(t){
        if(t === undefined) t = clock.getElapsedTime() - this.startTime;

        if(t >= this.duration){
            this.completed = true;
            let endValue = this.startValue + this.delta;
        
            if(this.object)
                this.object[this.property] = endValue;
            
            if(this.onComplete)
                this.onComplete(this);
            
            return endValue;
        }

        var x = this.callback(t, this.startValue, this.delta, this.duration);
        if(this.object)
            this.object[this.property] = x;
        
        return x;
    }

    Return(){
        pool.Return(this);
    }

    /**
     * @param {TweenCallback} callback 
     * @param {Number} [startValue]
     * @param {Number} delta 
     * @param {Number} duration 
     */
    static Request(callback, startValue, delta, duration){
        var tween = pool.Request();
        tween.Reset(callback, startValue, delta, duration);

        return tween;
    }

    static get functions(){
        return functions;
    }
}

Tween.Combo = TweenCombo;

export default Tween;