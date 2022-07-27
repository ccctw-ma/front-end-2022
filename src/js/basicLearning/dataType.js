/**
 * @Author: msc
 * @Date: 2022-06-25 15:55:18
 * @LastEditTime: 2022-06-27 00:55:28
 * @LastEditors: msc
 * @Description:
 */

// 1、typeof
// console.log(typeof 42); //number
// console.log(typeof "Hello world"); // string
// console.log(typeof undefined); // undefined
// console.log(typeof false); // boolean
// console.log(typeof BigInt(2131233719287391273912n)); // bigint
// console.log(typeof Symbol('1232')); // symbol
// console.log(typeof null);  // object
// console.log(typeof [1, 2, 3]); // object
// console.log(typeof { a: 1 });
// console.log(typeof new Set());
// console.log(typeof /[1-10]/i);
// console.log(typeof function(){}); // function
// console.log(typeof Object);
// console.log(typeof Map);

// 2、instanceof
// let num = 1;
// console.log(num instanceof Number); // false
// console.log("hello" instanceof String);
// console.log(false instanceof Boolean);
// console.log(undefined instanceof undefined); instanceof 右边必须是对象
// console.log(123123812739871293712987n instanceof BigInt);
// console.log(Symbol(12) instanceof Symbol);
// console.log([1, 2, 3] instanceof Array); // true
// console.log([1, 2, 3] instanceof Object);
// console.log(new Map() instanceof Map);

// 3、constructor
// let num = 1;
// console.log(num.constructor); // [Function: Number]
// console.log(true.constructor); // [Function: Boolean]
// console.log("".constructor); // [Function: String]
// console.log(function () {}.constructor); // [Function: Function]
// console.log([1, 2, 3].constructor); // [Function: Array]
// console.log({}.constructor); // [Function: Object]
// null 和 undefined 不是由对象构建。
//数字、布尔值、字符串是包装类对象，所以有constructor
// let n = null;
// console.log(n.constructor);

// 4、Object.prototype.toString.call

// const toString = Object.prototype.toString;
// console.log(toString.call(1)); // [object Number]
// console.log(toString.call(true)); // [object Boolean]
// console.log(toString.call("")); // [object String]
// console.log(toString.call(null)); // [object Null]
// console.log(toString.call(undefined)); // [object Undefined]
// console.log(toString.call(21321312312312n)); // [object BigInt]
// console.log(toString.call(Symbol(10))); // [object Symbol]
// console.log(toString.call([])); // [object Array]
// console.log(toString.call({})); // [object Object]
// console.log(toString.call(() => {})); // [object Function]
// console.log(toString.call(new Date())); // [object Date]
// console.log(toString.call(/[1-10]/gi)); // [object RegExp]
// console.log(toString.call(new Error())); // [object Error]
// console.log(toString.call(new Map())); // [object Map]
// console.log(toString.call(new Set())); // [object Set]

// ((...res) => {
//   console.log(toString.call(arguments)); // [Object Arguments]
//   console.log(toString.call(res)); // [object Array]
//   //   console.log(...arguments);
//   //   console.log(res);
// })(1, 2, 3, 4);

// console.log([1, [1, [1, [1, [1, 2, [3]]]]]].toString());

// let arr = [1, 2, 3];
// console.log(Array.prototype.hasOwnProperty("toString"));
// console.log(arr.toString());
// delete Array.prototype.toString;
// console.log(Array.prototype.hasOwnProperty("toString"));
// console.log(arr.toString());


let num = 1;
let n = new Number(1);
console.log(1 instanceof Number);
console.log(typeof Number);
console.log(1..__proto__ === Number.prototype);
console.log(Number.prototype);
console.log(n instanceof Number);
console.log(Object.prototype.toString.call(new Number()));
console.log(Object.prototype.toString.call());

console.log(typeof Promise.resolve().then);
console.log(void 0 === undefined);