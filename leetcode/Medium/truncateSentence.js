/**
 * @Author: msc
 * @Date: 2021-12-06 09:23:12
 * @LastEditTime: 2021-12-06 09:25:46
 * @LastEditors: msc
 * @Description: 1816. 截断句子
 */

/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var truncateSentence = function (s, k) {
  return s.split(" ").slice(0, k).join(" ");
};

console.log(truncateSentence("Hello how are you Contestant", 4));
