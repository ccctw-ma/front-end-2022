//no-unused-vars
import "./App.css";
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./stores/store";

export default function App() {
  return (
    <div>
      <Provider store={store}>
        <h1>Bookkeeper</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <Link to="/invoices">Invoices</Link> |{" "}
          <Link to="/expenses">Expenses</Link>
        </nav>
        <Outlet />
      </Provider>
    </div>
  );
}
