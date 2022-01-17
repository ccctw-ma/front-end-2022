/**
 * @Author: msc
 * @Date: 2021-12-26 10:21:59
 * @LastEditTime: 2021-12-26 12:53:27
 * @LastEditors: msc
 * @Description: 第 273 场周赛
 */


/**
 * @param {number} num
 * @return {boolean}
 */
var isSameAfterReversals = function (num) {
    if (num === 0) return true;
    if (num % 10 === 0) {
        return false;
    }

    return true;

};


/**
 * @param {number} n
 * @param {number[]} startPos
 * @param {string} s
 * @return {number[]}
 */
var executeInstructions = function (n, startPos, s) {
    let res = [];
    let x = startPos[0],
        y = startPos[1];
    let o = {
        'L': [0, -1],
        'R': [0, 1],
        'U': [-1, 0],
        'D': [1, 0]
    }
    let dfs = (x, y, s, index) => {
        let res = 0;
        for (let i = index; i < s.length; i++) {
            let dir = o[s[i]];
            x += dir[0];
            y += dir[1];
            if (x >= 0 && x < n && y >= 0 && y < n) {
                res++;
            } else {
                break;
            }
        }
        return res;
    }
    for (let i = 0; i < s.length; i++) {
        res.push(dfs(x, y, s, i))
    }
    return res;
};


/**
 * @param {number[]} arr
 * @return {number[]}
 */
var getDistances = function (arr) {
    let o = {};
    for (let i = 0; i < arr.length; i++) {
        let num = arr[i];
        let array = o[num] || [];
        array.push(i);
        o[num] = array;
    }
    let res = new Array(arr.length).fill(0);
    for (let key in o) {
        let array = o[key];
        //前缀和
        let presum = [0]
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
            presum.push(sum);
        }
        for (let i = 0; i < array.length; i++) {
            let l = i,
                r = array.length - i - 1;
            let count = 0;
            count += (array[i] * l - (presum[i]))
            count += ((presum[array.length] - presum[i + 1]) - array[i] * r);
            res[array[i]] = count;
        }
    }
    return res;
};


/**
 * @param {number[]} nums
 * @return {number[]}
 */
var recoverArray = function (nums) {

    nums.sort((a, b) => a - b);
    let res = new Array(nums.length / 2).fill(0);
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > nums[0] && (nums[i] - nums[0]) % 2 === 0) {
            const diff = nums[i] - nums[0],
                k = diff / 2;
            let queue = [];
            for (let j = 0, index = 0; j < nums.length; j++) {
                if (queue.length != 0 && queue[0] === nums[j]) {
                    queue.shift();
                } else if (index === res.length) {
                    break;
                } else {
                    queue.push(nums[j] + diff);
                    res[index++] = nums[j] + k;
                }
            }
            if (queue.length === 0) {
                return res;
            }
        }
    }
};


/**
 * @param {number[]} nums
 * @return {number[]}
 */
var recoverArray = function (nums) {
    let N = nums.length / 2
    nums.sort((l, r) => l - r)
    for (let i = 1; i < nums.length; i++) {
        let diff = nums[i] - nums[0]
        if (diff > 0 && diff % 2 === 0 && check(diff / 2)) {
            return check(diff / 2)
        }
    }

    function check(k) {
        let used = Array(N * 2)
        let lower = [nums[0]]
        let higher = []
        let pending = [nums[0] + 2 * k],
            p = 0
        for (let i = 1; i < 2 * N; i++) {
            let num = nums[i]
            if (p < pending.length && pending[p] === num) {
                p++
                higher.push(num)
                continue;
            }
            lower.push(num)
            pending.push(num + 2 * k)
        }
        // console.log(lower, higher, k)
        return lower.length === N && higher.length === N ? lower.map(x => x + k) : null
    }
};