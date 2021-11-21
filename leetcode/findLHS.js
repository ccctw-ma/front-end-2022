/**
 * @param {number[]} nums
 * @return {number}
 */
var findLHS = function (nums) {

    const numMap = new Map();
    nums.forEach(item => numMap.set(item, (numMap.get(item) || 0) + 1));
    let max = 0;
    [...numMap.keys()].forEach(n => {
        if (numMap.has(n + 1)) max = Math.max(max, numMap.get(n) + numMap.get(n + 1))
    })
    return max;
};

console.log(findLHS([1, 3, 2, 2, 5, 2, 3, 7]));