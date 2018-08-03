import Utils from '../utils/cik/Utils';
import CargoListView from './CargoListView';
import CargoView from './CargoView';
import Pool from '../utils/cik/Pool';
import PackedCargoBoxView from './PackedCargoBoxView';
import PackingSpaceView from './PackingSpaceView';
import Logger from '../utils/cik/Logger';
import Tween from '../utils/cik/Tween';
import Packer from '../packer/Packer';

/**
 * @typedef {Object} PackResultViewParams
 * @property {import('../UX').default} ux
 */

 /** @type {PackResultViewParams} */
const defaultParams = {};

/**
 * @param {CargoView} cargoView
 * @returns {PackedCargoBoxView}
 */
function poolNewFN(cargoView){
    //console.log('pool new', cargoView);
    var packedCargoView = new PackedCargoBoxView(cargoView.entry);
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
    var a = getOrientationAngles(orientation);
    return new THREE.Euler(a[0] * rad, a[1] * rad, a[2] * rad);
}

class PackResultView{
    /**
     * @param {CargoListView} cargoListView
     * @param {PackingSpaceView} packingSpaceView
     * @param {PackResultViewParams} params 
     */
    constructor(cargoListView, packingSpaceView, params){

        this.cargoListView = cargoListView;
        this.packingSpaceView = packingSpaceView;
        this.params = Utils.AssignUndefined(params, defaultParams);

        this.view = new THREE.Object3D();

        this.pool = new Pool(poolNewFN, poolResetFN);

        /** @type {Array<Tween>} */
        this.animatingViews = [];
    }

    /** 
     * @param {Packer.PackingResult} packingResult
     */
    DisplayPackingResult(packingResult){
        console.log(packingResult);
        //var containingVolume = this.packingSpaceView.FindContainingVolume(containingVolumeID);
        var containingVolume = packingResult.packed[0].containingVolume;
        var matrix = this.packingSpaceView.GetMatrix(containingVolume);
        var offset = new THREE.Vector3();
        var orientation = new THREE.Quaternion();
        var scale = new THREE.Vector3();
        matrix.decompose(offset, orientation, scale);


        var animatingViews = this.animatingViews;
        var view = this.view;
        var onTweenComplete = this.OnTweenComplete.bind(this);

        for(var i = 0, numPackedItems = packingResult.packed.length; i < numPackedItems; i++){
            let item = packingResult.packed[i];
            let cargoViewTemplate = this.cargoListView.GetTemplate(item.entry);
            let packedCargoView = this.pool.Request(cargoViewTemplate);

            Logger.WarnOnce('PackResultView.DisplayPackingResult', 'packedCargoView should be rotated instead of re-scaling');
            let rotation = getOrientationEuler(item.orientation);
            packedCargoView.SetRotationAngles(rotation.x, rotation.y, rotation.z);

            let x = item.position.x + offset.x,
                y = item.position.y + offset.y,
                z = item.position.z + offset.z;

            let zEntry = containingVolume.dimensions.length;
            setTimeout(function(){
                let posTweenCombo = Tween.Combo.Request3(Tween.functions.linear,
                    x, y, zEntry, 
                    0, 0, z - zEntry,
                    .75
                );
                
                posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
                posTweenCombo.onComplete = onTweenComplete;
                posTweenCombo.Update(0);
                animatingViews.push(posTweenCombo);
    
                view.add(packedCargoView.view);
            }, 200 * i);
        }
    }

    /**
     * 
     * @param {Tween|Tween.Combo} tween 
     */
    OnTweenComplete(tween){
        var index = this.animatingViews.indexOf(tween);
        if(index != -1){
            this.animatingViews.splice(index, 1);
        }
        tween.Unhook();
        tween.Return();
    }

    Update(){
        this.animatingViews.forEach(animatingView => {
            animatingView.Update();
        });
    }
}

export default PackResultView;