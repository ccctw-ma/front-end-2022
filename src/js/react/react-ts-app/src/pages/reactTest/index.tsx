/*
 * @Author: msc
 * @Date: 2022-06-24 10:40:36
 * @LastEditTime: 2022-06-24 11:22:12
 * @LastEditors: msc
 * @Description:
 */

import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Index() {
  return (
    <div>
      <h1>THis is my React</h1>
      <div>
        <Link to={"hooks"}>to Hooks</Link>
      </div>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
}
