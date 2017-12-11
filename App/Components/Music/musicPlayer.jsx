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
                musicUrl: "http://ws.stream.qqmusic.qq.com/200138786.m4a?fromtag=46",
                albumId: 0,
            } ,
            index: 0           
        }

        // 绑定播放器运行环境
        this.ctlHandle = this.ctlHandle.bind(this)           
    }

    componentDidMount() {
        console.log("componentDidMount: ", this.props.location.state)
        this.setState({
            curMusic: this.props.location.state.curMusic,
            index: this.props.location.state.index
        })
    }

/************************ 播放器操作函数 *************************/
    play() {
        // 给play按钮添加播放样式
        this.playNode.classList.toggle("control-pause")
        this.vinylNode.classList.toggle("album-playing")
        
        // 音乐的播放开始
        if (this.playNode.classList.contains("control-pause")) {
            console.log("music play")            
            this.audio.play()                    
        } else {
            // 音乐的播放开始
            console.log("music stop")
            this.audio.pause()
        }
    }
    
    musicController(cmd) {
        // 停止播放、更换play图标和唱片动画效果
        this.audio.pause()
        this.playNode.classList.remove("control-pause")
        this.vinylNode.classList.remove("album-playing")
        let curIndex = this.state.index
        let musicList = this.props.location.state.musicList

        switch (cmd) {
            case "forwards":
                // 计算下一首歌曲的index
                if (musicList.length == curIndex + 1) {
                    curIndex = 0
                } else {
                    curIndex = curIndex + 1
                }                
                break;
            case "back":
                // 计算上一首歌曲的index
                if (curIndex == 0) {
                    curIndex = musicList.length - 1
                } else {
                    curIndex = curIndex - 1
                }              
                break;        
            default:
                console.log("[ERROR] musicController")
                break;
        }
        // 更新当前music和歌曲index
        this.setState({
            curMusic: musicList[curIndex],
            index: curIndex
        }, function() {  // setState是异步操作，导致 curMusic 没有及时更新
            console.log(this.state.curMusic, this.state.index)
            // 修改source.src之后，需要重新加载audio元素
            this.audio.load()  // 这个很重要  
        })            
    }

    // 播放器相关函数
    ctlHandle(btnType) {
        switch (btnType) {
            case "control-back":
                console.log("[Music] control-back")
                this.musicController("back")
                break
            case "control-play":
                console.log("[Music] click control-play")
                this.play()
                break
            case "control-forwards":
                console.log("[Music] control-forwards")
                this.musicController("forwards")
                break
            default:
                break
        }
    }

    render() {
        let _this = this
        let albumUrl = `http://imgcache.qq.com/music/photo/album_300/${this.state.curMusic.albumId%100}/300_albumpic_${this.state.curMusic.albumId}_0.jpg`
        return (
            <div>
                <div className="music-player-container is-playing">
                    <div className="album">
                        <div className="album-art">
                            <img src={albumUrl} alt=""/>
                        </div>
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