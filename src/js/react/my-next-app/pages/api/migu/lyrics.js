/**
 * @Author: msc
 * @Date: 2022-06-14 15:37:42
 * @LastEditTime: 2022-06-15 14:45:46
 * @LastEditors: msc
 * @Description:
 */
import requestBack from "../../../util/requestBack";

export default async function handler(req, res) {
  try {
    const { cid } = req.query;
    console.log(cid);

    if (!cid) {
      throw "cid呢???";
    }

    const data = await requestBack(
      `http://music.migu.cn/v3/api/music/audioPlayer/getLyric?copyrightId=${cid}`
    );
    console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      message: "出现错误",
      detail: e,
    });
  }
}
