
(() => {

    function first() {
        console.log("first(): factory evaluated");
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log("first(): called");
        };
    }

    function second() {
        console.log("second(): factory evaluated");
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log("second(): called");
        };
    }

    class ExampleClass {
        @first()
        @second()
        method() { }
    }


    const test = new ExampleClass();


    function sealed(constructor: Function) {
        Object.seal(constructor);
        Object.seal(constructor.prototype);
    }

    @sealed
    class BugReport {
        type = "report";
        title: string;
        constructor(t: string) {
            this.title = t;
        }
    }

    const bugReport = new BugReport('Hello world');
    console.log(bugReport.type);



    function enumerable(value: boolean) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            descriptor.enumerable = value;
        }
    }
    class Greeter {
        greeting: string;
        constructor(message: string) {
            this.greeting = message;
        }

        @enumerable(false)
        greet() {
            return "Hello, " + this.greeting;
        }

        
    }




})();