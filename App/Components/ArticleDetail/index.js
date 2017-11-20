//文章详细列表
/*
 * 1. prop 传入 createTime 作为文章唯一标示
 * 2. fetchArticle 得到文章详细信息
 * 3. 之所以不放在 indexList 组件里面。是因为预防 index 过大，让 articleDetail 可以按需加载
 * 4. 在 indexList 页面绑定点击事件，点击文章后，改变 location 跳转到对应页面
 */
import React, { Component } from 'react'
import {ArticleModel, UserModel} from '../../Model/dataModel'
import '../../static/CSS/create.css'
import '../../static/CSS/articleDetail.css'
import AVATARPATH from '../../static/avatar/eg_cute.gif'
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
            title: "",
            author: "",
            content: "",
            comments:[]
        }
    }

    // 组件渲染完成之后，进行数据获取
    componentDidMount() {
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
            this.setState({
                title: article.title,
                author: article.author,
                content: article.content,
                comments: article.comments,
                _id: article._id,
            })           
        }, (err) => {
            console.log("[ERROR] fetchArticle: ", err)
        })
    }

    // 显示文章评论
    articleComments() {
        let _this = this
        let comments = this.state.comments
        console.log("[ArticleDetail] Article Comments:", comments.length)
        return comments.map(function(item, index) {
            return (
                <li className="row" key={index}>
                    <div className="col-15" style={{padding:'0.3rem 0', width:"1.5rem"}}>
                        <img className="comment-avatar" src={AVATARPATH} alt="无"/>
                    </div>
                    <div className="col-85 comment-list">
                        <div>
                            <div style={{fontWeight:'bold', fontSize:'15px', display: "inline-block"}}>{item.author}</div>
                            <div style={{fontSize:'13px', display: "inline-block"}}><span className="icon icon-clock">{item.createTime}</span></div>
                        </div>
                        <p className="col-85" style={{margin:'0.2rem 0', fontSize:'18px'}}>{item.content}</p>
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
        // let userInfo = UserModel.fetchLogin()
        // console.log(JSON.parse(userInfo).content)

        // 获取登录信息
        let userinfo = UserModel.fetchLogin()
        if (!userinfo) {
            console.log("评论前请先登录")
            location.hash = "/login"
        }
        // 更新评论
        let params = {
            _id: this.state._id,
            comments: {
                author: JSON.parse(userinfo).username,
                content: this.comment.value,
                createTime: new Date()
            },
        }

        ArticleModel.comment(params, (data) => {
            this.comment.value = ''
            this.componentDidMount()
        }, (err) => {
            console.log(err)
        })
    }

    render() {
        console.log("[ArticleDetail] render " + location.hash)        
        return(
            <div className="ad">            
                <header className="ad-title">{this.state.title}</header>
                <section>
                    <div className="ad-author">{this.state.author}</div>
                    <article className="ad-article">
                        <Markdown content={this.state.content}/>
                    </article>
                </section>
                <section>
                    <div className="ad-comments">
                        <ul>
                            {this.articleComments()}
                        </ul>
                    </div>
                </section>
                <div className="comment row no-gutter" style={{margin:'none',zIndex:'2002'}}>
                    <input type="text" style={{border:'none'}} ref={(node) => {
                        this.comment = node
                    }} className="col-75 comment-input" placeholder="说点什么吧" onChange={this.checkLogin}/>
                    <a onClick={()=>{this.handleComment()}} className="button col-25 button-fill button-big">评论</a>
                </div>
            </div>
        )
    }
}

// 做按需加载必须使用这个方式到处,不能使用 export
module.exports = ArticleDetail