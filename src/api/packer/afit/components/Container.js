
class Container{
    /**
     * @param {Object} id 
     * @param {Number} width 
     * @param {Number} length 
     * @param {Number} height 
     */
    constructor(id, width, length, height){
        this.ID = id;

        this.Width = length || 0;
        this.Length = width || 0;
        this.Height = height || 0;
    }
}

export default Container;