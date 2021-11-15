let test01 = {
    a: 1,
    b: 2,
    c: 3
}

console.log([...Object.keys(test01)].length);

var obj = {
    p1: 1,
    p2: 2,
};
with (obj) {
    p1 = 4;
    p2 = 5;
}
console.log(obj);

if (true) {
    var x = 5;
}

console.log(x);

// 函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其声明时所在的作用域，与其运行时所在的作用域无关。


let objtest02 = { a: 1 }
function f(o) {
    o.a = 2;
}
f(objtest02)
console.log(objtest02.a);

var f = function () {
    console.log(arguments.callee === f);
}

