/*
const _callback = Symbol('callback');
/** @returns {function} /
get callback(){ return this[_callback]; }
set callback(value){
    this[_callback] = value;
}
*/

class UpdateComponent{
    /**
     * 
     * @param {Boolean} active 
     * @param {Number} interval 
     * @param {function(Number)} callback
     */
    constructor(active, interval, callback){
        this.active = active === undefined ? false : active;
        this.interval = interval === undefined ? 1 / 30 : interval;
        this.callback = callback;
        this.lastUpdateTime = 0;
    }

    /**
     * @param {Number} now 
     */
    Update(now){
        this.lastUpdateTime = now;
        this.callback(now);
    }
}

export default UpdateComponent;