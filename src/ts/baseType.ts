

(() => {

    // 基础类型
    let isDone: boolean = false;
    console.log(isDone)

    let decLiteral: number = 6;
    let hexLiteral: number = 0xf00d;
    let binaryLiteral: number = 0b1010;
    let octalLiteral: number = 0o744;

    // ts编译器目标到es2020才支持bigint
    let bigN: bigint = 1n;

    // @ts-ignore
    let name: string = `Gene`;
    let age: number = 37;
    let sentence: string = `Hello, my name is ${name}. I'll be ${age + 1} years old next month.`;

    // console.log(sentence)


    let list: Array<number> = [1, 2, 3]
    list.map(item => 1)
    // console.log(list)

    //元组Tuple
    let x: [string, number];
    x = ["hello", 22];
    console.log(x[0].substring(0, 2));


    //枚举
    enum Color { Red, Green, Blue }
    let c: Color = Color.Blue;
    console.log(c === Color.Blue);


    //Any

    let list2: Array<any> = [1, true, "Hello world", [1, 2, 3]];
    console.log(list2[2]);


    //Void
    (function warnUser(): void {
        console.log("This is my warning message");
    })();

    // null undefinded
    let u: undefined = undefined;
    let n: null = null;

    // never
    const err = (message: string): never => {
        throw new Error(message);
    }
    // err("Hello typeScript");

    //类型断言 就像java里的类型转换
    let someValue: any = "this is a string";
    let strLength: number = (<string>someValue).length;
    console.log(strLength, someValue.length);



})();