/*
 * @Author: msc
 * @Date: 2022-03-28 10:27:33
 * @LastEditTime: 2022-07-12 00:12:59
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
        <Route  index element={<Home />} />
      </Route>
    </Routes>
  </HashRouter>
);


export default Router