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

import Modules from "../pages/modules";
import ExpandingCards from "../pages/modules/expandingCards";
import ProgressSteps from "../pages/modules/progressSteps/progressSteps";
import RotatingNavigation from "../pages/modules/rotatingNavigation";
import HiddenSearch from "../pages/modules/hiddenSearch";
import BlurryLoading from "../pages/modules/blurryLoading";
import ScrollAnimation from "../pages/modules/scrollAnimation";
import SplitLandingPage from "../pages/modules/splitLandingPage";
import FormInputWave from "../pages/modules/formInputWave";
import SoundBoard from "../pages/modules/soundBoard";
// console.log(process.env.NODE_ENV);

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
            <Route path="modules" element={<Modules></Modules>}></Route>
            <Route path="expandingCards" element={<ExpandingCards />}></Route>
            <Route path="progressSteps" element={<ProgressSteps />} />
            <Route path="rotatingNavigation" element={<RotatingNavigation />} />
            <Route path="hiddenSearch" element={<HiddenSearch />} />
            <Route path="blurryLoading" element={<BlurryLoading />} />
            <Route path="scrollAnimation" element={<ScrollAnimation />} />
            <Route path="splitLandingPage" element={<SplitLandingPage />} />
            <Route path="formInputWave" element={<FormInputWave />} />
            <Route path="soundBoard" element={<SoundBoard />} />
        </Routes>
    </BrowserRouter>
);

export default Router;
