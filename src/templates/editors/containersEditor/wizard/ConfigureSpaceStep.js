
import RaycastGroup from "../../../../api/utils/cik/input/RaycastGroup";
import WizardStep from "../../wizard/WizardStep";
import SurfaceUtils from "../../../utils/SurfaceUtils";
import DirectedRect from "../../../utils/DirectedRect";
import Draggable from "../../../ui/elements/Draggable";
import Dom from "../../../ui/Dom";
import Feedback from "../../../utils/Feedback";
import Container from "../../../../api/packer/container/Container";
import ContainingVolume from "../../../../api/packer/container/ContainingVolume";
import WizardAction from "../../../ui/elements/WizardAction";
import ContainersEditorWizard from "./ContainersEditorWizard";

/**
 * @typedef {Object} ConfigureSpaceData
 * 
 * @property {THREE.Object3D} view
 * @property {Container} container
 * @property {DirectedRect} platform
 */

const signals = {
    surfacePick: 'surfacePick',
    infoInput: 'infoInput',
    sidePick: 'sidePick'
}

class ConfigureSpaceStep extends WizardStep {

    constructor(){
        super('configureSpace');

        /**
         * @type {ConfigureSpaceData}
         */
        this.data;
        
        var container = new Container();
        var volume = new ContainingVolume(container);
        container.Add(volume);
        this.data.container = container;
        
    }

    Start(dataPass){
        super.Start();

        Object.assign(this.data, dataPass);

        /**
         * @type {THREE.Object3D}
         */
        this.obj = this.data.ref;

        var scope = this;

        var elements = document.getElementById('wizard-elements');
        var element = elements.querySelector('#configureSpace');

        var sideAction = new WizardAction(element.querySelector('#side'));
        sideAction.button.onclick = function(){
            scope.PickLoadingSide();
        };

        var inputAction = new WizardAction(element.querySelector('#input'));
        inputAction.button.onclick = function(){
            scope.InputInfo();
        };

        var surfaceAction = new WizardAction(element.querySelector('#surface'));
        surfaceAction.button.onclick = function(){
            scope.PickSurface();
        };

        var nextBtn = element.querySelector('#nextBtn');
        nextBtn.onclick = function(){
            scope.Complete();
        }

        this.modal = new Draggable(ContainersEditorWizard.title, Draggable.widths.medium);
        this.modal.Add(element);
        Dom.instance.Add(this.modal);

        this.On(signals.surfacePick, function(){
            surfaceAction.status = true;
            inputAction.disabled = false;
        });

        this.On(signals.infoInput, function(){
            inputAction.status = true;
            sideAction.disabled = false;
        });

        this.On(signals.sidePick, function(){
            sideAction.status = true;
            nextBtn.disabled = false;
        });
    }

    PickSurface(){
        if( !this.raycastGroup ){
            var scope = this;
            this.raycastGroup = new RaycastGroup(
                [this.obj], //items
                function(obj, intersection){
                    if(scope.pickSurfaceMode){
                        scope.OnClickPickSurface(obj, intersection);
                        scope.pickSurfaceMode = false;
                    }
                }, // callback
                
                undefined,
                
                false, //updateProperty
                true //recursive
            );

            var input = FPEditor.instance.sceneSetup.input;
            input.AddRaycastGroup('OnClick', 'Ref3D', this.raycastGroup);
        }

        this.pickSurfaceMode = true;
    }

    /**
     * 
     * @param {DirectedRect} platform 
     */
    ValidatePlatform(platform){
        var up = new THREE.Vector3(0, 1, 0);
        var horizontalUp = up.dot(platform.normal) > .9;
        console.log(platform.normal, up.dot(platform.normal));
        if(horizontalUp === false){
            alert('Please pick a horizontal surface facing up');
            return false;
        }

        if(platform.width < .0001){
            alert('Platform\'s width is too small');
            return false;
        }

        if(platform.length < .0001){
            alert('Platform\'s length is too small');
            return false;
        }

        return true;
    }

