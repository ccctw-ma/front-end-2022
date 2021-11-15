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

Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]