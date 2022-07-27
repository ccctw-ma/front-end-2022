/**
 * @Author: msc
 * @Date: 2022-06-14 10:48:24
 * @LastEditTime: 2022-06-15 22:52:53
 * @LastEditors: msc
 * @Description:
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../pages/App";
import CssTest from "../pages/cssTest";
import Loading from "../pages/cssTest/loading";
import Hooks from "../pages/hooks";
import UseEffect from "../pages/hooks/useEffect";

const Router = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App></App>}></Route>
      <Route path="cssTest" element={<CssTest></CssTest>}>
        <Route path="loading" element={<Loading></Loading>}></Route>
      </Route>
      <Route path="hooks" element={<Hooks></Hooks>}>
        <Route path="useEffect" element={<UseEffect></UseEffect>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
