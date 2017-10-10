var express = require('express')
var user = express.Router()

user.post('/register',function (req,res) {
    var user = req.body;
    Model('User').findOne({username: user.username}, function(err, doc) {
        if (err) {
            res.send('注册失败')
        } else if (doc) {
            res.send({id: 2, type:2, content: '用户名已存在'})
        } else {
            Model('User').findOne({email: user.email}, function(err, doc) {
                if (err) {
                    res.send('注册失败')
                } else if (doc) {
                    res.send({id: 3, type: 2, content: '邮箱已被使用'})
                } else {
                    Model('User').create(user, function(err, doc) {
                        if (err) {
                            res.send('注册失败')
                        } else {
                            var data = {id: 1,type:2, content: doc._id, username: doc.username}
                            res.send(data)
                        }
                    })
                }
            })
        }
    })
})

user.post('/login', function(req, res) {
    console.log("user login: ", req.body)
    var user = req.body
    Model('User').findOne(user, function(err, doc) {
        if (err) {
            res.send({id: 0, type: 1, content: err})
        } else {
            if (doc) {
                res.send({id: 1, type: 1, content: doc._id, username: doc.username})
            } else {
                res.send({id: 0, type: 1, content: '用户不存在'})
            }
        }
    })
})

module.exports = user