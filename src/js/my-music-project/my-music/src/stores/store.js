/**
 * @Author: msc
 * @Date: 2022-01-27 23:49:04
 * @LastEditTime: 2022-01-28 21:21:21
 * @LastEditors: msc
 * @Description: store
 */



import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './couterSlice';
import infoSlice from './infoSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    info:infoSlice
  },
});
