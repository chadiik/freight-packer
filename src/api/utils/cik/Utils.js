
const trimVariableRegex = new RegExp(/(?:\d|_|-)+$/);
const twopi = 2 * Math.PI;

class Utils {

    static Redefine(object, constructor){
        var classProperties = object;
        var instanceProperties = object.prototype;
    
        var def = constructor(instanceProperties);
    
        Object.assign(def, classProperties);
        Object.assign(def.prototype, instanceProperties);
        Object.defineProperties(def, Object.getOwnPropertyDescriptors(classProperties));
        Object.defineProperties(def.prototype, Object.getOwnPropertyDescriptors(instanceProperties));

        return def;
    }

    static AssignUndefined(target, source){
        if(target === undefined){
            target = {};
            Object.assign(target, source);
            return target;
        }

        var keys = Object.keys(source);
        keys.forEach(key => {
            if(target[key] === undefined) target[key] = source[key];
        });
        return target;
    }

    static Snapshot(obj){
        return JSON.parse(JSON.stringify(obj));
    }

    static GetRectOffset(element){
        var style = window.getComputedStyle(element),
            marginLeft = parseFloat(style.marginLeft),
            marginTop = parseFloat(style.marginTop),
            paddingLeft = parseFloat(style.paddingLeft),
            paddingTop = parseFloat(style.paddingTop);
        return {x: marginLeft + paddingLeft, y: marginTop + paddingTop};
    }

    static TrimVariable(input){
        return input.replace(trimVariableRegex, '');
    }

    static LimitString(str, length){
        if(str.length > length) str = str.substring(str.length - length);
        return str;
    }

    static LoopIndex(i, len){
        i = i % len;
        if(i < 0) i = len + i;
        return i;
    }

    static FastCircleLoop(divisions, callback){
        // ref: http://iquilezles.org/www/articles/sincos/sincos.htm
        var da = twopi / divisions;
        var a = Math.cos(da);
        var b = Math.sin(da);
        var cos = 1;
        var sin = 0;
        for( var i = 0; i < divisions; i++ )
        {
            var nc = a*cos - b*sin;
            var ns = b*cos + a*sin;
            cos = nc;
            sin = ns;
            callback(cos, sin);
        }
    }

    static ColorPaletteAsVec3(t, a, b, c, d, color){
        // ref: http://iquilezles.org/www/articles/palettes/palettes.htm
        // return a + b * cos( 6.28318 * ( c * t + d ) );
        color = color || new THREE.Color();
        var r = a.x + b.x * Math.cos( twopi * (c.x * t + d.x) ), 
            g = a.y + b.y * Math.cos( twopi * (c.y * t + d.y) ),
            b = a.z + b.z * Math.cos( twopi * (c.z * t + d.z) );
        return color.set(r, g, b);
    }
}

export default Utils;