    OnClickPickSurface(obj, intersection){
        console.log(intersection);
        var geometry = intersection.object.geometry;
        var coplanar = SurfaceUtils.GetCoplanar(2, geometry, intersection.face, true);

        var gVertices = geometry.vertices;
        var vertices = [];
        for(var f in coplanar){
            var face = coplanar[f];
            vertices.push(
                gVertices[face.a],
                gVertices[face.b],
                gVertices[face.c]
            );
        }

        var platform = DirectedRect.FromPoints(vertices);
        if(this.ValidatePlatform(platform) === false){
            this.pickSurfaceMode = true;
            return;
        }

        this.platform = platform;
        var volume = this.data.container.volume;
        volume.position.copy(this.platform.center);

        vertices = SurfaceUtils.Clone(vertices);
        var surfaceGeometry = SurfaceUtils.FromVertices(vertices);
        var normal = SurfaceUtils.Normal(surfaceGeometry);
        SurfaceUtils.Add(vertices, normal.clone().multiplyScalar(.1));
        surfaceGeometry.verticesNeedUpdate = true;

        if(this.selectedSurface === undefined){
            this.selectedSurface = new THREE.Mesh(surfaceGeometry, new THREE.MeshStandardMaterial({color: 0xaa0000}));
            this.selectedSurface.applyMatrix(this.obj.matrix);
            this.data.view.add(this.selectedSurface);

            var input = FPEditor.instance.sceneSetup.input;
            var scope = this;
            input.onClick.push(function(e){
                scope.selectedSurface.visible = false;
            });
        }
        this.selectedSurface.visible = true;

        this.selectedSurface.geometry = surfaceGeometry;

        var scope = this;
        var input = FPEditor.instance.sceneSetup.input;
        input.DelayedAction(function(){
            scope.SurfaceInfo();
        }, 200);

        this.On(signals.surfacePick, function(){
            scope.selectedSurface.visible = false;
        });
    }

    SurfaceInfo(){

        var scope = this;

        var platform = this.platform;
        var surfaceInfo = /*this.surfaceInfo =*/ {width: platform.width, length: platform.length};

        var obj = this.obj;
        var onChange = function(){
            let sw = surfaceInfo.width / platform.width;
            let sl = surfaceInfo.length / platform.length;
            let sh = (sw + sl) / 2;
            obj.scale.set(sw, sh, sl);
            platform.Scale(sw, sl, sh);

            console.log(platform);
            if(platform.invert){
                let m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
                obj.applyMatrix(m);
                platform.center.applyMatrix4(m);
            }

            let offset = new THREE.Vector3().subVectors(platform.center, obj.position);
            offset.y = 0;
            obj.position.sub(offset);
            platform.center.x = platform.center.z = 0;

            var volume = scope.data.container.volume;
            volume.position.copy(platform.center);
        };

        Feedback.Prompt('Surface width', surfaceInfo.width)
            .then(function(width){
                surfaceInfo.width = Number.parseFloat(width);
                return Feedback.Prompt('Surface length', surfaceInfo.length);
            })
            .then(function(length){
                surfaceInfo.length = Number.parseFloat(length);
                onChange();
                scope.Dispatch(signals.surfacePick);
            })
    }

    InputInfo(){

        var scope = this;
        
        var containingVolume = this.data.container.volume;
        var dimensions = this.data.container.volume.dimensions;
        if(dimensions.volume < 1){
            let platform = this.platform;
            dimensions.Set(platform.width, platform.length, platform.width);
        }
        var onChange = function(){
            scope.DisplayVolume();
        };

        Feedback.Prompt('Volume width', dimensions.width)
            .then(function(width){
                dimensions.width = Number.parseFloat(width);
                onChange();
                return Feedback.Prompt('Volume length', dimensions.length);
            })
            .then(function(length){
                dimensions.length = Number.parseFloat(length);
                onChange();
                return Feedback.Prompt('Volume height', dimensions.height);
            })
            .then(function(height){
                dimensions.height = Number.parseFloat(height);
                onChange();
                return Feedback.Prompt('Weight capacity', dimensions.width * dimensions.length * dimensions.height / 1000);
            })
            .then(function(weightCapacity){
                containingVolume.weightCapacity = weightCapacity;
                onChange();
                scope.Dispatch(signals.infoInput);
            });
    }

