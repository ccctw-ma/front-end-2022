/**
 * @Author: msc
 * @Date: 2021-12-10 09:49:53
 * @LastEditTime: 2021-12-10 17:06:23
 * @LastEditors: msc
 * @Description: 748. 最短补全词
 */

/**
 * @param {string} licensePlate
 * @param {string[]} words
 * @return {string}
 */
var shortestCompletingWord = function (licensePlate, words) {
    let arr = licensePlate.split("").reduce((pre, cur) => {
        cur = cur.toLowerCase().charCodeAt() - "a".charCodeAt();
        if (cur >= 0 && cur < 26) pre[cur]++;
        return pre;
    }, new Array(26).fill(0));
    return words.reduce((res, word) => {
        let temp = word.split('').reduce((pre, cur) => {
            pre[cur.charCodeAt() - 97]++;
            return pre;
        }, new Array(26).fill(0));
        if (temp.every((_, index) => temp[index] - arr[index] >= 0)) {
            if (res.length === 0 || word.length < res.length) res = word;
        }
        return res;
    }, '')
};

console.log(shortestCompletingWord(licensePlate = "iMSlpe4",
    words = ["claim", "consumer", "student", "camera", "public", "never", "wonder", "simple", "thought", "use"]));


let list = [1, 2, 3, 4, 5, 6, 7]
console.log(list.find(e => e === 3))