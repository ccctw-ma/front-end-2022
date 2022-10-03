const fs = require("fs");

const data = fs.readFileSync("./8.3.txt", { encoding: "utf-8" });
const lines = data.split('\r\n');
console.log(lines.length);


