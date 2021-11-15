['a', 'b', 'c'].map((a, b) => {
    console.log(a, b);
})


// for(let i=0;i<10;i++){
//     setTimeout(function(){
//         console.log(i);
//     },100*i)
// }

let name = ""

// @ts-ignore

function nameValidator(name) {
    return (name === "") || "姓名不能为空"
}

// console.log(nameValidator&&nameValidator(""))
// console.log("123"&&true&&"567")


let o = {}
Object.defineProperty(o, 'a', {
    value: 21,
    writable: false
})


    // strict mode
    (()=> {
        'use strict';
        var o = {};
        Object.defineProperty(o, 'b', {
            value: 2,
            writable: false
        });
        o.b = 3; // throws TypeError: "b" is read-only
        return o.b; // returns 2 without the line above
    })()