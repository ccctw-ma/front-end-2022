/**
 * @Author: msc
 * @Date: 2022-02-02 19:59:27
 * @LastEditTime: 2022-02-02 20:06:50
 * @LastEditors: msc
 * @Description: 
 */


/**
 * @param {string} word
 * @param {character} ch
 * @return {string}
 */
var reversePrefix = function (word, ch) {
    let arr = [...word];
    let index = -1;
    for (let i = 0; i < word.length; i++) {
        if (arr[i] === ch) {
            index = i;
            break;
        }
    }
    if (index === -1) return word;
    let l = 0, r = index;
    while (l < r) {
        let temp = arr[r];
        arr[r] = arr[l];
        arr[l] = temp;
        l++;
        r--;
    }
    return arr.join("");
};


console.log(reversePrefix(word = "abcd", ch = "z"));


