/* eslint-disable react-hooks/exhaustive-deps */
/*
 * @Author: msc
 * @Date: 2022-02-08 20:32:52
 * @LastEditTime: 2022-02-21 22:37:54
 * @LastEditors: msc
 * @Description: 主要显示界面
 */

import { Empty, Button, Tabs, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrrentMusic, setMusicList } from "../stores/musicSlice";
import {
  useGetMusicUrlMutation,
  useGetAllMusicOfPlayListMutation,
} from "../stores/netEaseSlice";
import { useSearchMusicByMiGuMutation } from "../stores/miGuSlice";
import { timeFormatter } from "../utils";
import {
  NetEaseIcon,
  QQMusicIcon,
  BilibiliIcon,
  MiGuMusicIcon,
  OtherIcon,
} from "../components/customizeIcons";
import styles from "./Home.module.scss";
const { TabPane } = Tabs;
export default function Home() {
  // const { data, isLoading, isSuccess, isError } = useGetPlayListQuery("587300511");
  const dispath = useDispatch();
  const musicList = useSelector((state) => state.music.musicList);
  const currrentKeyWords = useSelector((state) => state.music.currentKeyWords);
  const [getMusicUrl] = useGetMusicUrlMutation();
  const [getAllMusicOfPlayList] = useGetAllMusicOfPlayListMutation();
  const [searchMusicByMiGu, { searchMusicByMiGuLoading }] =
    useSearchMusicByMiGuMutation();
  const [selectedMusic, setSelectedMusic] = useState({});
  const [type, setType] = useState("netEase");
  const typeOptions = ["netEase", "qq", "bilibili", "migu", "other"];

  const [page, setPage] = useState(1);
  //处理音乐点击事件
  useEffect(() => {
    const fetchMusic = async (selectedMusic) => {
      //判断不是空对象
      if (Object.keys(selectedMusic).length !== 0) {
        if (selectedMusic._from === "migu") {
          dispath(setCurrrentMusic(selectedMusic));
        } else {
          let res = await getMusicUrl(selectedMusic.id);
          console.log(res);
          dispath(setCurrrentMusic({ ...selectedMusic, ...res.data.data[0] }));
        }
      }
    };
    fetchMusic(selectedMusic);
  }, [selectedMusic]);

  //处理tab和分页页码点击事件
  useEffect(() => {
    console.log("useEffect", type, page, currrentKeyWords);
    const fetchMusicList = async (type, page) => {
      if (type === "migu") {
        const miGuRes = await searchMusicByMiGu({
          keywords: currrentKeyWords,
          page,
        });
        console.log(miGuRes);
        dispath(
          setMusicList({
            type: "migu",
            songs: miGuRes.data.data,
            total: miGuRes.data.total,
          })
        );
      }
    };
    fetchMusicList(type, page);
  }, [type, page]);

  const handleGetAllMusicOfPlayList = async () => {
    let res = await getAllMusicOfPlayList("368529707");
    console.log(res);
    dispath(setMusicList(res.data.songs));
  };

  let netEaseMusicListContent = (
    <div className={styles.musicList}>
      {/* 标题栏 */}
      <div className={styles.musicInfo}>
        <h2>音乐标题</h2>
        <h2>歌手</h2>
        <h2>专辑</h2>
        <h2>时长</h2>
        <h2>来源</h2>
      </div>
      {musicList.netEase.songs.map((e) => (
        <div
          key={e.id}
          className={styles.musicInfo}
          onDoubleClick={() => setSelectedMusic(e)}
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

  let miguMusicListContent = (
    <div className={styles.musicList}>
      {/* 标题栏 */}
      <div className={styles.musicInfo}>
        <h2>音乐标题</h2>
        <h2>歌手</h2>
        <h2>专辑</h2>
        <h2>时长</h2>
        <h2>来源</h2>
      </div>
      {musicList.migu.songs.map((e) => (
        <div
          key={e._id}
          className={styles.musicInfo}
          onDoubleClick={() => setSelectedMusic(e)}
        >
          {/* 这里不同的歌单列表的数据名称不太一样 曹 */}
          <div className={styles.text}>{e._name}</div>
          <div className={styles.text}>{e._singerName}</div>
          <div className={styles.text}>{e._album}</div>
          <div className={styles.text}>{e._time}</div>
          <div className={styles.text}>咪咕音乐</div>
        </div>
      ))}
      <div className={styles.pagination}>
        <Pagination
          defaultPageSize={50}
          defaultCurrent={1}
          total={musicList.migu.total}
          showSizeChanger={false}
          onChange={(page) => {
            console.log(type, "page: " + page);
            setPage(page);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className={styles.main}>
      <Tabs
        defaultActiveKey="1"
        onTabClick={(key) => {
          console.log(typeOptions[key - 1]);
          setType(typeOptions[key - 1]);
          setPage(1);
        }}
      >
        {/* 网易云音乐的搜索结果 */}
        <TabPane
          tab={
            <span>
              <NetEaseIcon />
              网易云音乐
            </span>
          }
          key="1"
        >
          <div>{netEaseMusicListContent}</div>
        </TabPane>
        {/* QQ音乐的搜索结果 */}
        <TabPane
          tab={
            <span>
              <QQMusicIcon />
              QQ音乐
            </span>
          }
          key="2"
        ></TabPane>
        {/* B站的搜索结果 */}
        <TabPane
          tab={
            <span>
              <BilibiliIcon />
              bilibili
            </span>
          }
          key="3"
        ></TabPane>
        {/* 咪咕音乐的搜索结果 */}
        <TabPane
          tab={
            <span>
              <MiGuMusicIcon />
              咪咕音乐
            </span>
          }
          key="4"
        >
          {miguMusicListContent}
        </TabPane>
        {/* 其他搜索结果  之后进行拓展*/}
        <TabPane
          tab={
            <span>
              <OtherIcon />
              其他
            </span>
          }
          key="5"
        ></TabPane>
      </Tabs>
    </div>
  );
}
