/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
const containsNearbyDuplicate = function (nums, k) {
    k++;
    let res = {};
    for (let i = 0; i < Math.min(nums.length, k); i++) {
        let temp = res[nums[i]] || 0;
        temp++;
        if (temp >= 2) return true;
        res[nums[i]] = temp;
    }
    let index = k;
    while (index < nums.length) {
        res[nums[index - k]]--;
        let temp = res[nums[index]] || 0;
        temp++;
        if (temp >= 2) return true;
        res[nums[index]] = temp ;
        index++;
    }
    return false;
};

console.log(containsNearbyDuplicate([1, 2, 3, 4, 5, 6, 7, 8, 9, 9], 3));


/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
const containsNearbyDuplicate2 = function(nums, k) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        let num = nums[i]
        if (map.has(num) && i - map.get(num) <= k) {
            return true
        } else {
            map.set(num, i)
        }
    }
    return false
}