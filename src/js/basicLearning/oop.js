

let Person = function () {
    this.name = 'msc'
}

let p = new Person();
console.log(p.name);


// console.log([1,2,3].unshift(1));



let obj = {
    foo: function () {
        console.log(this);
    }
};

// obj.foo()
// (false|| obj.foo)()
// (1, obj.foo)() // window

var o = {
    f1: function () {
        console.log(this);
        var f2 = function () {
            console.log(this);
        }();
    }
}

o.f1()


var obj1 = {

    n: 1
};
let n = 123
var f = function () {
    return this;
};

console.log(f()); // true
console.log(f.call(obj1) === obj1); // true


function a() {
    console.log(this.n);
}

a.call(obj1);
a.call()

console.log(Object.prototype.hasOwnProperty.call(obj, 'toString'));

console.log(Math.max.apply(null, [1, 2, 2, 5, 6, 2]));

let counter = {
    count: 0,
    inc: function () {
        this.count++;
    }
}

let func = counter.inc.bind(counter);
func()
console.log(counter.count);