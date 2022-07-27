/*
 * @Author: msc
 * @Date: 2022-07-19 21:35:37
 * @LastEditTime: 2022-07-26 22:48:18
 * @LastEditors: msc
 * @Description:
 */

import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Modules() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 7fr",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        minWidth: "1024px",
      }}
    >
      <div style={{}}>
       
      </div>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
