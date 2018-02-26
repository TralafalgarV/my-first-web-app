var express = require('express')
var music = express.Router()
var request = require('request')

// 搜索结果列表 
let musicList = []

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
                promise.then(function(songs) {
                    console.log("musicList: ", songs)
                    // 存储搜索结果
                    musicList = songs
                    // 给客户端返回数据
                    res.send(JSON.stringify(songs))
                }).catch(function(value) {
                    console.log("Promise error: ", value)
                    res.send("Search Music Fail", value)
                })
            }
            break;
        case "music-add":
            let index = req.query.musicIndex
            addMusic(index, res)
            break;
        default:
            break;
    } 
})

// 添加歌曲到数据库
const addMusic = function(index, res) {
    // 判断musicList是否为空
    if (musicList) {
        console.log("add Music: ", index, musicList[index]) 
        let curMusic = musicList[index]
        // 通过 musicId 获取 musicUrl
        let promise1 = new Promise(function(resolve, reject) {
            request.get("http://localhost:4000/music/url?id="+`${curMusic.musicId}`, function(error, response, body) {
                let data = JSON.parse(body)
                if (data.code == 200) {
                    curMusic.musicUrl = data.data[0].url
                    resolve()
                }        
            })
        })

        // 通过 musicId 获取 albumUrl
        let promise2 = new Promise(function(resolve, reject) {
            request.get("http://localhost:4000/song/detail?ids="+`${curMusic.musicId}`, function(error, response, body) {
                let data = JSON.parse(body)
                if (data.code == 200) {
                    curMusic.albumUrl = data.songs[0].al.picUrl
                    curMusic.albumName = data.songs[0].al.name
                    resolve()
                }        
            })
        })

        /*
            artistName: {type: String, isRequired: true},
            albumTitle: {type: String, isRequired: true},
            songTitle: {type: String, isRequired: true},
            musicUrl: {type: String, isRequired: true},
            albumUrl: {type: String, isRequired: true},
            albumId: {type: Number, isRequired: true}  */
        Promise.all([promise1, promise2]).then(function(){
            console.log("Finish: ", curMusic)
            Model('Music').create({
                artistName: curMusic.artist,
                albumTitle: curMusic.albumName,
                songTitle: curMusic.musicName,
                musicUrl: curMusic.musicUrl,
                albumUrl: curMusic.albumUrl
            }, function(err, doc) {
                if (err) {
                    res.send("[Add Music] error ", err)            
                } else {
                    if (doc) {
                        res.send({code: 1, content: '发表成功'})                    
                    }
                }
            })

        }).catch(function(){
            res.send("Server =", err)
        })
        
    } else {
        console.log("add music fail : musicList is null")
    }
}

// 搜索歌曲
// 返回搜索结果，limit=10
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
                        albumUrl:
                }....] */ 
                console.log("songs length: ", songs.length)
                resolve(songs.map(function(ele, index) {
                    return {
                        musicName: ele.name,
                        musicId: ele.id,
                        artist: ele.artists[0].name,
                        artistId: ele.artists[0].id,
                        musicUrl: "",
                        albumUrl: ""
                    }
                }))
            }
        } else {
            reject(data.code)
        }
    })
}


module.exports = music