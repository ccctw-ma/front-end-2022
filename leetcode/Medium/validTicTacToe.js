/**
 * @Author: msc
 * @Date: 2021-12-09 09:22:47
 * @LastEditTime: 2021-12-09 09:53:26
 * @LastEditors: msc
 * @Description: 794. 有效的井字游戏
 */

/**
 * @param {string[]} board
 * @return {boolean}
 */
var validTicTacToe = function (board) {
    let x = 0,
        o = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === 'X') x++;
            if (board[i][j] === 'O') o++;
        }
    }
    return !(x < o || x - o > 1 || (x === o && check(board, 'X') && x !== 0) || (check(board, 'O') && x > o));

};

const check = (board, c) => {
    let res = [];
    for (let i = 0; i < 3; i++) {
        res.push(board[i][0] === c && board[i][0] === board[i][1] && board[i][1] === board[i][2]);
        res.push(board[0][i] === c && board[0][i] === board[1][i] && board[1][i] === board[2][i]);
    }
    res.push(board[1][1] === c && board[0][0] === board[1][1] && board[1][1] === board[2][2]);
    res.push(board[1][1] === c && board[0][2] === board[1][1] && board[1][1] === board[2][0]);
    return res.some((b) => b);
};