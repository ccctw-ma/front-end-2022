/**
 * @Author: msc
 * @Date: 2022-02-07 23:54:04
 * @LastEditTime: 2022-02-08 00:13:18
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
        // The `getPosts` endpoint is a "query" operation that returns data
        getHot: builder.query({
            // The URL for the request is '/fakeApi/posts'
            query: () => '/search/hot/detail'
        }),
        getMusic: builder.query({
            query: () => "/song/url?id=33894312"
        })
    })
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetHotQuery, useGetMusicQuery } = netEaseSlice
