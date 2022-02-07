/**
 * @Author: msc
 * @Date: 2022-02-04 23:30:23
 * @LastEditTime: 2022-02-04 23:35:13
 * @LastEditors: msc
 * @Description: 1725. 可以形成最大正方形的矩形数目
 */


/**
 * @param {number[][]} rectangles
 * @return {number}
 */
const countGoodRectangles = (rectangles) => {
    let maxLen = rectangles.reduce((pre, cur) => {
        let l = cur[0], w = cur[1];
        let temp = Math.min(l, w);
        pre = Math.max(pre, temp);
        return pre;
    }, 0)
    return rectangles.reduce((pre, cur) => {
        if (cur[0] >= maxLen && cur[1] >= maxLen) {
            pre++;
        }
        return pre;
    }, 0);
};


console.log(countGoodRectangles(rectangles = [[2, 3], [3, 7], [4, 3], [3, 7]]));