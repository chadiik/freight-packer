import Item from "./components/Item";
import Container from "./components/Container";


/**
 * @param {Array<Object>} objects 
 * @param {Array<string>} m - mapping to Item.constructor, ie: [ID, Length, ...]
 */
function toItems(objects, m){
    var items = [];
    objects.forEach(o => {
        items.push(new Item(o[m[0]], o[m[1]], o[m[2]], o[m[3]], o[m[4]]));
    });
    return items;
}

class TestData{
    /**
     * @param {Container} container 
     * @param {Array<Item>} items 
     */
    constructor(container, items){
        this.container = container;
        this.items = items;
    }
}

class AFitTest{

    static GenerateDataSample1(){
        var containerData = { ID: 1000, Name: 'Box1', Length: 15, Width: 13, Height: 9 };
        var itemsData = [
            { ID: 1000, Name: 'Item1', Length: 5,  Width: 4, Height: 2, Quantity: 1 },
		    { ID: 1001, Name: 'Item2', Length: 2,  Width: 1, Height: 1, Quantity: 3 },
		    { ID: 1002, Name: 'Item3', Length: 9,  Width: 7, Height: 3, Quantity: 4 },
		    { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 8 },
		    { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 1 },
            { ID: 1005, Name: 'Item6', Length: 3,  Width: 3, Height: 2, Quantity: 2 }
        ];

        var container = Object.assign(new Container(), containerData);
        var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

        var data = new TestData(container, items);
        return data;
    }

    static GenerateDataSample2(){
        var containerData = { ID: 1000, Name: 'Box1', Length: 60, Width: 35, Height: 25 };
        var itemsData = [
            { ID: 1000, Name: 'Item1', Length: 30,  Width: 50, Height: 20, Quantity: 1 },
		    { ID: 1003, Name: 'Item4', Length: 13, Width: 6, Height: 3, Quantity: 6 },
		    { ID: 1004, Name: 'Item5', Length: 17, Width: 8, Height: 6, Quantity: 3 },
            { ID: 1005, Name: 'Item6', Length: 5,  Width: 5, Height: 2, Quantity: 16 }
        ];

        var container = Object.assign(new Container(), containerData);
        var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

        var data = new TestData(container, items);
        return data;
    }

    static GenerateDataSampleFlatdeck(){
        var containerData = { ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102 };
        var itemsData = [
            { ID: 1000, Name: 'Item1', Length: 100,  Width: 70, Height: 90, Quantity: 3 },
		    { ID: 1003, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7 },
		    { ID: 1004, Name: 'Item5', Length: 40, Width: 20, Height: 30, Quantity: 4 },
            { ID: 1005, Name: 'Item6', Length: 30,  Width: 20, Height: 30, Quantity: 20 }
        ];

        var container = Object.assign(new Container(), containerData);
        var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

        var data = new TestData(container, items);
        return data;
    }

    static GenerateDataSampleFlatdeck2(){
        var containerData = { ID: 1000, Name: 'Box1', Length: 576, Width: 102, Height: 102, WeightCapacity: 48000 };
        var itemsData = [
            { ID: 1000, Name: 'Item1', Length: 100,  Width: 70, Height: 90, Quantity: 3 },
		    { ID: 1003, Name: 'Item4', Length: 60, Width: 60, Height: 60, Quantity: 7, StackingCapacity: 0 },
		    { ID: 1004, Name: 'Item5', Length: 40, Width: 28, Height: 30, Quantity: 4 },
            { ID: 1005, Name: 'Item6', Length: 30,  Width: 23, Height: 34, Quantity: 20 },
            { ID: 1005, Name: 'Item6', Length: 45,  Width: 20, Height: 30, Quantity: 30 },
            { ID: 1005, Name: 'Item6', Length: 35,  Width: 22, Height: 18, Quantity: 27 }
        ];

        var container = Object.assign(new Container(), containerData);
        var items = toItems(itemsData, ['ID', 'Length', 'Width', 'Height', 'Quantity']);

        var data = new TestData(container, items);
        return data;
    }
}

export default AFitTest;