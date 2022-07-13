/**
 * @Author: msc
 * @Date: 2022-03-28 11:14:57
 * @LastEditTime: 2022-07-06 01:17:34
 * @LastEditors: msc
 * @Description: 
 */
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    desktop: true,
    setTitle: (title) => ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system'),
    startDrag: (fileName) => {
        ipcRenderer.send('ondragstart', fileName)
    }
})


contextBridge.exposeInMainWorld('myAPI', {
    miniMizeWindow: () => ipcRenderer.invoke('app:min'),
    closeWindow: () => ipcRenderer.invoke('app:close'),
    toggleMaxmize: () => ipcRenderer.invoke('app:toggle-max')
})