function Cat(name,color){
    this.name = name;
    this.color = color;
    this.miao = function(){
        console.log('m m');
    }
}

let cat1 = new Cat('a','white');
let cat2 = new Cat('b','yellow')
Cat.prototype.name = 'free';
console.log(cat1.name);

//原型链的末端是null
console.log(Object.getPrototypeOf(Object));

function F(){
    this.foo = 'foo'
}

let f = new F();
console.log(f.constructor == F);
console.log(f.constructor.name);

console.log({} instanceof Object);
console.log([1,2,3] instanceof Array);

function M1(){
    this.hello = 'hello'
}

function M2(){
    this.world = 'world'
}

function S(){
    M1.call(this);
    M2.call(this);
}

S.prototype = Object.create(M1.prototype)
Object.assign(S.prototype,M2.prototype)
S.prototype.constructor = S
let s = new S()
console.log(s.hello,s.world);

let a = {};
let b = {x:1};
Object.setPrototypeOf(a,b);
console.log(Object.getPrototypeOf(a)===b);
console.log(a.x);

let ff = Object.setPrototypeOf({},F.prototype)
F.call(ff)
console.log(ff.foo);