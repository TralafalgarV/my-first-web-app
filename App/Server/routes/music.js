var express = require('express')
var music = express.Router()

music.get('/fetchList', function (req, res) {
    console.log("music req")
    res.send()
})

module.exports = music