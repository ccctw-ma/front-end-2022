class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet() {
        return "Hello" + this.greeting;
    }
}

let greeter = new Greeter("world");
console.log(greeter.greet())

class Animal {
    name: string;
    constructor(name: string) { this.name = name };
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log("woof! woof!");
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters?: number): void {
        console.log("Galloping...");
        super.move(distanceInMeters)
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45): void {
        console.log("Galloping...");
        super.move(distanceInMeters)
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");
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
    readonly legs: number = 8;
    constructor(readonly name: string) {
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
    private _fullName: string = "";
    get fullName(): string {
        return this._fullName;
    }
    set fullName(newName: string) {
        if (password && password === "Hello world") {
            this._fullName = newName;
        } else {
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
 abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
// department.generateReports(); // 错误: 方法在声明的抽象类中不存在
