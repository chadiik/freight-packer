import Utils from '../utils/cik/Utils';
import CargoListView from './CargoListView';
import CargoView from './CargoView';
import Pool from '../utils/cik/Pool';
import PackedCargoBoxView from './PackedCargoBoxView';
import PackingSpaceView from './PackingSpaceView';
import Tween from '../utils/cik/Tween';
import Packer from '../packer/Packer';
import BoxEntry from '../components/box/BoxEntry';
import Signaler from '../utils/cik/Signaler';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @typedef {Object} PackResultViewParams
 * @property {import('../UX').default} ux
 * @property {Number} animationDuration
 */

 /** @type {PackResultViewParams} */
const defaultParams = {
    animationDuration: 1
};

/**
 * @param {CargoView} cargoView
 * @returns {PackedCargoBoxView}
 */
function poolNewFN(cargoView){
    //console.log('pool new', cargoView);
    let packedCargoView = new PackedCargoBoxView(cargoView.entry);
    packedCargoView.Extend(cargoView);
    return packedCargoView;
}

/**
 * @param {PackedCargoBoxView} object 
 * @param {CargoView} cargoView
 * @returns {PackedCargoBoxView}
 */
function poolResetFN(object, cargoView){
    //console.log('pool reset', cargoView);
    object.Extend(cargoView);
    return object;
}

function getOrientationAngles(orientation){
    switch(orientation){
        case 'xyz': return  [0,     0,      0];
        case 'xzy': return  [90,    0,      0];
        case 'yxz': return  [0,     0,      90];
        case 'yzx': return  [90,    0,      90];
        case 'zxy': return  [90,    -90,    0];
        case 'zyx': return  [0,     -90,    0];
    }
}

/**
 * @param {string} orientation 
 */
function getOrientationEuler(orientation){
    const rad = Math.PI / 180.0;
    let a = getOrientationAngles(orientation);
    return new THREE.Euler(a[0] * rad, a[1] * rad, a[2] * rad);
}

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

const signals = {
    packVizStart: 'packVizStart',
    packVizEnd: 'packVizEnd',
    cargoVizCreate: 'cargoVizCreate',
    cargoVizPack: 'cargoVizPack',
    cargoVizUnpack: 'cargoVizUnpack'
};

class PackResultView extends Signaler{
    /**
     * @param {CargoListView} cargoListView
     * @param {PackingSpaceView} packingSpaceView
     * @param {PackResultViewParams} params 
     */
    constructor(cargoListView, packingSpaceView, params){

        super();

        this.cargoListView = cargoListView;
        this.packingSpaceView = packingSpaceView;
        this.params = Utils.AssignUndefined(params, defaultParams);

        /** @type {Array<CargoView} */
        this.cargoViews = [];
        this.view = new THREE.Object3D();

        this.pool = new Pool(poolNewFN, poolResetFN);

        /** @type {Array<Tween>} */
        this.animatingViews = [];

        if(typeof window.Pizzicato !== 'undefined'){
            let musipack = new (require('./components/Musipack').default)(this);
        }
    }

    /** 
     * @param {Packer.PackingResult} packingResult
     */
    async DisplayPackingResult(packingResult){

        this.Dispatch(signals.packVizStart, packingResult);

        if(packingResult.packed.length < 1) return;

        let scope = this;
        let units = this.params.ux.params.units;
        
        let containingVolume = packingResult.packed[0].containingVolume;
        let matrix = this.packingSpaceView.GetMatrix(containingVolume);
        let offset = new THREE.Vector3();
        let orientation = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        matrix.decompose(offset, orientation, scale);

        /** @type {Map<CargoView, Number>} */
        let packedQuantities = new Map();

        let animatingViews = this.animatingViews;
        let view = this.view;
        //let onTweenComplete = this.OnCargoFirstTweenComplete.bind(this);
        let zEntry = containingVolume.dimensions.length;
        let numPackedItems = packingResult.packed.length;
        let delayPerItem = this.params.animationDuration * 1000 / numPackedItems;
        for(let i = 0; i < numPackedItems; i++){
            let item = packingResult.packed[i];
            let cargoViewTemplate = this.cargoListView.GetTemplate(item.entry);

            let packedQuantity = packedQuantities.get(cargoViewTemplate);
            let totalQuantity = cargoViewTemplate.entry.quantity;
            if(packedQuantity === undefined) packedQuantities.set(cargoViewTemplate, packedQuantity = 0);
            packedQuantities.set(cargoViewTemplate, ++packedQuantity);
            let textColor = packedQuantity === totalQuantity ? 'rgb(255, 255, 255)' : 'rgb(255, 0, 0)';
            this.cargoListView.UpdateLabel(cargoViewTemplate, packedQuantity + '/' + totalQuantity, textColor);

            let packedCargoView = this.pool.Request(cargoViewTemplate);

            this.cargoViews.push(packedCargoView);

            let rotation = getOrientationEuler(item.orientation);
            packedCargoView.SetRotationAngles(rotation.x, rotation.y, rotation.z);

            let x = item.position.x + offset.x,
                y = item.position.y + offset.y,
                z = item.position.z + offset.z;

            let posTweenCombo = Tween.Combo.RequestN(Tween.functions.ease.easeOutQuad, .5,
                x, 0,
                y, 0,
                zEntry, z - zEntry
            );

            function onTweenComplete(tween){
                scope.Dispatch(signals.cargoVizPack, item);
                scope.OnCargoFirstTweenComplete(tween);
            }
            
            posTweenCombo.extraData = packedCargoView;
            posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
            posTweenCombo.onComplete = onTweenComplete;
            posTweenCombo.Update(0);
            animatingViews.push(posTweenCombo);
    
            view.add(packedCargoView.view);
            await sleep(delayPerItem);
        }

        await sleep(500);

        let unpackedOffset = 6 * units;
        for(let i = 0, numUnpackedItems = packingResult.unpacked.length; i < numUnpackedItems; i++){
            let item = packingResult.unpacked[i];
            let cargoViewTemplate = this.cargoListView.GetTemplate(item.entry);

            let totalQuantity = cargoViewTemplate.entry.quantity;
            if(packedQuantities.has(cargoViewTemplate) === false){
                let textColor = false ? 'rgb(255, 255, 255)' : 'rgb(255, 0, 0)';
                this.cargoListView.UpdateLabel(cargoViewTemplate, '0/' + totalQuantity, textColor);
            }

            if(i === 0) unpackedOffset += item.entry.dimensions.width / 2;

            for(let j = 0; j < item.unpackedQuantity; j++){
                let packedCargoView = this.pool.Request(cargoViewTemplate);

                this.cargoViews.push(packedCargoView);
                
                let x = containingVolume.dimensions.width * 1.5 + unpackedOffset + offset.x,
                    y = item.entry.dimensions.height / 2 + offset.y,
                    z = item.entry.dimensions.length * j + offset.z;

                let posTweenCombo = Tween.Combo.RequestN(Tween.functions.ease.easeOutQuad, .5,
                    x, 0,
                    y, 0,
                    zEntry, z - zEntry
                );

                function onTweenComplete(tween){
                    scope.Dispatch(signals.cargoVizUnpack, item);
                    scope.OnCargoFirstTweenComplete(tween);
                }
                
                posTweenCombo.extraData = packedCargoView;
                posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
                posTweenCombo.onComplete = onTweenComplete;
                posTweenCombo.Update(0);
                animatingViews.push(posTweenCombo);
        
                view.add(packedCargoView.view);
                await sleep(delayPerItem * .5);
            }

            unpackedOffset += item.entry.dimensions.width + 6 * units;
        }
    }

