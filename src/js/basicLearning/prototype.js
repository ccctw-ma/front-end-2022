let obj = {};
let p = {};
obj.__proto__ = p;
console.log(Object.getPrototypeOf(obj) === p);

console.log(Object.getOwnPropertyNames(Date));

function copyObject(ori) {
    return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj)
    )
}

console.log(Object.prototype.toString);
console.log(Function.prototype.toString);


console.log(Function.prototype.toString.call((a, b, ...c) => {
    return a + b + c
}));