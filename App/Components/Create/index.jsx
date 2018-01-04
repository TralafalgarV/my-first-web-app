// 发表文章组件

import React from 'react'
import {ArticleModel, UserModel} from '../../Model/dataModel'
import { ClassOperation, getAuthority, cancelMask } from '../../Tools'
import Markdown from '../Markdown'
import "../../Static/CSS/create.css"
import ADDIMG from "../../Static/create-icon/img.png"

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

        this.uploadImg = this.uploadImg.bind(this)
    }

    componentDidMount() {
        // 取消加载mask
        cancelMask()
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
        if (JSON.parse(userInfo)) {
            if (JSON.parse(userInfo).username) {
                console.log("username is null")            
            }
        } else {
            console.log("userinfo is null")
            return
        }

        // 更新文章列表
        info.push({
            title: title,
            content: content,
            backup: null,
            login: this.state.login,
            author: JSON.parse(userInfo).username,  //作者需要根据登录信息来判断
            createTime: Date.now(),
            imgs:[]
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
        document.querySelector(".input-lg").value = ""        
        // 路由跳转        // location.hash = '/indexlist'
    }
    
    // 隐藏 \ 显示 Markdown
    hideMarkdown(e) {
        if (e.target.innerHTML == "Hide Markdown") {
            e.target.innerHTML = "Show Markdown"
        } else {
            e.target.innerHTML = "Hide Markdown"            
        }
        //document.querySelector(".editor-preview").classList.toggle("hidden")
        ClassOperation.ToggleClass(".editor-preview", "hidden")
        ClassOperation.ToggleClass(".wmd", "expendWidth")        
    }

    // 定时保存功能：键入时开始；5min 一次保存
    saveContent() {
        setInterval(() => {
            console.log("save")
        }, 1000 * 60)
    }

    /**
     * 图片上传存储
     * +-- 前端：将图片包装成 FormData 数据发给后端
     * +-- 后端：通过 formidable 中间件，解析收到的 FormData 数据
     *     +-- 通过 fs 的createReadStream、createWriteStream将图片存在服务器
     *     +-- 返回图片的 url 方便前端转换成 markdown 语法
     */
    uploadImg(e) {
        let _this = this
        console.log("图片信息：", e.target.files[0])
        let img = e.target.files[0]

        // 判断是否为图片
        if (!img) {
            console.log("[Create] uploadImg error ")
            return
        }

        // 判断图片格式
        if (!(img.type.indexOf('image') == 0) && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) {
            console.log("[Create] img type error ")
            return
        }

        // // 读取图片，并在 markdown 中预览
        // let reader = new FileReader()
        // reader.readAsDataURL(img)
        // reader.onload = function(e) {
        // }

        // // 上传图片
        let formData = new FormData()
        formData.append('token',"articleId")        
        formData.append("imgData", img)
        ArticleModel.fetchImg(formData, function(res) {
            if (!res) {
                console.log("error!!!")
            }
            // 将图片更新到 markdown
            _this.setState({
                content: _this.state.content + `![图片描述]( ${res.path})` + "\r"
            })
            // 将图片以 markdown 形式在编辑栏显示 
            document.querySelector("#myEditor").value += `![图片描述]( ${res.path})` + "\r"                  
        }, function() {
            console.log("error")
        })

        // ArticleModel.fetchImg({img: e.target.result}, function(res) {
        //     console.log("success")

        //     // _this.forceUpdate()
        // }, function(res) {
        //     console.log("fail")
        // })
    }

    render() {
        console.log("[Create] render " + location.hash)     
        return (
            <div>
                <div className="create-container">
                    <div className="form-group">
                        <label htmlFor="title" className="sr-only">标题</label>
                        <input type="text" name="title" required="" data-error="" autoComplete="off" className="form-control tagClose input-lg" placeholder="文章标题：" onChange={(e) => {
                            this.handleChangeVal(e, "title")
                        }}/>
                    </div>
                    <div className="editor liveMode" style={{width: "100%"}}>
                        <div className="toolBar">
                            {/* 用来替换按钮的图片 */}
                            <img className="add-img" title="点击添加图片" src={ADDIMG} alt="点击添加图片" onClick={() => {document.querySelector(".file").click()}}/>
                            {/* 原来按钮的样式 */}
                            <input className="file" name="file" type="file" style={{height:"0", width:"0", zIndex: "-1", position: "absolute", left:"0"}} onChange={(e) => {
                                this.uploadImg(e) // 在这个地方上传img，并转成markdown语句显示出来
                            }}/>
                        </div>
                        <button type="button" className="btn mk-ctl-btn" value="Hide MD" style={{position:"absolute", right:"0px", top:"0px", padding:"0px 3px", height:"1rem", backgroundColor:"#0894ec", color:"#FFF"}} onClick={(e) => {
                            this.hideMarkdown(e)
                        }}>Hide Markdown</button>                        
                        <div className="wmd">
                            <textarea id="myEditor" className="mono form-control wmd-input" placeholder="正文内容：" style={{backgroundPosition: "right top", backgroundRepeat: "no-repeat", opacity: "1", height: "444px"}} onChange={(e) => {
                                this.handleChangeVal(e, "content")
                            }} onFocus={() => {
                                ClassOperation.AddClass(".liveMode", "liveMode-focus")                                
                            }} onBlur={() => {
                                // 失去焦点后去掉border样式
                                ClassOperation.RemoveClass(".liveMode", "liveMode-focus")                                                                
                            }}></textarea>
                        </div>
                        <div className="editor-preview">
                            <Markdown content={this.state.content} />
                        </div>
                    </div>
                    <div className=" publish-footer">
                        <div className="container">
                            <div className="operations clearfix">
                                {/* <div className="shareToWeibo checkbox pull-left mr10 mb0">
                                    <label htmlFor="shareToWeibo"><input type="checkbox" id="shareToWeibo"/> 同步到新浪微博</label>
                                </div> */}
                                <div className="pull-right">
                                    <span className="text-muted">已保存草稿</span>
                                    <a href="javascript:void(0);" className="mr10" onClick={(e) => {
                                        this.handleCancel(e)    
                                    }}>[舍弃]</a>
                                    <button title="" type="button" className="btn btn-primary ml10" data-text="发布问题" onClick={(e) => {
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