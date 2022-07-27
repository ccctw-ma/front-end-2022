/**
 * @Author: msc
 * @Date: 2022-07-21 00:55:43
 * @LastEditTime: 2022-07-21 01:04:06
 * @LastEditors: msc
 * @Description: 
 */

const _ = require('lodash')
let a = _.zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => {
    return a + b + c;
})

// console.log(a);
console.log(_.camelCase('Fuck---dfadf-dasfads_afdsf..fadf'));
console.log(_.capitalize('adsahfkajshd'));
console.log(_.pad('Hello World', 40, '--'));