    DisplayVolume(){
        var platform = this.platform;

        if(this.displayVolume === undefined){
            this.displayVolume = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
                new THREE.MeshStandardMaterial({
                    transparent: true,
                    opacity: .5
                })
            );
            this.displayVolume.scale.set(0.01, 0.01, 0.01);
            this.displayVolume.position.copy(platform.center);

            this.data.view.add(this.displayVolume);
        }

        
        var dimensions = this.data.container.volume.dimensions;
        this.displayVolume.scale.set(
            dimensions.width,
            dimensions.height,
            dimensions.length
        );
        this.displayVolume.position.y = platform.center.y + dimensions.height / 2;
    }

    PickLoadingSide(){
        if( !this.raycastGroupSide && this.displayVolume ){
            var scope = this;
            this.raycastGroupSide = new RaycastGroup(
                [this.displayVolume], //items
                function(obj, intersection){
                    if(scope.pickSideMode){
                        scope.OnClickPickSide(obj, intersection);
                        scope.pickSideMode = false;
                    }
                }, // callback
                
                function(obj){ //collectionQuery
                    return obj;
                },
                
                true, //updateProperty
                true //recursive
            );

            var input = FPEditor.instance.sceneSetup.input;
            input.AddRaycastGroup('OnClick', 'Side', this.raycastGroupSide);
        }

        this.pickSideMode = true;
    }

    /**
     * 
     * @param {THREE.Mesh} obj 
     * @param {THREE.Intersection} intersection 
     */
    OnClickPickSide(obj, intersection){

        /**
         * @type {Array<THREE.Vector3>}
         */
        var v = obj.geometry.vertices;
        var f = intersection.face;
        var vertices = [v[f.a], v[f.b], v[f.c]];
        f = obj.geometry.faces[intersection.faceIndex + (intersection.faceIndex % 2 === 1 ? - 1 : 1)];
        vertices.push(v[f.a], v[f.b], v[f.c]);
        
        var side = new THREE.Vector3();
        for(var i = 0; i < 6; i++){
            side.add(vertices[i]);
        }
        side.multiplyScalar(1 / 6).applyMatrix4(this.displayVolume.matrix);

        var center = this.displayVolume.position;
        var direction = new THREE.Vector3().subVectors(side, center);

        var platform = this.platform;
        platform.direction = DirectedRect.AxisDirection(direction);

        if(platform.direction.z < .99){
            let m = new THREE.Matrix4();
            m.setPosition(this.obj.position.clone().multiplyScalar(-1));
            m.makeRotationFromQuaternion(
                new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
            );
            this.obj.applyMatrix(m);
            
            platform.direction.multiplyScalar(-1);
        }

        console.log(platform);

        if(this.axesHelper === undefined){
            this.axesHelper = new THREE.AxesHelper(direction.length());
            this.data.view.add(this.axesHelper);
        }

        this.axesHelper.position.copy(center);

        this.Dispatch(signals.sidePick);
    }

    Complete(){
        SurfaceUtils.BakeObject(this.obj);
        this.obj.position.set(0, 0, 0);
        this.obj.rotation.set(0, 0, 0);
        this.obj.scale.set(1, 1, 1);
        super.Complete(this.data);
    }

    Dispose(){
        super.Dispose();
        this.modal.Remove();
    }
}

export default ConfigureSpaceStep;