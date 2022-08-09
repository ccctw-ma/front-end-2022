/*
 * @Author: msc
 * @Date: 2022-06-14 10:58:52
 * @LastEditTime: 2022-07-28 01:11:55
 * @LastEditors: msc
 * @Description:
 */

import { Link } from "react-router-dom";

const modules = require.context("./modules", true, /\.tsx$/);

const moduleList = modules.keys().map((module: string): any => {
    const res = module.match(/\/(\w+)\.tsx$/);
    const name = res![1];
    console.log(name);
    return (
        <li key={name}>
            <Link to={name}>{name}</Link>
        </li>
    );
});

export default function App() {
    return (
        <div>
            <h1>
                WelCome To My React Learning App
                <br />
                <Link to={"cssTest"}>cssTest</Link>
                <br />
                <Link to={"reactTest"}>reactTest</Link>
                <br />
                <Link to={"modules"}>modules</Link>
            </h1>
            <ul>{moduleList}</ul>
        </div>
    );
}
