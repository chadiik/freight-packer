import UpdateComponent from "./UpdateComponent";
import RaycastGroup from "./RaycastGroup";

const keypress = require('../../../../min-dependencies/lib/keypress');

/**
 * @typedef {Object} IScreen
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 * @property {Number} left
 * @property {Number} right
 * @property {Number} bottom
 * @property {Number} top
 */

/**
 * @typedef {Object} DragEvent
 * @property {MouseEvent} mouseEvent
 * @property {Number} sx - Start screen x
 * @property {Number} sy - Start screen y
 * @property {Number} x - Current screen x
 * @property {Number} y - Current screen y
 * @property {Number} dx - Delta x
 * @property {Number} dy - Delta y
 * @property {Number} distance - Distance (current - start)
 * @property {Number} minDist - Minimum distance to raise onDrag
 */

 /** keyboard api (http://dmauro.github.io/Keypress/)
 * @typedef keyboard
 * @property {function} on
 * @property {function} unregister
 */

const epsilon = Math.pow(2, -52);
const defaultKeysListen = 'abcdefghijklmnopqrtsuvwxyz'.split('').concat(['ctlr', 'shift', 'alt']);

class Input {

    /**
     * 
     * @param {HTMLElement} domContainer 
     */
    constructor (domContainer){
        this.enabled = true;
        
        var scope = this;
        Object.defineProperty(this, 'camera', {
            get: function(){
                return scope._camera;
            },
            set: function(camera){
                scope._camera = camera;
                scope.fov = {min: 40, max: camera.fov, target: camera.fov};
            }
        });

        this.domContainer = domContainer;

        this._mouse = {x:0, y:0};
        this.mouseScreen = new THREE.Vector2();
        this.mouseViewport = new THREE.Vector2();
        this.mouseDelta = new THREE.Vector2();
        this.lastMouseDownTime = 0;
        /**
         * @type {IScreen}
         */
        this.screen = {};
        this.ComputeScreen();

        this.raycaster = new THREE.Raycaster();

        this.clock = new THREE.Clock();
        this.clock.start();

        this._raycastGroups = {Update:{}, Update25:{}, Update10:{}, OnMouseDown:{}, OnDoubleClick:{}, OnMouseUp:{}, OnRightClick:{}, OnClick:{}};
        this.updateComponents = [
            new UpdateComponent(true, 1/25, this.Update25.bind(this)),
            new UpdateComponent(true, 1/10, this.Update10.bind(this))
        ];

        this.fireOnce = [];

        this.onMouseDown = [];
        this.onMouseUp = [];
        this.onRightClick = [];
        this.onDoubleClick = [];
        this.onClick = [];
        this.onDrag = [];

        /**
         * @type {DragEvent}
         */
        this.onDragEvent = {
            mouseEvent: undefined,
            sx: undefined, sy: undefined,
            x: 0, y: 0,
            dx: 0, dy: 0,
            distance: 0,
            minDist: 4 // pixels 
        };
        var onDragStatus = false;
        Object.defineProperty(this.onDragEvent, '_status', {
            get: function(){
                return onDragStatus;
            },
            set: function(value){
                onDragStatus = value;
                this.sx = this.sy = undefined;
                this.dx = this.dy = 0;
            }
        })

        this.doubleClickTime = .2;
        
        this.domContainer.addEventListener('mousedown', this.OnMouseDown.bind(this));
        this.domContainer.addEventListener('mouseup', this.OnMouseUp.bind(this));
        this.domContainer.addEventListener('contextmenu', this.OnRightClick.bind(this));
        this.domContainer.addEventListener('mousemove', this.OnMouseMove.bind(this), false);

        var thisOnMouseWheel = this.OnMouseWheel.bind(this);
        if (this.domContainer.addEventListener) {
            this.domContainer.addEventListener("mousewheel", thisOnMouseWheel, false);
            this.domContainer.addEventListener("DOMMouseScroll", thisOnMouseWheel, false);
        }
        else
            this.domContainer.attachEvent("onmousewheel", thisOnMouseWheel);

        this.screenNeedsUpdate = true;
        window.addEventListener('scroll', this.OnScroll.bind(this));

        this.cameraNeedsUpdate = true;
        this.onResize = [];
        window.addEventListener('resize', this.OnResize.bind(this));

        /**
         * @type {keyboard}
         */
        this.keyboard = new keypress.Listener();
        this.keyboard.on = this.keyboard.simple_combo;
        this.keyboard.unregister = this.keyboard.unregister_combo;
        this.keys = {};

        //
        
    }

    Dispose(){
        // remove listeners
    }

    ListenKeys(keys){
        if(keys === undefined) {
            keys = defaultKeysListen;
        }

        var scope = this;
        keys.forEach(key => {
            scope.keys[key] = false;
            scope.keyboard.register_combo({
                keys: key,
                prevent_repeat: true,
                on_keydown: function(){
                    scope.keys[key] = true;
                },
                on_keyup: function(){
                    scope.keys[key] = false;
                }
            });
        });
    }

