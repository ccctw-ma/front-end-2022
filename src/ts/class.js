"use strict";
class Greeter {
    constructor(message) {
        this.greeting = message;
    }
    greet() {
        return "Hello" + this.greeting;
    }
}
let greeter = new Greeter("world");
console.log(greeter.greet());
class Animal {
    constructor(name) { this.name = name; }
    ;
    move(distanceInMeters = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}
class Dog extends Animal {
    bark() {
        console.log("woof! woof!");
    }
}
class Snake extends Animal {
    constructor(name) { super(name); }
    move(distanceInMeters) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}
class Horse extends Animal {
    constructor(name) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}
let sam = new Snake("Sammy the Python");
let tom = new Horse("Tommy the Palomino");
sam.move();
tom.move(34);
// const dog = new Dog();
// dog.bark();
// dog.move(10);
// dog.bark();
/***
 * readOnly
 */
class Octopus {
    constructor(name) {
        this.name = name;
        this.legs = 8;
        this.name = name;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
// dad.name = "21"
/**
 * getter and setter
 */
let password = "Hello world ";
class Employee {
    constructor() {
        this._fullName = "";
    }
    get fullName() {
        return this._fullName;
    }
    set fullName(newName) {
        if (password && password === "Hello world") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}
let employee = new Employee();
employee.fullName = "ShenZhuoHui";
if (employee.fullName) {
    console.log(employee.fullName);
}
/**
 * abstract
 */
class Department {
    constructor(name) {
        this.name = name;
    }
    printName() {
        console.log('Department name: ' + this.name);
    }
}
class AccountingDepartment extends Department {
    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }
    printMeeting() {
        console.log('The Accounting Department meets each Monday at 10am.');
    }
    generateReports() {
        console.log('Generating accounting reports...');
    }
}
let department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
// department.generateReports(); // 错误: 方法在声明的抽象类中不存在
