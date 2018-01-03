var express = require('express')
var router = express.Router()
const formidable = require('formidable')
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

// 文章图片上传处理
router.post("/fetchImg",function(req,res){
    let form = new formidable.IncomingForm();
        form.encoding = 'utf-8'; // 编码
        form.keepExtensions = true; // 保留扩展名
        form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
        form.uploadDir = '../../Server/img/'  // 存储路径
        form.parse(req,function(err,fileds,files){ // 解析 formData数据
            if(err){ return console.log(err) }

            let imgPath = files.img.path // 获取文件路径
            let imgName = "./test." + files.img.type.split("/")[1] // 修改之后的名字
            let data = fs.readFileSync(imgPath) // 同步读取文件

            fs.writeFile(imgName,data,function(err){ // 存储文件

                if(err){ return console.log(err) }

                fs.unlink(imgPath,function(){}) // 删除文件
                res.json({code:1})
            })
        })
})
module.exports = router