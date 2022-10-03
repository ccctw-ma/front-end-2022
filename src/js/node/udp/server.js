const dgram = require("node:dgram");

const server = dgram.createSocket("udp4");

server.bind(55555, "localhost");

server.on("listening", () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.on("message", (msg, info) => {
    console.log(`server listening msg: ${msg} from ${info.address}:${info.port}`);
});

server.on("error", (error) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on("close", () => {
    console.log("server closed!!!");
});