    ComputeScreen(){
        var screen = this.domContainer.getBoundingClientRect();
        this.screen.x = screen.x;
        this.screen.y = screen.y;
        this.screen.width = screen.width;
        this.screen.height = screen.height;
        this.screen.left = screen.left;
        this.screen.right = screen.right;
        this.screen.bottom = screen.bottom;
        this.screen.top = screen.top;
        
        /*
        var rectOffset = Utils.GetRectOffset(this.domContainer);
        this.screen.x += rectOffset.x;
        this.screen.left += rectOffset.x;
        this.screen.y += rectOffset.y;
        this.screen.top += rectOffset.y;
        */
    }

    OnMouseDown(mouseEvent){
        if(mouseEvent.button === 0){
            this.UpdateScreenAndMouse(mouseEvent);
            var now = this.clock.getElapsedTime();
            if(now - this.lastMouseDownTime < this.doubleClickTime){
                if(this._dridMouseDown !== undefined){
                    this.AbortDelayedAction(this._dridMouseDown);
                    this._dridMouseDown = undefined;
                }
                this.OnDoubleClick(mouseEvent);
                return;
            }

            this.lastMouseDownTime = now;
            this.onDragEvent._status = true;

            var scope = this;
            this._dridMouseDown = this.DelayedAction(
                this._mouseDownDelayed = function(){
                    scope._dridMouseDown = undefined;
                    for(var i = 0; i < scope.onMouseDown.length; i++){
                        scope.onMouseDown[i](mouseEvent);
                    }
                    scope.UpdateRaycast('OnMouseDown');
                    scope.mouseDelta.copy(scope.mouseScreen);
                }, 
                this.doubleClickTime * 1000
            );
        }
    }

    OnDoubleClick(mouseEvent){
        for(var i = 0; i < this.onDoubleClick.length; i++){
            this.onDoubleClick[i](mouseEvent);
        }

        this.UpdateRaycast('OnDoubleClick');
    }

    ExecuteDelayedMD(mouseEvent){
        if(this._dridMouseDown !== undefined){
            this.AbortDelayedAction(this._dridMouseDown);
            this._dridMouseDown = undefined;
            this._mouseDownDelayed();
        }
    }

    OnMouseUp(mouseEvent){
        if(mouseEvent.button === 0){
            var now = this.clock.getElapsedTime();
            if(now - this.lastMouseDownTime < this.doubleClickTime){
                this.ExecuteDelayedMD(mouseEvent);
            }
            
            this.UpdateScreenAndMouse(mouseEvent);
            for(var i = 0; i < this.onMouseUp.length; i++){
                this.onMouseUp[i](mouseEvent);
            }

            this.UpdateRaycast('OnMouseUp');
            var d = this.mouseDelta.distanceToSquared(this.mouseScreen);
            var noMouseDrag = d < 10; // pixels squared
            if(noMouseDrag){
                this.OnClick(mouseEvent);
            }

            this.onDragEvent._status = false;
        }
    }

    OnMouseDrag(){
        var p = this.onDragEvent;
        if(p._status){
            let m = this.mouseScreen;
            if(p.sx === undefined) p.sx = p.x = m.x;
            if(p.sy === undefined) p.sy = p.y = m.y;

            let vx = p.x - p.sx,
                vy = p.y - p.sy;
            p.distance = Math.sqrt(vx * vx + vy * vy);
            if(p.distance > p.minDist && 
                (Math.abs(p.dx) > epsilon || Math.abs(p.dy) > epsilon)
            ){
                for(var i = 0; i < this.onDrag.length; i++){
                    this.onDrag[i](p);
                }
            }

            p.dx = p.x - m.x;
            p.dy = p.y - m.y;

            p.x = m.x;
            p.y = m.y;
        }
    }

    OnClick(mouseEvent){
        for(var i = 0; i < this.onClick.length; i++){
            this.onClick[i](mouseEvent);
        }

        this.UpdateRaycast('OnClick');
    }

    OnRightClick(mouseEvent){
        //mouseEvent.preventDefault();
        this.UpdateScreenAndMouse(mouseEvent);
        for(var i = 0; i < this.onRightClick.length; i++){
            this.onRightClick[i](mouseEvent);
        }

        this.UpdateRaycast('OnRightClick');
    }

    OnMouseMove(mouseEvent){
        this._mouse.x = THREE.Math.clamp(mouseEvent.clientX - this.screen.left, 0, this.screen.width);
        this._mouse.y = THREE.Math.clamp(mouseEvent.clientY - this.screen.top, 0, this.screen.height);
        this.onDragEvent.mouseEvent = mouseEvent;
        this.ExecuteDelayedMD(mouseEvent);
    }

    OnScroll(event){
        this.screenNeedsUpdate = true;
    }

    OnMouseWheel(mouseEvent){
        mouseEvent.preventDefault();
        var delta = THREE.Math.clamp(mouseEvent.wheelDelta || -mouseEvent.detail, -1, 1);
        this.fov.target = THREE.Math.clamp(this.fov.target - delta * 2., this.fov.min, this.fov.max);
        this.fov.lerp = 0;
    }

