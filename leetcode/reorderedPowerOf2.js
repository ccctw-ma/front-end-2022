

/**
 * @param {number} n
 * @return {boolean}
 */
var reorderedPowerOf2 = function (n) {
    let nums = new Set();
    let index = 1;
    while (index <= 1e9) {
        let s = index.toString();
        let bucket = new Array(10).fill(0);
        for (let i = 0; i < s.length; i++) {
            bucket[s[i] - '0']++;
        }
        nums.add(bucket.reduce((pre, cur) => pre + cur, ''));
        index <<= 1;
    }
    let bucket = new Array(10).fill(0);
    let s = n.toString();
    for (let i = 0; i < s.length; i++) {
        bucket[s[i] - '0']++;
    }
    let res = bucket.reduce((pre, cur) => pre + cur, '');
    return nums.has(res);
};


// console.log(reorderedPowerOf2(4021));

console.log([1,2,3,4,5,6,7,'aa'].join(''));