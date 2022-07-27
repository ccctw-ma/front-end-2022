/*
 * @Author: msc
 * @Date: 2022-07-04 21:11:21
 * @LastEditTime: 2022-07-06 01:34:20
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

