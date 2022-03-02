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


function Cat(name, color) {
    this.name = name;
    this.color = color;
    this.meow = function () {
        console.log("miao");
    }
}

let c1 = new Cat("1", '2');
let c2 = new Cat("1", '2');
console.log(c1.meow === c2.meow);
console.log(c1.constructor());