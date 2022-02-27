/**
 * @Author: msc
 * @Date: 2022-02-15 15:08:30
 * @LastEditTime: 2022-02-15 15:16:07
 * @LastEditors: msc
 * @Description: 1380. 矩阵中的幸运数
 */
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
const luckyNumbers = (matrix) => {
    let rowMin = [], colMax = [];
    for (let i = 0; i < matrix.length; i++) {
        let min = matrix[i][0];
        for (let j = 1; j < matrix[0].length; j++) {
            min = Math.min(min, matrix[i][j]);
        }
        rowMin.push(min);
    }
    for (let i = 0; i < matrix[0].length; i++) {
        let max = matrix[0][i];
        for (let j = 1; j < matrix.length; j++) {
            max = Math.max(max, matrix[j][i]);
        }
        colMax.push(max);
    }
    let res = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === rowMin[i] && matrix[i][j] === colMax[j]) {
                res.push(matrix[i][j]);
            }
        }
    }
    return res;
};


console.log(luckyNumbers(matrix = [[1,10,4,2],[9,3,8,7],[15,16,17,12]]));

