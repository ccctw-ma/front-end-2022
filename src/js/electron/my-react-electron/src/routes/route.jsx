/*
 * @Author: msc
 * @Date: 2022-03-28 10:27:33
 * @LastEditTime: 2022-03-28 10:34:10
 * @LastEditors: msc
 * @Description:
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";

const Router = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
          <Route path="home" element={(
              <div>
                  Hello world
              </div>
          )} />
      </Route>
    </Routes>
  </BrowserRouter>
);


export default Router