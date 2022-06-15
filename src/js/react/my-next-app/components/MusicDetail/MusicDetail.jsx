/*
 * @Author: msc
 * @Date: 2022-06-12 21:31:55
 * @LastEditTime: 2022-06-14 22:16:43
 * @LastEditors: msc
 * @Description: 
 */

import React, { useEffect, useRef, useState } from "react";
import { constSelector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import MusicHeader from "./MusicDetailHeader";
import MusicDetailCover from "./MusicDetailCover";
import MusicDetailPlayer from "./MusicDetailPlayer";
import { curMusicState } from "../../store";

export default function MusicDetail({ setIsHome, musicPlayer }) {

    const curMusic = useRecoilValue(curMusicState), setCurMusic = useSetRecoilState(curMusicState);
    // console.log("musicDetail", musicPlayer);
    return (
        <div className="relative w-screen h-screen">
            <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-auto flex-col">
                <div className="relative w-full h-full flex flex-col">
                    {/* music header */}
                    <MusicHeader setIsHome={setIsHome} />
                    {/* music cover */}
                    <MusicDetailCover musicPlayer={musicPlayer} />
                    {/* music control */}
                    <MusicDetailPlayer musicPlayer={musicPlayer} />
                </div>
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen bg-cover bg-top  -z-50 blur-[4px] brightness-[.5] saturate-50 "
                style={{ backgroundImage: `url(${curMusic._coverUrl || 'https://mcontent.migu.cn/newlv2/new/album/20210513/8592/s_yaLskeLyyeLOsIJf.jpg'})` }} >
            </div>
        </div >
    )
}