let o = {
    'a':{
        n:'123'
    },
    'b':{
        n:'456'
    }
}

console.log(o.a)



m = new Map()
m.set('123',{a:'1'})
m.set('456',{a:'2'})
console.log(m.get('123'))


let obj = {}
Object.defineProperty(obj,'a',{
    writable: true,
    enumerable:true,
    configurable:true,
    value:2
})


console.log(obj.a)
obj.a = 3
console.log(obj.a)




function f(){

}

console.log(typeof f);
// 空数组（[]）和空对象（{}）对应的布尔值
// console.log(Array.isArray([1,23]));
// console.log(Number(undefined));
console.log(!!{});
console.log(!!(0.1+0.2===0.3));
console.log(0.3/0.1);

console.log(2**53);
console.log(2**1024);
console.log(Number.MAX_VALUE);
console.log(Number.MIN_VALUE);
console.log(0xff);
console.log(0o377);
console.log(0b111);
console.log(parseInt('123.34'));
// 以下两种情况，JavaScript 会自动将数值转为科学计数法表示，其他情况都采用字面形式直接表示。
// （1）小数点前的数字多于21位。
// （2）小数点后的零多于5个。

let teststring = 'long\
long\
long\
long'

console.log(teststring);
console.log('\251');
console.log('\x12');
console.log('\u2111');


let base64 = 'hello world'
console.log();