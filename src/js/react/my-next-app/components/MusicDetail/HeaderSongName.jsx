/*
 * @Author: msc
 * @Date: 2022-05-23 10:05:24
 * @LastEditTime: 2022-05-23 13:13:39
 * @LastEditors: msc
 * @Description: 
 */
import React, { useRef, useState, useEffect } from 'react'

export default function HeaderSongName({ songName, singerName }) {

    const songNameDom1 = useRef(null);
    const songNameDom2 = useRef(null);
    const [songNameOverflow, setsongNameOverflow] = useState(false);
    useEffect(() => {
        // 判断歌名是否溢出
        // console.log(songNameDom1);
        // console.log("offsetWidth", songNameDom1.current.offsetWidth);
        // console.log("scrollWidth", songNameDom1.current.scrollWidth);
        if (songNameDom1.current.scrollWidth > songNameDom1.current.offsetWidth) {

            console.log("the width of this song'name is overflow");
            setsongNameOverflow(true);
            const sheet = document.styleSheets[0];
            const actualLength = songNameDom1.current.scrollWidth;
            const songNameAvailbleWidth = document.body.clientWidth / 2;
            const appendLength = actualLength / 15;
            const translateLength = actualLength + appendLength;

            const translateKeyFrames1 = "@keyframes songNameMove1" +
                "{" +
                `0% {
                        transform: translateX(0px);
                    }
                    100%{
                        transform: translateX(${-translateLength}px);
                    }`
                + "}";
            const translateKeyFrames2 = "@keyframes songNameMove2" +
                "{" +
                `0% {
                    transform : translateX(${translateLength}px);
                }
                100%{
                    transform : translateX(${-translateLength}px);
                }`
                + "}"
            if ("insertRule" in document.styleSheets[0]) {
                sheet.insertRule(translateKeyFrames1);
                sheet.insertRule(translateKeyFrames2);
            } else if ("addRule" in document.styleSheets[0]) {
                sheet.addRule(translateKeyFrames1);
                sheet.addRule(translateKeyFrames2);
            }


            songNameDom2.current.style.left = `${- songNameAvailbleWidth}px`;
            songNameDom1.current.style.animation = "songNameMove1 8s linear, 16s linear 8s infinite normal songNameMove2";
            songNameDom2.current.style.animation = "16s songNameMove2 linear infinite normal"; 
        }

    }, []);


    return (
        <>
            <div className={`flex flex-row text-lg font-bold rounded-lg align-bottom overflow-hidden`}>
                <span className={`block w-full whitespace-nowrap ${!songNameOverflow && 'flex flex-row justify-center items-center'}`}
                    ref={songNameDom1}>
                    {songName || "abcdefghijklmnopqrstuvwxyz1234567890+-"}
                </span>
                <span className={`${!songNameOverflow && 'hidden'} relative w-full whitespace-nowrap`}
                    ref={songNameDom2}>
                    {songName || "abcdefghijklmnopqrstuvwxyz1234567890+-"}
                </span>
            </div>
            <div className='flex flex-row justify-center items-center text-sm font-light'>
                {singerName || "周杰倫"}
            </div>

        </>


    )
}
