//文章详细列表
/*
 * 1. prop 传入 createTime 作为文章唯一标示
 * 2. fetchArticle 得到文章详细信息
 * 3. 之所以不放在 indexList 组件里面。是因为预防 index 过大，让 articleDetail 可以按需加载
 * 4. 在 indexList 页面绑定点击事件，点击文章后，改变 location 跳转到对应页面
 */
import React, { Component } from 'react'
import {ArticleModel, UserModel} from '../../Model/dataModel'
import '../../static/CSS/articleDetail.css'

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
        let index1 = location.hash.indexOf("?")
        let index2 = location.hash.lastIndexOf("/")
        
        let createTime = location.hash.substring(index2 + 1, index1)
        console.log(createTime)
        return createTime
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
                    <div className="col-15" style={{padding:'0.3rem 0'}}>
                        <img className="commentAvatar" src="" alt="无"/>
                    </div>
                    <div className="col-85 commentList">
                        <div>
                            <div style={{fontWeight:'bold', fontSize:'15px', display: "inline-block"}}>{item.author}</div>
                            <div style={{fontSize:'12px', display: "inline-block"}}><span className="icon icon-clock"></span>{item.createTime}</div>
                        </div>
                        <p className="col-85" style={{margin:'0.2rem 0', fontSize:'14px'}}>{item.content}</p>
                    </div>
                </li>                
            )
        })
    }

    // 提交评论
    handleComment() {
        if (this.comment.value == '') {
            alert("评论不能为空")
        }
        // let userInfo = UserModel.fetchLogin()
        // console.log(JSON.parse(userInfo).content) 
        // 更新评论
        let params = {
            _id: this.state._id,
            comments: {
                author: JSON.parse(UserModel.fetchLogin()).username,
                content: this.comment.value,
                createTime: new Date()
            },
        }

        ArticleModel.comment(params, (data) => {
            this.comment.value = ''
            this.componentDidMount();
        }, (err) => {
            console.log(err)
        })
    }

    render() {
        return(
            <div className="ad">            
                <header className="ad-title">{this.state.title}</header>
                <section>
                    <div className="ad-author">{this.state.author}</div>
                    <article className="ad-article">{this.state.content}</article>
                </section>
                <section>
                    <div className="ad-comments">
                        <ul>
                            {this.articleComments()}
                        </ul>
                    </div>
                </section>
                <div className="comment row no-gutter" style={{margin:'none',zIndex:'2002'}}>
                    <input type="text" style={{border:'none'}} ref={(e) => {
                        this.comment = e
                    }} className="col-75 commentInput" placeholder="说点什么吧" onChange={this.checkLogin}/>
                    <a onClick={()=>{this.handleComment()}} className="button col-25 button-fill button-big">评论</a>
                </div>
            </div>
        )
    }
}

// 做按需加载必须使用这个方式到处,不能使用 export
module.exports = ArticleDetail