import Context from "./context";
import Table from "./fragment";
// const Button = lazy(() => import("./button"));
// const About = lazy(() => import("./about"));
import Example from "./hook";
import RouterTest from "./routerTest";
import { Link } from "react-router-dom";
import TestJsx from "./test";
function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      <p>在React中使用React Router v6 的指南</p>
      
    </div>
  );
}

export default Home;