    LerpZoom(){
        this.fov.lerp += .1;
        if(this.fov.lerp >= 1 || Number.isNaN(this.fov.lerp)){
            return;
        }
        this.camera.fov += (this.fov.target - this.camera.fov) * this.fov.lerp;
        this.camera.updateProjectionMatrix();
    }

    OnResize(event) {
        this.screenNeedsUpdate = true;
        this.cameraNeedsUpdate = true;
    }

    RemoveEventCallback(eventType, callback){
        var callbacks = this[eventType];
        for(var iCallback = 0; iCallback < callbacks.length; iCallback++){
            if(callbacks[iCallback] === callback){
                callbacks.splice(iCallback, 1);
            }
        }
    }

    Update(){
        this.UpdateScreenAndMouse();

        this.FireOnce();

        // Raycasts
        this.UpdateRaycaster();
        this.UpdateRaycast('Update');

        var now = this.clock.getElapsedTime();
        for(var iUpdate = 0; iUpdate < this.updateComponents.length; iUpdate++){
            var updateComponent = this.updateComponents[iUpdate];
            if(updateComponent.active
                && (now - updateComponent.lastUpdateTime > updateComponent.interval)
            ){
                updateComponent.Update(now);
            }
        }

        this.OnMouseDrag();
    }

    Update25(){
        this.LerpZoom();
        this.UpdateRaycast('Update25');
    }

    Update10(){
        this.UpdateRaycast('Update10');
    }

    FireOnce(){
        for(var iCallback = this.fireOnce.length; iCallback-- > 0;){
            this.fireOnce[iCallback]();
        }
        this.fireOnce.length = 0;
    }

    DelayedAction(action, delay){
        var drid = window.setTimeout(function(){
            action();
        }, delay);
        return drid;
    }

    AbortDelayedAction(drid){
        window.clearTimeout(drid);
        return;
    }

    Repeat(action, interval){
        if(this._repeats === undefined) this._repeats = [];
        var drid = window.setInterval(function(){
            action();
        }, interval);
        this._repeats.push({action:action, drid:drid});
        return drid;
    }

    StopRepeat(action){
        if(this._repeats === undefined) return;
        if(typeof action === 'number'){
            window.clearInterval(action);
            return;
        }
        for(var i = 0; i < this._repeats.length; i++){
            if(this._repeats[i].action === action){
                window.clearInterval(this._repeats[i].drid);
                this._repeats.splice(i, 1);
                return;
            }
        }
    }

    UpdateScreenAndMouse(mouseEvent){
        if(this.screenNeedsUpdate) {
            this.ComputeScreen();
            this.screenNeedsUpdate = false;
        }
        if(this.cameraNeedsUpdate) {
            for(var i = 0; i < this.onResize.length; i++){
                this.onResize[i](this.screen);
            }
            this.cameraNeedsUpdate = false;
        }

        if(mouseEvent !== undefined){
            this._mouse.x = THREE.Math.clamp(mouseEvent.clientX - this.screen.left, 0, this.screen.width);
            this._mouse.y = THREE.Math.clamp(mouseEvent.clientY - this.screen.top, 0, this.screen.height);
        }

        this.mouseScreen.x = this._mouse.x;
        this.mouseScreen.y = this._mouse.y;

        this.mouseViewport.x = this._mouse.x / this.screen.width * 2 - 1;
        this.mouseViewport.y = -this._mouse.y / this.screen.height * 2 + 1;
    }

    RaycastTest(objects, recursive){
        this.UpdateRaycaster();
        recursive = recursive !== undefined ? recursive : false;
        var intersects = objects instanceof Array ? this.raycaster.intersectObjects(objects, recursive) : this.raycaster.intersectObject(objects, recursive);
        if (intersects.length > 0) {
            return intersects[0];
        }
        return undefined;
    }

    /**
     * @param {string} event Update Update25 Update10 OnMouseDown OnDoubleClick OnMouseUp OnRightClick OnClick
     * @param {string} groupID 
     * @param {RaycastGroup} group 
     */
    AddRaycastGroup(event, groupID, group){
        if(this._raycastGroups[event][groupID] !== undefined) console.log('RaycastGroup ' + groupID + ' is being overwritten.');
        this._raycastGroups[event][groupID] = group;
    }

    RemoveRaycastGroup(event, groupID){
        delete this._raycastGroups[event][groupID];
    }

    UpdateRaycaster(){
        this.camera.updateMatrixWorld();
        this.raycaster.setFromCamera(this.mouseViewport, this.camera);
    }

    UpdateRaycast(event){
        var raycastGroupsKeys = Object.keys(this._raycastGroups[event]);
        var numRaycastGroups = raycastGroupsKeys.length;
        if(numRaycastGroups > 0){
            if(numRaycastGroups > 1)
                raycastGroupsKeys.sort().reverse();
            
            for(var iGroup = 0; iGroup < numRaycastGroups; iGroup++){
                var key = raycastGroupsKeys[iGroup];
                this._raycastGroups[event][key].Raycast(this.raycaster);
            }
        }
    }
}

export default Input;