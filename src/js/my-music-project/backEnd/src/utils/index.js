const request = require("./request");


const getBatchSong = async cids =>{
    const songs = await request(`https://music.migu.cn/v3/api/music/audioPlayer/songs?type=1&copyrightId=${cids.join(',')}`).catch(() => ({ items: []}))
    return (songs.items || []).map(({ copyrightId, length = '00:00:00', songName, singers = [], albums = [], mvList = [], songId }) => ({
        id: songId,
        cid: copyrightId,
        name: songName,
        artists: singers.map(({ artistId, artistName }) => ({ id: artistId, name: artistName })),
        album: albums[0] ? { id: albums[0].albumId, name: albums[0].albumId } : undefined,
        duration: (length || '00:00:00').split(':').reduce((t, v, i) => t + Number(v) * Math.pow(60, 2 - i), 0),
        mvId: mvList[0] ? mvList[0].mvId : undefined,
        mvCid: mvList[0] ? mvList[0].copyrightId : undefined,
    }))
}


module.exports = {
    uuid: require("./uuid"),
    request,
    getBatchSong
}