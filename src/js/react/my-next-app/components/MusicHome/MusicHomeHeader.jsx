/*
 * @Author: msc
 * @Date: 2022-05-02 16:32:17
 * @LastEditTime: 2022-06-13 20:56:22
 * @LastEditors: msc
 * @Description: 界面的header
 */

import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil"
import { keyWordsState, musicListState } from "../../store"
import { SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import API from "../../util/request";
import { musicFormatter } from "../../util/music";

export default function MusicHomeHeader() {

  const [searchStr, setSearchStr] = useState("王心凌");
  const setkeyWords = useSetRecoilState(keyWordsState);
  const setMusicList = useSetRecoilState(musicListState);


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


  return (
    <div className="w-full h-full p-1">

      <div className="grid grid-cols-8 gap-1">

        <div className="flex justify-center items-center">
          <UnorderedListOutlined style={{ fontSize: "1.2rem" }} />
        </div>
        <div className="col-span-6">
          <input
            className="w-full h-8 rounded-lg border border-solid border-slate-400 pl-2"
            type="text"
            placeholder="王心凌"
            onChange={(e) => {
              setSearchStr(e.target.value)
            }}
            onKeyDown={e => {
              if (e.code === "Enter") {
                handleSearchMusics();
              }
            }}
          />
        </div>

        <div className="flex justify-center items-center">
          <SearchOutlined style={{ fontSize: "1.2rem" }} onClick={handleSearchMusics} />
        </div>
      </div>
    </div>
  );
}
