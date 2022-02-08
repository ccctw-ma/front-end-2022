/**
 * @Author: msc
 * @Date: 2022-02-07 14:25:41
 * @LastEditTime: 2022-02-07 15:15:28
 * @LastEditors: msc
 * @Description: 1405. 最长快乐字符串
 */
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {string}
 */
const longestDiverseString = (a, b, c) => {
    const q = new PriorityQueue(a, b, c);
    let res = "", flag = true;
    while (flag) {
        let first = q.queue[0];
        //当前字符串长度不到2那么可以随便加
        if (res.length < 2) {
            res += first.key;
            q.queue[0].value--;
        } else {
            let len = res.length;
            if (res[len - 1] === res[len - 2]) {
                if (first.key === res[len - 1]) {
                    if (q.queue[1].value > 0) {
                        res += q.queue[1].key;
                        q.queue[1].value--;
                    } else {
                        flag = false;
                    }
                } else {
                    res += first.key;
                    q.queue[0].value--;
                }
            } else {
                if (first.value > 0) {
                    res += first.key;
                    q.queue[0].value--;
                } else {
                    flag = false;
                }
            }
        }
        q.sort();
    }
    return res;
};


class PriorityQueue {
    constructor(a, b, c) {
        this.queue = [
            {
                key: 'a',
                value: a
            },
            {
                key: 'b',
                value: b
            },
            {
                key: 'c',
                value: c
            }
        ]
        this.sort();
    }

    sort() {
        this.queue.sort((a, b) => b.value - a.value)
    }
}


console.log(longestDiverseString(1, 1, 7));
console.log(longestDiverseString(2, 2, 1));
console.log(longestDiverseString(7, 1, 0));

