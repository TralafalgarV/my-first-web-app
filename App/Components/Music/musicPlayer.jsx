import React from 'react'
import {render} from 'react-dom'
import '../../Static/CSS/musicPlayer.less'
import {MusicModel} from '../../Model/dataModel'

class MusicPlayer extends React.Component {
    constructor(props) {
        super(props) 

        this.state = {
            curMusic: {
                artistName: "菠萝赛东",
                albumTitle: "未知",
                songTitle: "我的一个道姑朋友",
                musicUrl: "http://ws.stream.qqmusic.qq.com/200138786.m4a?fromtag=46"
            }            
        }

        // 绑定播放器运行环境
        this.ctlHandle = this.ctlHandle.bind(this)  
        this.chooseMusic = this.chooseMusic.bind(this)              
    }

    componentDidMount() {
        console.log("componentDidMount: ", this.props.location.state)
        this.setState({
            curMusic: this.props.location.state
        })
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

    render() {
        return (
            <div>
                <div className="music-player-container is-playing">
                    <div className="album">
                        <div className="album-art"></div>
                        <div className="vinyl" ref={(node) => {this.vinylNode = node}}></div>
                    </div>                
                    <div className="music-player">
                        <div className="player-content-container">
                            <div>
                                <h1 className="song-title">{this.state.curMusic.songTitle}</h1>
                                <h2 className="album-title">{this.state.curMusic.albumTitle}</h2>
                                <h3 className="artist-name">{this.state.curMusic.artistName}</h3>                                
                            </div>
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
                </div>
            </div>
        )
    }
}

module.exports = MusicPlayer