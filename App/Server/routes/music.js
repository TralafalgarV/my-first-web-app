var express = require('express')
var music = express.Router()

music.get('/fetchList', function (req, res) {
    console.log("music req")
    // 不可以send null （作死）
    res.send(JSON.stringify("wocao"))
})

module.exports = music