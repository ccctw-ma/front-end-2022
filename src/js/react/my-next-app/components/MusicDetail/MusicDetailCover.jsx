/*
 * @Author: msc
 * @Date: 2022-05-19 15:59:17
 * @LastEditTime: 2022-06-15 17:51:22
 * @LastEditors: msc
 * @Description: here show music cover and lyrics
 */
import React, { useState, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { keyWordsState, curMusicState, musicListState, curMusicPlayState } from "../../store";
import styles from "../../styles/App.module.css"

export default function MusicDetail({ musicPlayer }) {

    const [isCover, setIsCover] = useState(true);


    const curMusic = useRecoilValue(curMusicState), setCurMusic = useSetRecoilState(curMusicState);
    const curMusicPlay = useRecoilValue(curMusicPlayState);
    const [lyricContent, setLyricContent] = useState(null);
    const [lyricType, setLyricType] = useState(0);
    const [targetLyricDom, setTargetLyricDom] = useState(null);
    const lyricRefList = useRef([]);
    const lyricParentRef = useRef([]);

    const getRef = dom => lyricRefList.current.push(dom);


    // 没有歌词 有歌词没对应的时间 有歌词有对应的时间
    useEffect(() => {
        const { lyrics, lyricType } = curMusic._lyric;
        lyricRefList.current = [];
        setLyricType(lyricType);
        let content = null;
        if (lyricType === 0) {
            content = <div className='flex justify-center items-center text-white'>
                暂无歌词</div>;
        } else if (lyricType === 1) {
            content = lyrics.map((s, i) => {
                return (
                    <p key={i} className='text-gray-400 text-base'>
                        {s}
                    </p>
                )
            })
        } else {
            content = (lyrics.map((s) => {
                return (
                    <p key={s.id} id={s.id} ref={getRef} className='text-gray-400 text-base'>
                        {s.sentence}
                    </p>
                )
            }))

        }
        lyricParentRef.current.scrollTop = 0;
        setLyricContent(content)
    }, [curMusic]);


    //在音乐播放的时候且歌词有时间戳的时候 自动把当前正在播放的那段歌词居中并高亮
    useEffect(() => {
        const currentTime = curMusicPlay.currentTime;
        const { lyrics, lyricType } = curMusic._lyric;
        if (lyricType === 2 && lyrics.length) {

            let target = null;
            if (currentTime > lyrics[lyrics.length - 1].timeStamp) {
                target = lyrics[lyrics.length - 1];
            } else {
                for (let i = 0; i < lyrics.length - 1; i++) {
                    const temp = lyrics[i], next = lyrics[i + 1];
                    if (currentTime >= temp.timeStamp && currentTime < next.timeStamp) {
                        target = temp;
                        break;
                    }
                }
            }
            const lyricDoms = lyricRefList.current;
            let targetDom = null;
            lyricDoms.forEach(d => {
                if (d && d.id === target.id) {
                    targetDom = d;
                    return
                }
            })

            if (targetDom) {
                if (targetLyricDom && targetDom.id !== targetLyricDom.id) {
                    targetLyricDom.classList.remove('text-white');
                    targetLyricDom.classList.add('text-gray-400');
                }

                if (!targetLyricDom || targetLyricDom.id !== targetDom.id) {
                    const targetOffset = lyricParentRef.current.offsetHeight / 2;
                    const actualOffset = targetDom.offsetTop;
                    let currentScrollTop = lyricParentRef.current.scrollTop;
                    let targetScrollTop = Math.max(actualOffset - targetOffset, 0);
                    const step = 1;
                    //平滑滚动
                    const scroll = () => {
                        currentScrollTop += step;
                        if (currentScrollTop <= targetScrollTop) {
                            lyricParentRef.current.scrollTop = currentScrollTop;
                            setTimeout(scroll, 15);
                        }
                    }
                    setTimeout(scroll, 50);

                    console.log(lyricParentRef);
                    console.log(targetDom);
                    targetDom.classList.remove('text-gray-400');
                    targetDom.classList.add('text-white');

                    setTargetLyricDom(targetDom);
                }
            }

        }
    }, [curMusicPlay.currentTime]);

    return (
        <div className="relative grow">
            {/* 歌曲封面 */}
            <div className={`absolute w-screen h-full flex justify-center items-center transition-all duration-500 
                ${!isCover && 'opacity-0 -z-10'}`}
                onClick={() => { setIsCover(false) }}>
                <img className={`${styles.musicPlaySpin} ${!curMusicPlay.isPlay && styles.musicPlaySpinPause} 
                    block rounded-full w-1/2 md:w-1/4`}
                    src={curMusic._coverUrl || "https://mcontent.migu.cn/newlv2/new/album/20210513/8592/s_yaLskeLyyeLOsIJf.jpg"} alt=""
                />
            </div>
            {/* 歌曲歌词 */}
            <div className={`absolute w-screen h-full transition-all duration-500 ${isCover && 'opacity-0 -z-10'}`}>
                {/* <button onClick={() => console.log(lyricRefList.current)}>click me</button> */}
                <div className='w-full h-full py-12'
                    onClick={() => { setIsCover(true) }}>
                    <div ref={lyricParentRef} className='w-full h-full flex flex-col items-center overflow-scroll py-36'>
                        {lyricContent}
                    </div>
                </div>

            </div>
        </div>
    )
}

