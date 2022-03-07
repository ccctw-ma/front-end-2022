/**
 * @param {number} num
 * @return {number}
 */
const addDigits = (num) => {
    return (num - 1) % 9 + 1;
};

console.log(addDigits(64));