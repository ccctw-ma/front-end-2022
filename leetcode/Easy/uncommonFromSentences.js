/**
 * @Author: msc
 * @Date: 2022-01-30 14:02:01
 * @LastEditTime: 2022-01-30 14:08:38
 * @LastEditors: msc
 * @Description: 884. 两句话中的不常见单词
 */


/**
 * @param {string} s1
 * @param {string} s2
 * @return {string[]}
 */
var uncommonFromSentences = function (s1, s2) {
    let arr = (s1 + " " + s2).split(" ");
    let smap = new Map();
    arr.forEach(s => {
        smap.set(s, (smap.get(s) ?? 0) + 1);
    })
    let res = [];
    for (let [key, value] of smap.entries()) {
        if (value === 1) {
            res.push(key);
        }
    }
    return res;
};


console.log(uncommonFromSentences(s1 = "apple apple", s2 = "banana"));