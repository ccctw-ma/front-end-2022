/**
 * @Author: msc
 * @Date: 2022-02-05 20:09:37
 * @LastEditTime: 2022-02-05 20:40:24
 * @LastEditors: msc
 * @Description: 1219. 黄金矿工
 */


/**
 * @param {number[][]} grid
 * @return {number}
 */
var getMaximumGold = function (grid) {
    const direction = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let res = 0;
    const row = grid.length, col = grid[0].length;
    const visited = new Array(row).fill().map(_ => new Array(col).fill(0));
    const trace = (grid, x, y, count) => {
        for (let i = 0; i < 4; i++) {
            let nx = x + direction[i][0];
            let ny = y + direction[i][1];
            if (nx >= 0 && nx < row && ny >= 0 && ny < col && visited[nx][ny] !== 1 && grid[nx][ny] !== 0) {
                visited[nx][ny] = 1;
                count += grid[nx][ny];
                trace(grid, nx, ny, count);
                count -= grid[nx][ny];
                visited[nx][ny] = 0;
            } else {
                res = Math.max(res, count);
            }
        }
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (grid[i][j] !== 0) {
                visited[i][j] = 1;
                trace(grid, i, j, grid[i][j]);
                visited[i][j] = 0;
            }
        }
    }
    return res;
};


console.log(getMaximumGold(grid = [[1, 0, 7], [2, 0, 6], [3, 4, 5], [0, 3, 0], [9, 0, 20]]));

