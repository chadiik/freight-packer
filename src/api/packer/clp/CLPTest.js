import { ThisWorkbook, Cells } from "./Workbook";

var solverSheet = ThisWorkbook.Worksheets('CLP Solver Console');
var itemsSheet = ThisWorkbook.Worksheets('1.Items');
var containersSheet = ThisWorkbook.Worksheets('2.Containers');
var solutionSheet = ThisWorkbook.Worksheets('3.Solution');

const noYes = ['No', 'Yes'];
const sortCriterion = [null, 'Volume', 'Weight', 'MaxDim'];

/** @type {import('./CLPSolver').SolverOptions} */
const solverOptions = {
    itemSortCriterion: 1,
    showProgress: false,
    cpuTimeLimit: 3
};

// First-Fit-Decreasing based on:
solverSheet.Cells(12, 3, sortCriterion[solverOptions.itemSortCriterion]);
// Show progress on status bar?
solverSheet.Cells(13, 3, noYes[Number(solverOptions.showProgress)]);
// CPU time limit (seconds)
solverSheet.Cells(14, 3, solverOptions.cpuTimeLimit);

// Front side support required?
solverSheet.Cells(6, 3, noYes[0]);

function packPriority(p){
    switch(p){
        case 1: return 'Must be packed';
        case 0: return 'May be packed';
        case -1: return 'Don\'t pack';
    }
}
function fillPriority(p){
    switch(p){
        case 1: return 'Must be used';
        case 0: return 'May be used';
        case -1: return 'Do not use';
    }
}

var containersDataSrc = [
    { ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102 }
];
var containersData = [];
var itemsDataSrc = [
    { ID: 1001, Name: 'Item1', Length: 100,  Width: 70, Height: 90, Quantity: 3 },
    { ID: 1002, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7 },
    { ID: 1003, Name: 'Item5', Length: 40, Width: 20, Height: 30, Quantity: 4 },
    { ID: 1004, Name: 'Item6', Length: 30,  Width: 20, Height: 30, Quantity: 20 }
];
var itemsData = [];

var numItems = itemsDataSrc.length;
// Number of types of items
solverSheet.Cells(2, 3, numItems);

for(var i = 1; i <= numItems; i++){
    let item = itemsDataSrc[i - 1];

    let volume = item.Length * item.Width * item.Height;

    /** @type {import('./CLPSolver').ItemData} */
    let itemData = {
        length: item.Length,
        width: item.Width,
        height: item.Height,
        xyRotatable: true,
        yzRotatable: true,
        mandatory: 1,
        profit: 0,
        weight: volume / 1000,
        quantity: item.Quantity
    };
    itemsData.push(itemData);
    continue;
    // 1 id, 2 name, 4 width, 5 height, 6 length, 7 volume, 9 xy, 10 yz, 11 weight, 12 packPriority = MustBePacked, 13 profit = 0, 14 quantity

    itemsSheet.Cells(2 + i, 1, i);
    itemsSheet.Cells(2 + i, 2, item.ID);

    itemsSheet.Cells(2 + i, 4, itemData.width);
    itemsSheet.Cells(2 + i, 5, itemData.height);
    itemsSheet.Cells(2 + i, 6, itemData.length);
    itemsSheet.Cells(2 + i, 7, volume);

    itemsSheet.Cells(2 + i, 9, noYes[Number(itemData.xyRotatable)]);
    itemsSheet.Cells(2 + i, 10, noYes[Number(itemData.yzRotatable)]);

    itemsSheet.Cells(2 + i, 11, itemData.weight);

    itemsSheet.Cells(2 + i, 12, packPriority(itemData.mandatory));

    itemsSheet.Cells(2 + i, 13, itemData.profit);
    
    itemsSheet.Cells(2 + i, 14, itemData.quantity);
}

