/**
 * @Author: msc
 * @Date: 2022-01-29 16:51:29
 * @LastEditTime: 2022-01-29 17:41:04
 * @LastEditors: msc
 * @Description: 1765. 地图中的最高点
 */


/**
 * @param {number[][]} isWater
 * @return {number[][]}
 */
const highestPeak = (isWater) => {
    const direction = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let row = isWater.length;
    let col = isWater[0].length;
    let res = new Array(row).fill().map(() => new Array(col).fill(-1))
    let queue = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (isWater[i][j] === 1) {
                res[i][j] = 0;
                queue.push([i, j]);
            }
        }
    }
    while (queue.length !== 0) {
        const temp = [];
        for (let [x, y] of queue) {
            for (let i = 0; i < direction.length; i++) {
                let nx = x + direction[i][0];
                let ny = y + direction[i][1];
                if (nx >= 0 && nx < row && ny >= 0 && ny < col && res[nx][ny] === -1) {
                    res[nx][ny] = res[x][y] + 1;
                    temp.push([nx, ny]);
                }
            }
        }
        queue = temp;
    }
    return res;
};


const isWater = [[0, 0, 1], [1, 0, 0], [0, 0, 0]]

console.dir(isWater)

console.table(highestPeak(isWater));