var express = require('express')
var router = express.Router()
// var fs = require('fs')

// var DBPATH = 'mongoDB.json'

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

router.post('/comment', function (req, res) {
    var info = req.body
    var articleId = info._id
    var comment = info.comments
    console.log("[comments] comments data: ", comment)
    // 根据文章Id更新评论
    Model('Article').update({_id: articleId}, {
        $push: {comments:{author: comment.author, content: comment.content, createTime: comment.createTime}}}, function(err, newDoc) {
        if(err) {
            res.send(err)
        } else {
            res.send({title: 1, content: '评论成功'})
        }
    })        
})

router.get('/delete/:id', function(req, res) {
    Model('Article').findById(req.params.id).exec(function(err, collection) {
        if (err || collection == null) {
            return handleError("Collection: ", collection, err)
        } else {
            console.log("Find it: ", collection)
        }

        Model('Article').deleteOne({"_id": req.params.id}, function (err) {
            if (!err) {
                res.send(collection)            
                console.log("Article delete successful")
            } else {
                console.log("Article delete failed")
                res.send(err)                
            }
        })
    })
})

module.exports = router