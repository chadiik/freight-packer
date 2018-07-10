import { SupportsStacking, RotationConstraint, TranslationConstraint } from "./PackingProperty";
import Dimensions from "./Dimensions";
import TextField from "../common/TextField";
import CargoEntry from "../common/CargoEntry";

class BoxEntry extends CargoEntry {
    constructor(){
        super();
        this.type = 'BoxEntry';

        this.dimensions = new Dimensions(0, 0, 0);
        
        this.properties.stacking    = new SupportsStacking();
        this.properties.rotation    = new RotationConstraint();
        this.properties.translation = new TranslationConstraint();
        
        this.descriptions.push(new TextField('label', TextField.defaultContent));
    }

    Reset(){
        this.active = false;
        this.properties.stacking.Reset();
        this.properties.rotation.Reset();
        this.properties.translation.Reset();
        this.descriptions.length = 1;
        this.descriptions[0].content = TextField.defaultContent;
    }

    Clone(){
        var entry = super.Clone(new BoxEntry());
        
        entry.dimensions = this.dimensions.Clone();

        entry.properties.statcking      = this.properties.stacking.Clone();
        entry.properties.rotation       = this.properties.rotation.Clone();
        entry.properties.translation    = this.properties.translation.Clone();

        for(var i = 0; i < this.descriptions.length; i++){
            entry.descriptions.push(this.descriptions[i].Clone());
        }

        return entry;
    }

    ToString(){
        return '\'' + this.descriptions[0].content + '\': ' + this.dimensions.ToString();
    }
}

export default BoxEntry;