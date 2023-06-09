/*
 * @Author: msc
 * @Date: 2022-02-08 20:37:44
 * @LastEditTime: 2022-02-19 01:21:05
 * @LastEditors: msc
 * @Description: 音乐播放器
 */

// audioTracks	返回表示可用音频轨道的 AudioTrackList 对象
// autoplay	设置或返回是否在加载完成后随即播放音频
// buffered	返回表示音频已缓冲部分的 TimeRanges 对象
// controller	返回表示音频当前媒体控制器的 MediaController 对象
// controls	设置或返回音频是否显示控件（比如播放/暂停等）
// crossOrigin	设置或返回音频的 CORS 设置
// currentSrc	回当前音频的 URL
// currentTime	设置或返回音频中的当前播放位置（以秒计）
// defaultMuted	设置或返回音频默认是否静音
// defaultPlaybackRate	设置或返回音频的默认播放速度
// duration	返回当前音频的长度（以秒计）
// ended	返回音频的播放是否已结束
// error	返回表示音频错误状态的 MediaError 对象
// loop	设置或返回音频是否应在结束时重新播放
// mediaGroup	设置或返回音频所属的组合（用于连接多个音频元素）
// muted	设置或返回音频是否静音
// networkState	返回音频的当前网络状态
// paused	设置或返回音频是否暂停
// playbackRate	设置或返回音频播放的速度
// played	返回表示音频已播放部分的 TimeRanges 对象
// preload	设置或返回音频是否应该在页面加载后进行加载
// readyState	返回音频当前的就绪状态
// seekable	返回表示音频可寻址部分的 TimeRanges 对象
// seeking	返回用户是否正在音频中进行查找
// src	设置或返回音频元素的当前来源
// textTracks	返回表示可用文本轨道的 TextTrackList 对象
// volume	设置或返回音频的音量
// addTextTrack()	在音频中添加一个新的文本轨道
// canPlayType()	检查浏览器是否可以播放指定的音频类型
// fastSeek()	在音频播放器中指定播放时间。
// getStartDate()	返回一个新的Date对象，表示当前时间轴偏移量
// load()	重新加载音频元素
// play()	开始播放音频
// pause()	暂停当前播放的音频

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Slider, Button, Typography, Image, Popover } from "antd";
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  CaretRightFilled,
  PauseOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import {
  OneLoopIcon,
  LoopIcon,
  RandomLoopIcon,
  OrderLoopIcon,
  VolumeOpenIcon,
  VolumeCloseIcon,
} from "./customizeIcons";
import styles from "./MusicPlay.module.scss";
import { timeFormatter } from "../utils";
const { Title, Text, Paragraph } = Typography;

export default function Header() {
  const musicPlayer = useRef(null);

  const currentMusic = useSelector((state) => state.music.currentMusic);
  const [play, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  // 0 -> 单曲循环 1->歌单循环 2-> 顺序播放 3-> 随机播放
  const [order, setOrder] = useState(0);
  //不同播放顺序对应的图标
  const orderIconMap = {
    0: <OneLoopIcon />,
    1: <LoopIcon />,
    2: <OrderLoopIcon />,
    3: <RandomLoopIcon />,
  };

  // const handleCurrentVolumeChange =
  const volumeContent = (
    <Slider
      vertical
      defaultValue={100}
      value={volume}
      max={100}
      onChange={(value) => {
        musicPlayer.current.volume = value / 100;
        setVolume(value);
      }}
      style={{ height: "150px" }}
    />
  );
  useEffect(() => {
    musicPlayer.current.focus();
    // console.log(musicPlayer.current.duration);
    setDuration(musicPlayer.current.duration);
  });

  const handleCurrentTimeChange = (value) => {
    console.log(value);
    musicPlayer.current.currentTime = value;
    setPlay(true);
    musicPlayer.current.play();
  };
  //播放与暂停
  const handlePlay = () => {
    if (play) {
      setPlay(false);
      musicPlayer.current.pause();
    } else {
      setPlay(true);
      musicPlayer.current.play();
    }
  };
  //播放上一首
  const playPrevious = () => {};
  //播放下一首
  const playNext = () => {};

  const handleMusicAuthor = (ar = []) => {
    return ar.map((e) => e.name).join("/");
  };
  return (
    <div className={styles.main}>
      <audio
        ref={musicPlayer}
        src={currentMusic._musicUrl ?? null}
        id="music"
        controls
        style={{ display: "none" }}
        onTimeUpdate={() => {
          setCurrentTime(musicPlayer.current.currentTime);
        }}
      ></audio>

      <div className={styles.content}>
        <div className={styles.musicInfoContent}>
          <div className={styles.image}>
            <Image
              style={{ borderRadius: "5px" }}
              width={50}
              height={50}
              src={
                currentMusic._coverUrl ||
                "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fk-static.xsfaya.com%2Fuploads%2Fallimg%2F210701%2F095Z16364-1.jpg&refer=http%3A%2F%2Fk-static.xsfaya.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647000525&t=b10f8a7b13931eb53f4aa187299316a4"
              }
            />
          </div>

          <div className={styles.musicInfo}>
            <Title
              level={5}
              ellipsis={{
                rows: 1,
              }}
              style={{ display: "block", width: "100px", marginTop: "-2px" }}
            >
              {currentMusic._name}
            </Title>
            <Text strong ellipsis style={{ display: "block", width: "100px" }}>
              {currentMusic._singerName}
            </Text>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <Button
            type="danger"
            shape="circle"
            icon={orderIconMap[order]}
            size={"middle"}
            onClick={() => {
              setOrder((order + 1) % 4);
            }}
          />

          <Button
            type="danger"
            shape="circle"
            icon={<StepBackwardOutlined />}
            size={"middle"}
            onClick={playPrevious}
          />
          <Button
            type="danger"
            shape="circle"
            icon={play ? <PauseOutlined /> : <CaretRightFilled />}
            size={"large"}
            onClick={handlePlay}
          />
          <Button
            type="danger"
            shape="circle"
            icon={<StepForwardOutlined />}
            size={"middle"}
            onClick={playNext}
          />

          <Popover placement="top" content={volumeContent}>
            <Button
              type="danger"
              shape="circle"
              icon={volume === 0 ? <VolumeCloseIcon /> : <VolumeOpenIcon />}
              size={"middle"}
              onClick={() => {
                musicPlayer.current.volume = volume === 0 ? 1 : 0;
                setVolume( volume === 0 ? 100 : 0 );
              }}
            />
          </Popover>
        </div>

        <div className={styles.slider}>
          <div className={styles.timeText}>
            <Text strong> {timeFormatter(currentTime)}</Text>
          </div>

          <Slider
            defaultValue={0}
            value={currentTime}
            max={~~duration}
            tipFormatter={timeFormatter}
            onChange={handleCurrentTimeChange}
            style={{ width: "100%" }}
          />

          <div className={styles.timeText}>
            <Text strong> {timeFormatter(duration)}</Text>
          </div>
        </div>

        <div className={styles.other}>info</div>
      </div>
    </div>
  );
}
