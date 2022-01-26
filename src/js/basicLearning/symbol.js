let s1 = Symbol();
let s2 = Symbol('hello world');
let s3 = Symbol.for('hello world')
console.log(s1 === s2)
console.log(s2 === s3)
console.log(String(s1))

console.log(s2.description)


let o = {
    a: '1',
    [s1]: 'hello world'
}

console.log(Reflect.ownKeys(o))


console.log("training_project_us_5ec55353424dcba62bccca88aa0eec4f".startsWith('training_project') )



let arr = ['a','b','c','d']
console.log(arr.find(c=>c==='e'))

console.log('c3fb1332aa7044a09b3f735bf3efbb196'.split('_'));


