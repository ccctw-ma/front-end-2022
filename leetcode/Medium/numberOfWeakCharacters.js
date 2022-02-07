/**
 * @Author: msc
 * @Date: 2022-01-28 15:17:29
 * @LastEditTime: 2022-01-28 16:07:19
 * @LastEditors: msc
 * @Description:
 */

/**
 * @param {number[][]} properties
 * @return {number}
 */
var numberOfWeakCharacters = function (properties) {
    let arr = properties.reduce((pre, cur) => {
        let a = cur[0], d = cur[1];
        let temp = pre[a] === 0 ? [] : pre[a];
        temp.push(d);
        pre[a] = temp;
        return pre;
    }, new Array(100001).fill(0));
    let res = 0, max = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === 0) continue;
        let tempArr = arr[i];
        let tempMax = 0;
        tempArr.forEach((element) => {
            if (element < max) res++;
            tempMax = Math.max(element, tempMax);
        });
        max = Math.max(max, tempMax);
    }
    return res;
};




const numberOfWeakCharacters = properties => {
    properties.sort((a, b) => {
        return a[0] === b[0] ? a[1] - b[1] : b[0] - a[0];
    })
    let res = 0, max = 0;
    properties.forEach(p => {
        if (p[1] < max) {
            res++;
        } else {
            max = p[1];
        }
    })
    return res;
}


console.log(numberOfWeakCharacters((properties = [[1, 5], [10, 4], [4, 3]])));


var numberOfWeakCharacters = function (properties) {
    properties.sort((o1, o2) => {
        return o1[0] === o2[0] ? (o2[1] - o1[1]) : (o1[0] - o2[0]);
    });
    let ans = 0;
    const st = [];
    for (const p of properties) {
        while (st.length && st[st.length - 1] < p[1]) {
            st.pop();
            ans++;
        }
        st.push(p[1]);
    }
    return ans;
};
