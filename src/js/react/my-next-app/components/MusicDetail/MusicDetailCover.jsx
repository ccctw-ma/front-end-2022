/*
 * @Author: msc
 * @Date: 2022-05-19 15:59:17
 * @LastEditTime: 2022-06-12 22:26:17
 * @LastEditors: msc
 * @Description: here show music cover and lyrics
 */
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { keyWordsState, curMusicState, musicListState, curMusicPlayState } from "../../store";
import styles from "../../styles/App.module.css"

export default function MusicDetail() {

    const curMusic = useRecoilValue(curMusicState), setCurMusic = useSetRecoilState(curMusicState);
    const curMusicPlay = useRecoilValue(curMusicPlayState);
    return (
        <div className='w-screen top-12 flex justify-center items-center' style={{ height: "calc(100vh - 6rem)" }}>
            <img
                className={`${styles.musicPlaySpin} ${!curMusicPlay.isPlay && styles.musicPlaySpinPause} 
                block rounded-full w-1/2 md:w-1/4`}
                src={curMusic._coverUrl || "https://mcontent.migu.cn/newlv2/new/album/20210513/8592/s_yaLskeLyyeLOsIJf.jpg"} alt="" />
        </div>
    )
}

