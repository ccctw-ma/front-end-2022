/**
 * @Author: msc
 * @Date: 2022-06-24 15:49:05
 * @LastEditTime: 2022-06-24 16:08:56
 * @LastEditors: msc
 * @Description:
 */

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHi() {
        console.log('Hello world');
    }
}

class FuckYouTony{
    constructor(){

    }
    fuck(){

    }
    you(){

    }
    tony(){
        
    }
}

Person.prototype.species = '人类';

let per1 = new Person("xiaoming", 20);
per1.sayHi();
// console.log(per1.__proto__ === Person.prototype);
// console.log(Person.prototype.__proto__ === Object.prototype);
// console.log(Object.prototype.__proto__ === null);
console.log(per1.constructor);
console.log(per1.__proto__.constructor);
console.log(Person.prototype.__proto__.__proto__);
console.log(Person.prototype.constructor === Person);


console.log(Person.constructor === Function);
console.log(Function.constructor === Function);
console.log(Function);
console.log(Person instanceof Object);

