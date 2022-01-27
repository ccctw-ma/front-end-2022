/**
 * @Author: msc
 * @Date: 2021-12-08 20:22:49
 * @LastEditTime: 2021-12-08 20:22:50
 * @LastEditors: msc
 * @Description: react-router
 */


 import React, { useState, useEffect } from "react";
 import api from "../apis/api";
 function RouterTest() {
   // 声明一个新的叫做 “count” 的 state 变量
   const [count, setCount] = useState(0);
   const [topList, setTopList] = useState([]);
   // 相当于 componentDidMount 和 componentDidUpdate:
   useEffect(() => {
     // 使用浏览器的 API 更新页面标题
     document.title = `You clicked ${count} times`;
   }, [count]);
 

   return (
     <div>
       <p>You clicked {count} times</p>
       <button onClick={() => setCount(count + 1)}>Click me</button>
       {/* <div>{topList.map(list=>{
         return <span>{String(list)}</span>
       })}</div> */}
     </div>
   );
 }
 
 export default RouterTest;
 