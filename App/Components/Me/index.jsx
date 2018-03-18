import React from 'react'
import { Link } from 'react-router'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import "../../Static/CSS/me.less"
import { ArticleModel, UserModel } from '../../Model/dataModel'
import { ClassOperation, GetAuthority, DancelMask, DateDiff } from '../../Tools'

class Me extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            defaultTop: null,
        }

        // 获取登录用户数据，若没有登录则跳转
        let usrInfo = UserModel.fetchLogin()
        if (!usrInfo) {
            // 跳转到登录界面
            location.hash = "/login"
        }
    }

    componentDidMount() {
        this.fetchData()
        DancelMask()
        console.log("1", this.props)
    }

    // 获取当前usr的article
    fetchData() {
        let _this = this
        let usrInfo = JSON.parse(UserModel.fetchLogin())
        if (!usrInfo) {
            console.log("[ERROR] Me Page fetchData usrInfo error")
            return
        }
        // req: {usrname: ****, ....}
        // 通过 username 获取到对应用户的文章列表
        let req = {
            usrname: usrInfo.username
        }
        // res: {usrname: ***, articles: ***}
        ArticleModel.fetchUsrArticle(req, function(res) {
            console.log("[Me] fetchUsrArticle", res)
            _this.setState({
                list: res
            })
        }, function(err) {
            console.log("ERROR:", err)
        })
    }

    // 文章列表
    /**
     * {
            _id: item._id,
            title: item.title,
            content: item.content,
            createTime: item.createTime,
            author: item.author,
        }
     */
    indexList() {
        let articles = this.state.list  // 当前登录用户发过的文章
        return articles.map(function(ele, index) {
            return (
                <li key={index}>
                    <Link to={'/indexList/'+ele._id} style={{display:'block'}}>
                        <div className="me-list-num">{index + 1}</div>                   
                        <div className="me-list">
                            <div className="me-title">{ele.title}</div>
                            <div className="me-content">
                                <div className="me-author">{ele.author}</div>
                                <div className="me-time"><span className="icon icon-clock"></span>{DateDiff(ele.createTime)}</div>
                            </div>
                        </div>
                    </Link>                    
                </li>
            )
        })
    }

    render() {
        let _this = this
        return (
            <div className="page-me">
                <h3 className="me-pageTitle">文章列表</h3>
                <ul>
                    {_this.indexList()}
                </ul>
                <button className="quit-btn"><Link to="/login">退出</Link></button>
            </div>
        )
    }
}

module.exports = Me