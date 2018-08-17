import Signaler from "../../utils/cik/Signaler";
import Asset from "../../components/assets/Asset";
import Input from "../../utils/cik/input/Input";
import Camera from "../../scene/Camera";

/** @typedef IPoint @property {Number} x @property {Number} y */

const axisGeometry = new THREE.CylinderGeometry(.5, .5, 1, 6, 1);
const sliderGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

const axisMaterial = new Asset.SolidMaterialType({color: 0xffffff});
const sliderMaterial = new Asset.SolidMaterialType({color: 0x000000});

const signals = {
    change: 'change'
};

var raycaster = new THREE.Raycaster();
var plane = new THREE.Plane();
var tempVec3 = new THREE.Vector3();
var tempVec3_2 = new THREE.Vector3();

class Slider3D extends Signaler{
    /**
     * 
     * @param {Number} thickness 
     * @param {Number} length 
     * @param {Number} sliderThickness
     * @param {Number} [sliderLength]
     */
    constructor(thickness, length, sliderThickness, sliderLength){

        super();

        this.length = length;
        if(sliderLength === undefined) sliderLength = length / 10;

        let axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);
        let sliderMesh = new THREE.Mesh(sliderGeometry, sliderMaterial);
        let sliderHitArea = new THREE.Mesh(sliderGeometry, new Asset.InvisibleMaterialType({visible: false}));

        axisMesh.scale.set(thickness, length, thickness);
        axisMesh.position.y = length / 2;

        sliderMesh.scale.set(sliderThickness, sliderLength, sliderThickness);
        sliderHitArea.scale.set(sliderThickness * 2, sliderLength * 2, sliderThickness * 2);
        
        let sliderView = new THREE.Object3D();
        sliderView.add(sliderMesh);
        sliderView.add(sliderHitArea);

        this.axisView = axisMesh;
        this.sliderView = sliderMesh;
        this.sliderHitArea = sliderHitArea;

        this.view = new THREE.Object3D();
        this.view.add(this.axisView);
        this.view.add(this.sliderView);
        this.view.add(this.sliderHitArea);

        this.drag = {startX: 0, startY: 0, x: 0, y: 0, status: false};
    }

    get value(){
        this.sliderView.getWorldPosition(tempVec3);
        let sliderY = tempVec3.y;
        
        this.view.getWorldPosition(tempVec3);
        let originY = tempVec3.y;

        return (sliderY - originY) / this.length;
    }

    set value(value){
        this.view.getWorldPosition(tempVec3);
        let originY = tempVec3.y;

        let sliderY = originY + value * this.length;
        this.sliderView.getWorldPosition(tempVec3);
        tempVec3.y = sliderY;

        tempVec3.applyMatrix4(this.view.matrixWorld);
        
        this.sliderView.position.copy(tempVec3);
        this.sliderHitArea.position.copy(tempVec3);

        this.Dispatch(signals.change, value);
    }

    /** @param {IPoint} ndcCoord @param {THREE.Camera} camera */
    OnStartDrag(ndcCoord, camera){

        raycaster.setFromCamera(ndcCoord, camera);
        let intersections = raycaster.intersectObject(this.sliderHitArea);
        if(intersections && intersections[0]){
            this.drag.status = true;
            this.drag.startX = ndcCoord.x;
            this.drag.startY = ndcCoord.y;
            return true;
        }
    }

    /** @param {IPoint} ndcCoord @param {THREE.Camera} camera */
    OnDrag(ndcCoord, camera){

        if(this.drag.status){

            let vx = ndcCoord.x - this.drag.startX;
            let vy = ndcCoord.y - this.drag.startY;

            this.drag.x = ndcCoord.x;
            this.drag.y = ndcCoord.y;

            raycaster.setFromCamera(ndcCoord, camera);

            this.view.getWorldPosition(tempVec3);
            let originY = tempVec3.y;

            tempVec3.sub(camera.position).normalize();
            plane.setFromNormalAndCoplanarPoint(tempVec3_2, tempVec3);
            
            let intersection = raycaster.ray.intersectPlane(plane, tempVec3);
            if(intersection){
                this.value = THREE.Math.clamp((intersection.y - originY) / this.length, 0, 1);
            }

        }
    }

    /** @param {IPoint} ndcCoord @param {THREE.Camera} camera */
    OnStopDrag(ndcCoord, camera){

        if(this.drag.status){
            this.drag.status = false;
            this.drag.x = ndcCoord.x;
            this.drag.y = ndcCoord.y;
        }
    }

    /** @param {Input} input @param {Camera} cameraController */
    UseInput(input, cameraController){
        var scope = this;

        function onMouseDown(){
            let dragging = scope.OnStartDrag(input.mouseViewport, cameraController.camera);
            if(dragging){
                cameraController.Hold();
            }
            else{
                cameraController.Release();
            }
        }

        function onDrag(){
            scope.OnDrag(input.mouseViewport, cameraController.camera);
        }

        function onMouseUp(){
            scope.OnStopDrag(input.mouseViewport, cameraController.camera);
        }

        input.onMouseDown.push(onMouseDown);
        input.onDrag.push(onDrag);
        input.onMouseUp.push(onMouseUp);
    }

    static get signals(){
        return signals;
    }
}

export default Slider3D;