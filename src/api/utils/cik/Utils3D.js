
/**
 * @typedef {Object} Screen
 * @property {Number} width
 * @property {Number} height
 */

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

    /**
     * 
     * @param {THREE.Vector2|THREE.Vector3} viewportPoint 
     * @param {THREE.Camera} camera 
     * @param {THREE.Vector3} [result]
     * @param {string} [axis] - 'x', 'y' or 'z' (default='z')
     * @returns {THREE.Vector3}
     */
    static Unproject(viewportPoint, camera, result, axis){
        /*
        // Ref: https://stackoverflow.com/a/13091694/1712403
        var vector = new THREE.Vector3();
        vector.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );
        
        vector.unproject( camera );

        var dir = vector.sub( camera.position ).normalize();
        var distance = - camera.position.z / dir.z;
        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        */

        result = result || new THREE.Vector3();
        result.set(viewportPoint.x, viewportPoint.y, .5);
        result.unproject(camera);
        result.sub(camera.position).normalize();

        axis = axis || 'z';
        var distance = - camera.position[axis] / result[axis];
        result.multiplyScalar(distance).add(camera.position);

        return result;
    }
}

export default Utils3D;