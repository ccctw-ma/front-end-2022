const Koa = require("koa")
const KoaBody = require("koa-body")
const routes = require("./src/routes")
const dotenv = require("dotenv")
const cors = require("koa2-cors")

const app = new Koa();
// app.use(cors)

//配置环境变量
dotenv.config({path: '../.env'})


// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// 处理跨域
app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    await next()
})


// set up top level koa middleware
app.use(
    KoaBody({
        multipart: true,
        formLimit: "10mb",
        jsonLimit: "10mb",
        textLimit: "10mb",
        enableTypes: ["json", "form", "text"],
        parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
    })
)


// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

for (let route of routes) {
    app.use(route.routes())
}

// app.listen(process.env.PORT)
app.listen(7977, () => {
    console.log(`server running @ http://localhost:${7977}`)
})

console.log("app started at port " + 7977)
