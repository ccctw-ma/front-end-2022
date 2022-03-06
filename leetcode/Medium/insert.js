/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */

const insert2 = (intervals, newInterval) => {
    const len = intervals.length;
    //没有交集的情况
    //1、空集
    if (len === 0) return [newInterval];
    let start = newInterval[0], end = newInterval[1];
    //2、在最左边
    if (end < intervals[0][0]) return [newInterval, ...intervals];
    //3、在最右边
    if (start > intervals[len - 1][1]) return [...intervals, newInterval];
    //4、整体在新区间内部
    if (start <= intervals[0][0] && end >= intervals[len - 1][1]) return [newInterval];
    //5、新区间在区间列表内 但不相交
    if (len > 2) {
        let index = -1;
        for (let i = 0; i < len - 1; i++) {
            let a = intervals[i][1], b = intervals[i + 1][0];
            if (start > a && end < b) index = i + 1;
        }
        if (index !== -1) return [...intervals.slice(0, index), newInterval, ...intervals.slice(0, len)]
    }

    //有交集的情况

    let left, right;
    intervals.forEach((interval, index) => {
        let a = interval[0], b = interval[1];
        if (start >= a && start <= b) {
            left = index;
        }
        if (end >= a && end <= b) {
            right = index;
        }
    })
    if (left && right) {
        newInterval = [Math.min(intervals[left][0], start), Math.max(intervals[right][1], end)]
        return [...intervals.slice(0, left), newInterval, ...intervals.slice(right + 1)];
    } else if (left) {
        for (let i = 0; i < len; i++) {
            if (start > intervals[i][1]) {
                left = i;
                break;
            }
        }
        left = left ?? len;
        newInterval = [Math.min(intervals[left][0], start), end]
        return [...intervals.slice(0, left), newInterval, ...intervals.slice(right + 1)];
    } else {

    }
};

const insert = (intervals, newInterval) => {
    let left = newInterval[0], right = newInterval[1];
    let placed = false;
    let res = [];
    intervals.forEach(interval => {
        if (interval[0] > right) {
            if (!placed) {
                res.push([left, right]);
                placed = true;
            }
            res.push(interval);
        } else if (interval[1] < left) {
            res.push(interval);
        } else {
            left = Math.min(left, interval[0]);
            right = Math.max(right, interval[1]);
        }
    })
    if (!placed) {
        res.push([left, right])
    }
    return res;
}

let arr = [1, 2, 3];
// console.log(arr.slice(0, 0))
console.log(insert(intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]))