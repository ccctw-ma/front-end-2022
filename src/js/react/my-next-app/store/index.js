/**
 * @Author: msc
 * @Date: 2022-05-02 22:37:21
 * @LastEditTime: 2022-05-03 18:09:09
 * @LastEditors: msc
 * @Description: 状态管理集
 */

import { atom } from "recoil";

export const curMusicState = atom({
    key: "curMusic",
    default: {
        _from: "",
        _id: "",
        _name: "",
        _singerName: "",
        _album: "",
        _time: "",
        _lyricsUrl:"",
        _musicUrl: "",
        _coverUrl: "",
        raw: {}
    },
});

export const musicListState = atom({
    key: 'musicList',
    default: {
        netEase: {
            total: 0,
            songs: []
        },
        qq: {
            total: 0,
            songs: []
        },
        bilibili: {
            total: 0,
            songs: []
        },
        migu: {
            total: 0,
            songs: []
        }
    }
});

export const keyWordsState = atom({
    key: 'keyWords',
    default: ''
})


