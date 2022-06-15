/**
 * @Author: msc
 * @Date: 2022-05-03 15:54:19
 * @LastEditTime: 2022-06-15 17:03:27
 * @LastEditors: msc
 * @Description:
 */

import { useState, useEffect } from "react";
import { constSelector } from "recoil";
import API from "./request";
import { v4 as uuidv4 } from "uuid";

export const musicFormatter = (musics, type) => {
  let res = [];
  if (!musics) return [];
  if (type === "migu") {
    res = musics.map((music) => {
      let o = {};
      o._from = type;
      o._id = music.id;
      o._name = music.songName;
      o._singerName = music.singerName;
      o._album = music.albumName;
      o._time = null;
      o._lyricsUrl = music.lyrics;
      o._lyric = null;
      o._musicUrl = music.mp3;
      o._coverUrl = music.cover;
      // 前半部分是派生出来的数据， raw是原始获取的数据先保留备用
      return { ...o, raw: music };
    });
  }
  return res;
};

export const fetchMusicDetail = async (music, type) => {
  let res = {};
  if (type === "migu") {
    console.log(music, type);
    if (music?.raw.copyrightId) {
      const cid = music.raw.copyrightId;
      const data = await API.GET(`/api/${type}/lyrics?cid=${cid}`);
      if (data.status === 200) {
        let body = data.body;
        res._lyric = parseLyrics(body.lyric);
      }
    }
  }
  return {
    ...music,
    ...res,
  };
};

export const parseLyrics = (lyrics) => {
  let res = {
    lyrics: [],
    lyricType: 0,
  };
  if (!lyrics.length) {
    return res;
  }
  let sentencs = lyrics.split("\r\n");
  if (sentencs.length >= 2) {
    if (sentencs[0][0] !== "[") {
      res.lyrics = sentencs.filter((s) => s.length);
      res.lyricType = 1; // 有歌词但是没有时间戳
    } else {
      res.lyricType = 2;
      sentencs.forEach((s) => {
        if (s.length) {
          let temp = /\[(\d+):(\d+)\.(\d+)](.*)/.exec(s);
          if (temp) {
            const minute = Number.parseInt(temp[1]);
            const second = Number.parseInt(temp[2]);
            const millisecond = Number.parseInt(temp[3]);
            const sentence = temp[4];
            res.lyrics.push({
              id: uuidv4(),
              timeStamp: minute * 60 + second + millisecond / 100,
              sentence,
            });
          }
        }
      });
    }
  }
  return res;
};

export function useMusicPlayer() {
  const [musicPlayer, setMusicPlayer] = useState(null);
  useEffect(() => {
    const audio = document.getElementById("musicPlayer");
    // console.log(audio);
    // console.log(audio.currentSrc);
  }, []);
  return musicPlayer;
}
