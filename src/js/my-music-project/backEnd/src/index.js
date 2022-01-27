const Koa = require("koa")
const KoaBody = require("koa-body")
const routes = require("./routes")
const dotenv = require("dotenv")

const app = new Koa();

//配置环境变量
dotenv.config({ path: '../.env' })


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


for (let route of routes) {
    app.use(route.routes())
}

// app.listen(process.env.PORT)
app.listen(7977)

console.log("app started at port " + 7977)
