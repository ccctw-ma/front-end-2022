/**
 * @Author: msc
 * @Date: 2021-12-02 08:48:42
 * @LastEditTime: 2021-12-02 09:05:56
 * @LastEditors: msc
 * @Description: 506. 相对名次
 */

/**
 * @param {number[]} score
 * @return {string[]}
 */
var findRelativeRanks = function (score) {
  let arr = score.slice().sort((a, b) => b - a);
  return score.map((val) => {
    let index = arr.indexOf(val);
    return index === 0
      ? "Gold Medal"
      : index === 1
      ? "Silver Medal"
      : index === 2
      ? "Bronze Medal"
      : index + 1 + "";
  });
};

console.log(findRelativeRanks([10, 3, 8, 9, 4]));
