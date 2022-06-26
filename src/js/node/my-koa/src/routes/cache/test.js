/**
 * @Author: msc
 * @Date: 2022-06-24 16:42:37
 * @LastEditTime: 2022-06-24 23:00:40
 * @LastEditors: msc
 * @Description:
 */

const router = require("koa-router")();

const fs = require("fs");

const parseStatic = (dir) => {
  return new Promise((res) => {
    res(fs.readFileSync(dir));
  });
};

router.get("/static/:fileName?", async (ctx, next) => {
  console.log("cache");
  console.log(ctx.request);
  let time = new Date(Date.now() + 10000).toUTCString();
  // ctx.set("Expire", time);
  ctx.set("Cache-Control", "max-age=5");
  // ctx.body = "Hello cache" + new Date().toUTCString() + __dirname;
  ctx.body = await parseStatic(__dirname + "//" + "test.js");
  // ctx.set("Cache-Control", "max-age=10");
});

router.get("/", async (ctx, next) => {
  console.log("index");
  ctx.set("Content-type", "text/html");
  ctx.body = await parseStatic(__dirname + "//" + "index.html");
});

router.get("/cache/:name?", async (ctx, next) => {
  // console.log(ctx.query);
  const query = ctx.query;

  // ctx.set("Content-type", "application/json");
  // let time = new Date(Date.now() + 2000).toUTCString();
  // ctx.set("Expire", time);
  // ctx.set("Cache-Control", "max-age=2");
  // ctx.body = JSON.stringify({ name: query.name, timeStamp: Date.now() });

  // console.log(ctx.request);

  const ifModifedSince = ctx.request.header["if-modified-since"];
  console.log(ifModifedSince);
  console.log(Date.now());
  if (parseInt(ifModifedSince) + 3000 >= parseInt(Date.now())) {
    console.log("缓存命中");
    ctx.status = 304;
  } else {
    console.log("缓存未命中");
    ctx.set("Last-Modified", Date.now());
    ctx.body = JSON.stringify({
      name: query.name,
      timeStamp: new Date().toUTCString(),
    });
  }
});

module.exports = router;
