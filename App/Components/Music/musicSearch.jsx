import React from 'react'
import { render } from 'react-dom'
import { Link, hashHistory } from 'react-router'
import { MusicModel } from '../../Model/dataModel'
import { GetMusicAlbumUrl, DancelMask } from '../../Tools'

class MusicSearch extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            musicList: [],
            selectMusic: {
                // artistName: "菠萝赛东",
                // albumTitle: "未知",
                // songTitle: "我的一个道姑朋友",
                // musicUrl: "http://ws.stream.qqmusic.qq.com/200138786.m4a?fromtag=46"
                // 
            }, 
            // music 页面带过来的音乐名称
            name: this.props.location.state.name
        }
    }
    
    // 获取歌曲列表
    fetchMusicList() {
        /*
        [
            {   musicName: 
                musicId: 
                article: 
                articleId: 
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
        })
    }

    componentWillMount() {
        this.fetchMusicList()
    }

    componentDidMount() {
        DancelMask()
    }

    musicSearchList() {
        let _this = this
        let musicList = this.state.musicList
        return musicList.map(function(ele, index) {
            return (
                <li key={index}>
                    <header>{ele.musicName}</header>
                    <section>
                        <div>{ele.artist}</div>
                        <div>-</div>
                    </section>
                </li>
            )            
        })
    }

    render() {
      return (
        <div>
            <ul>
                {this.musicSearchList()}
            </ul>
        </div>
      )
    }
}

module.exports = MusicSearch