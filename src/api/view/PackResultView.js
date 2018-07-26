import Utils from '../utils/cik/Utils';
import CargoListView from './CargoListView';
import CargoView from './CargoView';
import Pool from '../utils/cik/Pool';
import PackedCargoBoxView from './PackedCargoBoxView';
import PackingSpaceView from './PackingSpaceView';
import Logger from '../utils/cik/Logger';
import Tween from '../utils/cik/Tween';

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
     * @param {import('../packer/Packer').PackingResult} packingResult
     */
    DisplayPackingResult(packingResult){
        var containingVolumeID = packingResult.Container.ID;
        var containingVolume = this.packingSpaceView.FindContainingVolume(containingVolumeID);
        var matrix = this.packingSpaceView.GetMatrix(containingVolume);
        var offset = new THREE.Vector3();
        var orientation = new THREE.Quaternion();
        var scale = new THREE.Vector3();
        matrix.decompose(offset, orientation, scale);


        var animatingViews = this.animatingViews;
        var view = this.view;
        var onTweenCompleted = this.OnTweenCompleted.bind(this);

        for(var i = 0, numPackedItems = packingResult.PackedItems.length; i < numPackedItems; i++){
            let item = packingResult.PackedItems[i];
            let cargoViewTemplate = this.cargoListView.GetTemplate(item.ID);
            let packedCargoView = this.pool.Request(cargoViewTemplate);

            let width = item.PackDimX,
                length = item.PackDimZ,
                height = item.PackDimY;

            Logger.WarnOnce('PackResultView.DisplayPackingResult', 'packedCargoView should be rotated instead of re-scaling');
            packedCargoView.SetScale(width, height, length);

            let x = item.CoordX + width / 2 + offset.x,
                y = item.CoordY + height / 2 + offset.y,
                z = item.CoordZ + length / 2 + offset.z;
            //packedCargoView.position.set(x, y, z);

            let zEntry = containingVolume.dimensions.length;
            setTimeout(function(){
                let posTweenCombo = Tween.Combo.Request3(Tween.functions.linear,
                    x, y, zEntry, 
                    0, 0, z - zEntry,
                    .5
                );
                
                posTweenCombo.Hook(packedCargoView.position, 'x', 'y', 'z');
                posTweenCombo.onComplete = onTweenCompleted;
                posTweenCombo.Update(0);
                animatingViews.push(posTweenCombo);
    
                view.add(packedCargoView.view);
            }, 100 * i);
        }
    }

    /**
     * 
     * @param {Tween|Tween.Combo} tween 
     */
    OnTweenCompleted(tween){
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