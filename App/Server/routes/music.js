var express = require('express')
var music = express.Router()

music.get('/fetchList', function (req, res) {
    console.log("music req")

    Model('Music').find().exec(function(err, doc) {
        if (err) {
            res.send(err)
        } else {
            if (doc) {
                console.log(doc)
                res.send(JSON.stringify(doc))
            }
        }
    })    
})

module.exports = music