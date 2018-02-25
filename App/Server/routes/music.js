var express = require('express')
var music = express.Router()
var request = require('request')

music.get('/fetchList', function (req, res) {
    console.log("music req", req.query)
    let option = req.query.option || "unvailed"

    switch (option) {
        case "music-list":
            Model('Music').find().exec(function(err, doc) {
                if (err) {
                    res.send(err)
                } else {
                    if (doc) {
                        // console.log(doc)
                        res.send(JSON.stringify(doc))
                    }
                }
            })               
            break;
        case "music-search":
            let musicName = req.query.musicName
            if (musicName) {
                let promise = new Promise(function(resolve, reject) {
                    serachMusic(musicName, resolve, reject)
                })
                promise.then(function(value) {
                    console.log("musicList: ", value)
                    // 给客户端返回数据
                    res.send(JSON.stringify(value))
                }).catch(function(value) {
                    console.log("Promise error: ", value)
                    res.send("Search Music Fail", value)
                })
            }
        default:
            break;
    } 
})


const serachMusic = function(musicName, resolve, reject) {
    
    request.get("http://localhost:4000/search?keywords="+`${encodeURIComponent(musicName)}`+"&limit=10", function(error, response, body) {
        let data = JSON.parse(body)
        if (data.code == 200) {
            let songs = data.result.songs
            if (songs !== []) {
                /*  musicList[{
                        musicName:
                        musicId:
                        artist:
                        artistId:
                        musicUrl:
                        albumImg:
                    }....] */ 
                let musicList = []
                console.log(songs.length)
                resolve(songs.map(function(ele, index) {
                    return {
                        musicName: ele.name,
                        musicId: ele.id,
                        artist: ele.artists[0].name,
                        artistId: ele.artists[0].id,
                        musicUrl: "",
                        albumImg: ""
                    }
                }))
            }
        } else {
            reject(data.code)
        }
    })
}


module.exports = music