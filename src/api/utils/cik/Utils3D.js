

/**
 * @typedef {Object} Screen
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @typedef {Object} IPoint
 * @property {Number} x
 * @property {Number} y
 */

var tempBox = new THREE.Box3();
var tempVec = new THREE.Vector3();

class Utils3D {

    /** Converts 'vec' to NDC, to supply 'vec' in the range [0, 1], ommit 'screen'
     * @param {THREE.Vector2|THREE.Vector3} vec 
     * @param {Screen} [screen]
     * @returns {THREE.Vector2|THREE.Vector3}
     */
    static ToNDC(vec, screen){
        if(screen){
            vec.x /= screen.width;
            vec.y /= screen.height;
        }
        vec.x = vec.x * 2 - 1;
        vec.y = vec.y * 2 - 1;

        if(vec.z !== undefined)
            vec.z = .5;

        return vec;
    }

    /** Converts 'vec' to [0, 1] range, to supply 'vec' in NDC [-1, 1], ommit 'screen'
     * @param {THREE.Vector2|THREE.Vector3} vec 
     * @param {Screen} [screen]
     * @returns {THREE.Vector2|THREE.Vector3}
     */
    static ToUnit(vec, screen){
        if(screen){
            vec.x /= screen.width;
            vec.y /= screen.height;
        }
        else{
            vec.x = vec.x / 2 + .5;
            vec.y = vec.y / 2 + .5;
        }

        if(vec.z !== undefined)
            vec.z = .5;

        return vec;
    }

    /** Converts a NDC to world plane (axis) position
     * @param {THREE.Vector2|THREE.Vector3} viewportPoint - in NDC, can be safely used as 'result' if THREE.Vector3
     * @param {THREE.Camera} camera 
     * @param {THREE.Vector3} [result]
     * @param {string} [axis] - 'x', 'y' or 'z' (default='z')
     * @returns {THREE.Vector3}
     */
    static Unproject(viewportPoint, camera, result, axis){
        // Ref: https://stackoverflow.com/a/13091694/1712403

        result = result || new THREE.Vector3();
        result.set(viewportPoint.x, viewportPoint.y, .5);
        result.unproject(camera);
        result.sub(camera.position).normalize();

        axis = axis || 'z';
        var distance = - camera.position[axis] / result[axis];
        result.multiplyScalar(distance).add(camera.position);

        return result;
    }

    /** Converts world position to NDC
     * @param {THREE.Vector3} worldPoint 
     * @param {THREE.Camera} camera 
     * @param {Screen} screen 
     * @param {THREE.Vector2} result 
     */
    static Project(worldPoint, camera, screen, result) {
        // Ref: https://github.com/josdirksen/threejs-cookbook/blob/master/03-camera/03.07-convert-world-coordintate-to-screen-coordinates.html

        tempVec.copy(worldPoint).project(camera);
        result = result || new THREE.Vector2();
        result.x  = tempVec.x;
        result.y  = tempVec.y;
        return result;
    }
}

class Rect {
    /**
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} right 
     * @param {Number} bottom 
     */
    constructor(left, top, right, bottom){
        this.Set(left, top, right, bottom);
    }

    /**
     * @param {Number} left 
     * @param {Number} top 
     * @param {Number} right 
     * @param {Number} bottom 
     */
    Set(left, top, right, bottom){
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    /**
     * @param {IPoint|Number} point - {x, y} | x value
     * @param {Number} y - y value
     */
    ContainsPoint(point, y){
        let x = y ? point : point.x;
        y = y ? y : point.y;
        return x > this.left && x < this.right && y > this.top && y < this.bottom;
    }

    Offset(x, y){
        this.left += x;
        this.top += y;
        this.right += x;
        this.bottom += y;
    }

    Copy(rect){
        this.Set(rect.left, rect.top, rect.right, rect.bottom);
    }

    Clone(){
        return new Rect(this.left, this.top, this.right, this.bottom);
    }
}

Utils3D.Rect = Rect;

export default Utils3D;