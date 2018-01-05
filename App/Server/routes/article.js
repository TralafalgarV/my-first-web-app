var express = require('express')
var router = express.Router()
var fs = require('fs')
var formidable = require("formidable")
import ServerCfg from '../serverConfig'
var API = ServerCfg.realUrl

// var DBPATH = 'mongoDB.json'

const log = function() {
    return console.log.apply(console, arguments)
}

router.get('/fetchArticle/:id', function(req, res) {
    console.log("fetchArticle: ",req.params.id)

    Model('Article').findById(req.params.id).exec(function(err, collection) {
        console.log("fetchArticle: ", collection)
        res.send(JSON.stringify(collection))
    })
})

// 从文件中读取数据并发送到client
router.get('/fetchList', function (req, res) {
    // 1：升序； -1：降序
    var orderObj = {
        'createTime': -1
    }

    // 从数据库中找到所有文章，并按照降序排列
    Model('Article').find().sort(orderObj).exec(function(err, collection) {
        var articleList = []
        collection.forEach(function(item) {
            articleList.push({
                _id: item._id,
                title: item.title,
                content: item.content,
                createTime: item.createTime,
                author: item.author,
            })
        })
        res.send(articleList) // 数据类型为 object
    })
})

// 将client发送的数据存到MongoDB数据库中
router.post('/publish', function (req, res) {
    let data = req.body

    console.log("[article] publish a new article...", data)
    Model('Article').create(data, function(err, doc) {
        if (err) {
            res.send(err)
        } else {
            if (doc) {
                res.send({title: 1, content: '发表成功'})
            }
        }
    })
})

// comment 处理
router.post('/comment', function (req, res) {
    var info = req.body
    var articleId = info._id
    var comment = info.comments
    console.log("[comments] comments data: ", info)
    // 根据文章Id更新评论
    Model('Article').update({_id: articleId}, {
        $push: {comments:{author: comment.author, content: comment.content, createTime: comment.createTime}}}, function(err, newDoc) {
        if(err) {
            console.log("comment fail")
            res.send({title: 2, content: '评论失败'})
        } else {
            res.send({title: 1, content: '评论成功'})
        }
    })        
})

router.get('/delete/:id', function (req, res) {
    Model('Article').findById(req.params.id).exec(function (err, collection) {
        if (err || collection == null) {
            return handleError("Collection: ", collection, err)
        } else {
            console.log("Find it: ", collection)
        }

        Model('Article').deleteOne({
            "_id": req.params.id
        }, function (err) {
            if (!err) {
                res.send(collection)
                console.log("Article delete successful")
            } else {
                res.send(err)
                console.log("Article delete failed")                
            }
        })
    })
})

/**
 * 图片上传存储
 * +-- 前端：将图片包装成 FormData 数据发给后端
 * +-- 后端：通过 formidable 中间件，解析收到的 FormData 数据
 *     +-- 通过 fs 的createReadStream、createWriteStream将图片存在本地
 *     +-- 返回图片的 url 方便前端转换成 markdown 语法
 */
router.post('/fetchImg', function (req, res) {
    // 每次都新创建一个form，防止form中残存的数据导致 parse 触发多次!!!
    var form = new formidable.IncomingForm()
    // 临时目录
    form.uploadDir = './static/upload/img/'  // 二进制文件存储目录
    form.parse(req, function (err, fields, files) {
        var imgDataPath = './static/upload/img/' + fields.token + files.imgData.name
        fs.createReadStream(files.imgData.path).pipe(fs.createWriteStream(imgDataPath))
        imgDataPath = imgDataPath.substring(1)

        // 返回给前端图片信息
        var imgInfo = {
            name: files.imgData.name,
            path: API + imgDataPath
        }
        res.send(imgInfo)
        // // 图片路径更新到数据库
        // Model('Article').update({_id: "5a4e1c37b99d68886d05397d"}, {$push: {imgs: imgInfo}}, function (err, doc) {
        //     if (err) {
        //         res.send(err)
        //     } else {
        //         if (doc) {
        //             res.send(imgInfo)
        //         }
        //     }
        // })

        fs.unlink(files.imgData.path, function (err) {
            if (err) {
                throw err
            }
        })
    })
})

module.exports = router