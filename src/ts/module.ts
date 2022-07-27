/*
 * @Author: msc
 * @Date: 2022-07-18 22:08:06
 * @LastEditTime: 2022-07-18 22:20:21
 * @LastEditors: msc
 * @Description: 
 */

// 任何包含顶级import或者export的文件都被当成一个模块。
// 相反地，如果一个文件不带有顶级的import或者export声明，
// 那么它的内容被视为全局可见的（因此对模块也是可见的）。

// import cc from "./Symbols"
// console.log(cc);

export interface StringValidator {
    isAccptable(s: string): boolean;
}

export const numberRegexp = /^[0-9]+$/;

class ZipCodeValidator implements StringValidator {
    isAccptable(s: string): boolean {
        return s.length === 5 && numberRegexp.test(s);
    }
}

export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };