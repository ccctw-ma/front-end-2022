import logo from "./logo.svg";
import styles from "./styles/App.module.css";
import { Link, Outlet } from "react-router-dom";
import HeadBar from "./components/headBar";
function App() {
    return (
        <div className={styles.App}>
            <div id={styles.leftBar} className="bg-green-300">
                leftbar
            </div>
            <div id={styles.headBar} className="bg-red-300">
                <HeadBar />
            </div>
            <div id={styles.mainContent} className="bg-yellow-300">
                mainContent
            </div>
            <div id={styles.musicBar} className="bg-purple-300">
                musicBar
            </div>
        </div>
    );
}

export default App;
