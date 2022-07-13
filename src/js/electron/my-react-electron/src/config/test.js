
/**
 * @Author: msc
 * @Date: 2022-03-27 17:45:22
 * @LastEditTime: 2022-07-06 01:18:26
 * @LastEditors: msc
 * @Description:
 */

// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem, nativeTheme, globalShortcut, Notification } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const https = require("https");

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

let processInterval

async function createWindow() {
    //创建浏览器窗口,宽高自定义具体大小你开心就好
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 640,
        //预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境。
        webPreferences: {
            preload: path.join(__dirname, "./src/config/preload.js"),
            // nodeIntegrationInWorker: true
        },
        frame: false,
        // titleBarStyle: 'hidden',
        // titleBarOverlay: {
        //     color: '#2f3241',
        //     symbolColor: '#74b1be'
        // }
        // titleBarOverlay: true,
        // transparent: true,
        backgroundColor: '#000'
    });

    /* 
       * 加载应用-----  electron-quick-start中默认的加载入口
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, './build/index.html'),
          protocol: 'file:',
          slashes: true
        }))
      */
    // 加载应用----适用于 react 项目
    await mainWindow.loadURL("http://localhost:3000/");

    // 打开开发者工具，默认不打开
    mainWindow.webContents.openDevTools();

    // 关闭window时触发下列事件.
    mainWindow.on("closed", function () {
        mainWindow = null;
    });


    const INCREMENT = 0.03;
    const INTERVAL_DELAY = 100;
    let c = 0;
    // 设置下标的进度条
    // processInterval = setInterval(() => {
    //     mainWindow.setProgressBar(c);

    //     if (c < 2) {
    //         c += INCREMENT;
    //     } else {
    //         c = (- INCREMENT * 5);
    //     }
    // }, INTERVAL_DELAY)


    const menu = Menu.getApplicationMenu();
    menu.append(
        new MenuItem({
            label: app.name,
            submenu: [
                {
                    label: 'Increment',
                    click: () => mainWindow.webContents.send('update-counter', 1),
                },
                {
                    label: 'Decrement',
                    click: () => mainWindow.webContents.send('update-counter', -1)
                }
            ]
        })
    )
    //本地快捷键
    menu.append(new MenuItem({
        label: "Electron",
        submenu: [{
            role: "help",
            accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
            click: () => { console.log('Electron rocks'); }
        }]
    }))

    // 全局快捷键
    globalShortcut.register('Alt+CommandOrControl+I', () => {
        console.log('Electron loves global shortcuts');
    })
    // const menu = Menu.buildFromTemplate([
    // ])
    Menu.setApplicationMenu(menu);

    // const contents = mainWindow.webContents;
    // console.log(contents);
    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        // console.log(title);
        win.setTitle(title);
    })

    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog();
        if (canceled) {
            return
        } else {
            return filePaths[0];
        }
    })

    ipcMain.on('counter-value', (event, value) => {
        console.log(value);
    })

    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })

    const iconName = path.join(__dirname, 'iconForDragAndDrop.png');
    // const icon = fs.createWriteStream(iconName);

    fs.writeFileSync(path.join(__dirname, 'drag-and-drop-1.md'), '#First file to test drag and drop');
    fs.writeFileSync(path.join(__dirname, 'drag-and-drop-2.md'), '#Second file to test drag and drop file');
    // https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
    //     response.pipe(icon);
    // })

    ipcMain.on('ondragstart', (e, f) => {
        e.sender.startDrag({
            file: path.join(__dirname, f),
            icon: iconName
        })
    })
}
// 显示通知
const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BOTY = 'Notification from the Main process'

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法 这个功能在win10需要特殊配置
// app.on("ready", createWindow);
app.whenReady().then(createWindow).then(() => {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BOTY })
})
// 所有窗口关闭时退出应用.
app.on("window-all-closed", function () {
    // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on('before-quit', () => {
    clearInterval(processInterval);
})

app.on("activate", function () {
    // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
    if (mainWindow === null) {
        createWindow();
    }
});
// 你可以在这个脚本中续写或者使用require引入独立的js文件.
