/**
 * @Author: msc
 * @Date: 2022-06-07 14:13:06
 * @LastEditTime: 2022-06-08 10:19:53
 * @LastEditors: msc
 * @Description: 
 */
// instanceof

const myInstanceOf = (tar, ori) => {
    while (tar) {
        if (tar.__proto__ === ori.prototype) {
            return true;
        }
        tar = tar.__proto__
    }
    return false;
}
let a = [1, 2, 3];
console.log(a.__proto__);
console.log(myInstanceOf(a, Array));
console.log(myInstanceOf(a, Object));

// map
Array.prototype.myMap = function (fn, thisArg) {
    let res = [];
    thisArg = thisArg || []
    let arr = this;
    for (let i = 0; i < arr.length; i++) {
        res.push(fn.call(thisArg, arr[i], i, arr));
    }
    return res;
}
let b = a.myMap((x) => x + 1);
console.log(b);

// reduce
Array.prototype.myReduce = function (fn, initValue) {
    let arr = this;
    let num = initValue === undefined ? arr[0] : initValue;
    let i = initValue === undefined ? 1 : 0;
    for (; i < arr.length; i++) {
        num = fn(num, arr[i], i, arr)
    }
    return num;
}
console.log(a.myReduce((pre, cur) => pre + cur, 0));


// flatten
function flatten(arr) {
    let res = [];
    arr.forEach(e => {
        if (Array.isArray(e)) {
            res.push(...flatten(e))
        } else {
            res.push(e);
        }
    })
    return res;
}
console.log(flatten([1, 2, [1, 2], [1, [2, [3]]]]));

// flatten 指定deep
function flatten_deep(arr, deep) {
    let res = [];
    for (let e of arr) {
        console.log(e);
    }
    for (let e of arr) {
        if (Array.isArray(e) && deep) {
            res.push(...flatten_deep(e, deep - 1));
        } else {
            res.push(e);
        }
    }
    return res;
}

console.log(flatten_deep([1, 2, [1, 2], [1, [2, [3]]]]), 2);

//函数柯里化
function curry(fn, len = fn.length) {
    return _curry.call(this, fn, len);
}
function _curry(fn, len, ...args) {
    return function (...params) {
        let _args = [...args, ...params];
        if (_args.length >= len) {
            return fn.apply(this, _args);
        } else {
            return _curry.call(this, fn, len, ..._args);
        }
    }
}

let _fn = curry((a, b, c, d, e) => {
    console.log(a, b, c, d, e);
})
_fn(1)(2)(3)(4)(5, 6, 7);

// 浅拷贝
function shallowCopy(tar, ori) {
    for (let key in ori) {
        tar[key] = ori[key];
    }
    return tar;
}

//深拷贝
function deepCopy(tar, ori) {
    for (let k in ori) {
        let e = ori[k];
        if (e instanceof Array) {
            tar[k] = [];
            deepCopy(tar[k], e);
        } else if (e instanceof Object) {
            tar[k] = {};
            deepCopy(tar[k], e);
        } else {
            tar[k] = e;
        }
    }
}

// 手写 call apply bind
function f(a, b) {
    console.log(a, b);
    console.log(this.name);
}
obj = {
    name: '张三'
}
Function.prototype.myApply = function (context) {
    let obj = context || window;
    obj.fn = this;
    const args = arguments[1] || [];
    let res = obj.fn(...args);
    delete obj.fn;
    return res;
}
f.myApply(obj, [1, 2]);

Function.prototype.myCall = function (context = window) {
    let obj = context;
    obj.fn = this;
    const args = [...arguments].slice(1);
    let res = obj.fn(...args);
    delete obj.fn;
    return res;
}
f.myCall(obj, 1, 2);

Function.prototype.myBind = function (context) { };


// 手动实现new

function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayHi = function () {
    console.log("Hi, 我是" + this.name);
}
function create() {
    let obj = {};
    let fn = [].shift.call(arguments);
    obj.__proto__ = fn.prototype;
    let res = fn.apply(obj, arguments);
    return res instanceof Object ? res : obj;
}
let p2 = create(Person, '李四', 19);
p2.sayHi();


//手写promise promise.all, promise.race
const STATUS = {
    PENDING: "pending",
    FULFILLED: "fulfilled",
    REJECTED: "rejected"
}

Promise.prototype.myAll = function (promiseArr) {
    let count = 0;
    let res = [];
    return new Promise((resolve, reject) => {
        if (!promiseArr.length) {
            resolve(res);
        }
        promiseArr.forEach((p, i) => {
            Promise.resolve(p).then(v => {
                count++;
                res[i] = v;
                if (count === promiseArr.length) {
                    resolve(res)
                }
            }, e => {
                reject(e);
            })
        })
    })
}

Promise.prototype.myRace = function (promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach(p => {
            Promise.resolve(p).then(v => {
                resolve(v);
            },
                e => {
                    reject(e);
                })
        })
    })
}

// ajax
function ajax() {
    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();
        xhr.open('get', 'https://www.google.com');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let s = xhr.responseText;
                    let object = JSON.parse(s);
                    resolve(object)
                } else {
                    reject('error')
                }
            }
        }
        xhr.send();
    })
}

// debounce 防抖
function debounce(fn, delay) {
    if (typeof fn !== 'function') {
        throw new TypeError('fn不是函数');
    }
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    }
}
function throttle(fn, delay) {
    let valid = true;
    return function () {
        if (!valid) {
            return false;
        }
        valid = false;
        setTimeout(() => {
            fn();
            valid = true;
        }, delay);
    }
}

let arr = [1, 2, 3, 4, [1, 2, 3, 4]];
let res = [...arr];
console.log(res);
