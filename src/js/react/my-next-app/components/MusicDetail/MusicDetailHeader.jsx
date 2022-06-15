/*
 * @Author: msc
 * @Date: 2022-05-19 15:54:51
 * @LastEditTime: 2022-06-14 22:17:24
 * @LastEditors: msc
 * @Description: 
 */
import { useRouter } from 'next/router'
import React, { useRef, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { keyWordsState, curMusicState, musicListState } from "../../store";
import { LeftOutlined } from "@ant-design/icons"
import styles from "../../styles/App.module.css"
import HeaderSongName from './HeaderSongName';

export default function MusicHeader({setIsHome}) {

    const curMusic = useRecoilValue(curMusicState), setCurMusic = useSetRecoilState(curMusicState);
    const router = useRouter();
       return (
        <div className='w-screen h-12 flex flex-row justify-between items-center z-10 text-white'>

            <div className='w-3/12 flex justify-center items-center'
                onClick={() => setIsHome(true)}>

                <LeftOutlined className='text-xl' />
            </div>
            <div className='w-6/12 flex flex-col gap-1 justify-end mt-3'>
               <HeaderSongName songName={curMusic._name} singerName = {curMusic._singerName} /> 
            </div>
            <div className='w-3/12 flex justify-center items-center text-base font-medium truncate'>
                {curMusic._from || "咪咕音樂"}
            </div>

        </div>

    )
}
