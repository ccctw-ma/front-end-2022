"use strict";
/**
 * 泛型
 * @param arg
 * @returns
 */
function identity3(arg) {
    return arg;
}
function identity2(arg) {
    return arg;
}
function identity(arg) {
    return arg;
}
let outPut = identity("Hello world!");
console.log(outPut);
function loggingIdentity(arg) {
    console.log(arg.length);
    return arg;
}
let myIdentity = identity;
/**
 * genericClass
 */
class GenericNumber {
}
let myGenericNumber = new GenericNumber();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) { return x + y; };
