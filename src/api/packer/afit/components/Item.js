
function almost(n1, n2){
    return Math.abs(n1 - n2) < .01;
}

class Item{
    /**
     * @param {Object} id 
     * @param {Number} dim1 
     * @param {Number} dim2 
     * @param {Number} dim3 
     * @param {Number} quantity 
     */
    constructor(id, dim1, dim2, dim3, quantity){
        this.ID = id;
        this.IsPacked = false;
        this.Dim1 = dim2;
        this.Dim2 = dim1;
        this.Dim3 = dim3;
        this.CoordX = 0;
        this.CoordY = 0;
        this.CoordZ = 0;
        this.Quantity = quantity;
        this.PackDimX = 0;
        this.PackDimY = 0;
        this.PackDimZ = 0;
        this.Volume = this.Dim1 * this.Dim2 * this.Dim3;
    }

    /** 
     * @param {Item} item
     * @returns {string} - axis order (xyz, xzy, yxz, yzx, zxy or zyx)
     */
    static ResolveOrientation(item){
        var w = item.Dim1, l = item.Dim2, h = item.Dim3;

        if(almost(item.PackDimX, w)){ // x
            if(almost(item.PackDimY, h)){ // y
                return 'xyz';
            }
            else if(almost(item.PackDimY, l)){ // z
                return 'xzy';
            }
        }
        else if(almost(item.PackDimX, h)){ // y
            if(almost(item.PackDimY, w)){ // x
                return 'yxz';
            }
            else if(almost(item.PackDimY, l)){ // z
                return 'yzx';
            }
        }
        else if(almost(item.PackDimX, l)){ // z
            if(almost(item.PackDimY, w)){ // x
                return 'zxy';
            }
            else if(almost(item.PackDimY, h)){ // y
                return 'zyx';
            }
        }

        return 'xyz';
    }
}

export default Item;