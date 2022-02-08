//no-unused-vars
import "./App.css";
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./stores/store";
import style from "./styles/App.module.css";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <div className={style.main}>
          {/* <div className={style.mainContent}> */}
          <Header />

          <h1>Bookkeeper</h1>
          <nav
            style={{
              borderBottom: "solid 1px",
              paddingBottom: "1rem",
            }}
          >
            <Link to="/invoices">Invoices</Link>
            <Link to="/expenses">Expenses</Link>
          </nav>
          <Outlet />
          <div>这里是音乐播放器</div>
          {/* </div> */}
        </div>
      </Provider>
    </>
  );
}
