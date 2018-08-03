import Debug from "../../debug/Debug";

var offset = new THREE.Vector3();
var orientation = new THREE.Quaternion();
var scale = new THREE.Vector3();
function setDebugMatrix(matrix){
    matrix.decompose(offset, orientation, scale);
}

const debugging = false;

function sleep(ms) {
    return new Promise(resolve => {
        if(debugging) setTimeout(resolve, ms);
        else resolve();
    });
}

function str(obj){
    var result;
    if(obj instanceof Array){
        result = '[';
        let i;
        for(i = 0; i < obj.length - 1; i++) result += obj[i] + ', ';
        result += obj[i] + ']';
    }
    return result;
}

function debugLog(...args){
    console.log(...args);
    return sleep(50);
}

function debugPacking(...args){
    /** @type {Packing} */
    var packing = args[0];
    packing.spaces.forEach(space => {
        var p = space.position;
        var d = space.dimensions;
        Debug.Viz.DrawVolume(p[0], p[1], p[2], d[0], d[1], d[2], args[1] || 0xaaffff, args[2] || 500);
    });
    return sleep(500);
}

function debugSpace(...args){
    /** @type {Space} */
    var space = args[0];
    var p = space.position;
    var d = space.dimensions;
    Debug.Viz.DrawVolume(p[0], p[1], p[2], d[0], d[1], d[2], args[1] || 0xaaffff, args[2] || 500);
    return sleep(300);
}

function debugPlacement(...args){
    /** @type {Placement} */
    var placement = args[0];
    var p = placement.position;
    var d = placement.dimensions;
    Debug.Viz.DrawVolume(p[0], p[1], p[2], d[0], d[1], d[2], args[1] || 0xaaffaa, args[2] || 500);
    return sleep(300);
}

function debugPacked(...args){
    /** @type {Placement} */
    var placement = args[0];

    debugPlacement(placement, 0x8888ff, 100000);
}

function debugAs(type, ...args){
    switch(type){
        case 'Log': return debugLog(...args);
        case 'Packing': return debugPacking(...args);
        case 'Space': return debugSpace(...args);
        case 'Placement': return debugPlacement(...args);
        case 'Packed': return debugPacked(...args);
    }
    return true;
}

/**
 * @typedef {Array<Number>} Dimensions
 * @typedef {Array<Number>} Position
 * 
 * @typedef Item
 * @property {string} id 
 * @property {Dimensions} dimensions
 * @property {Number} weight
 * 
 * @typedef Container
 * @property {Dimensions} dimensions
 * @property {Number} weight
 * 
 * @typedef Placement
 * @property {string} id
 * @property {Dimensions} dimensions
 * @property {Position} position
 * @property {Number} weight
 * 
 * @typedef Space
 * @property {Dimensions} dimensions
 * @property {Position} position
 * 
 * @typedef Packing
 * @property {Array<Space>} spaces
 * @property {Array<Placement>} placements
 * @property {Number} weight
 */

const placePermutations = [ [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0] ];

/**
 * @param {Item} item 
 * @param {Space} space
 * @returns {Placement}
 */
function place(item, space){
    var d = item.dimensions,
        sd = space.dimensions;
    
    for(let i = 0; i < 6; i++){
        let p = placePermutations[i];
        if( d[p[0]] <= sd[0]
            && d[p[1]] <= sd[1]
            && d[p[2]] <= sd[2]
        ){
            return {
                id: item.id,
                dimensions: [d[p[0]], d[p[1]], d[p[2]]],
                position: space.position,
                weight: item.weight
            };
        }
    }

    return undefined;
}

/**
 * 
 * @param {Space} space 
 * @param {Placement} placement
 * @returns {Array<Space>} 
 */
function breakUpSpace(space, placement){
    var spaceDim = space.dimensions,
        spacePos = space.position,
        placementDim = placement.dimensions;
    return [
        {  
            dimensions: [ spaceDim[0] - placementDim[0]  , spaceDim[1]                      , spaceDim[2]                   ],  
            position:   [ spacePos[0] + placementDim[0]  , spacePos[1]                      , spacePos[2]                   ]
        },{  
            dimensions: [ placementDim[0]                , spaceDim[1] - placementDim[1]    , spaceDim[2]                   ],  
            position:   [ spacePos[0]                    , spacePos[1] + placementDim[1]    , spacePos[2]                   ]
        },{  
            dimensions: [ placementDim[0]                , placementDim[1]                  , spaceDim[2] - placementDim[2] ],  
            position:   [ spacePos[0]                    , spacePos[1]                      , spacePos[2] + placementDim[2] ]
        }
    ];
}

