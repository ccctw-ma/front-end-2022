/**
 * @Author: msc
 * @Date: 2021-12-26 10:23:09
 * @LastEditTime: 2021-12-26 10:28:44
 * @LastEditors: msc
 * @Description: 1078. Bigram 分词
 */


/**
 * @param {string} text
 * @param {string} first
 * @param {string} second
 * @return {string[]}
 */
var findOcurrences = function (text, first, second) {
    return text.split(' ').reduce((pre, cur, index, arr) => {
        if (index >= 2 && arr[index - 2] === first && arr[index - 1] === second) {
            pre.push(cur);
        }
        return pre;
    }, [])
};


console.log(findOcurrences(text = "alice is a good girl she is a good student", first = "a", second = "good"

))