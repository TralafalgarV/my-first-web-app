var webpack = require('webpack')
var path = require('path')
// var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Edition = './App'
module.exports = {
  entry: path.resolve(Edition+'/app.js'),
  resolve: {
    extensions:['*','.js','.jsx','.css','.json', '.less'],
  },
  devtool:'source-map',
  output: {
    path: '/data/app/build',
    filename: 'bundle.js',
    chunkFilename: 'js/[name].[chunkhash:5].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({  //webpack自带的压缩代码插件
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: Edition+'/index.html',
      filename: 'index.html'
    }),
    //允许错误警告，但不停止编译
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],

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
      //配置信息的参数“?limit=8192”表示将所有小于8kb的图片都转为base64形式(其实应该说超过8kb的才使用url-loader 来映射到文件，否则转为data url形式)
      {
        test: /\.(woff|woff2|ttf|svg|eot)$/,
        use: ["url-loader?limit=10000"]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: ['url-loader?limit=10000&name=img/[name].[hash].[ext]']
      },
    ]
  }
}