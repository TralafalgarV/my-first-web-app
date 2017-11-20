// 发表文章组件

import React from 'react'
import {ArticleModel, UserModel} from '../../Model/dataModel'
import Markdown from '../Markdown'
import "../../static/CSS/create.css"

class Create extends React.Component {
    constructor(props) {
        super(props)
        // 检查是否已经登录
        var login = UserModel.fetchLogin()
        if (!login) {
            // 跳转到登录界面
            location.hash = "/login"
        }
        this.state = {
            login: login,
            title: '',
            content: '',
            author: 'unknown',
            pageTitle: '发表文章'
        }
    }

    // 更新文章信息
    handleChangeVal(e, key) {
        let val = e.target.value
        if (key === 'title') {
            this.setState({title: val})
        } else {
            // 将内容以markdown格式进行存储
            this.setState({content: val})            
        }
    }
    
    // 发布文章内容
    handlePublish(e) {
        let title = this.state.title
        let content = this.state.content
        let info = []
        let now = new Date()

        // 内容检测
        if('' == title) {
            alert("标题不能为空")
            return
        }

        if('' == content) {
            alert("内容不能为空")
            return
        }
        
        // 获取作者信息
        let userInfo = UserModel.fetchLogin()
        // 更新文章列表
        info.push({
            title: title,
            content: content,
            login: this.state.login,
            author: JSON.parse(userInfo).username,  //作者需要根据登录信息来判断
            createTime: now.toUTCString(),
        }) 

        // 将数据更新到数据库
        ArticleModel.publish(info, () => {
            // 路由跳转
            location.hash = '/indexlist'
        }, (err) => {
            alert(err)
        })
    }

    // 取消用户输入内容
    handleCancel(e) {

        // 清空所有输入内容
        this.setState({
            title: '',
            content: ''
        })
        document.querySelector("#myEditor").value = ""
        // 路由跳转
        // location.hash = '/indexlist'
    }
    
    // 隐藏 \ 显示 Markdown
    hideMarkdown(e) {
        console.log(e.target.innerHTML)
        if (e.target.innerHTML == "Hide MK") {
            e.target.innerHTML = "Show MK"
        } else {
            e.target.innerHTML = "Hide MK"            
        }
        document.querySelector(".editor-preview").classList.toggle("hidden")
        document.querySelector(".wmd").classList.toggle("expendWidth")
    }

    render() {
        console.log("[Create] render " + location.hash)        
        return (
            <div>
                <div className="create-container">
                    <div className="form-group">
                        <label htmlFor="title" className="sr-only">标题</label>
                        <input type="text" name="title" required="" data-error="" autoComplete="off" className="form-control tagClose input-lg" placeholder="标题：不需要很长" onChange={(e) => {
                            this.handleChangeVal(e, "title")
                        }}/>
                    </div>
                    <div id="questionText" className="editor liveMode" style={{width: "100%"}}>
                        <button type="button" className="btn" value="Hide MK" style={{position:"absolute", right:"0px", top:"0px", margin:"5px", padding:"3px", backgroundColor:"#009a61", color:"#FFF"}} onClick={(e) => {
                            this.hideMarkdown(e)
                        }}>Hide MK</button>                        
                        <div className="wmd">
                            <textarea id="myEditor" className="mono form-control wmd-input" placeholder="" style={{backgroundPosition: "right top", backgroundRepeat: "no-repeat", opacity: "1", height: "444px"}} onChange={(e) => {
                                this.handleChangeVal(e, "content")    
                            }} onFocus={() => {
                                document.querySelector(".liveMode").classList.add("liveMode-focus")
                            }}></textarea>
                        </div>
                        <div className="editor-line"></div>
                        <div className="editor-preview">
                            <Markdown content={this.state.content} />
                        </div>
                    </div>
                    <div className=" publish-footer">
                        <div className="container">
                            <div className="operations clearfix">
                                <div className="shareToWeibo checkbox pull-left mr10 mb0">
                                    {/* <label htmlFor="shareToWeibo"><input type="checkbox" id="shareToWeibo"/> 同步到新浪微博</label> */}
                                </div>
                                <div className="pull-right">
                                    <span className="text-muted" id="editorStatus">已保存草稿</span>
                                    <a id="dropIt" href="javascript:void(0);" className="mr10" onClick={(e) => {
                                        this.handleCancel(e)    
                                    }}>[舍弃]</a>
                                    <button className="hide" type="button"></button>
                                    <button data-toggle="tooltip" data-placement="top" title="" type="button" data-type="question" id="publishIt" className="btn btn-primary ml10" data-text="发布问题" onClick={(e) => {
                                        this.handlePublish(e);
                                    }}>发布文章</button>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        )
    }
}

module.exports = Create