/**
 * @param {string[]} timePoints
 * @return {number}
 */
const findMinDifference = function (timePoints) {
    //按时间进行排序
    timePoints.sort((a, b) => {
        let x = a.split(":");
        let y = b.split(":");
        let xh = Number(x[0]), xm = Number(x[1]);
        let yh = Number(y[0]), ym = Number(y[1]);
        if (xh === yh) return xm - ym;
        return xh - yh;
    })
    let min = Number.MAX_VALUE;
    const calculateDiff = (a, b) => {
        let x = a.split(":");
        let y = b.split(":");
        let xh = Number(x[0]), xm = Number(x[1]);
        let yh = Number(y[0]), ym = Number(y[1]);
        return (yh - xh) * 60 + ym - xm;
    }
    for (let i = 0; i < timePoints.length - 1; i++) {
        let a = timePoints[i];
        let b = timePoints[i + 1];
        min = Math.min(min, calculateDiff(a, b));
    }
    return Math.min(min, calculateDiff("0:0", timePoints[0]) + calculateDiff(timePoints[timePoints.length - 1], "24:00"));
};

console.log(findMinDifference(timePoints =
    ["23:59", "00:00"]))


