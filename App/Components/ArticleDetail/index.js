//文章详细列表
/*
 * 1. prop 传入 createTime 作为文章唯一标示
 * 2. fetchArticle 得到文章详细信息
 * 3. 之所以不放在 index 组件里面。是因为预防 index 过大，让 articleDetail 可以按需加载
 * 4. 在 index 页面绑定点击事件，点击文章后，改变 location 跳转到对应页面
 */
import React, { Component } from 'react'
import {ArticleModel} from '../../Model/dataModel'
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

    componentDidMount() {
        this.fetchData()
    }

    // 从路由中获取文章唯一标识
    getArticleDetail() {
        let index1 = location.hash.indexOf("?")
        let index2 = location.hash.lastIndexOf("/")
        
        let createTime = location.hash.substring(index2 + 1, index1)
        console.log(createTime)
        return createTime
    }

    // 获取数据
    fetchData() {
        ArticleModel.fetchArticle(this.getArticleDetail(), (article) => {
            console.log("fetchArticle: ", article)
            this.setState({
                title: article.title,
                author: article.author,
                content: article.content,
                comments: article.comments,
            })
        }, (err) => {
            console.log("[ERROR] fetchArticle: ", err)
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
            </div>
        )
    }
}

// 做按需加载必须使用这个方式到处,不能使用 export
module.exports = ArticleDetail