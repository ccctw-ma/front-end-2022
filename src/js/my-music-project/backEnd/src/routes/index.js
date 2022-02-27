const fs = require("fs")

// 自动导入新生成的路由
module.exports = fs.readdirSync(__dirname + "\\MiguMusic").reduce((pre, file) => {
    const fileName = file.replace(/\.js/, "");
    if (fileName !== "index") {
        console.log(fileName)
        pre.push(require(`./MiguMusic/${fileName}`))
    }
    return pre;
}, [])