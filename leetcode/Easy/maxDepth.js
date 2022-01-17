/**
 * @param {string} s
 * @return {number}
 */
var maxDepth = function (s) {
    let stack = [];
    let max = 0;
    s.split('').forEach(c => {
        if (c === '(') {
            stack.push('(')
        } else if (c === ')') {
            stack.pop()
        }
        max = Math.max(max, stack.length)
    })
    return max
};

console.log(maxDepth("(1+(2*3)+((8)/4))+1"))