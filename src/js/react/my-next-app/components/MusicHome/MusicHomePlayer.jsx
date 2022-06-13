/*
 * @Author: msc
 * @Date: 2022-05-02 17:22:30
 * @LastEditTime: 2022-06-13 16:50:32
 * @LastEditors: msc
 * @Description: 
 */


import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { keyWordsState, curMusicState, musicListState, curMusicPlayState } from "../../store";
import { timeFormatter } from "../../util/time";
import API from "../../util/request";
import { musicFormatter, fetchMusicDetail } from "../../util/music";
import {
    NetEaseIcon,
    QQMusicIcon,
    BilibiliIcon,
    MiGuMusicIcon,
    OtherIcon,
} from "../customizeIcons";
import { MenuUnfoldOutlined, PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons"
import styles from "../../styles/App.module.css"


export default function MusicHomePlayer({setIsHome, musicPlayer}) {

    const curMusic = useRecoilValue(curMusicState), setCurMusic = useSetRecoilState(curMusicState);
    const curMusicPlay = useRecoilValue(curMusicPlayState);
    // const musicPlayer = {...curMusicPlay.musicPlayer};
    const [isPlay, setPlay] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);


    useEffect(() => {
        console.log('当前选中的音乐', curMusic);
        if (!curMusic._musicUrl) {
            musicPlayer.current.pause();
            setPlay(false);
        } else {
            musicPlayer.current.currentTime = 0;
            musicPlayer.current.play();
            setPlay(true);
        }
    }, [curMusic])

    // useEffect(() => {
    //     musicPlayer.current.focus();
    //     // setDuration(musicPlayer.current.duration);
    //     setCurrentTime(curMusicPlay.currentTime);
    //     musicPlayer.current.currentTime = curMusicPlay.currentTime;
    // }, []);
    

    useEffect(() => {
        if (isPlay) {
            // console.log(musicPlayer, isPlay);
            // console.log(curMusic._musicUrl);
            musicPlayer.current.play();
        } else {
            // console.log(musicPlayer, isPlay);
            musicPlayer.current.pause();
        }
    }, [isPlay]);

    return (
        <div className="w-full">
            {/* <audio
                ref={musicPlayer}
                src={curMusic._musicUrl ?? null}
                id="music"
                controls
                className="hidden"
                onTimeUpdate={() => {
                    // console.log(musicPlayer.current.currentTime);
                    if (musicPlayer.current.ended) {
                        setPlay(false);
                    }
                }}
            ></audio> */}
            <div className="w-full h-14 flex flex-row items-center bg-white">
                <div className="w-2/12" onClick={() => setIsHome(false)}>
                    <img
                        src={curMusic._coverUrl} alt="图片"
                        className={`${styles.musicPlaySpin} ${!isPlay && styles.musicPlaySpinPause} 
                        absolute left-2 bottom-2 block w-14 h-14 object-center rounded-full`} />
                </div>

                <div className="w-8/12 h-full flex flex-row justify-start items-center">
                    <div className="ml-2 max-w-[70%] text-base font-semibold truncate">
                        {curMusic._name}
                    </div>
                    -
                    <div className="ml-2 mt-[2px] max-w-[30%] text-sm font-normal truncate">
                        {curMusic._singerName}
                    </div>

                </div>

                <div className="w-2/12 flex flex-row justify-center items-center">
                    <div>
                        {!isPlay && <PlayCircleOutlined className=" text-xl  mr-1" onClick={() => setPlay(true)} />}
                        {isPlay && <PauseCircleOutlined className="text-xl mr-1" onClick={() => setPlay(false)} />}
                    </div>
                    <div>
                        <MenuUnfoldOutlined className="text-xl ml-1" />
                    </div>
                </div>

            </div>

        </div>
    )
}