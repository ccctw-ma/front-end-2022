/*
 * @Author: msc
 * @Date: 2022-06-14 10:58:52
 * @LastEditTime: 2022-06-14 11:18:47
 * @LastEditors: msc
 * @Description:
 */

import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <h1>
      WelCome To My React Learning App
      <Link to={"cssTest"}>cssTest</Link>
    </h1>
  );
}
