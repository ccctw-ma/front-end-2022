/**
 * @Author: msc
 * @Date: 2022-02-07 23:54:04
 * @LastEditTime: 2022-02-11 23:11:41
 * @LastEditors: msc
 * @Description: 
 */


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const netEaseSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'netEase',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3300' }),
    // The "endpoints" represent operations and requests for this server
    endpoints: builder => ({

        login: builder.mutation({
            query: params => ({
                url: '/login/cellphone',
                method: "POST",
                body: params
            })
        }),

        // The `getPosts` endpoint is a "query" operation that returns data
        getHot: builder.query({
            // The URL for the request is '/fakeApi/posts'
            query: () => '/search/hot/detail'
        }),
        getMusic: builder.query({
            query: () => "/song/url?id=33894312"
        }),
        getPlayList: builder.query({
            query: listId => `/playlist/detail?id=${listId}`
        }),
        getMusicUrl: builder.mutation({
            query: musicId => ({
                url: `/song/url?id=${musicId}`,
                method: "GET"
            })
        }),
        //获取歌单的全部信息
        getAllMusicOfPlayList: builder.mutation({
            query: playListId => ({
                url: `/playlist/track/all?id=${playListId}`,
                method: "GET"
            })
        }),
        //搜索
        searchMusic: builder.mutation({
            query: keyWords =>({
                url:`/search?keywords=${keyWords}`,
                method: "GET"
            })
        })
    })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
    useGetHotQuery, useGetMusicQuery, useLoginMutation,
    useGetPlayListQuery, useGetMusicUrlMutation,useGetAllMusicOfPlayListMutation,
    useSearchMusicMutation
} = netEaseSlice
