/**
 * @Author: msc
 * @Date: 2021-12-09 20:45:42
 * @LastEditTime: 2021-12-09 20:55:19
 * @LastEditors: msc
 * @Description:
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Expenses from "./expenses";
import Invoices from "./invoices";
import Invoice from "./invoice";
import Home from "./Home"
import App from "../App";



const Router = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="home" element={<Home/>}/>
        <Route path="invoices" element={<Invoices />}>
          <Route
            index
            element={
              <main style={{ padding: "1rem" }}>
                <p>Select an invoice</p>
              </main>
            }
          />
          <Route path=":invoiceId" element={<Invoice />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
