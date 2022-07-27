/**
 * @Author: msc
 * @Date: 2022-03-27 17:45:22
 * @LastEditTime: 2022-07-12 01:32:57
 * @LastEditors: msc
 * @Description:
 */

// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, screen, webFrame } = require("electron");
const path = require("path");
const configTitleBarEvent = require('./src/config/titleBar');

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

async function createWindow() {

    console.log(screen.getPrimaryDisplay());
    const { size: { width, height }, scaleFactor } = screen.getPrimaryDisplay();
    // console.log(width, height, scaleFactor);
    //创建浏览器窗口,宽高自定义具体大小你开心就好
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 640,

        //预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境。
        webPreferences: {
            preload: path.join(__dirname, "./src/config/preload.js"),
            // nodeIntegrationInWorker: true
            zoomFactor: 1.0
        },
        frame: false,
        backgroundColor: '#000'
    });



    mainWindow.once('ready-to-show', () => {
        mainWindow.webContents.setZoomFactor(1.0);
        mainWindow.show();

    })
    // 打开开发者工具，默认不打开
    mainWindow.webContents.openDevTools();

    // 关闭window时触发下列事件.
    mainWindow.on("closed", function () {
        mainWindow = null;
    });

    // 注册相关事件
    //注册标题栏的相关事件
    configTitleBarEvent(mainWindow);
    // 加载应用----适用于 react 项目

    // mainWindow.loadFile('./public/index.html');
    await mainWindow.loadURL("http://localhost:3000/");

}


// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法 
app.on("ready", createWindow);

// 所有窗口关闭时退出应用.
app.on("window-all-closed", function () {
    // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on('before-quit', () => {
    console.log("this app will close soon");
})

app.on("activate", function () {
    // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
    if (mainWindow === null) {
        createWindow();
    }
});
// 你可以在这个脚本中续写或者使用require引入独立的js文件.
