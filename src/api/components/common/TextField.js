class TextField {
    /**
     * @param {string} label 
     * @param {string} content 
     */
    constructor(label, content){
        /**
         * @type {string}
         */
        this.label = label;
        /**
         * @type {string}
         */
        this.content = content;
    }

    /**
     * @param {TextField} field 
     */
    Copy(field){
        this.label = field.label;
        this.content = field.content;
    }

    Clone(){
        var field = new TextField(this.label, this.content);
        return field;
    }

    static get defaultContent(){
        return '-';
    }
}

export default TextField;