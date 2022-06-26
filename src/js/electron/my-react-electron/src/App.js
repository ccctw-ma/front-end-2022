import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";
function App() {
  console.log(window.myAPI.desktop);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Hello world
        </a>
        <Link to={"home"}>To Home</Link>
      </header>
    </div>
  );
}

export default App;
