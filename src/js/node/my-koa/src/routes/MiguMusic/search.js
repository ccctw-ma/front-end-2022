const router = require("koa-router")();
const {uuid, request} = require("../../utils")
router.get("/migu/search/:key?/:page?", async (ctx, next) => {
    try {
        console.log("Hello MiguMusic " + JSON.stringify(ctx.query))
        const {key, page = 1} = ctx.query;
        if (!key) {
            ctx.status = 200;
            ctx.body = {
                message: "请输入关键字",
                data: {}
            }
            return
        }
        const typeMap = {
            song: 2,
            singer: 1,
            album: 4,
            playlist: 6,
            mv: 5,
            lyric: 7,
        };
        const res = await request(
            "https://m.music.migu.cn/migu/remoting/scr_search_tag",
            "get",
            {
                params: {
                    keyword: key,
                    pgc: page,
                    rows: 50,
                    type: 2
                }
            }
        )
        let data = (res.musics || []).map((music) => {
            return {
                from: "migu",
                music
            }
        })
        ctx.status = 200;
        ctx.body = {
            data,
            total: res?.pgt ?? 0
        }
    } catch (err) {
        ctx.throw(err)
    }


})


module.exports = router