var numContainers = containersDataSrc.length;
// Number of types of containers
solverSheet.Cells(4, 3, numContainers);
for(var i = 1; i <= numContainers; i++){
    let container = containersDataSrc[i - 1];

    let volume = container.Width * container.Height * container.Length;

    /** @type {import('./CLPSolver').ContainerData} */
    let containerData = {
        length: container.Length,
        width: container.Width,
        height: container.Height,
        quantity: 1,
        mandatory: 1,
        cost: 0,
        weightCapacity: volume / 1000
    };
    containersData.push(containerData);
    continue;
    // 1 id, 2 name, 3 width, 4 height, 5, length, 6 volume_capacity, 7 weight_capacity, 8 fillPriority = 1, 9 cost = 1, 10 quantity

    containersSheet.Cells(1 + i, 1, i);
    containersSheet.Cells(1 + i, 2, container.ID);

    containersSheet.Cells(1 + i, 3, containerData.width);
    containersSheet.Cells(1 + i, 4, containerData.height);
    containersSheet.Cells(1 + i, 5, containerData.length);
    containersSheet.Cells(1 + i, 6, volume);

    containersSheet.Cells(1 + i, 7, containerData.weightCapacity);

    containersSheet.Cells(1 + i, 8, fillPriority(containerData.mandatory));

    containersSheet.Cells(1 + i, 9, containerData.cost);

    containersSheet.Cells(1 + i, 10, containerData.quantity);
}

solutionSheet.Cells(1, 'B').calculate = () => { return Math.abs(solutionSheet.Cells(4, 'J').Value); }; // =+$J$4
solutionSheet.Cells(4, 'G').calculate = () => { return solutionSheet.Sum(solutionSheet.Cells(6, 'G'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'G')); }; // =SUM($G$6:$G$39)
solutionSheet.Cells(4, 'H').calculate = () => { return solutionSheet.Sum(solutionSheet.Cells(6, 'H'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'H')); }; // =SUM($H$6:$H$39)
solutionSheet.Cells(4, 'I').calculate = () => { return solutionSheet.Sum(solutionSheet.Cells(6, 'I'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'I')); }; // =SUM($I$6:$I$39)
solutionSheet.Cells(4, 'J').calculate = () => { return solutionSheet.Sum(solutionSheet.Cells(6, 'J'), solutionSheet.Cells(6 + solutionSheet.Cells(3, 'B'), 'J')); }; // =SUM($J$6:$J$39)

for(var i = 1; i <= 100/*solutionSheet.Cells(3, 'B')*/; i++){
    solutionSheet.Cells(5 + i, 'G').calculate = () => {
        let itemName = solutionSheet.Cells(6, 'B').Value;
        return itemsSheet.Cells(itemsSheet.Find(itemName).row, 1).Value;
    }; // itemIndex
    
    solutionSheet.Cells(5 + i, 'H').calculate = () => { return itemsSheet.Cells(2 + solutionSheet.Cells(5 + i, 'G'), 7).Value }; // volume
    solutionSheet.Cells(5 + i, 'I').calculate = () => { return itemsSheet.Cells(2 + solutionSheet.Cells(5 + i, 'G'), 11).Value }; // weight
    solutionSheet.Cells(5 + i, 'J').calculate = () => { return itemsSheet.Cells(2 + solutionSheet.Cells(5 + i, 'G'), 13).Value }; // profit
}

console.log('CLP setup complete');
console.log(ThisWorkbook);

const CLPSolver = require('./CLPSolver');

const test1Data = {
    solverOptions: solverOptions,
    items: itemsData,
    container: containersData[0]
};

function Test1(){

    /** @param {CLPSolver.SolutionData} solution */
    function onSolution(solution){
        console.log(solution);
        let packedItems = solution.container.filter(container => container !== null)[0].items;
        console.log(packedItems);
    }
    CLPSolver.signaler.On(CLPSolver.signals.solution, onSolution);
    CLPSolver.Execute(test1Data.solverOptions, test1Data.items, [test1Data.container]);

}

export {
    Test1,
    test1Data
}