import Logger from "../../utils/cik/Logger";

const _enabled = Symbol('enabled');

class PackingProperty {
    constructor(){
        this[_enabled] = false;
    }

    /** @returns {Boolean} Is property enabled */
    get enabled(){ return this[_enabled]; }
    set enabled(value){
        this[_enabled] = value;
    }

    Reset(){
        this.enabled = false;
    }

    /**
     * @param {PackingProperty} prop 
     */
    Copy(prop){
        this.enabled = prop.enabled;
    }

    Clone(){
        Logger.Warn('PackingProperty.Clone is not implemented');
    }

    static Assert(prop){
        return prop instanceof PackingProperty;
    }
}

class StackingProperty extends PackingProperty {
    constructor(){
        super();

        /** Maximum stacking capacity (weight) */
        this.capacity = Number.MAX_SAFE_INTEGER;
    }

    Reset(){
        super.Reset();
        this.capacity = Number.MAX_SAFE_INTEGER;
    }

    /**
     * @param {StackingProperty} prop 
     */
    Copy(prop){
        super.Copy(prop);
        this.capacity = prop.capacity;
    }

    Clone(){
        var prop = new StackingProperty();
        prop.Copy(this);
        return prop;
    }
}

class Constraint extends PackingProperty {
    constructor(){
        super();
    }

    Copy(prop){
        super.Copy(prop);
    }

    Clone(){
        Logger.Warn('Constraint.Clone is not implemented');
    }
}

const orientations = { xyz: 'xyz', zyx: 'zyx', yxz: 'yxz', yzx: 'yzx', zxy: 'zxy', xzy: 'xzy' };
const _allowedOrientations = Symbol('allowedOrientations');
class RotationConstraint extends Constraint {
    constructor(){
        super();
    }

    /** Enables each orientation enumeration in array
     * @param {Array<orientations>} value */
    set allowedOrientations(value){
        this[_allowedOrientations] = value;
    }
    get allowedOrientations(){ return this[_allowedOrientations]; }

    Reset(){
        super.Reset();
        if(this.allowedOrientations instanceof Array) this.allowedOrientations.length = 0;
    }

    /** @param {Boolean} allowX @param {Boolean} allowY @param {Boolean} allowZ */
    SetOrientationsByAxis(allowX, allowY, allowZ){
        let allowed = this.allowedOrientations;
        if(allowed) allowed.length = 0;
        else allowed = [];

        if(allowY){
            allowed.push(orientations.xyz, orientations.zyx);

            if(allowX) allowed.push(orientations.yzx);
            if(allowZ) allowed.push(orientations.zxy);
        }
        if(allowX) allowed.push(orientations.xzy);
        if(allowZ) allowed.push(orientations.yxz);

        this.allowedOrientations = allowed;
    }

    /** @param {Boolean} allowWH @param {Boolean} allowLH @param {Boolean} allowWL */
    SetOrientationsBySide(allowWH, allowLH, allowWL){
        let allowed = this.allowedOrientations;
        if(allowed) allowed.length = 0;
        else allowed = [];

        if(allowWH) allowed.push(orientations.yxz, orientations.yzx);
        if(allowLH) allowed.push(orientations.xzy, orientations.zxy);
        if(allowWL) allowed.push(orientations.xyz, orientations.zyx);

        this.allowedOrientations = allowed;
    }

    /**
     * @param {RotationConstraint} prop 
     */
    Copy(prop){
        super.Copy(prop);
        this.allowedOrientations = prop.allowedOrientations instanceof Array ? prop.allowedOrientations.slice() : undefined;
    }

    Clone(){
        var prop = new RotationConstraint();
        prop.Copy(this);
        return prop;
    }

    /** Enumerations of orientation values, do not modify directly */
    static get orientations(){
        return orientations;
    }
}

class TranslationConstraint extends Constraint {
    constructor(){
        super();

        /** Should be positioned on the platform surface (on the ground) */
        this.grounded = false;
    }

    Reset(){
        super.Reset();
        this.grounded = false;
    }

    /**
     * @param {TranslationConstraint} prop 
     */
    Copy(prop){
        super.Copy(prop);
        this.grounded = prop.grounded;
    }

    Clone(){
        var prop = new TranslationConstraint();
        prop.Copy(this);
        return prop;
    }
}

export {
    PackingProperty,
    StackingProperty,
    RotationConstraint,
    TranslationConstraint
};