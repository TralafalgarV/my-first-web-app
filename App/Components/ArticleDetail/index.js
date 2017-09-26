//文章详细列表
/*
 * 1. prop 传入 article_id
 * 2. fetchArticle 得到文章详细信息
 * 3. 之所以不放在 index 组件里面。是因为预防 index 过大，让 articleDetail 可以按需加载
 * 4. 在 index 页面绑定点击事件，点击文章后，改变 location 跳转到对应页面
 */
import React, { Component } from 'react'
import {ArticleModel} from '../../Model/dataModel'

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
            
        }
    }

    render() {
        return(
            <div>
                <span style={Style}>ArticleDetail</span> 
            </div>
        )
    }
}

// 做按需加载必须使用这个方式到处,不能使用 export
module.exports = ArticleDetail