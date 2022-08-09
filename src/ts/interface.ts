/*
 * @Author: msc
 * @Date: 2022-02-22 23:38:10
 * @LastEditTime: 2022-08-05 00:10:16
 * @LastEditors: msc
 * @Description: 接口
 */

interface LabelledValue {
    size?: number; //可选属性
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
printLabel({ size: 10, label: "Size 10 Object" })

//只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 20, y: 20 };
// p1.x = 5; Cannot assign to 'x' because it is a read-only property
let ro: ReadonlyArray<number> = [1, 2, 3, 4];
// ro[0] = 1; error
// ro.push(5); error
// ro.length = 100; error


//函数类型
interface SearchFunc {
    (source: string, subString: string): boolean;
}
//函数的参数名不需要与接口里定义的名字相匹配
const mySearch: SearchFunc = function (source: string, subString: string) {
    let res = source.search(subString);
    return res > -1;
}

//可索引的类型
interface StringArray {
    [index: number]: string;
}
let myArray: StringArray = ["Bolb", "Fred"];
let myStr: string = myArray[0];
console.log(myStr);


interface NumberDictionary {
    [index: string]: number;
    length: number;
    name: number;
}

//类类型
// interface ClockInterface {
//     currentTime: Date;
// }
// class Clock implements ClockInterface {
//     currentTime: Date = new Date();
//     constructor(h: number, m: number) {

//     }
// }


interface ClockConstructor {
    new(hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): any;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);


//继承接口
interface Shape {
    color: string;
}
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number;
}
let square = <Square>{};
square.color = "blue";
square.penWidth = 10;
square.sideLength = 5.0;

//混合类型
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}
function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = () => { };
    return counter;
}
let cc = getCounter();
cc(10);
cc.reset();
cc.interval = 5.0



