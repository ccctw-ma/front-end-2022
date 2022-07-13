/**
 * @Author: msc
 * @Date: 2022-07-06 01:05:19
 * @LastEditTime: 2022-07-12 00:11:23
 * @LastEditors: msc
 * @Description: 
 */



const { app, ipcMain } = require('electron');


const configTitleBarEvent = (win) => {

    console.log("配置点击事件");
    ipcMain.handle('app:min', () => {
        win.minimize();
    })

    ipcMain.handle('app:close', () => {
        win.close();
    })

    ipcMain.handle('app:toggle-max', () => {
        const isMax = win.isMaximized();

        console.log(win.isMaximized());
        if (isMax) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    })
}


module.exports = configTitleBarEvent