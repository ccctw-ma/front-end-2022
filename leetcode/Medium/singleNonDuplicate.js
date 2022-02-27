/**
 * @Author: msc
 * @Date: 2022-02-14 16:44:46
 * @LastEditTime: 2022-02-14 17:24:13
 * @LastEditors: msc
 * @Description: 540. 有序数组中的单一元素
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNonDuplicate = function (nums) {
    if (nums.length === 1) return nums[0];
    let l = 0, r = nums.length - 1;
    const judge = (nums, index) => {
        let len = nums.length;
        if (index > 0 && index < len - 1 && nums[index] !== nums[index - 1] && nums[index] !== nums[index + 1]) {
            return 0;
        } else if ((index === 0 && nums[index] !== nums[index + 1]) || (index === nums.length - 1 && nums[index] !== nums[index - 1])) {
            return 0;
        } else if (index % 2 === 1 && nums[index] === nums[index - 1]) {
            // target in the right
            return 1;
        } else if (index % 2 === 0 && nums[index] === nums[index + 1]) {
            return 1;
        } else {
            // target in the left
            return -1;
        }
    }
    let res = 0;
    while (l <= r) {
        let mid = ~~(l + (r - l) / 2);
        let j = judge(nums, mid);
        console.log(mid, nums[mid], j);
        if (j === 1) {
            l = mid + 1;
        } else if (j === -1) {
            r = mid - 1;
        } else {
            res = nums[mid];
            break;
        }
    }
    return res;
};


console.log(singleNonDuplicate(nums = [1, 3, 3, 7, 7, 10, 10, 11, 11, 12, 12]));
var singleNonDuplicate = function (nums) {
    let low = 0, high = nums.length - 1;
    while (low < high) {
        let mid = Math.floor((high - low) / 2) + low;
        mid -= mid & 1;
        if (nums[mid] === nums[mid + 1]) {
            low = mid + 2;
        } else {
            high = mid;
        }
    }
    return nums[low];
};

