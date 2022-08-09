/*
 * @Author: msc
 * @Date: 2022-07-28 23:31:56
 * @LastEditTime: 2022-07-29 01:08:34
 * @LastEditors: msc
 * @Description:
 */

import {
    VscChromeRestore,
    VscChromeMinimize,
    VscChromeMaximize,
    VscChromeClose,
} from "react-icons/vsc";
import { useRecoilState } from "recoil";
import { windowState } from "../../stores";
export default function HeadBar() {
    const [winState, setWinState] = useRecoilState(windowState);

    return (
        <div className="flex flex-row h-full items-center justify-between mx-4">
            <div>返回</div>

            <div>
                <input type="text" />
            </div>
            <div className="flex gap-4">
                <div>
                    <VscChromeMinimize
                        className="cursor-pointer hover:bg-slate-400"
                        onClick={() => {
                            window.myAPI.miniMizeWindow();
                        }}
                    />
                </div>
                <div>
                    {winState.isMax ? (
                        <VscChromeRestore
                            className="cursor-pointer"
                            onClick={() => {
                                window.myAPI.toggleMaxmize();
                                setWinState((pre) => {
                                    return {
                                        ...pre,
                                        isMax: false,
                                    };
                                });
                            }}
                        />
                    ) : (
                        <VscChromeMaximize
                            className="cursor-pointer"
                            onClick={() => {
                                window.myAPI.toggleMaxmize();
                                setWinState((pre) => {
                                    return {
                                        ...pre,
                                        isMax: true,
                                    };
                                });
                            }}
                        />
                    )}
                </div>
                <div>
                    <VscChromeClose
                        className="cursor-pointer"
                        onClick={() => {
                            window.myAPI.closeWindow();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
