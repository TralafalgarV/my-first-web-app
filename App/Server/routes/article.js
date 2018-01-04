var express = require('express')
var router = express.Router()
var fs = require('fs')
var formidable = require("formidable");
var API = 'http://localhost:4545'

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

// 预览图片上传
router.post('/fetchImg', function (req, res) {
    // var newPath = undefined
    // 设置的临时目录form.uploadDir是存在于内存中的数据，并不是真正的图片
    // form.parse(req, function (err, fields, files) {
    //     if (err) {
    //         throw err
    //     }

    //     if (files.imgData) {
    //         newPath = rename(files.imgData.path, files.imgData.name, 'preview')
    //     }
    // })
    // 每次都新创建一个form，防止form中残存的数据导致 parse 触发多次
    var form = new formidable.IncomingForm()
    // 临时目录
    form.uploadDir = './img'
    form.parse(req, function(err,fields,files){
        var imgDataPath = './img/'+fields.token+files.imgData.name
        fs.createReadStream(files.imgData.path).pipe(fs.createWriteStream(imgDataPath));
        imgDataPath = imgDataPath.substring(1)

        // 图片路径更新到数据库
        Model('Article').update({_id: "5a4df1259fc41cc5e083a28b"},{$push:{imgs: [API+imgDataPath]}},function (err,doc) {
            if(err){
                res.send(err)
            }else{
                if(doc){
                    res.send({title:1,content:'修改成功'})
                }
            }
        })

        fs.unlink(files.imgData.path, function(err){
            if(err) {
                // throw err;
            }
        })
    })
})

// 需要通过fs的方法，将文件重新保存到需要的地方即可，这时候就是图片了
function rename(old, _new, code) {
    var path = './img' + code + '/' // 创建 img 存储路径
    // 判断路径是否存在
    fs.exists(path, function (exists) {
        if (!exists) {
            fs.mkdir(path)
            console.log('创建文件夹！')
        }
        fs.renameSync(old, path + _new)

		//删除临时文件
		fs.unlink(old, function(err){
			if(err) {
				// throw err;
			}
		})        
    })
    return path + _new
}
module.exports = router