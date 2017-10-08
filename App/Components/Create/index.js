// 发表文章

import React from 'react'
import {ArticleModel, UserModel} from '../../Model/dataModel'

class Create extends React.Component {
    constructor(props) {
        super(props)
        // 检查是否已经登录
        var login = UserModel.fetchLogin()
        if (!login) {
          location.hash = "/login";
        }
        this.state = {
            login: login,
            title: '',
            content: '',
            author: '',
            pageTitle: '发表文章'
        }
    }

    // 更新文章信息
    handleChangeVal(e, key) {
        let val = e.target.value
        if (key === 'title') {
            this.setState({title: val})
        } else {
            this.setState({content: val})
        }
    }
    
    // 发布文章内容
    handlePublish(e) {
        let title = this.state.title
        let content = this.state.content
        let info = []
        let now = new Date()

        if('' == title) {
            alert("标题不能为空")
            return
        }
        if ('' == content) {
            alert("内容不能为空")
            return
        }
        
        info.push({
            title: title,
            content: content,
            login: this.state.login,
            author: 'wangwei',
            createTime: now.toUTCString(),
        }) 

        // 将数据更新到数据库
        ArticleModel.publish(info, () => {
            location.hash = '/indexlist'
        }, (err) => {
            alert(err)
        })
    }

    // 取消用户输入内容
    handleCancel(e) {
        this.setState({
            title: '',
            content: ''
        })
        location.hash = '/indexlist'
    }
    render() {
        return (
            <div>
                <header className="bar bar-nav" style={{position: "relative"}}>
                    <h1 className="title">{this.state.pageTitle}</h1>
                </header>
                <div className="content"  style={{position: "relative", top: "0"}}>
                    <div className="list-block" style={{margin: "0"}}>
                        <ul>
                            <li>
                                <div className="item-content">
                                    <div className="item-inner" style={{borderBottom: "2px solid #eee"}}>
                                        <div className="item-input">
                                            <input type="text" placeholder="请输入标题" value={this.state.title} onChange={(e) => {
                                                this.handleChangeVal(e, "title")
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="align-top">
                                <div className="item-content">
                                    <div className="item-inner">
                                        <div className="item-input">
                                            <textarea placeholder="请输入内容" value={this.state.content} style={{height: "10rem"}} onChange={(e) => {
                                                this.handleChangeVal(e, "content")    
                                            }}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="content-block">
                        <div className="row">
                            <div className="col-50">
                                <a className="button button-big button-fill button-danger" onClick={(e) => {
                                    this.handleCancel(e)
                                }}>取消</a>
                            </div>
                            <div className="col-50">
                                <a className="button button-big button-fill button-success" onClick={(e) => {
                                    this.handlePublish(e)
                                }}>发表</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = Create