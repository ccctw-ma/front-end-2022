/*
 * @Author: msc
 * @Date: 2022-07-29 01:05:39
 * @LastEditTime: 2022-07-29 01:24:19
 * @LastEditors: msc
 * @Description: 
 */

export interface MyElectronAPI {
    desktop: boolean;
    setTitle(title: string): void;
    async openFile(): void;
    handleCounter(callback: any): void;
    async toggle(): boolean;
    async system(): void;
    startDrag(fileName: string): void;
}

declare global {
    interface Window {
        electronAPI: MyElectronAPI
    }
}


export interface MyAPI {
    miniMizeWindow(): void;
    closeWindow(): void;
    toggleMaxmize(): void;
}

declare global {
    interface Window {
        myAPI: MyAPI
    }
}
