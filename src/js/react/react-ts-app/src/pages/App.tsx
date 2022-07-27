/*
 * @Author: msc
 * @Date: 2022-06-14 10:58:52
 * @LastEditTime: 2022-07-27 21:50:46
 * @LastEditors: msc
 * @Description:
 */

import React from "react";
import { Outlet, Link } from "react-router-dom";

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
            <ul>
                <li>
                    <Link to={"expandingCards"}>expanding-cards</Link>
                </li>
                <li>
                    <Link to={"progressSteps"}>progressSteps</Link>
                </li>
                <li>
                    <Link to={"rotatingNavigation"}>rotatingNavigation</Link>
                </li>
                <li>
                    <Link to={"hiddenSearch"}>hiddenSearch</Link>
                </li>
                <li>
                    <Link to={"blurryLoading"}>blurryLoading</Link>
                </li>
                <li>
                    <Link to={"scrollAnimation"}>scrollAnimation</Link>
                </li>
                <li>
                    <Link to={"splitLandingPage"}>splitLandingPage</Link>
                </li>
                <li>
                    <Link to={"formInputWave"}>formInputWave</Link>
                </li>
                <li>
                    <Link to={"soundBoard"}>soundBoard</Link>
                </li>
            </ul>
        </div>
    );
}
