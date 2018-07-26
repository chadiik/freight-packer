import Config from "../utils/cik/config/Config";
import AFitTest from "../packer/afit/AFitTest";
import Pool from "../utils/cik/Pool";

function testConfig(){
    var obj;
    obj = {
        prop1: '1',
        prop2: '2',
        child: {
            prop: 'child object'
        },
        fn: function(){
            console.log('prop1:' + obj.prop1 + ', prop2:' + obj.prop2);
        }
    };

    var config = new Config(obj);
    config.Track('prop1', 'prop2', 'fn', 'child.prop');

    var onGUIChanged = function(){
        console.log(obj, 'changed');
    };
    config.Edit(onGUIChanged, 'obj', undefined);

    console.log(config.gui.list);
}

function testAFit(){
    var test = new AFitTest();
    var data = AFitTest.GenerateDataSample1();
    var result = test.T1(data.container, data.items);
    console.group('AFit packing', data);
    console.log(result);
    console.groupEnd();

}

function testPool(){

    function newFN(){
        var obj = {life: 0};
        return obj;
    }
    /**
     * @typedef Living
     * @property {Number} life
     * @param {Living} obj
     */
    function resetFN(obj){
        obj.life++;
        return obj;
    }
    
    var pool = new Pool(newFN, resetFN);

    var obj = pool.Request();
    console.group('Pool test');
    console.group('var obj = pool.Request();');
    console.log('pool', pool);
    console.log('obj', obj);
    console.groupEnd();

    pool.Return(obj);
    console.group('pool.Return(obj);');
    console.log('pool', pool);
    console.log('obj', obj);
    console.groupEnd();

    obj = pool.Request();
    console.group('obj = pool.Request();');
    console.log('pool', pool);
    console.log('obj', obj);
    console.groupEnd();

    console.groupEnd();
}

export {
    testConfig,
    testAFit,
    testPool
};