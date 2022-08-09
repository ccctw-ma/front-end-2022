/**
 * @Author: msc
 * @Date: 2022-06-14 10:48:24
 * @LastEditTime: 2022-06-14 11:16:39
 * @LastEditors: msc
 * @Description:
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../pages/App";
import CssTest from "../pages/cssTest";
import Loading from "../pages/cssTest/loading";
import ReactTest from "../pages/reactTest";
import Hooks from "../pages/reactTest/Hooks";
import Recoil from "../pages/reactTest/recoil";

const modules = require.context("../pages/modules", true, /\.tsx$/);

//根据pages里的文件自动导入路由
const moduleComponents = modules.keys().map((key: string): any => {
    // console.log(key);
    const matchRes = key.match(/\/(\w+)\.tsx$/);
    // console.log(matchRes);
    const moduleName = matchRes![1];
    const E = modules(key).default;
    return <Route path={moduleName} element={<E />} key={key} />;
});

const Router = (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App></App>}></Route>
            <Route path="cssTest" element={<CssTest></CssTest>}>
                <Route path="loading" element={<Loading></Loading>}></Route>
            </Route>
            <Route path="reactTest" element={<ReactTest></ReactTest>}>
                <Route path="hooks" element={<Hooks></Hooks>}></Route>
                <Route path="recoil" element={<Recoil></Recoil>}></Route>
            </Route>
            {moduleComponents}
        </Routes>
    </BrowserRouter>
);

export default Router;
//    {/* <Route path="modules" element={<Modules></Modules>}></Route>
//     <Route path="expandingCards" element={<ExpandingCards />}></Route>
//     <Route path="progressSteps" element={<ProgressSteps />} />
//     <Route path="rotatingNavigation" element={<RotatingNavigation />} />
//     <Route path="hiddenSearch" element={<HiddenSearch />} />
//     <Route path="blurryLoading" element={<BlurryLoading />} />
//     <Route path="scrollAnimation" element={<ScrollAnimation />} />
//     <Route path="splitLandingPage" element={<SplitLandingPage />} />
//     <Route path="formInputWave" element={<FormInputWave />} />
//     <Route path="soundBoard" element={<SoundBoard />} /> */}
