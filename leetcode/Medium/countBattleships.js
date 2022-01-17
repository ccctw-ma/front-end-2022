/**
 * @Author: msc
 * @Date: 2021-12-18 12:05:55
 * @LastEditTime: 2021-12-18 12:20:00
 * @LastEditors: msc
 * @Description: 419. 甲板上的战舰
 */


/**
 * @param {character[][]} board
 * @return {number}
 */
var countBattleships = function (board) {
    let res = 0;
    const direction = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];
    const dfs = (x, y, board) => {
        for (let dir of direction) {
            let nx = x + dir[0],
                ny = y + dir[1];
            while (nx >= 0 && nx < board.length && ny >= 0 && ny < board[0].length && board[nx][ny] === 'X') {
                board[nx][ny] = '.';
                nx = nx + dir[0], ny = ny + dir[1]
            }
        }
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 'X') {
                board[i][j] = '.';
                dfs(i, j, board);
                res++;
            }
        }
    }
    return res;
};


console.log(countBattleships(board = [
    ["X", ".", ".", "X"],
    [".", ".", ".", "X"],
    [".", ".", ".", "X"]
]))