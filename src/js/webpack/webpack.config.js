const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { webpack } = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
        // print: './src/print.js'
        // another: './src/another.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true
    },
    output: {
        // filename: 'bundle.js',
        // filename: '[name].bundle.js',
        filename: '[name].[chunkhash].js',
        // chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    optimization: {
        moduleIds: 'named',
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all'
        //         }
        //     }
        // }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // title: 'Output Mangement'
            title: 'Caching'
        }),
        // new webpack.NameModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin()
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // 指定公共bundle的名称 webpack4.0 以下可以使用 4.0以上迁移至splitChunks
        // })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    }
}