class TextField {
    constructor(label, content){
        this.label = label;
        this.content = content;
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