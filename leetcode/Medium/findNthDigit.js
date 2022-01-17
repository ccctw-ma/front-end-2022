/**
 * @param {number} n
 * @return {number}
 */

// 400. 第 N 位数字


var findNthDigit = function (n) {
    // 一位的数字为1到9 9个
    // 两位的数字为10到99 90个
    // 三位的数字为100到999 900个
    let index = 1,
        len = 9,
        num = n;
    while ((n - index * len) > 0) {
        n -= (index * len);
        index++;
        len *= 10;
    }
    console.log(index, n, (10 ** (index - 1) - 1))
    //确定数据在哪个范围内
    let a = ~~(n / index);
    a += (10 ** (index - 1) - 1);
    let b = n % index;
    console.log(a, b)
    if (b === 0) {
        return String(a)[index - 1];
    }
    return String(a + 1)[b - 1];
};

console.log(findNthDigit(9));

// console.log(String(1000)[0])