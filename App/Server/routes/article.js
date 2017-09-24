var express = require('express')
var router = express.Router()
var fs = require('fs')

// var DBPATH = 'mongoDB.json'

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
                title: item.title,
                content: item.content,
                createTime: item.createTime,
            })
        })
        res.send(articleList) // 数据类型为 object
    })
    // fs.readFile(DBPATH, function(err, data) {
    //     if (err) {
    //         console.log("fetchList read file err: ", err)
    //     }
        // res.send(data) // 数据类型为 object
    // })
})

// 将client发送的数据存到文件中
router.post('/publish', function (req, res) {
    let data = req.body

    console.log(data)

    if (data.article_id) {
        Model('Article').update({_id: data.article_id}, {$set: {title: data.title, content: data.content}}, function(err, result) {
            if(err){
                res.send(err)
            }else{
                res.send({title:1,content:'修改成功'})
            }
        })
    } else {
        console.log("[article] publish a new article...")
        data.create_id = new Date()
        Model('Article').create(data, function(err, doc) {
            if (err) {
                res,send(err)
            } else {
                if (doc) {
                    res.send({title: 1, content: '发表成功'})
                }
            }
        })
    }
    // fs.writeFile(DBPATH ,JSON.stringify(data), (error) => {
    //     if (error) {
    //         console.log("fail");
    //     } else {
    //         console.log("success");
    //     }
    // })
    // res.send(JSON.stringify(null))
})

module.exports = router