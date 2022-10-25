/**
 * @Author: msc
 * @Date: 2022-02-07 23:53:37
 * @LastEditTime: 2022-02-07 23:54:39
 * @LastEditors: msc
 * @Description: 访问qq音乐相关资源
 */


 import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

 // Define our single API slice object
 export const qqSlice = createApi({
   // The cache reducer expects to be added at `state.api` (already default - this is optional)
   reducerPath: 'qq',
   // All of our requests will have URLs starting with '/fakeApi'
   baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3200' }),
   // The "endpoints" represent operations and requests for this server
   endpoints: builder => ({
     // The `getPosts` endpoint is a "query" operation that returns data
     getPosts: builder.query({
       // The URL for the request is '/fakeApi/posts'
       query: () => '/getSingerDesc?singermid=0025NhlN2yWrP4'
     })
   })
 })
 
 // Export the auto-generated hook for the `getPosts` query endpoint
 export const { useGetPostsQuery } = qqSlice