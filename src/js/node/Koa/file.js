/**
 * @Author: msc
 * @Date: 2022-06-24 16:53:03
 * @LastEditTime: 2022-06-24 17:05:40
 * @LastEditors: msc
 * @Description:
 */

const fs = require("fs");
const os = require("os");
const path = require("path");



console.log(os.platform());
console.log(os.release());
// console.log(path.dirname());

fs.readdirSync(__dirname).forEach((fileName, index) => {
  console.log(fileName);
  const file = fs.statSync(__dirname + "\\" + fileName);
  if(file.isFile()){
    console.log(file);
  }
});
