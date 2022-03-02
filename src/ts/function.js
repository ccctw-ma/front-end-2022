"use strict";
/*
 * @Author: msc
 * @Date: 2022-03-02 20:53:06
 * @LastEditTime: 2022-03-02 20:57:22
 * @LastEditors: msc
 * @Description: function
 */
let myAdd = (baseValue, increment) => {
    return baseValue + increment;
};
/**
 * optionParams and default params
 */
function buildName(firstName, lastName) {
    return firstName + " " + lastName;
}
// let result1 = buildName("Bob");                  // error, too few parameters
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams"); // ah, just right
