// function timeout(ms) {
//     return new Promise((resolve, reject) => {
//         setTimeout(resolve, ms, 'done 2333');
//     })
// }

// timeout(500).then(v => console.log(v))


// async function f() {
//     await Promise.reject('出错了').catch(e => console.log(e));
//     return await Promise.resolve('hello world');
// }

// f().then(v => console.log(v))

/*
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2
    .then(result => {
        console.log(result)
        console.log('test');
    })
    .catch(error => console.log(error))




const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
    console.log(results);
});*/


const http = require('https');
const resolve = require("@rollup/plugin-node-resolve");

// 第三方天气接口
let url = 'https://www.fastmock.site/mock/cbc7bb1f48d813d2e150862ce0b08c81/test/hello';

let req = http.request(url, function (res) {
    let info = '';

    res.on('data', function (chunk) {
        info += chunk;
    });

    res.on('end', function (err) {
        console.log(info);
    });
});

req.end();




const timeout = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, new Array(10).fill(0).map((v, index) => index))
    })
}

timeout(1000).then(value => {
    console.log(value)
})

const promise = new Promise((resolve,reject)=>{
    console.log("Promise");
    resolve();
})

promise.then(()=>{
    console.log("resolved")
})

console.log("hello world")











