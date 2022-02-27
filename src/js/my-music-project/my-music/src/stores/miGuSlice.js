/**
 * @Author: msc
 * @Date: 2022-02-19 00:08:20
 * @LastEditTime: 2022-02-21 21:27:47
 * @LastEditors: msc
 * @Description: 获取咪咕音乐数据
 */


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const miGuSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'miGuMusic',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7977' }),
    // The "endpoints" represent operations and requests for this server
    endpoints: builder => ({
        //搜索
        searchMusicByMiGu: builder.mutation({
            query: ({ keywords, page = 1 }) => ({
                url: `/migu/search?key=${keywords}&page=${page}`,
                method: "GET"
            })
        })
    })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
    useSearchMusicByMiGuMutation
} = miGuSlice