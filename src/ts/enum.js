"use strict";
/*
 * @Author: msc
 * @Date: 2022-03-03 11:05:51
 * @LastEditTime: 2022-03-03 11:35:56
 * @LastEditors: msc
 * @Description:
 */
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
var Responses;
(function (Responses) {
    Responses[Responses["No"] = 0] = "No";
    Responses[Responses["Yes"] = 1] = "Yes";
})(Responses || (Responses = {}));
function respond(recipient, message) {
    1 + 1;
}
respond("Princess Caroline", Responses.Yes);
let directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
let xx;
let y = { name: "Alice", location: "Seattle" };
xx = y;
