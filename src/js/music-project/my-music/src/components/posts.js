/**
 * @Author: msc
 * @Date: 2021-12-08 21:28:11
 * @LastEditTime: 2021-12-08 21:28:11
 * @LastEditors: msc
 * @Description: 
 */


 import { Outlet } from "react-router-dom";

 function Posts() {
   return (
     <div style={{ padding: 20 }}>
       <h2>博客：</h2>
       {/* 渲染任何匹配的子级 */}
       <Outlet />
     </div>
   );
 }
 
 export default Posts;