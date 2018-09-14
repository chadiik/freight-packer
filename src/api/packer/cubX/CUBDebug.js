import Debug from "../../debug/Debug";
import Region from "./core/Region";

export const debugging = false;

if(debugging){
    Debug.app.sceneSetup.input.ListenKeys(['right', 'space']);
}

export function sleep(ms, force) {
    return new Promise(resolve => {
        if(debugging || force) setTimeout(resolve, ms);
        else resolve();
    });
}

export function debugLog(...args){
    console.log(...args);
}

export function keypress(ms, force) {
    return new Promise(resolve => {
        if(debugging || force){
            let tid = undefined;
            function execute(){
                if(tid !== undefined) clearTimeout(tid);
                removeEventListener('keydown', execute);
                resolve();
            }
            if(ms && ms > 0) tid = setTimeout(execute, ms);
            addEventListener('keydown', execute);
        }
        else{
            resolve();
        }
    });
}

/**
 * @param {Region} region * @param {Number} color 
 */
export function debugRegion(region, color, solid, duration, checkered){
    var x = region.x, y = region.y, z = region.z, w = region.width, h = region.height, l = region.length;
    var debugUID = Debug.Viz.DrawVolume(x + w/2, y + h/2, z + l/2, w, h, l, color || 0xaaffff, duration || -1, !Boolean(solid), checkered);
    return debugUID;
}

/** @param {Array<string>} */
export function debugClear(uids){
    if(uids){
        uids.forEach(uid => {
            Debug.Viz.RemoveObjectByUID(uid);
        });
    }
    else{
        Debug.Viz.ClearAll();
    }
}

function numberFormatDefault(n){ return n; }

export function numberFormat(n, d){
    if(n > Number.MAX_SAFE_INTEGER - 2) return 'MAX';
    let nStr = Math.round(n) !== n ? n.toFixed(d) : n;
    return nStr;
}

/** @typedef FormatParams @property {Function} nf number formatting function */
/** @param {string} str @param {FormatParams} params @param {Array<*>} args */
export function format(str, params, ...args){
    if(params.nf === undefined) params.nf = numberFormatDefault;
    let index = 0;
    while( (index = str.indexOf('@', index)) !== -1 ){
        if(str[index - 1] !== '\\'){
            let a = args.shift();
            if(typeof a === 'number') a = params.nf(a);
            str = str.replace('@', a);
        }
        index += 1;
    }
    return str;
}