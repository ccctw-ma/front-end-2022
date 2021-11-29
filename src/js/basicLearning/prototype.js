let obj = {};
let p = {};
obj.__proto__ = p;
console.log(Object.getPrototypeOf(obj)===p);

console.log(Object.getOwnPropertyNames(Date));

function copyObject(ori){
    return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj)
    )
}