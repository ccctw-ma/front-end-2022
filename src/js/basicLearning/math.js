console.log(Math.max());

// console.log((1.2).toInteger());


function range(min,max){
    return Math.random()*(max-min)+min;
}
let num = range(1,10);
console.log(num);
console.log(~~num);