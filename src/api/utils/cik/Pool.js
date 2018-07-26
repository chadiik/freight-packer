
const _new = Symbol('new'),
    _reset = Symbol('reset');

/**
 * @template {T}
 */
class Pool{
    /**
     * @param {function(...args)=>T} fnNew 
     * @param {function(T, ...args)=>T} [fnReset]
     */
    constructor(fnNew, fnReset){
        this.objects = [];

        this[_new] = fnNew;
        this[_reset] = fnReset;
    }

    /** Get a clean object (fnNew & fnReset) from the pool
     * @returns {T}
     */
    Request(...args){
        var object;

        if(this.objects.length === 0){
            object = this[_new](...args);
        }
        else{
            object = this.objects[this.objects.length - 1];
            --this.objects.length;
        }

        return this[_reset](object, ...args);
    }

    /** Make object available again
     * @param {T} object 
     */
    Return(object){
        this.objects[this.objects.length] = object;
    }
}

export default Pool;