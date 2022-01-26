
const router = require("koa-router")();

router.get("/", async (ctx, next) => {
    ctx.body = "hello world";
    console.log('hello world')
})

module.exports = router