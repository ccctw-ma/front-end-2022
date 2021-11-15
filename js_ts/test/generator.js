// function* gen() {
//     yield 1;
//     return 2;
// }

// let g = gen();

// console.log(
//     g.next(),
//     g.next().value,
// );




async function f(){
    
    throw new Error('出错了！！！');
}

f().then(v=> console.log(v),e=> console.log('reject',e))