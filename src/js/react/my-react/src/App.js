//no-unused-vars
import logo from "./logo.svg";
import "./App.css";
import React from 'react';
// const Home  = React.lazy(()=>import('./components/home'))
import Home from "./components/home";
function App() {
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;



{/* <header className="App-header">
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
          Learn React 233 hello world
        </a>
      </header> */}