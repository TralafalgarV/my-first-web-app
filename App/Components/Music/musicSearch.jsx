import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'
import { MusicModel } from '../../Model/dataModel'
import '../../Static/CSS/musicSearch.less'
import { GetMusicAlbumUrl, DancelMask } from '../../Tools'

class MusicSearch extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            musicList: [],
            // music 页面带过来的音乐名称
            name: this.props.location.state.name
        }

        this.addMusic = this.addMusic.bind(this)
    }
    
    // 获取歌曲列表
    fetchMusicList() {
        /*
        [
            {   musicName: 
                musicId: 
                artist: 
                artistId: 
                musicUrl: 
                albumImg: 
            },
        ...] */
        MusicModel.fetchList({option: "music-search", musicName: this.state.name}, (data) => {
            console.log("Music List:", data)
            this.setState({
                musicList: data
            })
        }, (err) => {
            console.log("music search fail")
            this.setState({
                musicList: [{
                    musicName: "未知",
                    artist: "未知"
                }]
            })            
        })
    }

    componentWillMount() {
        this.fetchMusicList()
    }

    componentDidMount() {
        DancelMask()
    }

    // 选中的music添加至列表
    addMusic(e) {
        console.log(e.target.dataset.key)
        let index = e.target.dataset.key
        // 将音乐加载到后端数据库，返回成功后跳转
        if (index !== undefined && index !== NaN && index !== '') {
            MusicModel.fetchList({option: "music-add", musicIndex: index}, (data) => {
                if (data) {
                    hashHistory.push({
                        pathname: "/music",
                        state: {
                        }
                    })                     
                }
            }, (err) => {
                console.log("Add Music Fail", err)
            })
        }
    }

    musicSearchList() {
        let _this = this
        let musicList = this.state.musicList
        return musicList.map(function(ele, index) {
            return (
                <li key={index}>
                    <header style={{width: "30%", display: "inline-block"}}>{ele.musicName}</header>
                    <section style={{width: "70%", display: "inline-block"}}>
                        <span>{ele.artist}</span>
                        <div className="ms-add-btn" style={{float: "right", display: "inline-block"}} data-key={index} onClick={(e) => {
                            _this.addMusic(e)
                        }}>+</div>
                    </section>
                    <hr/>
                </li>
            )            
        })
    }

    render() {
      return (
        <div className="ms">
            <ul>
                <li key={"header"}>
                    <header style={{width: "30%", display: "inline-block"}}>{"音乐"}</header>
                    <section style={{width: "70%", display: "inline-block"}}>
                        <span>{"歌手"}</span>
                    </section>
                    <hr/>
                </li>                
                {this.musicSearchList()}
            </ul>
        </div>
      )
    }
}

module.exports = MusicSearch