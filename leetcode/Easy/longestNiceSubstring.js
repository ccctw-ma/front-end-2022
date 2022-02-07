/**
 * @Author: msc
 * @Date: 2022-02-01 15:45:47
 * @LastEditTime: 2022-02-01 16:17:05
 * @LastEditors: msc
 * @Description: 1763. 最长的美好子字符串
 */


/**
 * @param {string} s
 * @return {string}
 */
var longestNiceSubstring = function (s) {
    let length = s.length;
    if (s.length <= 1) return "";
    let arr = [...s];
    console.log(arr);
    const check = arr => {
        let l = 65, r = 97;
        for (let i = 0; i < 26; i++) {
            let a = arr[l + i];
            let b = arr[r + i];
            if (a === 0 && b !== 0 || a !== 0 && b === 0) {
                return false;
            }
        }
        return true;
    }
    for (let len = length; len >= 2; len--) {
        let bucket = new Array(128).fill(0);
        //init
        for (let i = 0; i < len; i++) {
            bucket[arr[i].charCodeAt()]++;
        }
        if (check(bucket)) return s.substring(0, len);
        for (let i = 0; i < length - len; i++) {
            bucket[arr[i].charCodeAt()]--;
            bucket[arr[i + len].charCodeAt()]++;
            if (check(bucket)) {
                return s.substring(i + 1, i + len + 1);
            }
        }
    }
    return "";
};


console.log(longestNiceSubstring(s = "YazaAay"));




var longestNiceSubstring = function(s) {
    this.maxPos = 0;
    this.maxLen = 0;
    
    let types = 0;
    for (let i = 0; i < s.length; ++i) {
        types |= 1 << (s[i].toLowerCase().charCodeAt() - 'a'.charCodeAt());
    }
    types = bitCount(types);
    for (let i = 1; i <= types; ++i) {
        check(s, i);
    }
    return s.slice(maxPos, maxPos + maxLen);
};

const check = (s, typeNum) => {
    const lowerCnt = new Array(26).fill(0);
    const upperCnt = new Array(26).fill(0);
    let cnt = 0;
    for (let l = 0, r = 0, total = 0; r < s.length; ++r) {
        let idx = s[r].toLowerCase().charCodeAt() - 'a'.charCodeAt();
        if ('a' <= s[r] && s[r] <= 'z') {
            ++lowerCnt[idx];
            if (lowerCnt[idx] === 1 && upperCnt[idx] > 0) {
                ++cnt;
            }
        } else {
            ++upperCnt[idx];
            if (upperCnt[idx] === 1 && lowerCnt[idx] > 0) {
                ++cnt;
            }
        }
        total += (lowerCnt[idx] + upperCnt[idx]) === 1 ? 1 : 0;
        while (total > typeNum) {
            idx = s[l].toLowerCase().charCodeAt() - 'a'.charCodeAt();
            total -= (lowerCnt[idx] + upperCnt[idx]) === 1 ? 1 : 0;
            if ('a' <= s[l] && s[l] <= 'z') {
                --lowerCnt[idx];
                if (lowerCnt[idx] === 0 && upperCnt[idx] > 0) {
                    --cnt;
                }
            } else {
                --upperCnt[idx];
                if (upperCnt[idx] === 0 && lowerCnt[idx] > 0) {
                    --cnt;
                }
            }
            ++l;
        }
        if (cnt === typeNum && r - l + 1 > maxLen) {
            maxPos = l;
            maxLen = r - l + 1;
        }
    }
}

var bitCount = function(n) {
    let ret = 0;
    while (n) {
        n &= n - 1;
        ret++;
    }
    return ret;
};
