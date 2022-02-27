"use strict";
/*
 * @Author: msc
 * @Date: 2022-02-22 23:38:10
 * @LastEditTime: 2022-02-23 00:35:54
 * @LastEditors: msc
 * @Description: 接口
 */
function printLabel(labelledObj) {
    console.log(labelledObj.label);
}
printLabel({ size: 10, label: "Size 10 Object" });
let p1 = { x: 20, y: 20 };
// p1.x = 5; Cannot assign to 'x' because it is a read-only property
let ro = [1, 2, 3, 4];
//函数的参数名不需要与接口里定义的名字相匹配
const mySearch = function (source, subString) {
    let res = source.search(subString);
    return res > -1;
};
let myArray = ["Bolb", "Fred"];
let myStr = myArray[0];
console.log(myStr);
function createClock(ctor, hour, minute) {
    return new ctor(hour, minute);
}
class DigitalClock {
    constructor(h, m) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock {
    constructor(h, m) { }
    tick() {
        console.log("tick tock");
    }
}
let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
let square = {};
square.color = "blue";
square.penWidth = 10;
square.sideLength = 5.0;
function getCounter() {
    let counter = function (start) { };
    counter.interval = 123;
    counter.reset = () => { };
    return counter;
}
let cc = getCounter();
cc(10);
cc.reset();
cc.interval = 5.0;
