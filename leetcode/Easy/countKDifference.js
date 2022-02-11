/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}    2006. 差的绝对值为 K 的数对数目
 */
const countKDifference = (nums, k) => {
    const numMap = new Map();
    return nums.reduce((pre, cur) => {
        pre += numMap.get(cur - k) ?? 0;
        pre += numMap.get(cur + k) ?? 0;
        numMap.set(cur, (numMap.get(cur) ?? 0) + 1);
        return pre;
    }, 0)
};