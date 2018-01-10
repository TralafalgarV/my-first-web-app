var express = require('express')
var router = express.Router()
var fs = require('fs')
var formidable = require("formidable")
var serverCfg = require('../serverConfig')

var API = serverCfg.realUrl
// var API = serverCfg.testUrl

// var DBPATH = 'mongoDB.json'

const log = function() {
    return console.log.apply(console, arguments)
}

router.get('/fetchArticle/:id', function(req, res) {
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

/*
let options = {
    docName: "comment| article",  // 删除哪种数据
    atricleId:this.state._id,     // 文章Id
    commentId: item._id           // 评论Id
}
*/
// 删除操作
router.get('/delete', function (req, res) {
    let options = req.query
    if (!options) {
        throw "[Delete] options is null"
        return 
    }
    switch (options.dataType) {
        case "comment":
            delComment(options, res)
            break;
        case "article":
            delArticle(options.atricleId, res)
            break;
        default:
            break;
    }
})

// 评论删除
function delComment(options, res) {
    Model('Article').findById(options.atricleId).exec(function (err, collection) {
        if (err || collection == null) {
            throw err
        } else {
            console.log("Find it: ", collection)
        }

        // 文章Id和commentId 删除评论
        Model('Article').update({_id: options.atricleId}, {
            $pull: {comments:{_id: options.commentId}}}, function(err, newDoc) {
            if(err) {
                console.log("del comment fail")
                res.send({title: 2, content: '删除评论失败'})
            } else {
                console.log("del comment success")
                res.send({title: 1, content: '删除评论成功'})
            }
        })         
    })
}

// 文章删除
function delArticle(id, res) {
    Model('Article').findById(id).exec(function (err, collection) {
        if (err || collection == null) {
            throw err
        } else {
            console.log("Find it: ", collection)
        }

        Model('Article').deleteOne({
            "_id": id
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
}

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
        // 由于nginx的配置问题，暂时将图片的存储位置改为 /data/static/upload/img/ 目录
        var imgDataPath = '/data/static/upload/img/' + fields.token + files.imgData.name
        fs.createReadStream(files.imgData.path).pipe(fs.createWriteStream(imgDataPath))
        imgDataPath = imgDataPath.substring(1)

        // 返回给前端图片信息
        var imgInfo = {
            name: files.imgData.name,
            path: API + "/" + fields.token + files.imgData.name // 图片在服务器的访问IP
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

router.post('/fetchUsrArticle', function (req, res) {
    // let req = {
    //     usrname: ...
    // }
    let usrName = req.body.usrname
    if (!usrName) {
        console.log("[ERROR] fetchUsrArticle req is error")
        res.send("usrName is undefined")
    }

    // 1：升序； -1：降序
    var orderObj = {
        'createTime': -1
    }

    // 从数据库中找到所有文章，并按照降序排列
    Model('Article').find({"author":usrName}).sort(orderObj).exec(function(err, collection) {
        if (err) {
            throw err
        }
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

module.exports = router