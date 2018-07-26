
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
}

export default Item;