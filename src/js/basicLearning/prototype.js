function Person() {

}
Person.prototype.name = "Hello"
let p1 = new Person()
let p2 = new Person()
p1.name = "World";
console.log(p1.name);
delete p1.name;
console.log(p1.name);
// console.log(p1.__proto__ === Person.prototype);
// console.log(Person === Person.prototype.constructor);

function Parent() {
    this.names = ['zhu', 'feifan'];
}
function Child() {

}
Child.prototype = new Parent()
let c1 = new Child();
c1.names.push('ma');
console.log(c1.names);
let c2 = new Child();
console.log(c2.names);

var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() {
        return scope;
    }
    return f;
}
console.log(checkscope()());;

arr1 = [1, 2, 3];
arr2 = [4, 5, 6];
arr3 = arr1.concat(arr2);
arr1.push(...arr2);
console.log(arr1, arr3);


var data = [];
for (let i = 0; i < 3; i++) {
    data[i] = function () {
        console.log(i);
    }
}
data[0]();
data[1]();
data[2]();

const num_const = 10;
num_const = 20;
