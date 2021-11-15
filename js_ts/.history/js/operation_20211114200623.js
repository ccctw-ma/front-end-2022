console.log(false + 'a');
let obj = { p: 1,
toString:()=>{
    return 'hello'
} }

console.log(o);
console.log(obj+2);
console.log(Number({}));
console.log(2**3**2);
// 这里需要注意与NaN的比较。任何值（包括NaN本身）与NaN使用非相等运算符进行比较，返回的都是false。