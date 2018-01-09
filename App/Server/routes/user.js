var express = require('express')
var user = express.Router()

const errorThrow = function (context) {
    let error = new Error(context)
    throw error
}

user.post('/register', function (req, res) {
    var user = req.body
    if (!req) {
        console.log("请求消息为空")
        return
    }

    new Promise(function (resolve, reject) {
            Model('User').findOne({
                username: user.username
            }, function (err, doc) {
                if (err) {
                    res.send({
                        registerState: false,
                        content: `数据库错误: ${err}`
                    })
                    reject()
                } else if (doc) {
                    console.log('用户名已存在')
                    res.send({
                        registerState: false,
                        content: '用户名已存在'
                    })
                    reject()
                } else {
                    console.log("用户名未被使用")
                    resolve()
                }
            })
        })
        .then(function () {
            // 查找邮箱是否已经被占用
            Model('User').findOne({
                email: user.email
            }, function (err, doc) {
                if (err) {
                    res.send({
                        registerState: false,
                        content: `数据库错误: ${err}`
                    })
                } else if (doc) {
                    res.send({
                        registerState: false,
                        content: '邮箱已被使用'
                    })
                } else {
                    console.log("邮箱未被使用")
                }
            })
        }, function () {
            let error = new Error("Promise error")
            // error.state = response.status
            // error.response = response
            throw error
        })
        .then(function () {
            Model('User').create(user, function (err, doc) {
                if (err) {
                    res.send({
                        registerState: false,
                        content: `数据库错误: ${err}`
                    })
                } else {
                    console.log("注册成功")
                    res.send({
                        registerState: true,
                        content: '注册成功',
                        username: doc.username,
                        authority: doc.authority
                    })
                }
            })
        }, function () {
            let error = new Error("Promise error")
            // error.state = response.status
            // error.response = response
            throw error
        })

    // // 查找用户明是否已经存在
    // Model('User').findOne({username: user.username}, function(err, doc) {
    //     if (err) {
    //         res.send('注册失败')
    //     } else if (doc) {
    //         res.send({id: 2, type:2, content: '用户名已存在'})
    //     } else {
    //         // 查找邮箱是否已经被占用
    //         Model('User').findOne({email: user.email}, function(err, doc) {
    //             if (err) {
    //                 res.send('注册失败')
    //             } else if (doc) {
    //                 res.send({id: 3, type: 2, content: '邮箱已被使用'})
    //             } else {
    //                 Model('User').create(user, function(err, doc) {
    //                     if (err) {
    //                         res.send('注册失败')
    //                     } else {
    //                         var data = {id: 1,type:2, content: doc._id, username: doc.username}
    //                         res.send(data)
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
})

// interface req.body {
//     username: string;
//     password: string;
// }
// interface response {
//     resState: string,
//     content: string,
//     authority: object
//     username?: string
// }

/* 用户注册 */
/**
 *  user = {
        username,
        email,
        password,
    }
 */
user.post('/login', function (req, res) {
    console.log("user login: ", req.body)
    var user = req.body
    Model('User').findOne(user, function (err, doc) {
        if (err) {
            res.send({
                resState: "error",
                content: err
            })
        } else {
            if (doc) {
                res.send({
                    resState: "success",
                    content: "登陆成功",
                    username: doc.username,
                    authority: doc.authority
                })
            } else {
                res.send({
                    resState: "error",
                    content: "用户不存在"
                })
            }
        }
    })
})

module.exports = user