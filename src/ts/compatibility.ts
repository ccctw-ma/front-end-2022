/*
 * @Author: msc
 * @Date: 2022-07-07 00:49:25
 * @LastEditTime: 2022-07-08 22:10:07
 * @LastEditors: msc
 * @Description: 
 */

interface Named {
    name: string;
}

class Person {
    constructor(name: string) {
        this.name = name
    }
    name: string
}

let p: Named;
p = new Person('233');

// let xxx: Named;
// let yy = { name: "Tony", location: "BeiJing" };
// xxx = yy;


// 对于函数的赋值的过程中参数的忽略是可以进行的
let xxx = (a: number) => 0;
let yy = (b: number, s: string) => 0;
yy = xxx;
// xxx = yy;
// let x = () => ({name: 'Alice'});
// let y = () => ({name: 'Alice', location: 'Seattle'});

// x = y; // OK
// y = x; // Error, because x() lacks a location property