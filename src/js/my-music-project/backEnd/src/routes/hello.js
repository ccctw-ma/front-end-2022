
const router = require("koa-router")();

router.get("/hello", async (ctx, next) => {
    ctx.body = "hello world";
    console.log('hello world')
})

module.exports = router