import { createRoot } from "react-dom/client";
import "./index.css";
// import "animate.css";
// import "antd/dist/antd.css";
import reportWebVitals from "./reportWebVitals";
import Router from "./routes/route";
import { RecoilRoot } from "recoil";
const root = createRoot(document.getElementById("root"));
root.render(
    <RecoilRoot>
        {Router}
    </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
