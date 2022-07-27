/**
 * @Author: msc
 * @Date: 2022-07-26 23:44:24
 * @LastEditTime: 2022-07-26 23:48:43
 * @LastEditors: msc
 * @Description: 
 */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    }
});