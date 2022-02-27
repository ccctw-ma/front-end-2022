"use strict";
// 基础类型
let isDone = false;
console.log(isDone);
let decLiteral = 6;
let hexLiteral = 0xf00d;
let binaryLiteral = 0b1010;
let octalLiteral = 0o744;
// @ts-ignore
let name = `Gene`;
let age = 37;
let sentence = `Hello, my name is ${name}.

I'll be ${age + 1} years old next month.`;
// console.log(sentence)
let list = [1, 2, 3];
list.map(item => 1);
// console.log(list)
//元组Tuple
let x;
x = ["hello", 22];
console.log(x[0].substring(0, 2));
//枚举
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
let c = Color.Blue;
console.log(c === Color.Blue);
//Any
let list2 = [1, true, "Hello world", [1, 2, 3]];
console.log(list2[2]);
//Void
(function warnUser() {
    console.log("This is my warning message");
})();
// null undefinded
let u = undefined;
let n = null;
// never
const err = (message) => {
    throw new Error(message);
};
// err("Hello typeScript");
//类型断言 就像java里的类型转换
let someValue = "this is a string";
let strLength = someValue.length;
console.log(strLength, someValue.length);
