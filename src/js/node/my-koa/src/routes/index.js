const fs = require("fs");
const path = require("path");
// 自动导入新生成的路由

const loadRouter = (fileName) => {
  if (fs.statSync(fileName).isFile()) {
    // console.log(fileName);
    return [require(fileName)];
  } else {
    console.log(fileName);
    let res = [];
    let fileNames = fs.readdirSync(fileName);
    fileNames.forEach((f) => {
      //   let fileName = f.replace(/\.js/, "");
      if (!f.startsWith("index")) {
        res.push(...loadRouter(fileName + "\\" + f));
      }
    });
    return res;
  }
};

const routers = loadRouter(__dirname);

console.log("路由文件数为：" + routers.length);

module.exports = routers;