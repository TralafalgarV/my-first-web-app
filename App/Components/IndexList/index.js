// 文章列表

import React from 'react'
import {render} from 'react-dom'
import '../../static/css/indexlist.css'
import {ArticleModel} from '../../Model/dataModel'

let Styles = {
    indexList:{
        paddingRight:'0.75rem',
        marginBottom:'0.2rem',
        borderTop:'1px solid #dfdfdf',
        borderBottom:'1px solid #dfdfdf',
        paddingLeft:"0.75rem",
        paddingBottom:"0.3rem",
        position: "relative",
        zIndex: "2001",
        background: "rgba(255, 255, 255, 0)",
        listStyleType:"none"
    },
    h4Style:{
        margin:"0.3rem 0",
        color:'#259',
        fontSize:'30px'
    },
    pStyle:{
        margin:"0.3rem 0",
        fontSize:"20px"
    },
    listBlock:{
      margin:0,
    },
    userTitle:{
        dispaly:'inline-blcok',
    }
}

class IndexList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            defaultTop: null
        }
    }
    componentDidMount() {
        console.log("will get data")
        this.fetchData()
        console.log("got data")
    }

    // 获取数据
    fetchData() {

        ArticleModel.fetchList("", (data) => {
            console.log("Server数据：", data)
            this.setState({list : data})      
        }, (err) => {
            console.log(err)
        })        
    }
    //限制字数
    wordControl(word){
        if(word.length>65){
           word = word.substring(0,65)+' ...';
        }
        return word
    }
    // 列表
    indexList() {
        let _this = this        
        let list = this.state.list

        return list.map(function(item, index) {
            let date = new Date()              
            return (
                <li className="" style={Styles.indexList} key={index}>
                    <div className="list">
                        <div className=""><h4 style={Styles.h4Style}>{item.title}</h4></div>
                        <div className="">
                            <div style={{display:'inline-block', verticalAlign:'top', height:'1.2rem'}}>
                                <img src="" style={{marginRight:'0.3rem', height:'1.2rem', display:'inline-block'}}  alt=""/>
                            </div>
                            <div style={{display:'inline-block', verticalAlign:'top', height:'1.2rem'}}>
                                <div style={{display:'inline-block', fontSize:'18px', fontWeight:600, marginRight:'0.3rem'}}>{item.author}</div>
                                <div style={{display:'inline-block', fontSize:'14px'}}><span className="icon icon-clock"></span>{item.createTime}</div>
                            </div>
                        </div>
                        <div className=""><p style={Styles.pStyle}>{_this.wordControl(item.content)}</p></div>
                    </div>
                </li>
            )
        })
    }
    
    render() {
        return (
            <div>
                <ul>
                    {this.indexList()}
                </ul>
            </div>
        )
    }
}

module.exports = IndexList