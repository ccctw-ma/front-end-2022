/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minimumDifference = function (nums, k) {
    nums.sort((a, b) => a - b);
    let res = Number.MAX_VALUE;
    for (let i = 0; i < nums.length - k + 1; i++) {
        res = Math.min(res, nums[i + k - 1] - nums[i])
    }
    return res;
};