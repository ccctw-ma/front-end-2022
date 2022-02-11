/**
 * @Author: msc
 * @Date: 2022-01-27 23:49:04
 * @LastEditTime: 2022-02-10 20:54:54
 * @LastEditors: msc
 * @Description: store
 */



import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './couterSlice';
import infoSlice from './infoSlice';
import { apiSlice } from './apiSlice';
import { qqSlice } from './qqSlice';
import { netEaseSlice } from './netEaseSlice';
import musicSlice from './musicSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    info: infoSlice,
    music: musicSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [qqSlice.reducerPath]: qqSlice.reducer,
    [netEaseSlice.reducerPath]: netEaseSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(qqSlice.middleware).concat(netEaseSlice.middleware)


});
