/*
 * @Author: msc
 * @Date: 2022-03-03 11:05:51
 * @LastEditTime: 2022-03-03 11:35:56
 * @LastEditors: msc
 * @Description: 
 */

enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

enum Responses {
    No,
    Yes
}
function respond(recipient: string, message: Responses): void {
    1 + 1;
}

respond("Princess Caroline", Responses.Yes)

// console.log(Responses.Yes === Responses.Yes);

const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
declare enum Enum {
    A = 1,
    B,
    C = 2
}


interface Named {
    name: string;
}

let xx: Named;
let y = { name: "Alice", location: "Seattle" };
xx = y;