function rnsort(a, b){
    if(a < b) return 1;
    if(a > b) return -1;
    return 0;
}

function volumeSort(a, b){
    var av = a.dimensions[0] * a.dimensions[1] * a.dimensions[2];
    var bv = b.dimensions[0] * b.dimensions[1] * b.dimensions[2];

    if(av > bv) return -1;
    if(av < bv) return 1;
    return 0;
}

/**
 * @param {Container} container 
 * @param {Array<Item>} items 
 */
async function pack(container, items){
    /** @type {Array<Packing>} */
    var packings = [];
    /** @type {Array<Item>} */
    var unpacked = [];

    items.sort(volumeSort);

    //for(let iItem = 0; iItem < items.length; iItem++){
    const iItem = 0;
    while(items.length > 0){
        let item = items[iItem];

        if(item.weight > container.weight){
            return {failed: 'Item is too big'};
        }
        
        let packed = false;

        for(let iPacking = 0; iPacking < packings.length && !packed; iPacking++){
            let packing = packings[iPacking];
            await debugAs('Packing', packing);

            // If this packing's going to be too big with this item as well then skip on to the next packing
            if(packing.weight + item.weight > container.weight){
                await debugAs('Log', 'Packing ' + iPacking + ' is overweight');
                continue;
            }

            for(let iSpace = 0; iSpace < packing.spaces.length; iSpace++){
                let space = packing.spaces[iSpace];
                await debugAs('Space', space);
                
                // Try placing the item in this space, if it doesn't fit skip on the next space
                let placement = place(item, space);
                if( !placement ){
                    await debugAs('Log', 'Placing item in Space ' + iSpace + ' of Packing ' + iPacking + ' failed');
                    continue;
                }

                await debugAs('Placement', placement);

                // Add the item to the packing and break up the surrounding spaces
                packing.placements.push(placement);
                packing.weight += item.weight;
                packing.spaces.splice(iSpace, 1);
                packing.spaces.push(...breakUpSpace(space, placement));

                packed = true;
                items.splice(iItem, 1);
                await debugAs('Packed', placement);
                await debugAs('Log', 'Item packed successfully in Space ' + iSpace + ' of Packing ' + iPacking);
                break;
            }
        }

        if( packed ){
            continue;
        }

        // Can't fit in any of the spaces for the current packings so lets try a new space the size of the container
        /** @type {Space} */
        let space = {
            dimensions: container.dimensions.sort(rnsort),
            position: [0, 0, 0]
        };

        let placement = place(item, space);

        // If it can't be placed in this space, then it's just too big for the container and we should abandon hope
        if( !placement ){
            unpacked.push(...items.splice(iItem, 1));
            await debugAs('Log', 'Placing item of dimensions' + str(item.dimensions) + ' abandoned');
            continue;
        }

        // Otherwise lets put the item in a new packing and break up the remaing free space around it
        /** @type {Packing} */
        let packing = {
            placements: [placement],
            weight: item.weight,
            spaces: breakUpSpace(space, placement)
        };
        packings.push(packing);
        items.splice(iItem, 1);
        await debugAs('Packed', placement);
        await debugAs('Log', 'Item packed successfully in new Space.');
    }

    return {
        packings,
        unpacked
    };
}

function almost(n1, n2){
    return Math.abs(n1 - n2) < .01;
}

/** 
 * @param {Array<Number>} packedDimensions
 * @param {Array<Number>} itemDimensions
 * @returns {string} - axis order (xyz, xzy, yxz, yzx, zxy or zyx)
 */
function resolveOrientation(packedDimensions, itemDimensions){
    var pw = packedDimensions[0],
        ph = packedDimensions[1],
        w = itemDimensions[0],
        h = itemDimensions[1],
        l = itemDimensions[2];
    if(almost(pw, w)){ // x
        if(almost(ph, h)){ // y
            return 'xyz';
        }
        else if(almost(ph, l)){ // z
            return 'xzy';
        }
    }
    else if(almost(pw, h)){ // y
        if(almost(ph, w)){ // x
            return 'yxz';
        }
        else if(almost(ph, l)){ // z
            return 'yzx';
        }
    }
    else if(almost(pw, l)){ // z
        if(almost(ph, w)){ // x
            return 'zxy';
        }
        else if(almost(ph, h)){ // y
            return 'zyx';
        }
    }
    return 'xyz';
}

export {
    pack,
    resolveOrientation,
    setDebugMatrix
};