const router = require("koa-router")({
    prefix:"/test"
});
router.get("/hello", async (ctx, next) => {
    ctx.body = "hello world";
    console.log('hello world')
})

router.get("/migu",(ctx,next)=>{
    console.log("hello migu");
    ctx.body = "Hello MiguMusic"
})


router.post("/post", async (ctx, next) => {
    ctx.body = "post Hello " + ctx.request.body
    console.log(ctx.request.body);
})


module.exports = router
