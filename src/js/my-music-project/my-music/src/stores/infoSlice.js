/* eslint-disable no-unused-vars */
/**
 * @Author: msc
 * @Date: 2022-01-28 21:05:53
 * @LastEditTime: 2022-02-07 17:25:19
 * @LastEditors: msc
 * @Description: 
 */


import { createSlice, createSelector } from "@reduxjs/toolkit";
import API from "../apis/api"
export const slice = createSlice({

    name: 'info',
    initialState: {
        value: "index"
    },
    reducers: {
        setInfo: (state, actions) => {
            state.value = actions.payload;
        },

    }
})

export const infoActions = slice.actions;

export const infoAsyncActions = {
    initInfo: () => {
        return async (dispatch, getState) => {
            try {
                const res = await API.GET("/test/hello")
                if (res.status === 200) {
                    dispatch(infoActions.setInfo(res.data))
                } else {
                    throw Error(res.message);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

}


//这个可以用作派生属性
export const drivedInfo = state => state.info.value + "---derived"

export default slice.reducer;