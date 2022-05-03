/*
 * @Author: msc
 * @Date: 2022-02-08 20:32:52
 * @LastEditTime: 2022-05-03 18:29:26
 * @LastEditors: msc
 * @Description: 主要显示界面
 */

import { Empty, Button, Tabs, Pagination, Spin } from "antd";
import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setCurrrentMusic, setMusicList } from "../stores/musicSlice";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { keyWordsState, curMusicState, musicListState } from "../store";
import { timeFormatter } from "../util/time";
import API from "../util/request";
import { musicFormatter, fetchMusicDetail } from "../util/music";
import {
    NetEaseIcon,
    QQMusicIcon,
    BilibiliIcon,
    MiGuMusicIcon,
    OtherIcon,
} from "./customizeIcons";

const { TabPane } = Tabs;




export default function Home() {
    const musicList = useRecoilValue(musicListState), setMusicList = useSetRecoilState(musicListState);
    const keyWords = useRecoilValue(keyWordsState);
    const curMusic = useRecoilValue(curMusicState), setCurMusic = useSetRecoilState(curMusicState);
    const [selectedMusic, setSelectedMusic] = useState({});
    const [type, setType] = useState("migu");
    const typeOptions = ["netEase", "qq", "bilibili", "migu", "other"];
    const [page, setPage] = useState(1);


    const handleSearchMusics = async () => {
        if (searchStr.length !== 0) {
            console.log(searchStr);
            setkeyWords(searchStr);
            const data = await API.GET(`/api/migu/search?keyWords=${searchStr}&page=${1}`);
            if (data.status === 200) {
                console.log(data);

                setMusicList((old) => {
                    return {
                        ...old,
                        migu: {
                            total: data.body?.pgt,
                            songs: musicFormatter(data.body?.musics, "migu")
                        }
                    }
                })

            } else {
                console.log(data);
            }
        }
    };


    // 处理音乐点击事件
    useEffect(() => {
        (async () => {
            // 判空
            if (Object.keys(selectedMusic).length !== 0) {
                // console.log(selectedMusic);
                const music = await fetchMusicDetail(selectedMusic, type);
                setCurMusic(pre => {
                    return {
                        ...pre,
                        ...music
                    }
                })
            }
        })();
    }, [selectedMusic]);

    //处理tab和分页页码点击事件
    useEffect(() => {
        console.log("useEffect", type, page, keyWords);
        if (keyWords.length !== 0) {
            const fetchMusicList = async (type, keyWords, page) => {
                // console.log(`/api/${type}/search?keyWords=${keyWords}&page=${page}`);
                const data = await API.GET(`/api/${type}/search?keyWords=${keyWords}&page=${page}`);
                if (data.status === 200) {
                    console.log(data);
                    setMusicList((old) => {
                        return {
                            ...old,
                            [type]: {
                                total: data.body?.pgt,
                                songs: musicFormatter(data.body?.musics, type)
                            }
                        }
                    })
                } else {
                    console.log(data);
                }
            };
            fetchMusicList(type, keyWords, page);
        }

    }, [type, page]);

    const handleGetAllMusicOfPlayList = async () => {
        let res = await getAllMusicOfPlayList("368529707");
        console.log(res);
        dispath(setMusicList(res.data.songs));
    };

    // let netEaseMusicListContent = (
    //     <div className={styles.musicList}>
    //         {/* 标题栏 */}
    //         <div className={styles.musicInfo}>
    //             <h2>音乐标题</h2>
    //             <h2>歌手</h2>
    //             <h2>专辑</h2>
    //             <h2>时长</h2>
    //             <h2>来源</h2>
    //         </div>
    //         {musicList.netEase.songs.map((e) => (
    //             <div
    //                 key={e.id}
    //                 className={styles.musicInfo}
    //                 onDoubleClick={() => setSelectedMusic(e)}
    //             >
    //                 {/* 这里不同的歌单列表的数据名称不太一样 曹 */}
    //                 <div className={styles.text}>{e.name}</div>
    //                 <div className={styles.text}>
    //                     {e.artists.map((a) => a.name).join("/")}
    //                 </div>
    //                 <div className={styles.text}>{e.album.name}</div>
    //                 <div className={styles.text}>{timeFormatter(e.duration / 1000)}</div>
    //                 <div className={styles.text}>网易云音乐</div>
    //             </div>
    //         ))}
    //     </div>
    // );

    let miguMusicListContent = (
        <div className="container px-2">
            {/* 标题栏 */}
            <div className="hidden sm:flex flex-row ">
                <h2>音乐标题</h2>
                <h2>歌手</h2>
                <h2>专辑</h2>
                <h2>时长</h2>
                <h2>来源</h2>
            </div>
            {musicList[type].songs.map((e, index) => (
                <div
                    key={e._id}
                    className="w-full my-1 px-1 flex flex-row justify-between items-center hover:bg-sky-300 rounded-2xl"
                    onDoubleClick={() => {
                        setSelectedMusic(e);
                    }}
                >
                    <div className="w-1/12 text-xl">{index + 1}</div>
                    <div className="w-8/12 flex flex-col justify-start pl-2">
                        <div className=" text-lg font-semibold truncate">{e._name}</div>
                        <div className="flex flex-row justify-start">
                            <div className="block mr-1 text-sm font-normal truncate">{e._singerName}</div>
                            -
                            <div className="block ml-1 text-sm font-normal truncate">{e._album}</div>
                        </div>
                    </div>

                    {/* <div className={styles.text}>{e._time}</div> */}
                    <div className="w-2/12">咪咕音乐</div>
                    <div className="w-1/12"
                        onClick={() => {
                            setSelectedMusic(e);
                        }}
                    >
                        播放
                    </div>
                </div>
            ))}
            <div className="flex my-2 justify-center items-center">
                <Pagination
                    defaultPageSize={50}
                    defaultCurrent={1}
                    total={musicList[type].total}
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
        <div >
            <Tabs
                defaultActiveKey="4"
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
                    {/* <div>{netEaseMusicListContent}</div> */}
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
