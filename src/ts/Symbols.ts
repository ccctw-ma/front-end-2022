/*
 * @Author: msc
 * @Date: 2022-07-15 00:21:46
 * @LastEditTime: 2022-07-18 22:12:52
 * @LastEditors: msc
 * @Description: 
 */

(() => {
    let sym1 = Symbol();
    let sym2 = Symbol("key");
    let sym3 = Symbol("key");
    console.log(sym2 === sym3);
    let a: any = {};
    a[Symbol.toStringTag] = (): string => {
        return "Hello symbol"
    }
    // console.log(Object.prototype.toString());
    let pets: Set<number | string> = new Set(['cat', 2, '3'])

    pets[Symbol.iterator] = function* () {
        yield 1;
        yield 2;
        yield 3;
    }
    for (let p of pets) {
        console.log(p);
    }

    console.log("Hello world");


});

export = "Hello world";