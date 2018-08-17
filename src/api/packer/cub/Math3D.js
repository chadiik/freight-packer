/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    out[2] = a[2] + b[2]
    return out
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b
    out[1] = a[1] * b
    out[2] = a[2] * b
    return out
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
}

/**
 * @typedef {Array<Number>} Vec3
 */

/** @type {Vec3} */
var v0 = [0, 0, 0];

/**
 * 
 * @param {Vec3} out 
 * @param {Vec3} origin 
 * @param {Vec3} direction 
 * @param {Vec3} normal 
 * @param {Number} dist 
 */
function intersectRayPlane(out, origin, direction, normal, dist) {
  var denom = dot(direction, normal);
  if (denom !== 0) {
    var t = -(dot(origin, normal) + dist) / denom;
    if (t < 0) {
      return null;
    }
    scale(v0, direction, t);
    return add(out, origin, v0);
  }
  else if (dot(normal, origin) + dist === 0) {
    return copy(out, origin);
  }
  else {
    return null;
  }
}

export {
    intersectRayPlane
};