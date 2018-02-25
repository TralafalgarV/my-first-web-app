//文章详细列表
/*
 * 1. prop 传入 createTime 作为文章唯一标示
 * 2. fetchArticle 得到文章详细信息
 * 3. 之所以不放在 indexList 组件里面。是因为预防 index 过大，让 articleDetail 可以按需加载
 * 4. 在 indexList 页面绑定点击事件，点击文章后，改变 location 跳转到对应页面
 */
import React, { Component } from 'react'
import { Link } from 'react-router'
import {ArticleModel, UserModel} from '../../Model/dataModel'
import { DateDiff, DancelMask, GetAuthority } from '../../Tools'
import '../../Static/CSS/create.css'
import '../../Static/CSS/articleDetail.less'
import AVATARPATH from '../../Static/avatar/eg_cute.gif'
import Markdown from '../Markdown'

let Style = {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: "2002"
}

class ArticleDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: "",            
            title: "",
            author: "",
            content: "",
            thumbUp: 0,
            comments:[]
        }

        // 获取登录信息
        this.userinfo = UserModel.fetchLogin()
        if (!this.userinfo) {
            console.log("[ArticleDetial] 此用户文登录")
            // location.hash = "/login"
        }
        
        this.replyComment = this.replyComment.bind(this)
        this.clickThumbUp = this.clickThumbUp.bind(this)
    }

    // 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。
    componentWillMount() {
        this.fetchData()
    }

    // 从路由中获取文章 Id
    getArticleId() {
        let articleId = this.props.params.id  // 通过Link标签带过来的 id参数
        console.log("ArticleId: ", articleId)
        return articleId
    }

    // 获取数据
    fetchData() {
        ArticleModel.fetchArticle(this.getArticleId(), (article) => {
            console.log("[ArticleDetail] fetchArticle: ", article)
            if (article) {
                this.setState({
                    title: article.title,
                    author: article.author,
                    content: article.content,
                    comments: article.comments,
                    thumbUp: article.thumbUp,
                    _id: article._id,
                })                
            }
            
            // 取消mask效果
            DancelMask()
        }, (err) => {
            console.log("[ERROR] fetchArticle: ", err)
        })
    }

    // 删除评论
    delComment(e, item) {
        let _this = this
        let options = {
            dataType: "comment",
            atricleId:this.state._id,
            commentId: item._id
        }

        let commentList = this.state.comments
        if (commentList) {
            commentList.forEach(function(ele, index) {
                if (ele._id == item._id) {
                    let commentDel = commentList.splice(index, 1)
                    console.log("The comment id", commentDel._id, "has been deleted from state arr")                    
                    _this.setState({
                        comments: commentList
                    })
                }
            })
        }

        e.stopPropagation()

        ArticleModel.delCommet(options, function(data) {
            console.log("The Comment has been deleted")
            // 删除后刷新list
            // _this.fetchData()
        }, function(err) {
            if (err) {
                console.log("Delete: ", err)
            }
        })        
    }

    // 回复评论
    replyComment(e, author) {
        var commentInput = document.querySelector(".comment-input")
        commentInput.value = "回复 "+ author + " : "
        commentInput.focus()  // 获取焦点
    }

    // 点赞功能
    clickThumbUp(e) {
        this.setState({
            thumbUp: this.state.thumbUp + 1
        })
        console.log(this.state.thumbUp)
    }

    // 显示文章评论
    articleComments() {
        let _this = this
        let comments = this.state.comments
        // 获取当前登录用户的权限
        let authority = GetAuthority()
        let userInfo = JSON.parse(this.userinfo)
        return comments.map(function(item, index) {
            return (
                <li className="row no-gutter" key={index}>
                    <div className="col-15" style={{padding:'0.3rem 0', width:"2.5rem"}}>
                        <img className="comment-avatar" src={AVATARPATH} alt="无"/>
                    </div>
                    <div className="col-85 comment-list">
                        <div>
                            <div style={{fontWeight:'bold', fontSize:'0.85rem', display: "inline-block"}}>{item.author}</div>
                            <div style={{fontSize:'0.7rem', float: "right"}}><span className="icon icon-clock">{DateDiff(item.createTime)}</span></div>
                        </div>
                        <p className="col-85" style={{margin: "0", padding:'0.2rem 0'}}>{item.content}</p>
                    </div>
                    <div className="comment-ctl">
                        <div id="comment-reply" onClick={(e) => {
                            _this.replyComment(e, item.author)
                        }}>回复</div>
                        {/* <div id="comment-thumbUp" onClick={(e) => {
                            _this.clickThumbUp(e)
                        }}>点赞: <span id="comment-thumbUp-count">{_this.state.thumbUp || 0}</span></div> */}
                        {
                            authority.delComment == true && userInfo.username == item.author ? 
                            <div id="comment-del" onClick={(e) => {
                                _this.delComment(e, item)
                            }}>删除</div> : null 
                        }                                             
                    </div>                
                </li>                
            )
        })
    }

    // 提交评论信息，并更新到服务器
    handleComment() {
        if (this.comment.value == '') {
            alert("评论不能为空")
        }
        
        // 更新评论
        let params = {
            _id: this.state._id,
            comments: {
                author: JSON.parse(this.userinfo).username,
                content: this.comment.value,
                thumbUp: this.state.thumbUp,
                createTime: Date.now()
            },
        }

        ArticleModel.comment(params, (data) => {
            this.comment.value = ''
            // 评论后更新数据
            this.fetchData()
        }, (err) => {
            console.log(err)
        })
    }

    render() {
        console.log("[ArticleDetail] render " + location.hash)
        let data = this.state
        let path = {
            pathname: "/create",
            state: this.state
        }

        let userInfo = JSON.parse(this.userinfo)
        if (!userInfo) {
            userInfo = {}
        }
        return(
            <div className="ad">            
                <header className="ad-title">{this.state.title}
                {
                    this.state.author == userInfo.username ?
                    <Link to={path}>
                        <button id="edit-btn">Edit</button>
                    </Link> : null
                } 
                </header>
                <section>
                    <div className="ad-author">{this.state.author}                   
                    </div>
                    <article className="ad-article">
                        <Markdown content={this.state.content}/>
                    </article>
                </section>
                <section style={{paddingBottom: "3rem"}}>
                    <div className="ad-comments">
                        <ul>{this.articleComments()}</ul>
                    </div>
                </section>
                <div className="comment row no-gutter" style={{margin:'none',zIndex:'2002'}}>
                    <input type="text" style={{border:'none', height: "2rem"}} ref={(node) => {
                        this.comment = node
                    }} className="col-75 comment-input" placeholder="说点什么吧" onChange={this.checkLogin}/>
                    <a onClick={()=>{this.handleComment()}} className="col-25">评论</a>
                </div>
            </div>
        )
    }
}

// 做按需加载必须使用这个方式导出,不能使用 export
module.exports = ArticleDetail