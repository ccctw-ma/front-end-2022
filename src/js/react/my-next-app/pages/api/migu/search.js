/**
 * @Author: msc
 * @Date: 2022-05-03 10:50:32
 * @LastEditTime: 2022-05-03 15:31:17
 * @LastEditors: msc
 * @Description: 
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



import requestBack from "../../../util/requestBack";

export default async function handler(req, res) {

  try {
    const {
      keyWords,
      page = 1
    } = req.query;
    console.log(keyWords, page);

    const typeMap = {
      song: 2,
      singer: 1,
      album: 4,
      playlist: 6,
      mv: 5,
      lyric: 7,
    };

    const data = await requestBack(
      "https://m.music.migu.cn/migu/remoting/scr_search_tag",
      "get",
      {
        params: {
          keyword: keyWords,
          pgc: page,
          rows: 50,
          type: 2
        }
      }
    )
    res.status(200).json(data)

  } catch(e) {
    res.status(500).json({
      message: "出现错误",
      detail: e
    })
  }
}