/**
 * @Author: msc
 * @Date: 2022-02-12 16:28:57
 * @LastEditTime: 2022-02-12 16:55:32
 * @LastEditors: msc
 * @Description: 1020. 飞地的数量
 */
/**
 * @param {number[][]} grid
 * @return {number}
 */
const numEnclaves = (grid) => {
    let res = 0;
    const m = grid.length, n = grid[0].length;
    const direction = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const dfs = (grid, x, y) => {
        if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] === 1) {
            grid[x][y] = 0;
            for (let i = 0; i < 4; i++) {
                let nx = x + direction[i][0];
                let ny = y + direction[i][1];
                dfs(grid, nx, ny);
            }
        }
    }
    for (let i = 0; i < n; i++) {
        if (grid[0][i] === 1) dfs(grid, 0, i);
        if (grid[m - 1][i] === 1) dfs(grid, m - 1, i);
    }
    for (let i = 1; i < m - 1; i++) {
        if (grid[i][0] === 1) dfs(grid, i, 0);
        if (grid[i][n - 1] === 1) dfs(grid, i, n - 1);
    }
    for (let i = 1; i < m - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
            if (grid[i][j] === 1) res++;
        }
    }
    return res;
};


console.log(numEnclaves(grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]));




