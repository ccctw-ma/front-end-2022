/**
 * @Author: msc
 * @Date: 2022-02-13 21:05:08
 * @LastEditTime: 2022-02-13 21:10:22
 * @LastEditors: msc
 * @Description: 1189. “气球” 的最大数量
 */
/**
 * @param {string} text
 * @return {number}
 */
const maxNumberOfBalloons = (text) => {
    let arr = new Array(26).fill(0);
    [...text].forEach(c => arr[c.charCodeAt() - 97]++)
    let res = 0, flag = true;
    while (flag) {
        [..."balloon"].forEach(c => {
            let index = c.charCodeAt() - 97;
            if (arr[index] > 0) {
                arr[index]--;
            } else {
                flag = false;
            }
        })
        if (flag) res++;
    }
    return res;
};

