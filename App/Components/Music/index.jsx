// 音乐列表

import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import '../../Static/CSS/music.less'
import { MusicModel } from '../../Model/dataModel'

// 获取所有封面图片路径的集合
const requireCover = require.context("../../Static/cover", true, /[0-9]\.(png|jpg)/)
const images = requireCover.keys().map(requireCover)
//获取歌曲路径
// const requireMusic = require.context("../../Static/resource", true, /.*\.(mp3)/)
// const musics = requireMusic.keys().map(requireMusic)
// import musics from '../../Static/resource/1.mp3'
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
        // this.playNode.classList.remove("control-pause")
        // this.vinylNode.classList.remove("album-playing")

        //console.log("点歌", this.audio)   // audio 已经移动到 musicPlayer组件
        this.setState({
            curMusic: musicList[index]
        })
        // 修改source.src之后，需要重新加载audio元素
        //this.audio.load()  // 这个很重要
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
    
    // 播放列表
    musicListHandle() {
        let _this = this
        let musicList = this.state.musicList
        return musicList.map(function(ele, index) {
            return (
                <li key={index}>
                    <Link to="/musicPlayer">
                        <div className="musis-list-item" data-index={index} onClick={(e) => {
                            e.stopPropagation()  // stopPropagation()方法既可以阻止事件冒泡，也可以阻止事件捕获，也可以阻止处于目标阶段
                            _this.chooseMusic(e.target.dataset.index)
                        }}>
                            <header>{ele.songTitle}</header>
                            <section>
                                <div>{ele.artistName}</div>
                                <div>-</div>
                                <div>{ele.albumTitle}</div>
                            </section>
                        </div>
                    </Link>
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
            </div>           
        )
    }
}

module.exports = Music