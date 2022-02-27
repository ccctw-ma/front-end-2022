/**
 * @Author: msc
 * @Date: 2022-02-17 14:41:41
 * @LastEditTime: 2022-02-17 15:44:50
 * @LastEditors: msc
 * @Description: 688. 骑士在棋盘上的概率
 */
/**
 * @param {number} n
 * @param {number} k
 * @param {number} row
 * @param {number} column
 * @return {number}
 */
var knightProbability = function (n, k, row, column) {
    const directions = [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [1, -2], [-1, 2], [1, 2]];
    let dp = new Array(n).fill().map(_ => new Array(n).fill(1));
    while (k !== 0) {
        let temp = new Array(n).fill().map(_ => new Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let count = 0;
                for (let d = 0; d < directions.length; d++) {
                    let nx = i + directions[d][0];
                    let ny = j + directions[d][1];
                    if (nx >= 0 && nx < n && ny >= 0 && ny < n) {
                        count += dp[nx][ny];
                    }
                }
                temp[i][j] = count / 8;
            }
        }
        dp = temp;
        k--;
    }
    return dp[row][column];
};

console.log(knightProbability(n = 3, k = 2, row = 0, column = 0));

