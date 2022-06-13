/*
*
* js事件循环机制
* */

Promise.resolve().then(() => {
    console.log("1");
    setTimeout(() => {
        console.log("2");
        Promise.resolve().then(()=>{
            console.log("3");
        })
    }, 0)
})

setTimeout(() => {
    console.log("4");
    Promise.resolve().then(() => {
        console.log("5")
    }).then(() => {
        console.log("6");
    })
}, 0);

console.log("7");

// 5、1、3、4、2