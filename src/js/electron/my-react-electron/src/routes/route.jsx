/*
 * @Author: msc
 * @Date: 2022-03-28 10:27:33
 * @LastEditTime: 2022-06-25 01:13:35
 * @LastEditors: msc
 * @Description:
 */

import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "../pages/index"

const Router = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>

      </Route>
      <Route path="home" element={<Home/>} />
    </Routes>
  </HashRouter>
);


export default Router