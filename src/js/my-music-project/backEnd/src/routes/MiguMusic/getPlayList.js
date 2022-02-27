const router = require("koa-router")();
const {request, getBatchSong} = require("../../utils")
const cheerio = require("cheerio")
router.get("/migu/playlist/:id?", async (ctx, next) => {
    // id 歌单id
    const {id} = ctx.query;
    const playListRes = await request(`http://m.music.migu.cn/migu/remoting/query_playlist_by_id_tag?onLine=1&queryChannel=0&createUserId=migu&contentCountMin=5&playListId=${id}`);

    const listInfo = playListRes?.rsp?.playList[0];
    if (!listInfo) {
        ctx.status = 200
        ctx.message = playListRes?.info || "服务异常"
    } else {
        const {
            playListName: name,
            createName,
            createUserId,
            playCount,
            contentCount,
            image: picUrl,
            summary: desc,
            createTime,
            updateTime,
            tagLists,
            playListType
        } = listInfo;
        const baseInfo = {
            name,
            id,
            picUrl,
            playCount,
            trackCount: contentCount,
            desc,
            creator: {
                id: createUserId,
                name: createName || '',
            },
            createTime,
            updateTime,
            tagLists,
            list: [],
        };
        const cids = [];

        let pageNo = 1;
        while ((pageNo - 1) * 20 < contentCount) {
            const listPage = await request(`https://music.migu.cn/v3/music/playlist/${id}?page=${pageNo}`, "get", {}, {
                dataType: 'raw',
            })

            const $ = cheerio.load(listPage);

            $('.row.J_CopySong').each((i, v) => cids.push(v.attribs['data-cid']));

            pageNo += 1;
        }
        baseInfo.list = await getBatchSong(cids);

        ctx.status = 200;
        ctx.body = {
            data: baseInfo
        }

    }


})

module.exports = router