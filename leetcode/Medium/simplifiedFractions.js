/**
 * @Author: msc
 * @Date: 2022-02-10 15:14:50
 * @LastEditTime: 2022-02-10 15:23:15
 * @LastEditors: msc
 * @Description: 1447. 最简分数
 */

/**
 * @param {number} n
 * @return {string[]}
 */
var simplifiedFractions = function (n) {
    const gcd = (a, b) => {
        return b === 0 ? a : gcd(b, a % b);
    }
    let res = [];
    for (let i = 1; i < n; i++) {
        for (let j = i + 1; j <= n; j++) {
            if (gcd(j, i) === 1) {
                res.push(i + "/" + j);
            }
        }
    }
    return res;
};

console.log(simplifiedFractions(5));