/*
 * @Author: msc
 * @Date: 2022-02-22 22:36:47
 * @LastEditTime: 2022-02-22 23:04:17
 * @LastEditors: msc
 * @Description: 变量声明
 */


//块作用域
const f = (input: boolean) => {
    let a = 100;
    if (input) {
        let b = a + 1;
        return b;
    }
    // Error: 'b' doesn't exist here
    // return b;
}



for (let i = 0; i < 10; i++) {
    setTimeout(() => console.log(i), 100 * i);
}

let o = {
    a: "foo",
    b: 12,
    c: "bar"
}
let { a: newName1, b: newName2 }: { a: string, b: number } = o;
