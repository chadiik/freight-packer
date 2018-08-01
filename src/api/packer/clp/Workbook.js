import Signaler from "../../utils/cik/Signaler";

const typeofString = 'string';
var colLabels = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const signals = {
    updated: 'u'
};

class CellEntry /*extends Signaler*/{
    constructor(value){
        this.Value = value;
        this.col = 0;
        this.row = 0;

        /** @type {Function} */
        this.calculate = undefined;
    }

    get Value(){
        if(this.calculate)
            this._value = this.calculate();
        return this._value;
    }
    set Value(value){
        this._value = value;
        //this.Dispatch(signals.updated, this);
    }

    get Select(){
        console.log('Select: ', this.Value);
    }

    toString(){
        return this.Value.toString();
    }

    static get signals(){
        return signals;
    }
}

/**
 * 
 * @param {Number} row 
 * @param {Number} col 
 * @param {*} [value]
 */
function Cells(row, col, value){
    return new CellEntry('default');
}

/** @type {Worksheet} */
var active;

class Worksheet{
    /** @param {string} label */
    constructor(label){
        this.label = label.toLowerCase();
        /** @type {Map<Number, Map<Number, CellEntry>>} */
        this.data = new Map();

        this.cellsFN = this.Cells.bind(this);
    }

    /**
     * 
     * @param {CellEntry} cell1 
     * @param {CellEntry} cell2 
     */
    Sum(cell1, cell2){
        var cells = Range(cell1, cell2).cells;
        var total = 0;
        cells.forEach(cell => {
            let value = Number.parseFloat(cell.Value);
            if(!isNaN(value))
                total += value;
        });
        return total;
    }

    get Activate(){
        active = this;
        Cells = this.cellsFN;
    }

    Cells(row, col, value){
        if(typeof col === typeofString) col = colLabels.indexOf(col);

        if(!this.data.has(row) || !this.data.get(row).has(col)){
            if(!this.data.has(row))
                this.data.set(row, new Map());
            
            let newEntry = new CellEntry(0);
            newEntry.row = row;
            newEntry.col = col;
            this.data.get(row).set(col, newEntry);
        }
        
        if(value)
            this.data.get(row).get(col).Value = value;
        
        return this.data.get(row).get(col);
    }

    Find(value){
        for(var row of this.data.values()){
            for(var cell of row.values()){
                if(cell.Value === value){
                    return cell;
                }
            }
        }
    }

    Print(){
        console.group(this.label);
        var rows = [];
        for(var [row, rowData] of this.data){
            let rowResult = [row + ':'];
            for(var [col, colData] of rowData){
                rowResult.push(colData.Value);
            }
            rows[row] = rowResult;
        }
        
        rows.forEach(row => {
            console.log(...row);
        });
        console.groupEnd();
    }
}

class Workbook{
    constructor(){
        /** @type {Map<string, Worksheet>} */
        this.worksheets = new Map();
    }

    /** @param {Worksheet} worksheet */
    Add(worksheet){
        this.worksheets.set(worksheet.label.toLowerCase(), worksheet);
    }

    /** @param {string} label */
    Worksheets(label){
        return this.worksheets.get(label.toLowerCase());
    }

    Print(){
        for(var worksheet of this.worksheets.values()){
            worksheet.Print();
        }
    }

    get print(){
        this.Print();
    }
}

var solverSheet = new Worksheet('CLP Solver Console');
var itemsSheet = new Worksheet('1.Items');
var containersSheet = new Worksheet('2.Containers');
var solutionSheet = new Worksheet('3.Solution');

var ThisWorkbook = new Workbook();
ThisWorkbook.Add(solverSheet);
ThisWorkbook.Add(itemsSheet);
ThisWorkbook.Add(containersSheet);
ThisWorkbook.Add(solutionSheet);

/**
 * @param {string} label 
 * @returns {Boolean}
 */
function CheckWorksheetExistence(label){
    return ThisWorkbook.Worksheets(label) !== undefined;
}

class CellsRange{
    constructor(){
        /** @type {Array<CellEntry>} */
        this.cells = [];        
    }

    set Value(value){
        this.cells.forEach(cell => {
            cell.Value = value;
        });
    }

    get Clear(){
        this.cells.forEach(cell => {
            cell.Value = null;
        });
    }

    get ClearContents(){
        this.Clear;
    }
}

var _range = new CellsRange();

/**
 * @param {CellEntry} cell1 
 * @param {CellEntry} cell2 
 */
function Range(cell1, cell2){
    var minCol = Math.min(cell1.col, cell2.col);
    var maxCol = Math.max(cell1.col, cell2.col);
    var minRow = Math.min(cell1.row, cell2.row);
    var maxRow = Math.max(cell1.row, cell2.row);

    _range.cells.length = 0;
    for(var c = minCol; c < maxCol; c++){
        for(var r = minRow; r < maxRow; r++){
            _range.cells.push(Cells(r, c));
        }
    }

    return _range;
}

class Application{

    static set StatusBar(value){
        console.log(value);
    }

    static set ScreenUpdating(value){

    }

    static Alert(msg){
        console.log('CLP alert:', msg);
    }

    static Confirm(msg, defaultValue){
        console.log('CLP confirm (' + defaultValue + '):', msg);
        return defaultValue;
    }
}

export {
    ThisWorkbook, Cells, CheckWorksheetExistence, Range, Application
};