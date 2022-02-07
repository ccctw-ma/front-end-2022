/**
 * @Author: msc
 * @Date: 2022-02-03 22:28:26
 * @LastEditTime: 2022-02-03 23:01:23
 * @LastEditors: msc
 * @Description: 1414. 和为 K 的最少斐波那契数字数目
 */


/**
 * @param {number} k
 * @return {number}
 */
var findMinFibonacciNumbers = function (k) {
    let arr = [1];
    let a = 1, b = 1;
    while (b <= k) {
        arr.push(b);
        let temp = a + b;
        a = b;
        b = temp;
    }
    //直接满足条件
    if (arr[arr.length - 1] === k) return 1;
    let res = 1;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === k) return res;
        if (arr[i] < k) {
            k -= arr[i];
            res++;
        }
    }
    return res;
};


findMinFibonacciNumbers(1_000_000_000)




const binarySearch = (arr, tar) => {
    let l = 0, r = arr.length - 1;
    while (l <= r) {
        let mid = ~~((l + r) / 2);
        if (arr[mid] < tar) {
            l = mid + 1;
        } else if (arr[mid] > tar) {
            r = mid - 1;
        } else {
            return mid;
        }
    }
    return -(l + 1);
}






