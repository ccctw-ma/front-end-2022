import logo from "./logo.svg";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
function App() {
  return (
    <div className="w-screen h-screen">
      <header className="flex flex-row">
        <div
          onClick={() => {
            window.myAPI.miniMizeWindow();
          }}
        >
          最小化
        </div>

        <div
          className=" text-2xl"
          onClick={() => {
            console.log(111);

            window.myAPI.toggleMaxmize();
          }}
        >
          最大化
        </div>

        <div
          onClick={() => {
            window.myAPI.closeWindow();
          }}
        >
          关闭
        </div>
      </header>
      <main>
        <Link to={"home"}>To Home</Link>
      </main>

      <Link to={"/"}>Home</Link>

      <Outlet />
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React Hello world
    //       233
    //     </a>
    //     <Link to={"home"}>To Home</Link>
    //   </header>
    // </div>
  );
}

export default App;
