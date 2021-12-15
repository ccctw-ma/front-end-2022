/**
 * @Author: msc
 * @Date: 2021-12-15 14:06:49
 * @LastEditTime: 2021-12-15 15:10:36
 * @LastEditors: msc
 * @Description: 851. 喧闹和富有
 */


/**
 * @param {number[][]} richer
 * @param {number[]} quiet
 * @return {number[]}
 */
var loudAndRich = function (richer, quiet) {
    let richTree = richer.reduce((pre, cur) => {
        let a = cur[0],
            b = cur[1];
        let arr = pre[b] || [];
        arr.push(a);
        pre[b] = arr;
        return pre;
    }, {})
    return quiet.reduce((pre, _, index) => {
        if (richTree[index] && richTree[index].length!==0) {
            let min = quiet[index], minIndex = index;
            let arr = richTree[index];
            while(arr.length!==0){
                let s = new Set();
                arr.forEach(rich=>{
                    if(quiet[rich]<min){
                        min = quiet[rich];
                        minIndex = rich;
                    }
                    richTree[rich]?.forEach(item=>s.add(item));
                });
                arr = [...s];
            }
            pre[index] = minIndex;
        }
        return pre;
    }, new Array(quiet.length).fill(0).map((_, index) => index));
};

console.log(loudAndRich(richer = [
    [1, 0],
    [2, 1],
    [3, 1],
    [3, 7],
    [4, 3],
    [5, 3],
    [6, 3]
], quiet = [3, 2, 5, 4, 6, 1, 7, 0]))


var loudAndRich = function(richer, quiet) {
    const n = quiet.length;
    const g = new Array(n).fill(0);
    for (let i = 0; i < n; ++i) {
        g[i] = [];
    }
    const inDeg = new Array(n).fill(0);
    for (const r of richer) {
        g[r[0]].push(r[1]);
        ++inDeg[r[1]];
    }

    const ans = new Array(n).fill(0);
    for (let i = 0; i < n; ++i) {
        ans[i] = i;
    }
    const q = [];
    for (let i = 0; i < n; ++i) {
        if (inDeg[i] === 0) {
            q.push(i);
        }
    }
    while (q.length) {
        const x = q.shift();
        for (const y of g[x]) {
            if (quiet[ans[x]] < quiet[ans[y]]) {
                ans[y] = ans[x]; // 更新 x 的邻居的答案
            }
            if (--inDeg[y] === 0) {
                q.push(y);
            }
        }
    }
    return ans;
};