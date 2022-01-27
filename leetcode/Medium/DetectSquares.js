const DetectSquares = function () {
    this.xmap = new Map();
    this.ymap = new Map();
    this.pointMap = new Map();
};

/**
 * @param {number[]} point
 * @return {void}
 */
DetectSquares.prototype.add = function (point) {
    let x = point[0],
        y = point[1];
    let arr1 = this.xmap.get(x) ?? [];
    arr1.push(point);
    this.xmap.set(x, arr1);
    let arr2 = this.ymap.get(y) ?? [];
    arr2.push(point);
    this.ymap.set(y, arr2);
    let s = x + "_" + y;
    this.pointMap.set(s, (this.pointMap.get(s) ?? 0) + 1);
};

/**
 * @param {number[]} point
 * @return {number}
 */
DetectSquares.prototype.count = function (point) {
    let x = point[0],
        y = point[1];
    let xarr = this.xmap.get(x);
    let yarr = this.ymap.get(y);
    let res = 0;
    if (xarr && yarr) {
        for (let i = 0; i < xarr.length; i++) {
            let xx = xarr[i];
            if (xx[1] === y) continue;
            let len = Math.abs(xx[1] - y);
            for (let j = 0; j < yarr.length; j++) {
                let yy = yarr[j];
                if (yy[0] === x || Math.abs(yy[0] - x) !== len) continue;
                let tar = yy[0] + "_" + xx[1];
                res += this.pointMap.get(tar) ?? 0;
            }
        }
    }
    return res;
};

/**
 * Your DetectSquares object will be instantiated and called as such:
 * var obj = new DetectSquares()
 * obj.add(point)
 * var param_2 = obj.count(point)
 */

const detectSquares = new DetectSquares();
detectSquares.add([3, 10]);
detectSquares.add([11, 2]);
detectSquares.add([3, 2]);
console.log(detectSquares.count([11, 10]));
// 返回 1 。你可以选择：
//   - 第一个，第二个，和第三个点
console.log(detectSquares.count([14, 8]));; // 返回 0 。查询点无法与数据结构中的这些点构成正方形。
detectSquares.add([11, 2]); // 允许添加重复的点。
console.log(detectSquares.count([11, 10]));; // 返回 2 。你可以选择：
//   - 第一个，第二个，和第三个点
//   - 第一个，第三个，和第四个点







var DetectSquares = function() {
    this.cnt = new Map();
};

DetectSquares.prototype.add = function(point) {
    const x = point[0], y = point[1];
    if (!this.cnt.has(y)) {
        this.cnt.set(y, new Map());
    }
    const yCnt = this.cnt.get(y);
    yCnt.set(x, (yCnt.get(x) || 0) + 1);
};

DetectSquares.prototype.count = function(point) {
    let res = 0;
    let x = point[0], y = point[1];
    if (!this.cnt.has(y)) {
        return 0;
    }
    const yCnt = this.cnt.get(y);
    const entries = this.cnt.entries();
    for (const [col, colCnt] of entries) {
        if (col !== y) {
            let l = Math.abs(col - y);
            res += (colCnt.get(x) || 0) * (yCnt.get(x + l) || 0) * (colCnt.get(x + l) || 0);
            res += (colCnt.get(x) || 0) * (yCnt.get(x - l) || 0) * (colCnt.get(x - l) || 0);
        }
    }
    return res;
};