/**
 * @Author: msc
 * @Date: 2021-11-30 17:15:55
 * @LastEditTime: 2021-12-01 15:50:13
 * @LastEditors: msc
 * @Description:
 */
import React, { useState, useEffect } from "react";
import api from "../apis/api";
function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);
  const [topList, setTopList] = useState([]);
  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
  }, [count]);

  useEffect(() => {
    (async () => {
      let response = await api.GET("http://localhost:3200/getTopLists");
      console.log(response.data);
      setTopList(response.data)
      
    })();
  }, []);
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

export default Example;
