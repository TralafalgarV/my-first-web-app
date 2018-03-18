var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin');
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
module.exports = {
    entry: path.resolve('App/app.js'),
    output: {
        path: './build',
        filename: 'bundle.js',
        chunkFilename: 'js/[name].[chunkhash:5].js'
    },
    resolve: {
        extensions: [
            '*',
            '.js',
            '.jsx',
            '.css',
            '.json',
            '.less'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({title: 'webpack', template: './App/index.html', filename: 'index.html'}),
        new openBrowserWebpackPlugin({url: 'http://localhost:8800'})
    ],
    devServer: {
        port: 8800,
        contentBase: './build',  // 本地服务器在哪个目录搭建页面
        inline: true,            // 用来支持dev-server自动刷新的配置
        stats: {                 // 这个配置属性用来控制编译的时候shell上的输出内容
            colors: true,
            cached: false
        },
        host: "0.0.0.0"
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //正则，匹配到的文件后缀名
                use: ['babel-loader']
            },
            //加载css代码
            {
                test: /\.(less|css)$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            // 配置信息的参数“?limit=8192”表示将所有小于8kb的图片都转为base64形式(其实应该说超过8kb的才使用url-loader
            // 来映射到文件，否则转为data url形式)
            {
                test: /\.(woff|woff2|ttf|svg|eot)$/,
                use: ["url-loader?limit=10000"]
            }, {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: ['url-loader?limit=10000&name=img/[name].[hash].[ext]']
            }
        ]
    }
}