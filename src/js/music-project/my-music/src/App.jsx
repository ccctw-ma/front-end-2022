//no-unused-vars
import "./App.css";
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./stores/store";
import style from "./styles/App.module.scss";
import Header from "./components/Header";
import MusicPlay from "./components/MusicPlay";
export default function App() {
  return (
    <>
      <Provider store={store}>
        <div className={style.main}>
          <div className={style.header}>
            <Header />
          </div>
          <div className={style.content}>
            <Outlet />
          </div>
          <div className={style.musicPlay}>
            <MusicPlay />
          </div>
        </div>
      </Provider>
    </>
  );
}
