console.log(JSON.stringify(false));

let arr = [undefined, function () { }]
console.log(JSON.stringify(arr));

var obj = {
    'prop1': 'value1',
    'prop2': 'value2',
    'prop3': 'value3'
};

var selectedProperties = ['prop1', 'prop2'];

console.log(JSON.stringify(obj, selectedProperties));