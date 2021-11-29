/* 
 value: 123,
    writable: false,
    enumerable: true,
    configurable: false,
    get: undefined,
    set: undefined
*/


var obj1 = { p: 'a' };

console.log(Object.getOwnPropertyDescriptor(obj1, 'p'));

let obj2 = Object.defineProperties({}, {
    p1: { value: 1, enumerable: true },
    p2: { value: 2, enumerable: false }
})
//这跟Object.keys的行为不同，Object.keys只返回对象自身的可遍历属性的全部属性名。
console.log(Object.getOwnPropertyNames(obj2));
console.log(Object.getOwnPropertyNames(Object.prototype));


let obj3 = Object.defineProperty({}, 'p', {
    get: () => {
        return 'getter'
    },
    set: (value) => {
        console.log(`set:${value}`);
    }
})

console.log(obj3.p);
obj3.p = 3

var extend = function (to, from) {
    for (var property in from) {
        if (!from.hasOwnProperty(property)) continue;
        Object.defineProperty(
            to,
            property,
            Object.getOwnPropertyDescriptor(from, property)
        );
    }
    return to;
}

console.log(extend({}, { get a() { return 1 } }));

let obj4 = new Object()
console.log(Object.isExtensible(obj4));
Object.preventExtensions(obj4);
console.log(Object.isExtensible(obj4));
obj4['p'] = 4;
Object.freeze(obj4)
delete obj4.p
console.log(obj4.p);