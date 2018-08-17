
const typeofNumber = 'number';

/** @param {THREE.Color} source @param {Array<THREE.Color>} colors */
function findNearest(source, colors){
    var dMin = Number.MAX_SAFE_INTEGER;
    var nearest = source;
    colors.forEach(color => {
        let vx = color.r - source.r,
            vy = color.g - source.g,
            vz = color.b - source.b;
        let d = vx * vx + vy * vy + vz * vz;
        if(d < dMin){
            dMin = d;
            nearest = color;
        }
    });

    return nearest;
}

var tempColor = new THREE.Color();

class ColorTemplate{
    /**
     * @param {Array<string|THREE.Color>} colors 
     */
    constructor(...colors){
        /** @type {Array<THREE.Color>} */
        this.colors = [];
        colors.forEach(color => {
            if( !(color instanceof THREE.Color) ) color = new THREE.Color(color);
            this.colors.push(color);
        });
    }

    /**
     * @template T
     * @param {T} target 
     * @returns {T}
     */
    Apply(target){
        var scope = this;
        if(typeof target === typeofNumber){
            let mapColor = findNearest(tempColor.setHex(target), this.colors);
            target = mapColor.getHex();
        }
        else if(target instanceof THREE.Color){
            let mapColor = findNearest(target, this.colors);
            target.copy(mapColor);
        }
        else if(target instanceof THREE.Material){
            let color = target.color;
            if(color instanceof THREE.Color){
                let mapColor = findNearest(color, this.colors);
                color.copy(mapColor);
            }
        }
        else if(target instanceof THREE.Object3D){
            target.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    scope.Apply(child.material);
                }
            });
        }
        return target;
    }
}

export default ColorTemplate;