var express = require('express')
var router = express.Router()

let item = [{
    title: '阅后即瞎',
    author: '阿炳二人组',
    content: '缘 妙不可言'
}, {
    title: '暴走大事件',
    author: '王尼玛',
    content: 'lalalala'
}]

router.get('/fetchList', function (req, res) {
    res.send(JSON.stringify(item))
})

router.post('/publish', function (req, res) {
    console.log("publish", req.body)
    res.send(JSON.stringify(null))
})

module.exports = router