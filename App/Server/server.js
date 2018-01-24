var express = require('express')
var app = express()
var path = require('path')
// 使用session希望达到以下两个目的：
// +--对于未登录的用户需要跳转到某些页面进行拦截
// +--跳转某些页面需要带有用户信息
var session = require('express-session')
// 将session信息存入数据库
var MongoStore = require('connect-mongo')(session);
// 解析cookie req.cookie
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))
//导入文件
require('./db')
var mongoose = require('mongoose')

var article = require('./routes/article')
var user = require('./routes/user')
var music = require('./routes/music')

//dev-API
global.API = 'http://localhost:4545'

/**
 * 中间件（middleware）就是处理http请求的函数，
 * 它的最大特点就是，一个中间件处理完成，再传递给下一个中间件
 * App实例在运行过程中，会调用一系列中间件！
 */
/**
 * 每个中间件可以从App实例，接受三个参数。req、res、next（next回调函数，代表下一个中间件）
 * 每个中间件都可以对http请求进行加工，并且决定是否调用next方法，将req传递给下一个中间件
 * 如果next(params) 如果带有参数，则代表抛出一个错误，参数为错误文本，
 * 抛出错误后，后面的中间件不再执行，直到发现一个错误处理函数为止
 */
/**
 * 针对不同请求，express提供了use方法的一些别名：all、get、post
 * all: 表示所有的请求都必须通过该中间件，参数 “*”表示对所有路径有效
 * get: GET动词的http请求会通过该中间件
 */
/**
 * next作用：主要负责将控制权交给下一个中间件，
 * 如果当前中间件没有终结请求，并且next没有被调用，那么请求将被挂起，
 * 后面的中间件将得不到被执行的机会
 */
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
        //这段仅仅为了方便返回json而已
    res.header("Content-Type", "application/json;charset=utf-8")
    if(req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(200)
    } else { 
        next()
    }
})

app.use(bodyParser.json())

/*加载article、user、music中间件*/
app.use('/article', article)
app.use('/user', user)
app.use('/music', music)

app.listen('4545',function () {
    console.log('listen 4545 port')
})
