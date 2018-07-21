class PackingProperty {
    constructor(){
        this.enabled = false;
    }

    Reset(){
        this.enabled = false;
    }

    Copy(){
        Logger.Warn('PackingProperty.Copy is not implemented');
    }

    Clone(){
        Logger.Warn('PackingProperty.Clone is not implemented');
    }
}

class SupportsStacking extends PackingProperty {
    constructor(){
        super();
    }

    /**
     * @param {SupportsStacking} prop 
     */
    Copy(prop){
        this.enabled = prop.enabled;
    }

    Clone(){
        var prop = new SupportsStacking();
        prop.enabled = this.enabled;
        return prop;
    }
}

class Constraint extends PackingProperty {
    constructor(){
        super();
    }

    Copy(prop){
        Logger.Warn('Constraint.Copy is not implemented');
    }

    Clone(){
        Logger.Warn('Constraint.Clone is not implemented');
    }
}

class RotationConstraint extends Constraint {
    constructor(){
        super();
    }

    /**
     * @param {RotationConstraint} prop 
     */
    Copy(prop){
        this.enabled = prop.enabled;
    }

    Clone(){
        var prop = new RotationConstraint();
        prop.enabled = this.enabled;
        return prop;
    }
}

class TranslationConstraint extends Constraint {
    constructor(){
        super();
    }

    /**
     * @param {TranslationConstraint} prop 
     */
    Copy(prop){
        this.enabled = prop.enabled;
    }

    Clone(){
        var prop = new TranslationConstraint();
        prop.enabled = this.enabled;
        return prop;
    }
}

export {
    PackingProperty,
    SupportsStacking,
    RotationConstraint,
    TranslationConstraint
};