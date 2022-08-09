/**
 * @Author: msc
 * @Date: 2022-07-29 00:29:38
 * @LastEditTime: 2022-07-29 00:36:41
 * @LastEditors: msc
 * @Description: 
 */

import { atom } from "recoil";


export const windowState = atom({
    key: 'windowState',
    default: {
        isMax: false,
        isMin: false,
    }
})