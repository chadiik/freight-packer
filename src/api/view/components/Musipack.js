import PackResultView from "../PackResultView";
import Packer from "../../packer/Packer";
import Pool from "../../utils/cik/Pool";

var tempRange = [];

class Range{
    /**
     * 
     * @param {Array<Number>} args [min,max...] pairs
     */
    constructor(...args){
        /** @type {Array<Number>} */
        this.min = [];
        /** @type {Array<Number>} */
        this.max = [];

        for(let i = 0, halfLength = args.length; i < halfLength; i++){
            this.min.push(args[i * 2]);
            this.max.push(args[i * 2 + 1]);
        }
    }

    /** @param {Array<Number>} args */
    Min(...args){
        this.min.length = 0;
        this.min.push(...args);
        return this;
    }

    /** @param {Array<Number>} args */
    Max(...args){
        this.max.length = 0;
        this.max.push(...args);
        return this;
    }

    /** @param {Number} index @returns {Number} */
    Length(index){
        return this.max[index] - this.min[index];
    }

    /** @param {Array<Number>} args */
    Evaluate(...args){
        tempRange.length = 0;
        for(let i = 0; i < args.length; i++){
            let min = this.min[i],
                max = this.max[i],
                v = args[i];
            let value = v * (max - min) + min;
            tempRange.push(value);
        }
        return tempRange;
    }
}

const range = {
    frequency: 0,
    volume: 1
};

const _playing = Symbol('playing');
const _iid = Symbol('iid');

class Note{
    constructor(){
        this.wave = new Pizzicato.Sound({ 
            source: 'wave', 
            options: {
                type: 'sine',
                frequency: 440
            }
        });

        this[_playing] = false;
    }

    /** @param {Number} value */
    set frequency(value){
        this.wave.frequency = value;
    }

    /** @returns {Boolean} */
    get playing(){ return this[_playing]; }

    Play(duration){
        this[_playing] = true;
        this.wave.play();
        let scope = this;
        function onNoteComplete(){ scope.Stop(); }
        this[_iid] = window.setTimeout(onNoteComplete, Math.floor(duration * 1000));
    }

    Stop(){
        if(this[_iid] !== undefined) window.clearTimeout(this[_iid]);
        this[_iid] = undefined;

        this.wave.stop();
        this[_playing] = false;
    }
}

/**
 * @returns {Note}
 */
function poolNewFN(){
    let note = new Note();
    return note;
}

/**
 * @param {Note} object 
 * @returns {Note}
 */
function poolResetFN(object){
    return object;
}

class Toner{
    constructor(){

        this.pool = new Pool(poolNewFN, poolResetFN);
        
        this.ranges = new Range(
            100, 900, // freq
            0, 1, // volume
            0.2, 0.8 // duration
        );

        window.Toner = this;
    }

    GetNote(){
        /** @type {Note} */
        let note = this.pool.Request();
        return note;
    }

    RelaseNote(note){
        this.pool.Return(note);
    }

    /** @param {Number} x @param {Number} y @param {Number} z */
    Coords(x, y, z){

        const divs = 6;
        let divLength = this.ranges.Length(range.frequency) / divs;
        let values = this.ranges.Evaluate(x, y, z);

        let frequency = Math.floor(values[0]),
            volume = values[1],
            duration = values[2];

        let note = this.GetNote();
        note.frequency = frequency;
        note.Play(duration);

        let scope = this;
        function onNoteComplete(){
            scope.RelaseNote(note);
        }
        window.setInterval(onNoteComplete, Math.floor(duration * 1000));
    }
}

class Musipack{
    /**
     * 
     * @param {PackResultView} packResultView 
     */
    constructor(packResultView){

        console.log('Musicpack hooked in!');

        this.toner = new Toner();

        packResultView.Once(PackResultView.signals.packVizStart, function(){
            packResultView.params.animationDuration = 8;
        });
        
        packResultView.On(PackResultView.signals.cargoVizPack, this.OnItemPacked.bind(this));
        packResultView.On(PackResultView.signals.cargoVizUnpack, this.OnItemUnpacked.bind(this));
    }

    /** @param {Packer.PackedCargo} item */
    OnItemPacked(item){
        this.EvaluateItem(item);
    }

    /** @param {Packer.PackedCargo} item */
    OnItemUnpacked(item){
        this.EvaluateItem(item);
    }

    /** @param {Packer.PackedCargo} item */
    EvaluateItem(item){
        if(item && item.position){
            let x = item.position.x,
                y = item.position.y,
                z = item.position.z;

            let w = item.containingVolume.dimensions.width,
                h = item.containingVolume.dimensions.height,
                l = item.containingVolume.dimensions.length;
            
            this.toner.Coords(x / w, y / h, z / l);
        }
    }
}

export default Musipack;