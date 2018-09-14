
/** @typedef Vec2 @property {Number} x @property {Number} y */
/** @typedef Rectangle @property {Vec2} p1 @property {Vec2} p2 @property {Vec2} p3 @property {Vec2} p4 */

const epsilon = Math.pow(2, -52);
const smallValue = .000001;
const smallValueSqrt = .001;

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function segmentIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }
  
    var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  
    // Lines are parallel
    if (Math.abs(denominator) < epsilon) {
        return false;
    }
  
    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  
    // is the intersection along the segments
    if (ua > 0 || ua < 1 || ub > 0 || ub < 1) return false;
  
    // Return a object with the x and y coordinates of the intersection
    var x = x1 + ua * (x2 - x1);
    var y = y1 + ua * (y2 - y1);

    return {x, y};
}

function linesIntersect(ax, ay, bx, by, cx, cy, dx, dy){
    // Line AB represented as a1x + b1y = c1
    var a1 = by - ay,
        b1 = ax - bx;
    var c1 = a1 * ax + b1 * ay;
  
    // Line CD represented as a2x + b2y = c2
    var a2 = dy - cy,
        b2 = cx - dx;
    var c2 = a2 * cx + b2 * cy;
  
    var determinant = a1 * b2 - a2 * b1;
  
    // The lines are parallel
    if (Math.abs(determinant) < smallValue) return false;

    var x = (b2 * c1 - b1 * c2) / determinant;
    var y = (a1 * c2 - a2 * c1) / determinant;
    return {x: x, y: y};
}

function rectangleContainsPoint(offset, rx, ry, rw, rh, px, py){
    var x = rx - offset, y = ry - offset, w = rw + offset * 2, h = rh + offset * 2;
    return px > x && px < x + w
        && py > y && py < y + h;
}

/** @param {Number} offset offsets the region by this before checking * @param {Region} subRegion */
function rectangleContainsRectangle(offset, rx, ry, rw, rh, ox, oy, ow, oh){
    var x = rx - offset, y = ry - offset, w = rw + offset * 2, h = rh + offset * 2;
    return ox > x && ox + ow < x + w
        && oy > y && oy + oh < y + h;
}

/**
 * @param {Array<Vec2>} points
 */
function rectanglesFromPoints(points){
    // Separate points in lists of 'y' coordinate, grouped by 'x' coordinate
    const toInt = Math.round(1 / smallValue);
    var xs = {};
    points.forEach(point => {
        let xCat = Math.floor(point.x * toInt);
        if(xs[xCat] === undefined) xs[xCat] = {x: point.x, ys: []};
        let ys = xs[xCat].ys;
        let yCat = Math.floor(point.y * toInt);
        let insert = true;
        for(let iY = 0; iY < ys.length; iY++){
            if(ys[iY].yCat === yCat) insert = false;
        }
        if(insert) ys.push({yCat: yCat, y: point.y});
    });

    //console.log('xs:', xs);

    // Intersect lists
    function sortYCat(a, b){
        if(a.yCat < b.yCat) return -1;
        if(a.yCat > b.yCat) return 1;
        return 0;
    }
    var xsKeys = Object.keys(xs);
    for(let iX = 0; iX < xsKeys.length; iX++){
        let xCat = xs[xsKeys[iX]];
        xCat.ys.sort(sortYCat);
    }

    /** @typedef IntersectedX @property {Number} x1 @property {Number} x2 @property {Array<Number>} ys */
    /** @type {Array<IntersectedX>} */
    var intersectedXs = [];
    for(let iX = 0; iX < xsKeys.length; iX++){
        let xCat1 = xs[xsKeys[iX]];
        let ys1 = xCat1.ys;
        for(let iX2 = iX + 1; iX2 < xsKeys.length; iX2++){
            let xCat2 = xs[xsKeys[iX2]];
            let ys2 = xCat2.ys;

            let yIntersect = [];
            let xIntersect = {x1: xCat1.x, x2: xCat2.x, ys: yIntersect};
            for(let iY1 = 0; iY1 < ys1.length; iY1++){
                for(let iY2 = 0; iY2 < ys2.length; iY2++){
                    if(ys1[iY1].yCat === ys2[iY2].yCat){
                        yIntersect.push(ys1[iY1].y);
                        break;
                    }
                }
            }

            if(yIntersect.length > 1) intersectedXs.push(xIntersect);
        }
    }

    //console.log(intersectedXs);

    /** @type {Array<Rectangle>} */
    var rectangles = [];
    for(let iIX = 0; iIX < intersectedXs.length; iIX++){
        let intersectedX = intersectedXs[iIX];
        let ys = intersectedX.ys;
        let x1 = intersectedX.x1, x2 = intersectedX.x2;
        for(let iY1 = 0; iY1 < ys.length; iY1++){
            for(let iY2 = iY1 + 1; iY2 < ys.length; iY2++){
                let p1 = {x: x1, y: ys[iY1]},
                    p2 = {x: x2, y: ys[iY1]},
                    p3 = {x: x2, y: ys[iY2]},
                    p4 = {x: x1, y: ys[iY2]};
                
                let rectangle = {p1: p1, p2: p2, p3: p3, p4: p4};
                rectangles.push(rectangle);
            }
        }
    }

    return rectangles;
}

/**
 * @param {Array<Rectangle>} rectangles 
 * @returns {Array<Rectangle>} the array is edited in-place
 */
function reduceRectangles(rectangles){
    for(let iRect = 0; iRect < rectangles.length; iRect++){
        let ra = rectangles[iRect];
        let ax = ra.p1.x, ay = ra.p1.y;
        let aw = ra.p3.x - ax, ah = ra.p3.y - ay;
        for(let jRect = 0; jRect < rectangles.length; jRect++){
            if(iRect !== jRect){
                let rb = rectangles[jRect];
                let bx = rb.p1.x, by = rb.p1.y;
                let bw = rb.p3.x - bx, bh = rb.p3.y - by;
                if(rectangleContainsRectangle(smallValue, ax, ay, aw, ah, bx, by, bw, bh)){
                    rectangles.splice(jRect, 1);
                    jRect--;
                    iRect = Math.max(0, jRect - 1);
                    break;
                }
            }
        }
    }
    return rectangles;
}

/** @param {Number} ax @param {Number} ay @param {Number} bx @param {Number} by @param {Number} x @param {Number} y */
function segmentContainsPoint(ax, ay, bx, by, x, y){
    var vx = bx - ax, vy = by - ay,
        vxa = x - ax, vya = y - ay,
        vxb = x - bx, vyb = y - by;
    var d = Math.sqrt(vx * vx + vy * vy),
        da = Math.sqrt(vxa * vxa + vya * vya),
        db = Math.sqrt(vxb * vxb + vyb * vyb);
    return Math.abs( d - (da + db) ) < smallValueSqrt;
}

export {
    epsilon,
    smallValue,
    smallValueSqrt,
    linesIntersect,
    rectangleContainsPoint,
    rectangleContainsRectangle,
    reduceRectangles,
    rectanglesFromPoints
};