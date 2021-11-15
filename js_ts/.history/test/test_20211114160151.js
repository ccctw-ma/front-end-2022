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
