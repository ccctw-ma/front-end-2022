/**
 * @param {number} num
 * @return {boolean}
 */
const checkPerfectNumber = function (num) {
    let res = [1];
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            if (num / i !== i) res.push(i);
            res.push(num / i);
        }
    }
    return res.reduce((pre, cur) => pre + cur, 0) === num;
};

console.log(checkPerfectNumber(497))


for (let i = 0; i < 9.2; i++) {
    console.log(i)
}