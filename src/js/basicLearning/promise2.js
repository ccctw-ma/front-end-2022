/**
 * @Author: msc
 * @Date: 2022-06-05 21:36:09
 * @LastEditTime: 2022-06-06 00:54:45
 * @LastEditors: msc
 * @Description: promise learning
 */
const fs = require('fs')

fs.readFile('./ajax.js', (err, dara) => {
    if (err) throw err;
    // console.log(dara.toString());
})


function mineReadFile(path) {
    return new Promise((res, rej) => {
        let a = " "
    })
}


let p1 = new Promise((res, rej) => {
    res('ok')
})
let p2 = Promise.resolve('233');
let p3 = Promise.reject('fuck you');
let p = Promise.race([p1, p2, p3])


new Promise((res, rej) => {
    let a = 0
    console.log("This is first time begin");
    setTimeout(() => {
        a = 1;
        res(a)
    }, 1000);
}).then(res => {
    res += 100
    console.log(res);
    return new Promise(() => { })
}).then(res => {
    console.log(res + 100);
})