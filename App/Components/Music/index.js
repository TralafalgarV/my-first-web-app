// 音乐列表

import React from 'react'
import {render} from 'react-dom'
import '../../static/CSS/music.css'

// 获取所有封面图片路径的集合
const requireCover = require.context("../../static/cover", true, /[0-9]\.(png|jpg)/)
const images = requireCover.keys().map(requireCover)
// 获取歌曲路径
// const requireMusic = require.context("../../static/resource", true, /.*\.(mp3)/)
// const musics = requireMusic.keys().map(requireMusic)
// console.log(requireMusic)

class Music extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            defaultTop: null,
        }
        // 绑定当前运行环境
        this.rotateGallery = this.rotateGallery.bind(this)
        this.resetDeg = this.resetDeg.bind(this)
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
        this.timer = setInterval(this.rotateGallery, 1000)
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
        this.timer = setInterval(this.rotateGallery, 1000)
    }

    btnHandle() {
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
    
    render() {
        return (
            <div style={{position: "relative"}}>
                <div className="container">
                    <div className="gallery" id="gallery" ref={(node) => {this.galleryNode = node}}>{this.coverImages()}</div>
                    <div id="buttons">{this.btnHandle()}</div>                
                </div>
                <div className="media">
                    <audio src="" controls="controls"></audio>
                </div>    
            </div>           
        )
    }
}

module.exports = Music