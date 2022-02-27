const router = require("koa-router")();

router.get("/test/hello", async (ctx, next) => {
    ctx.body = "hello world";
    console.log('hello world')
})

router.get("/migu/hello",(ctx,next)=>{
    console.log("hello migu");
    ctx.body = "Hello MiguMusic"
})


router.post("/test/hello", async (ctx, next) => {
    ctx.body = "post Hello " + ctx.request.body
    console.log(ctx.request.body);
})

module.exports = router