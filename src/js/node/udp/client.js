const dgram = require("node:dgram");
const fs = require("fs");
const client = dgram.createSocket("udp4");

client.bind(44444, "localhost");

const PORT = 3456;
const HOST = "127.0.0.1";

//buffer用来存储数据
const message = Buffer.from("我是client, 我来自客户端！");

const sendMsg = (msg) => {
    client.send(msg, PORT, HOST, (err, bytes) => {
        if (err) {
            console.log(err);
        }
        console.log(`服务器发送消息到: http://${HOST}:${PORT}`);
        console.log(`发送了 ${bytes} 个字节数据`);
        // client.close();
    });
};

client.on("close", () => {
    console.log("客户端已关闭！");
});

//错误处理
client.on("error", (error) => {
    console.log(error);
});

const data = fs.readFileSync("./8.3.txt", { encoding: "utf-8" });
const lines = data.split("\r\n");
console.log(lines);
let i = 0;

let interval = setInterval(() => {
    if (i < lines.length) {
        sendMsg(lines[i]);
        i++;
    } else {
        clearInterval(interval);
        client.close();
    }
}, 500);
