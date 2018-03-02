import React from 'react'
import {render} from 'react-dom'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import '../../Static/CSS/musicPlayer.less'
import {MusicModel} from '../../Model/dataModel'
import { DancelMask } from '../../Tools'
import VinylPath from '../../Static/cover/vinyl.png'

const MUSICCTL = {
    FORWARD: 'forward',
    BACK: 'back',
    STOP: 'stop',
    PLAY: 'play'
}

/**
 * log修饰器
 * 
 * @param {any} target 修饰的类
 * @param {any} name 修饰的属性名
 * @param {any} descriptor 该属性的描述对象
 * @returns 
 */
function log(target, name, descriptor) {
    var oldValue = descriptor.value
  
    descriptor.value = function() {
      console.log(`Calling ${name} with`, arguments)
      return oldValue.apply(null, arguments)
    }
  
    return descriptor
}
// 1. 通过操作 player 更新 this.state.curMusic ;
// 2. 从而触发 render 和 dispatch 来更新 store 中的 curMusic
// 3. 并通过 start 和 stop dispach 来操作 store 中的 audio 
class Player extends React.Component {
    constructor(props) {
        super(props) 
        
        this.state = {
            curMusic: this.props.location.state.curMusic,
            index: this.props.location.state.index           
        }
    
        // 绑定播放器运行环境
        this.ctlHandle = this.ctlHandle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps", nextProps)
    }

    componentWillMount() {
        console.log("Music will mount")
        this.setState({
            curMusic: this.props.location.state.curMusic,
            index: this.props.location.state.index
        }, function() {
            // 将当前的音乐通过dispatch更新到store
            // 从首页跳转到当前页面，需要根据option状态更新 option 状态
            if (this.props.location.state.returnFlag === true && this.props.option === "Start") {
                this.updateOption("Start")                
            } else {
                this.updateOption("init")                   
            }
        })

        DancelMask()
    }

/************************ 播放器操作函数 *************************/
    // 通过 option 触发不同的 dispatch
    updateOption(option) {
        this.props.actions.update("http://music.163.com/song/media/outer/url?id=" +`${this.state.curMusic.musicId}`+".mp3", 
        option,  
        this.state.curMusic,
        this.props.location.state.musicList,
        this.props.location.state.index)
    }

    play() {
        // 给play按钮添加播放样式
        this.playNode.classList.toggle("control-pause")
        this.vinylNode.classList.toggle("album-playing")
        
        // 音乐的播放开始
        if (this.playNode.classList.contains("control-pause")) {
            console.log("music play")            
            this.updateOption("Start")     
        } else {
            // 结束音乐的播放
            console.log("music stop")
            // this.audio.pause()
            this.updateOption("Stop")
        }
    }
    
    musicController(cmd) {
        // 停止播放、更换play图标和唱片动画效果
        // this.audio.pause()
        this.playNode.classList.remove("control-pause")
        this.vinylNode.classList.remove("album-playing")
        let curIndex = this.state.index
        let musicList = this.props.location.state.musicList

        switch (cmd) {
            case MUSICCTL.FORWARD:
                // 计算下一首歌曲的index
                if (musicList.length == curIndex + 1) {
                    curIndex = 0
                } else {
                    curIndex = curIndex + 1
                }                
                break;
            case MUSICCTL.BACK:
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
        }, function() { 
             // setState是异步操作，导致 curMusic 没有及时更新
            console.log("Update Option State", cmd)
            this.updateOption(cmd)
        })
    }

    // 播放器相关函数
    ctlHandle(btnType) {
        // this.context.store.dispatch({type: "pre"})
        switch (btnType) {
            case MUSICCTL.BACK:
                console.log("[Music] control-back")
                this.musicController(MUSICCTL.BACK)                                  
                break
            case MUSICCTL.PLAY:
                console.log("[Music] click control-play")
                this.play()
                break
            case MUSICCTL.FORWARD:
                console.log("[Music] control-forwards")
                this.musicController(MUSICCTL.FORWARD)
                break
            default:
                break
        }
    }

    render() {
        let _this = this
        // 获取当前歌曲封面的url
        let albumUrl = this.state.curMusic.albumUrl
        return (
            <div>
                <div className="music-player-container is-playing">
                    <div className="album">
                        <div className="album-art">
                            <img src={albumUrl} alt=""/>
                        </div>
                        {
                            // 从主页进入，且操作状态为 start，需要保留播放状态
                            _this.props.option === "Start" ? 
                            <div className="vinyl album-playing" ref={(node) => {this.vinylNode = node}} style={{backgroundImage : "url(" + VinylPath + "),url(" + albumUrl + ")"}}></div> : 
                            <div className="vinyl" ref={(node) => {this.vinylNode = node}} style={{backgroundImage : "url(" + VinylPath + "),url(" + albumUrl + ")"}}></div>
                        }
                    </div>                
                    <div className="music-player">
                        <div className="player-content-container">
                            <div>
                                <h1 className="song-title">{this.state.curMusic.songTitle}</h1>
                                <h2 className="album-title">{this.state.curMusic.albumTitle}</h2>
                                <h3 className="artist-name">{this.state.curMusic.artistName}</h3>                                
                            </div>
                            <div className="music-player-controls">
                                <div className="control-back" onClick={() => this.ctlHandle(MUSICCTL.BACK)}></div>
                                {
                                    // 从主页进入，且操作状态为 start，需要保留播放状态
                                    _this.props.option === "Start" ? 
                                    <div className="control-play control-pause" onClick={() => this.ctlHandle(MUSICCTL.PLAY)} ref={(node) => this.playNode = node}></div> :
                                    <div className="control-play" onClick={() => this.ctlHandle(MUSICCTL.PLAY)} ref={(node) => this.playNode = node}></div>                                    
                                }
                                <div className="control-forwards" onClick={() => this.ctlHandle(MUSICCTL.FORWARD)}></div>
                                {/* <audio ref={(node) => {this.audio = node}}>
                                    <source src={"http://music.163.com/song/media/outer/url?id=" +`${this.state.curMusic.musicId}`+".mp3"} type="audio/mpeg" />
                                </audio> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// mapStateToProps：简单来说，就是把状态绑定到组件的属性当中。
// 我们定义的state对象有哪些属性，在我们组件的props都可以查阅和获取
function mapStateToProps(state) {
    console.log("Music Player store state: ", state)
    return {
        curMusicUrl: state.musicPlayerReducer.curMusicUrl,
        curMusic: state.musicPlayerReducer.curMusic,
        musicList: state.musicPlayerReducer.musicList,
        index: state.musicPlayerReducer.index,
        option: state.musicPlayerReducer.option
    }
}

/*这个方法return的就是一个dispatch函数，将该方法绑定到属性上，我们同样可以在props查看和调用*/
function mapDispatchToProps(dispatch) {
    return {
        actions: {
            update: (curMusicUrl, option, curMusic, musicList, index) => {
                dispatch({
                    type: "update",
                    curMusicUrl: curMusicUrl,
                    option: option,
                    curMusic: curMusic,
                    musicList: musicList,
                    index: index
                })
            }                      
        }
    }
}

// action creator
let updateAction = function() {
    return {

    }
}

const MusicPlayer = connect(mapStateToProps, mapDispatchToProps)(Player)

module.exports = MusicPlayer