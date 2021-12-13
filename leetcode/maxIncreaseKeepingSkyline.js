/**
 * @Author: msc
 * @Date: 2021-12-13 09:07:04
 * @LastEditTime: 2021-12-13 09:42:12
 * @LastEditors: msc
 * @Description: 807. 保持城市天际线
 */


/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxIncreaseKeepingSkyline = function (grid) {
    let rowMax = [],
        colMax = [];
    for (let i = 0; i < grid.length; i++) {
        let rolmax = grid[i][0];
        let colmax = grid[0][i];
        for (let j = 1; j < grid.length; j++) {
            rolmax = Math.max(rolmax, grid[i][j]);
            colmax = Math.max(colmax, grid[j][i]);
        }
        rowMax.push(rolmax);
        colMax.push(colmax);
    }
    console.log(rowMax, colMax);
    let res = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            let temp = Math.min(rowMax[i], colMax[j]);
            res += temp - grid[i][j];
        }
    }
    return res;
};

// console.log(maxIncreaseKeepingSkyline([[3,0,8,4],[2,4,5,7],[9,2,6,3],[0,3,1,0]]))