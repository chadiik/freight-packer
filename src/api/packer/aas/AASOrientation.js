
function almost(n1, n2){
    return Math.abs(n1 - n2) < .01;
}

function resolve(w, l, h, dimensions){
    var dw = dimensions.width, dl = dimensions.length, dh = dimensions.height;

    if(almost(w, dw)){ // x
        if(almost(h, dh)){ // y
            return 'xyz';
        }
        else if(almost(h, dl)){ // z
            return 'xzy';
        }
    }
    else if(almost(w, dh)){ // y
        if(almost(h, dw)){ // x
            return 'yxz';
        }
        else if(almost(h, dl)){ // z
            return 'yzx';
        }
    }
    else if(almost(w, dl)){ // z
        if(almost(h, dw)){ // x
            return 'zxy';
        }
        else if(almost(h, dh)){ // y
            return 'zyx';
        }
    }

    console.warn('ResolveOrientation issue with:', item);
    return 'xyz';
}

export { resolve };