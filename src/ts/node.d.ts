/*
 * @Author: msc
 * @Date: 2022-07-18 22:41:50
 * @LastEditTime: 2022-07-18 23:44:11
 * @LastEditors: msc
 * @Description: 
 */

declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }
}