    /** @param {Tween|Tween.Combo} tween */
    OnCargoFirstTweenComplete(tween){
        let packedCargoView = tween.extraData;
        this.OnTweenComplete(tween);
        let scaleTweenCombo = Tween.Combo.RequestN(Tween.functions.special.pingPong, .1, 
            1, .1,
            1, .1,
            1, .1
        );
        
        scaleTweenCombo.extraData = packedCargoView;
        scaleTweenCombo.Hook(packedCargoView.view.scale, 'x', 'y', 'z');
        scaleTweenCombo.onComplete = this.OnTweenComplete.bind(this);;
        scaleTweenCombo.Update(0);
        this.animatingViews.push(scaleTweenCombo);
    }

    /** @param {Tween|Tween.Combo} tween */
    OnTweenComplete(tween){
        let packedCargoView = tween.extraData;
        packedCargoView.view.scale.set(1, 1, 1);
        let index = this.animatingViews.indexOf(tween);
        if(index != -1){
            this.animatingViews.splice(index, 1);
        }
        tween.Unhook();
        tween.Return();
    }

    /** @param {string} entryUID */
    SelectEntry(entryUID){
        if(!entryUID){
            this.DisableHighlights();
        }
        else{
            this.Highlight(entryUID);
        }
    }

    DisableHighlights(){
        for(let i = 0, numCargoViews = this.cargoViews.length; i < numCargoViews; i++){
            this.cargoViews[i].focus = 1;
        }
    }

    /** @param {string} entryUID */
    Highlight(entryUID){
        for(let i = 0, numCargoViews = this.cargoViews.length; i < numCargoViews; i++){
            let cargoView = this.cargoViews[i];

            let cvEntry = cargoView.entry;
            if(cvEntry.uid === entryUID){
                cargoView.focus = 1.75;
            }
            else{
                cargoView.focus = .25;
            }
        }
    }

    /** @param {Number} value */
    Slice(value){
        if(value >= 1){
            this.view.children.forEach(child => {
                child.visible = true;
            });
            return;
        }

        let minY = Number.MAX_SAFE_INTEGER, maxY = Number.MIN_SAFE_INTEGER;
        this.view.children.forEach(child => {
            tempBox.setFromObject(child);
            tempBox.getSize(tempVec);
            let halfHeight = tempVec.y / 2;
            tempBox.getCenter(tempVec);
            let low = tempVec.y - halfHeight;
            let high = tempVec.y + halfHeight;
            if(low < minY) minY = low;
            if(high > maxY) maxY = high;
        });

        let y = minY + value * (maxY - minY);

        //console.log('slice ' + y.toFixed(2) + ' between ' + minY.toFixed(2) + ' and ' + maxY.toFixed(2));

        this.view.children.forEach(child => {
            tempBox.setFromObject(child);
            tempBox.getSize(tempVec);
            let halfHeight = tempVec.y / 2;
            tempBox.getCenter(tempVec);
            let low = tempVec.y - halfHeight;

            if(low < y) child.visible = true;
            else child.visible = false;
        });
    }

    Clear(){
        this.animatingViews.length = 0;
        this.cargoViews.length = 0;
        while(this.view.children.length > 0) this.view.remove(this.view.children[this.view.children.length - 1]);
    }

    Update(){
        this.animatingViews.forEach(animatingView => {
            animatingView.Update();
        });
    }

    static get signals(){
        return signals;
    }
}

export default PackResultView;