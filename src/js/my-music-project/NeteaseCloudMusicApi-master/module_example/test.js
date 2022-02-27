"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NeteaseCloudMusicApi_1 = require("NeteaseCloudMusicApi");
(0, NeteaseCloudMusicApi_1.banner)({ type: 0 }).then((res) => {
    console.log(res);
});
(0, NeteaseCloudMusicApi_1.lyric)({
    id: '33894312',
}).then((res) => {
    console.log(res);
});
