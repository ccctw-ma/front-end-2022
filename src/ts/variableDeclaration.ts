/*
 * @Author: msc
 * @Date: 2022-02-22 22:36:47
 * @LastEditTime: 2022-09-22 00:15:26
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

interface Quiz {
    question: string;
    a: string;
    b: string;
    c: string;
    d: string;
    correct: string;
    [key: string]: string;
}


const quizData: Array<Quiz> = [
    {
        question: "Which language runs in a web browser?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "What does CSS stand for?",
        a: "Central Style Sheets",
        b: "Cascading Style Sheets",
        c: "Cascading Simple Sheets",
        d: "Cars SUVs Sailboats",
        correct: "b",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Hypertext Markdown Language",
        c: "Hyperloop Machine Language",
        d: "Helicopters Terminals Motorboats Lamborginis",
        correct: "a",
    },
    {
        question: "What year was JavaScript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "none of the above",
        correct: "b",
    },
];
let index = 0;
let cccc = 'ddd';
console.log(quizData[index][cccc]);
