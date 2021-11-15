

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
});