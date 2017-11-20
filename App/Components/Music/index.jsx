// 音乐列表

import React from 'react'
import {render} from 'react-dom'
import '../../static/CSS/music.css'
import {MusicModel} from '../../Model/dataModel'

// 获取所有封面图片路径的集合
const requireCover = require.context("../../static/cover", true, /[0-9]\.(png|jpg)/)
const images = requireCover.keys().map(requireCover)
//获取歌曲路径
// const requireMusic = require.context("../../static/resource", true, /.*\.(mp3)/)
// const musics = requireMusic.keys().map(requireMusic)
// import musics from '../../static/resource/1.mp3'
// console.log(musics)

var musicList = []

class Music extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            musicList: [],
            curMusic: {
                // artistName: "菠萝赛东",
                // albumTitle: "未知",
                // songTitle: "我的一个道姑朋友",
                // musicUrl: "http://ws.stream.qqmusic.qq.com/200138786.m4a?fromtag=46"
                // 
            },
        }
        // 绑定专辑轮播图运行环境
        this.rotateGallery = this.rotateGallery.bind(this)
        this.resetDeg = this.resetDeg.bind(this)
        this.listHandle = this.listHandle.bind(this)
        // 绑定播放器运行环境
        this.ctlHandle = this.ctlHandle.bind(this)
        this.chooseMusic = this.chooseMusic.bind(this)
    }

    // 展示专辑封面
    coverImages() {
        return (
            images.map(function(item, index) {
                return (
                    <div className="gallery-pic" key={index}><img src={item} alt="" /></div>                                    
                )
            })
        )
    }

    // 图片旋转（旋转的是gallery，不是每个图片）
    rotateGallery() {
        let galleryNode = this.galleryNode 
        // 获取 gallery 元素的 transform 属性
        let transform = galleryNode.style.transform
        let deg = null
        let pattern = /rotateY\((-?\d+)deg\)/

        if (pattern.test(transform)) {
            // 获得当前的角度值
            deg = parseInt(pattern.exec(transform)[1], 10)    
        } else {
            deg = 0
        }
        deg -= 60

        galleryNode.style.transition = "0.4s"
        galleryNode.style.transform = "rotateY(" + deg + "deg)"
        if (deg < -360) {
            window.requestAnimationFrame(this.resetDeg)
        }
    }    

    // 角度重置
    resetDeg() {
        let galleryNode = this.galleryNode
        galleryNode.style.transition = "0s"
        galleryNode.style.transform = "rotateY(0deg)"
        window.requestAnimationFrame(this.rotateGallery)
    }

    componentDidMount() {
        // setInternal 中传入的回调函数，需要绑定当前运行环境
        this.timer = setInterval(this.rotateGallery, 1500)
        this.fetchData()
    }

    // 获取music相关数据
    fetchData() {
        MusicModel.fetchList("", (data) => {
            // 更新state
            this.setState({
                musicList: data
            })
            // 
            musicList = this.state.musicList
            console.log("Music List:", musicList)
        }, (err) => {
            console.log("music fail")
        })
    }

    // 卸载钩子函数
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    // 设置点击图片的位置
    setGalleryImage(index) {
        let galleryNode = this.galleryNode
        let deg = index * 60
        galleryNode.style.transition = "0.4s"
        galleryNode.style.transform = "rotateY(" + deg + "deg)"
    }

    // 重启定时器
    restartTimer() {
        clearInterval(this.timer)
        this.timer = setInterval(this.rotateGallery, 1500)
    }

    // 点歌
    chooseMusic(index) {
        // 给play按钮添加停止样式
        this.playNode.classList.remove("control-pause")
        this.vinylNode.classList.remove("album-playing")

        console.log("点歌", this.audio)
        this.setState({
            curMusic: musicList[index]
        })
        // 修改source.src之后，需要重新加载audio元素
        this.audio.load()
    }

    // 轮播导航栏
    listHandle() {
        let _this = this
        return (
            images.map(function(item, index) {
                return (
                    <div className="music-btn" key={index} onClick={function(e) {
                        _this.setGalleryImage(index)
                        _this.restartTimer()
                        _this.chooseMusic(index)
                    }}>{index + 1}</div>
                )
            })
        )
    }

    playHandle() {
        // 给play按钮添加播放样式
        this.playNode.classList.toggle("control-pause")
        this.vinylNode.classList.toggle("album-playing")
        
        // 音乐的播放停止
        if (this.playNode.classList.contains("control-pause")) {
            console.log("music play")            
            this.audio.play()                    
        } else {
            console.log("music stop")
            this.audio.pause()
        }
    }

    // 播放器相关函数
    ctlHandle(btnType) {
        switch (btnType) {
            case "control-back":
                console.log("[Music] control-back")
                break
            case "control-play":
                console.log("[Music] click control-play")
                this.playHandle()
                break
            case "control-forwards":
                console.log("[Music] control-forwards")
                break
            default:
                break
        }
    }
    
    // 播放列表
    musicListHandle() {
        let _this = this
        let musicList = this.state.musicList
        return musicList.map(function(ele, index) {
            return (
                <li key={index}>
                    <div className="musis-list-btn" data-index={index} onClick={(e) => {
                        e.stopPropagation()  // stopPropagation()方法既可以阻止事件冒泡，也可以阻止事件捕获，也可以阻止处于目标阶段
                        _this.chooseMusic(e.target.dataset.index)
                    }}><span>{ele.songTitle}</span></div>
                </li>
            )
        })
    }

    render() {
        console.log("[Music] render " + location.hash)
        return (
            <div style={{position: "relative"}}>
                <div className="mContainer">
                    <div className="mGallery" id="mGallery" ref={(node) => {this.galleryNode = node}}>{this.coverImages()}</div>
                    <div id="buttons">{this.listHandle()}</div>                
                </div>
                <div className="music-list">
                    <ul>
                        {this.musicListHandle()}
                    </ul>
                </div>                
                <div className="music-player-container is-playing">
                    <div className="music-player">
                        <div className="player-content-container">
                            <h1 className="song-title">{this.state.curMusic.songTitle}</h1>
                            <h2 className="album-title">{this.state.curMusic.albumTitle}</h2>
                            <h3 className="artist-name">{this.state.curMusic.artistName}</h3>
                            <div className="music-player-controls">
                                <div className="control-back" onClick={() => this.ctlHandle("control-back")}></div>
                                <div className="control-play" onClick={() => this.ctlHandle("control-play")} ref={(node) => this.playNode = node}></div>
                                <div className="control-forwards" onClick={() => this.ctlHandle("control-forwards")}></div>
                                <audio ref={(node) => {this.audio = node}}>
                                    <source src={this.state.curMusic.musicUrl} type="audio/mpeg" />
                                </audio>
                            </div>
                        </div>
                    </div>

                    <div className="album">
                        <div className="album-art"></div>
                        <div className="vinyl" ref={(node) => {this.vinylNode = node}}></div>
                    </div>
                </div>
            </div>           
        )
    }
}

module.exports = Music