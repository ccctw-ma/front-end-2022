/**
 * @Author: msc
 * @Date: 2022-03-28 11:14:57
 * @LastEditTime: 2022-03-28 11:16:17
 * @LastEditors: msc
 * @Description: 
 */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    desktop: true
})