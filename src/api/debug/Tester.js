import Config from "../utils/cik/config/Config";
import AFitTest from "../packer/afit/AFitTest";

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
    var data = AFitTest.GenerateDataRandom1();
    var result = test.T1(data.container, data.items);
    console.group('AFit packing', data);
    console.log(result);
    console.groupEnd();

}

export {
    testConfig,
    testAFit
};