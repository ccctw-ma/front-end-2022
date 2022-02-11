/**
 * @Author: msc
 * @Date: 2022-02-08 23:31:13
 * @LastEditTime: 2022-02-08 23:31:13
 * @LastEditors: msc
 * @Description: 处理时间的函数
 */

export const timeFormatter = (value) => {
    //取整
    value = ~~value;
    let minute = ~~(value / 60);
    minute = minute < 10 ? "0" + minute : String(minute);
    let second = value % 60;
    second = second < 10 ? "0" + second : String(second);
    return minute + ":" + second;
};
