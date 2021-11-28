/**
 * @param {string}
 * @return {string}
 */
var originalDigits = function (s) {
    let charMap = s.split('').reduce((pre, cur) => {
        pre[cur] = (pre[cur] || 0) + 1;
        return pre;
    }, {})
    let numberStrings = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    let len = s.length;
    let res = []
    while (len) {
        numberStrings.forEach((num, index) => {
            let arr = num.split('');
            if (arr.every(c => charMap[c])) {
                res.push(index);
                arr.forEach(c => charMap[c]--);
            }
            len -= num.length;
        })
    }
    return res.sort((a, b) => a - b).reduce((pre, cur) => pre += cur, "")
};

// console.log(Array.from('one'));
// console.log('one'.split(''));
// console.log([1, 2, 3].every((item) => item >= 1));
// console.log(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].reduce);

console.log(originalDigits('zeroonetwothreefourfivesixseveneightnine'));

