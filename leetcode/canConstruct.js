/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean} 383. 赎金信
 */
var canConstruct = function (ransomNote, magazine) {
    const a = magazine.split('').reduce((pre, cur) => {
        pre[cur.charCodeAt('a') - 97]++;
        return pre;
    }, new Array(26).fill(0))
    return ransomNote.split('').every(c => --a[c.charCodeAt('a') - 97] >= 0)
};


console.log(canConstruct('aa', 'aab'));
