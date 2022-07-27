/*
 * @Author: msc
 * @Date: 2022-07-18 22:19:06
 * @LastEditTime: 2022-07-18 22:25:03
 * @LastEditors: msc
 * @Description: 
 */

import { ZipCodeValidator } from "./module";
import { ZipCodeValidator as Zip } from "./module";
import s from "./module2";

let myValidator = new ZipCodeValidator();
let myValidator2 = new Zip();
console.log(myValidator.isAccptable("Hello"));
console.log(myValidator2.isAccptable("12323"));
console.log(s);
