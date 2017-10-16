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

class Music extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            artistName: '阿三',
            albumTitle: '农业重金属',
            songTitle: '东北隆冬',
            musicList: [],
        }
        // 绑定专辑轮播图运行环境
        this.rotateGallery = this.rotateGallery.bind(this)
        this.resetDeg = this.resetDeg.bind(this)
        this.listHandle = this.listHandle.bind(this)
        // 绑定播放器运行环境
        this.ctlHandle = this.ctlHandle.bind(this)
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

    fetchData() {
        MusicModel.fetchList("", (data) => {
            console.log("success")
        }, (err) => {
            console.log("fail")
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

    listHandle() {
        let _this = this
        return (
            images.map(function(item, index) {
                return (
                    <div className="btn" key={index} onClick={function(e) {
                        _this.setGalleryImage(index)
                        _this.restartTimer()
                    }}>{index}</div>
                )
            })
        )
    }

    // 播放器相关函数
    ctlHandle(btnType) {
        switch (btnType) {
            case "control-back":
                console.log("control-back")
                break
            case "control-play":
                console.log("control-play")
                break
            case "control-forwards":
                console.log("control-forwards")
                break
            default:
                break
        }
    }
    render() {
        console.log("[Music] render " + location.hash)                
        return (
            <div style={{position: "relative"}}>
                <div className="mContainer">
                    <div className="mGallery" id="mGallery" ref={(node) => {this.galleryNode = node}}>{this.coverImages()}</div>
                    <div id="buttons">{this.listHandle()}</div>                
                </div>
                <div className="music-player-container is-playing">
                    <div className="music-player">
                        <div className="player-content-container">
                            <h1 className="artist-name">{this.state.artistName}</h1>
                            <h2 className="album-title">{this.state.albumTitle}</h2>
                            <h3 className="song-title">{this.state.songTitle}</h3>
                            <div className="music-player-controls">
                                <div className="control-back" onClick={this.ctlHandle("control-back")}></div>
                                <div className="control-play" onClick={this.ctlHandle("control-play")}></div>
                                <div className="control-forwards" onClick={this.ctlHandle("control-forwards")}></div>
                                <audio src="../../static/resource/童话镇.mp3"></audio>
                            </div>
                        </div>
                    </div>
            
                    <div className="album">
                        <div className="album-art"></div>
                        <div className="vinyl is-playing"></div>
                    </div>
                </div>
            </div>           
        )
    }
}

module.exports = Music