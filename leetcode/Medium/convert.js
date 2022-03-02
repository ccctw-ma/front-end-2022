/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 * 6. Z 字形变换
 */
const convert = (s, numRows) => {
    if (numRows === 1) return s;
    let res = new Array(numRows).fill(0).map(_ => []);
    let i = 0;
    while (i < s.length) {
        for (let j = 0; i < s.length && j < numRows; j++) {
            res[j].push(s[i++]);
        }
        for (let j = numRows - 2; i < s.length && j >= 1; j--) {
            res[j].push(s[i++]);
        }
    }
    return res.map(e => e.join("")).join("");
};

const convert2 = (s, numRows) => {
    if (numRows === 1) return s;
    let res = new Array(numRows).fill("");
    let i = 0;
    while (i < s.length) {
        for (let j = 0; i < s.length && j < numRows; j++) {
            res[j] += s[i++];
        }
        for (let j = numRows - 2; i < s.length && j >= 1; j--) {
            res[j] += s[i++];
        }
    }
    return res.join("");
};


console.log(convert2(s = "PAYPALISHIRING", numRows = 3))

