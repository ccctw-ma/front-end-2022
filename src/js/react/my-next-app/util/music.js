/**
 * @Author: msc
 * @Date: 2022-05-03 15:54:19
 * @LastEditTime: 2022-05-03 18:14:16
 * @LastEditors: msc
 * @Description: 
 */


export const musicFormatter = (musics, type) => {
    let res = [];
    if (type === "migu") {
        res = musics.map(music => {
            let o = {};
            o._from = type;
            o._id = music.id;
            o._name = music.songName;
            o._singerName = music.singerName;
            o._album = music.albumName;
            o._time = null;
            o._lyricsUrl = music.lyrics;
            o._musicUrl = music.mp3;
            o._coverUrl = music.cover;
            // 前半部分是派生出来的数据， raw是原始获取的数据先保留备用 
            return { ...o, raw: music };
        })
    }
    return res;
}


export const fetchMusicDetail = async (music, type) => {
    if (type === 'migu') {
        return music
    } else {
        return {}
    }
}