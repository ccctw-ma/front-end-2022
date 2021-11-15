let test01 = {
    a: 1,
    b: 2,
    c: 3
}

console.log([...Object.keys(test01)].length);

var obj = {
    p1: 1,
    p2: 2,
};
with (obj) {
    p1 = 4;
    p2 = 5;
}
console.log(obj);

if(true){
    var x = 5;
}

console.log(x);