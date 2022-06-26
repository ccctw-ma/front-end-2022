import { createRoot } from "react-dom/client";
import "./index.css";
import "animate.css";
import "antd/dist/antd.css";
import React from "react";
import reportWebVitals from "./reportWebVitals";
import Router from "./routes/route";
import App from "./App";
const container = document.getElementById("root");
const root = createRoot(container);

root.render(<React.StrictMode>{Router}</React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
