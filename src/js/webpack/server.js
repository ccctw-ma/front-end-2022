/**
 * @Author: msc
 * @Date: 2022-07-22 00:58:25
 * @LastEditTime: 2022-07-22 01:00:58
 * @LastEditors: msc
 * @Description: 
 */


const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));
app.listen(3000, () => {
    console.log('Example app listening on port 3000!\n');
})