/*
 * @Author: msc
 * @Date: 2022-06-14 10:58:52
 * @LastEditTime: 2022-06-24 11:20:02
 * @LastEditors: msc
 * @Description:
 */

import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <h1>
      WelCome To My React Learning App
      <br />
      <Link to={"cssTest"}>cssTest</Link>
      <br />
      <Link to={"reactTest"}>reactTest</Link>
    </h1>
  );
}
