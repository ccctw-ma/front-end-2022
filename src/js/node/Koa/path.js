/**
 * @Author: msc
 * @Date: 2022-07-04 20:33:35
 * @LastEditTime: 2022-07-04 20:39:25
 * @LastEditors: msc
 * @Description:
 */

const path = require("path");

console.log(path.delimiter);

process.env.path.split(path.delimiter).forEach((p) => {
  
});

console.log(__dirname);
console.log(path.join(__dirname, __filename));
console.log(__filename);