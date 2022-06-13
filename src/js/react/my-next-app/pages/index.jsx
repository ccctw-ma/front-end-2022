import React, { useState, useRef, useEffect } from "react";
import MusicHome from "../components/MusicHome/MusicHome";
import MusicDetail from "../components/MusicDetail/MusicDetail";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { curMusicState, curMusicPlayState } from "../store";
import { useMusicPlayer } from "../util/music";

export default function Home() {

  const [isHome, setIsHome] = useState(true);
  const musicPlayer = useRef(null);

  const curMusic = useRecoilValue(curMusicState);
  const curMusicPlay = useRecoilValue(curMusicPlayState), setCurMusicPlay = useSetRecoilState(curMusicPlayState);
  // 页面切换操作

  const [mainView, setMainView] = useState(null);



  // 页面初试化
  useEffect(() => {
    console.log("Hello, welcome to my react music app");
    console.log("index", musicPlayer);
    musicPlayer.current.focus();
    setMainView(<MusicHome setIsHome={setIsHome} musicPlayer={musicPlayer} />)

  }, []);

  return (
    <>
      <audio
        ref={musicPlayer}
        src={curMusic._musicUrl ?? null}
        id="musicPlayer"
        controls
        className="hidden"
        onTimeUpdate={() => {
          // console.log(musicPlayer.current.currentTime);
        }}
      ></audio>

      <div className="container h-screen overflow-hidden">
        <div className={`absolute top-0 left-0 container h-screen transition-all duration-500 
        ${!isHome && 'opacity-0 -z-10'}`}>
          <MusicHome setIsHome={setIsHome} musicPlayer={musicPlayer} />
        </div>
        <div className={`absolute top-0 left-0 container h-screen transition-all duration-500 
        ${isHome && 'opacity-0 -z-10'}`}>
          <MusicDetail setIsHome={setIsHome} musicPlayer={musicPlayer} />
        </div>
      </div>
    </>
  );
}

