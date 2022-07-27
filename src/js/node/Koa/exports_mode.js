
const sayHello = () => {

    console.log("hello")
}


exports.sayHello = sayHello;


console.log(exports)
console.log(module.exports)
console.log(exports===module.exports)

const arr = [1,2,3,4,5];
let [a,b,...ret] = arr

console.log(a);
console.log(b);
console.log(ret);