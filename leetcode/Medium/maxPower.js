/**
 * @param {string} s
 * @return {number}
 * 1446. 连续字符
 */
var maxPower = function (s) {
    let l = 0,
        r = 0;
    max = 1;
    while (l < s.length) {
        r = l + 1;
        while (r < s.length && s[r] === s[l]) r++;
        max = Math.max(max, r - l);
        l = r;
    }
    return max;
};


console.log(maxPower('triplepillooooow'))