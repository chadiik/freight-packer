class PackingProperty {
    constructor(){
        this.enabled = false;
    }

    Reset(){
        this.enabled = false;
    }

    Clone(){
        var property = new PackingProperty();
        property.enabled = this.enabled;
        return property;
    }
}

class SupportsStacking extends PackingProperty {
    constructor(){
        super();
    }
}

class Constraint extends PackingProperty {
    constructor(){
        super();
    }
}

class RotationConstraint extends Constraint {
    constructor(){
        super();
    }
}

class TranslationConstraint extends Constraint {
    constructor(){
        super();
    }
}

export {
    SupportsStacking,
    RotationConstraint,
    TranslationConstraint
};