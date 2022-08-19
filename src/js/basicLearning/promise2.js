/**
 * @Author: msc
 * @Date: 2022-06-05 21:36:09
 * @LastEditTime: 2022-08-17 23:08:20
 * @LastEditors: msc
 * @Description: promise learning
 */
// const fs = require('fs')
// fs.readFile('./ajax.js', (err, dara) => {
//     if (err) throw err;
//     // console.log(dara.toString());
// })


// function mineReadFile(path) {
//     return new Promise((res, rej) => {
//         let a = " "
//     })
// }


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



function fetchUser() {
    console.log("fetch user...");
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('fetched user');
            resolve({
                name: "Ringo starr"
            })
        }, 1000);
    });
}
function wrapPromise(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then((r) => {
        status = "success";
        result = r;
    },
        (e) => {
            status = "error";
            result = e;
        }
    );
    return {
        read() {
            if (status === "pending") {
                throw suspender;
            } else if (status === "error") {
                throw result;
            } else if (status === "success") {
                return result;
            }
        }
    }
}

function fetchData() {
    let userPromise = fetchUser();
    return {
        user: wrapPromise(userPromise)
    };
}

// const data = fetchData().user.read();
// console.log(data);