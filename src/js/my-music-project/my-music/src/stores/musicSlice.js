/**
 * @Author: msc
 * @Date: 2022-02-10 20:51:24
 * @LastEditTime: 2022-02-21 20:56:12
 * @LastEditors: msc
 * @Description: 管理当前的音乐状态
 */


import { createSlice, createSelector } from "@reduxjs/toolkit";
import { musicFormatter } from "../utils"
export const slice = createSlice({
    name: 'music',
    initialState: {
        currentMusic: {
            _from: '',
            _id: "",
            _name: "",
            _singerName: "",
            _album: "",
            _time: "",
            _musicUrl: "",
            _coverUrl: ""

        },
        musicList: {
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
        },
        currentKeyWords: ""
    },
    reducers: {
        setCurrrentMusic: (state, actions) => {
            state.currentMusic = actions.payload;
        },
        setMusicList: (state, actions) => {
            const { type, songs, total } = actions.payload;
            // 将不同来源的歌曲数据统一起来
            state.musicList[type].songs = musicFormatter(type, songs);
            state.musicList[type].total = total;
        },
        setCurrrentKeyWords: (state, actions) => {
            state.currentKeyWords = actions.payload;
        }
    }
})

export const { setCurrrentMusic, setMusicList, setCurrrentKeyWords } = slice.actions;

//这个可以用作派生属性
// export const drivedInfo = state => state.info.value + "---derived"

export default slice.reducer;