// 音乐列表

import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'
import '../../Static/CSS/music.less'
import { MusicModel } from '../../Model/dataModel'
import { getMusicAlbumUrl, cancelMask } from '../../Tools'

// 获取所有本地封面图片路径
// const requireCover = require.context("../../Static/cover", true, /[0-9]\.(png|jpg)/)
// const images = requireCover.keys().map(requireCover)
//获取本地歌曲路径
// const requireMusic = require.context("../../Static/resource", true, /.*\.(mp3)/)
// const musics = requireMusic.keys().map(requireMusic)
// import musics from '../../Static/resource/1.mp3'
// console.log(musics)

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
    }

    // 展示专辑封面
    coverImages() {
        let images = this.state.musicList.map(function(ele) {
            return getMusicAlbumUrl(ele.albumId)
        })
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
        this.fetchData()
        // setInternal 中传入的回调函数，需要绑定当前运行环境
        this.timer = setInterval(this.rotateGallery, 1500)
        // 取消加载mask
        cancelMask()
    }

    // 获取music相关数据
    fetchData() {
        MusicModel.fetchList("", (data) => {
            // 更新state
            this.setState({
                musicList: data
            })
            console.log("Music List:", this.state.musicList)
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

    // 轮播导航栏
    listHandle() {
        let _this = this
        return (
            this.state.musicList.map(function(item, index) {
                return (
                    <div className="music-btn" key={index} onClick={function(e) {
                        _this.setGalleryImage(index)
                        _this.restartTimer()
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
            let path = {
                pathname: "/musicPlayer",
                state: {
                    curMusic: ele,
                    musicList: _this.state.musicList,
                    index: index
                }
            }
            return (
                <li key={index}>
                    <div className="musis-list-item" data-index={index} onClick={(e) => {
                        e.stopPropagation()  // stopPropagation()方法既可以阻止事件冒泡，也可以阻止事件捕获，也可以阻止处于目标阶段
                        hashHistory.push(path)  // 使用 react-router的 hashHistory 函数实现页面跳转和传参。
                    }}>
                        <header>{ele.songTitle}</header>
                        <section>
                            <div>{ele.artistName}</div>
                            <div>-</div>
                            <div>{ele.albumTitle}</div>
                        </section>
                        <div className="listNum">{index + 1}</div>
                    </div>
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