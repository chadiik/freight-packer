import CargoEntry from '../components/common/CargoEntry';
import BoxEntry from '../components/box/BoxEntry';
import CargoBoxView from './CargoBoxView';
import CargoView from './CargoView';
import Utils from '../utils/cik/Utils';
import { Transition, Slide } from '../utils/cik/transitions/Transition';
import Asset from '../components/assets/Asset';

const epsilon = Math.pow(2, -52);

var tempBox3 = new THREE.Box3();
var tempVec3 = new THREE.Vector3();


/**
 * @typedef {Object} EntryInputViewParams
 * @property {import('../UX').default} ux
 * @property {SceneSetup} sceneSetup
 * @property {scaleFigure} scaleFigure
 */

const _scaleFigure = Symbol('scaleFigure');
const scaleFigure = {
    man: 'man',
    woman: 'woman',
    none: 'none'
};

/** @type {EntryInputViewParams} */
const defaultParams = {
    scaleFigure: scaleFigure.man
};

class EntryInputView{
    /** @param {EntryInputViewParams} params */
    constructor(params){

        this.params = Utils.AssignUndefined(params, defaultParams);
        const scope = this;

        this.view = new THREE.Object3D();
        this.preview = new THREE.Object3D();
        this.view.add(this.preview);

        /** @type {Map<string, CargoView>} */
        this.previewTypes = new Map();

        let units = this.params.ux.params.units;
        this.offsetX = 0;

        // scale ref
        const height = 71 * units;

        let material = new THREE.MeshBasicMaterial({color: 0x000000, transparent : true, side: THREE.DoubleSide});
        Asset.SetTextureMap('scaleref-alphaMap.jpg', material, 'alphaMap').then( (alphaMap) => {
            alphaMap.repeat.setX(.5);
        });

        let refMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(height / 2, height, 1, 1),
            material
        );

        this.offsetX = 60 * units;
        refMesh.position.x = this.offsetX;

        this.view.add(refMesh);
        this.refMesh = refMesh;
        this.scaleFigure = this.params.scaleFigure;

        tempBox3.setFromObject(this.refMesh);
        tempBox3.getSize(tempVec3);
        this.offsetX -= tempVec3.x / 2;

        let bkgMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(height * 6, height * 1.8, 1, 1),
            new THREE.MeshBasicMaterial({color: 0xffffff, depthWrite: false, depthFunc: THREE.NeverDepth, side: THREE.DoubleSide})
        );

        bkgMesh.position.z = -2 * units;

        this.view.add(bkgMesh);

        this.rotate = false;

        this.transition = new Transition(this.view, this.view, .25);
        this.slideIn = new Slide('x', 1.2, 0);
        this.slideIn.Init(this.transition);
        this.slideOut = new Slide('x', 0, 1.2);
        this.slideOut.Init(this.transition);
        /** @param {Slide} transitionController */
        function onTransitionComplete(transitionController){
            if(transitionController === scope.slideOut){
                scope.Hide();
            }
            else{
                scope.rotate = true;
            }
        }
        this.transition.On(Transition.signals.complete, onTransitionComplete);
        
        this.Preview();
    }

    /** @param {scaleFigure} value */
    set scaleFigure(value){
        this[_scaleFigure] = value;
        let refMesh = this.refMesh;
        if(refMesh instanceof THREE.Mesh){
            /** @type {THREE.Texture} */
            let alphaMap = refMesh.material.alphaMap;
            if(value === scaleFigure.man){
                alphaMap.offset.setX(0);
            }
            else{
                alphaMap.offset.setX(.5);
            }
        }
    }

    get scaleFigure(){ return this[_scaleFigure]; }

    static get scaleFigure(){ return scaleFigure; }

    /**
     * @param {CargoEntry} entry 
     */
    Preview(entry){

        let valid = entry;

        if(valid){
            if(entry instanceof BoxEntry) valid = entry.dimensions.volume > epsilon;
        }

        if(!valid){
            this.End();
            return false;
        }

        let c = this.preview.children;
        while(c.length > 0) this.preview.remove(c[c.length - 1]);

        let units = this.params.ux.params.units;
        let offsetX = this.offsetX;

        if(entry instanceof BoxEntry){
            /** @type {CargoBoxView} */
            let boxView = this.previewTypes.get(entry.type);
            if(boxView){
                boxView.entry = entry;
            }
            else{
                boxView = new CargoBoxView(entry);
                this.previewTypes.set(entry.type, boxView);

                boxView.mesh.material = boxView.mesh.material.clone();
                boxView.mesh.material.depthWrite = false;
            }

            boxView.mesh.renderOrder = Number.MAX_SAFE_INTEGER - 10;
            this.preview.add(boxView.view);

            this.preview.position.x = -Math.max(entry.dimensions.width, entry.dimensions.length) / 2 + offsetX;
            this.preview.position.y = entry.dimensions.height / 2 + tempBox3.min.y;
        }

        this.Start();
    }

    Show(){
        this.view.visible = true;
    }

    Start(){
        if(this.previewing === false){
            this.rotate = false;
            this.transition.controller = this.slideIn;
            this.transition.Start();
        }
        this.Show();
    }

    Hide(){
        this.view.visible = false;
    }

    End(){
        if(this.previewing === true){
            this.transition.controller = this.slideOut;
            this.transition.Start();
        }
    }

    get previewing(){ return this.view.visible; }

    /** @param {Number} now @param {Number} deltaTime */
    Update(now, deltaTime){
        if(this.previewing){
            if(this.rotate) this.preview.rotateY(-Math.PI / 10 * deltaTime / 1000);
            this.transition.Update();
        }
    }
}

export default EntryInputView;