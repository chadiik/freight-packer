
class Item{
    constructor(ID, Dim1, Dim2, Dim3, Quantity){
        this.ID = ID;
        this.IsPacked = false;
        this.Dim1 = Dim1;
        this.Dim2 = Dim2;
        this.Dim3 = Dim3;
        this.CoordX = 0;
        this.CoordY = 0;
        this.CoordZ = 0;
        this.Quantity = Quantity;
        this.PackDimX = 0;
        this.PackDimY = 0;
        this.PackDimZ = 0;
        this.Volume = this.Dim1 * this.Dim2 * this.Dim3;
    }
}

export default Item;