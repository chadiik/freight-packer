import Signaler from "../../utils/cik/Signaler";
import RaycastGroup, { RaycastCallback } from "../../utils/cik/input/RaycastGroup";

const sliderSignals = {
    change: 'change',
    stop: 'stop'
};

const _value = Symbol('value');

var vec3 = new THREE.Vector3();

class SliderBox extends Signaler{
    /** @param {THREE.Mesh} mesh */
    constructor(mesh){
        super();

        this.mesh = mesh;
        this[_value] = 1;

        this.dragging = false;
    }

    set value(value){
        if(Math.abs(this[_value] - value) * 100 > 0){
            this[_value] = value;
            this.Dispatch(sliderSignals.change, value);
        }
    }

    /** @param {Input} input @param {Camera} cameraController */
    UseInput(input, cameraController){
        var scope = this;

        function onMouseDown(){
            scope.dragging = true;
        }


        function onDrag(worldPoint){
            let boundingVolume = new THREE.Box3().setFromObject(scope.mesh);
            boundingVolume.getSize(vec3);
            let height = vec3.y;
            boundingVolume.getCenter(vec3);
            let minY = vec3.y - height / 2;
            let maxY = vec3.y + height / 2;
            scope.value = THREE.Math.clamp(
                THREE.Math.clamp(worldPoint.y - minY, 0, maxY - minY) / (maxY - minY)
                , 0, 1);
        }

        function onMouseUp(){
            scope.dragging = false;
            cameraController.Release();
            scope.Dispatch(sliderSignals.stop);
        }

        input.onMouseDown.push(onMouseDown);
        input.onMouseUp.push(onMouseUp);

        let raycastGroup = new RaycastGroup([this.mesh], 
            /** @type {RaycastCallback} */
            function(obj, intersection){
                if(scope.dragging){
                    cameraController.Hold();
                    onDrag(intersection.point);
                }
                else{
                    cameraController.Release();
                }
        });
        input.AddRaycastGroup('Update25', 'sliderB', raycastGroup);
    }

    static get signals(){
        return sliderSignals;
    }
}

export default SliderBox;