/*
 * @Author: msc
 * @Date: 2022-02-08 20:32:52
 * @LastEditTime: 2022-02-12 01:28:45
 * @LastEditors: msc
 * @Description: 主要显示界面
 */

import { Empty, Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrrentMusic, setMusicList } from "../stores/musicSlice";
import {
  useGetPlayListQuery,
  useGetMusicUrlMutation,
  useGetAllMusicOfPlayListMutation,
} from "../stores/netEaseSlice";
import { timeFormatter } from "../utils";
import styles from "./Home.module.scss";
export default function Home() {
  // const { data, isLoading, isSuccess, isError } = useGetPlayListQuery("587300511");
  const dispath = useDispatch();
  const musicList = useSelector((state) => state.music.musicList);
  const [getMusicUrl, { _isLoading }] = useGetMusicUrlMutation();
  const [getAllMusicOfPlayList, { getAllMusicOfPlayListIsLoading }] =
    useGetAllMusicOfPlayListMutation();
  const handlePlayMusic = async (music) => {
    // let res = await getMusicUrl("33894312");
    let res = await getMusicUrl(music.id);
    console.log(res);
    dispath(setCurrrentMusic({ ...music, ...res.data.data[0] }));
  };

  const handleGetAllMusicOfPlayList = async () => {
    let res = await getAllMusicOfPlayList("368529707");
    console.log(res);
    dispath(setMusicList(res.data.songs));
  };

  let musicListContent = (
    <div className={styles.musicList}>
      {/* 标题栏 */}
      <div className={styles.musicInfo}>
        <h2>音乐标题</h2>
        <h2>歌手</h2>
        <h2>专辑</h2>
        <h2>时长</h2>
        <h2>来源</h2>
      </div>
      {musicList.map((e) => (
        <div
          key={e.id}
          className={styles.musicInfo}
          onDoubleClick={() => handlePlayMusic(e)}
        >
          {/* 这里不同的歌单列表的数据名称不太一样 曹 */}
          <div className={styles.text}>{e.name}</div>
          <div className={styles.text}>
            {e.artists.map((a) => a.name).join("/")}
          </div>
          <div className={styles.text}>{e.album.name}</div>
          <div className={styles.text}>{timeFormatter(e.duration / 1000)}</div>
          <div className={styles.text}>网易云音乐</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.main}>
      <div onClick={handleGetAllMusicOfPlayList}>获取歌单信息</div>
      <div>{musicListContent}</div>
    </div>
  );
}

const MusicInfo = (props) => {
  const dispath = useDispatch();
  const data = props.data;
  console.log(data);

  return (
    <div>
      专辑: {data.album.name}
      {/* {JSON.stringify(props)} */}
      时长: 来源: 网易云音乐
    </div>
  );
};
