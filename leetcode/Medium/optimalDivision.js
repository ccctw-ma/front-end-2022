/**
 * @Author: msc
 * @Date: 2022-02-27 16:24:15
 * @LastEditTime: 2022-03-01 23:43:56
 * @LastEditors: msc
 * @Description: 
 */
/**
 * @param {number[]} nums
 * @return {string}
 */
var optimalDivision = function (nums) {
    let len = nums.length;
    if (len === 1) return nums[0] + "";
    if (len === 2) return nums[0] + "/" + nums[1];
    const res = [];
    res.push(nums[0]);
    res.push("/(");
    res.push(nums[1]);
    for (let i = 2; i < n; i++) {
        res.push("/");
        res.push(nums[i]);
    }
    res.push(")");
    return res.join('');
};