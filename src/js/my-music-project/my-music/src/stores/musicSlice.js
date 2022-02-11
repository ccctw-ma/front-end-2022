/**
 * @Author: msc
 * @Date: 2022-02-10 20:51:24
 * @LastEditTime: 2022-02-10 21:48:04
 * @LastEditors: msc
 * @Description: 管理当前的音乐状态
 */


import { createSlice, createSelector } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'music',
    initialState: {
        currentMusic: {
            url: '',

        },
        musicList: []
    },
    reducers: {
        setCurrrentMusic: (state, actions) => {
            state.currentMusic = actions.payload;
        },
        setMusicList: (state, actions) => {
            state.musicList = actions.payload;
        }
    }
})

export const { setCurrrentMusic, setMusicList } = slice.actions;

//这个可以用作派生属性
// export const drivedInfo = state => state.info.value + "---derived"

export default slice.reducer;