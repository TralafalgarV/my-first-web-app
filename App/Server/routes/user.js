var express = require('express')
var user = express.Router()

user.get('', function(req, res) {
    console.log("fetchArticle: ",req.params.id)
    // 1：升序； -1：降序
    var orderObj = {
        'author_id': -1
    }

    Model('Article').find({"createTime": req.params.id}).exec(function(err, collection) {
        console.log("fetchArticle: ", collection)
        res.send(JSON.stringify(collection[0]))
    })
})

module.exports = user