/**
 * @Author: msc
 * @Date: 2022-02-19 00:35:47
 * @LastEditTime: 2022-02-19 01:11:11
 * @LastEditors: msc
 * @Description: 处理不同的音乐数据
 */
export const musicFormatter = (type, songs) => {
    let res = [];
    if (type === "migu") {
        res = songs.map(song => {
            let o = {};
            o._from = song.from;
            const music = song.music;
            o._id = music.id;
            o._name = music.songName;
            o._singerName = music.singerName;
            o._album = music.albumName;
            o._time = null;
            o._musicUrl = music.mp3;
            o._coverUrl = music.cover;
            return { ...o, ...music };
        })
    }
    return res;
}