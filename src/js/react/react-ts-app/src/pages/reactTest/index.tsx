/*
 * @Author: msc
 * @Date: 2022-06-24 10:40:36
 * @LastEditTime: 2022-07-12 20:58:41
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
        <Link to={"recoil"}> to Recoil</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
