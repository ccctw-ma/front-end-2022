// Object

Object.prototype.print = ()=>{
    console.log('233');
}

// let a = new Object();
// a.print()

let obj = {}
let value = new Object(obj)
console.log(obj===value);

var a = ['Hello', 'World'];

console.log(Object.keys(a));// ["0", "1"]
console.log(Object.getOwnPropertyNames(a)); // ["0", "1", "length"]