// 游戏

import React from 'react'
import { Link } from 'react-router'
import { render } from 'react-dom'
import { createStore } from 'redux'
import "../../Static/CSS/me.less"
import { ArticleModel, UserModel } from '../../Model/dataModel'
import { ClassOperation, GetAuthority, DancelMask, DateDiff } from '../../Tools'
// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter)

/**
 * 这是一个 reducer，形式为 (state, action) => state 的纯函数。
 * 描述了 action 如何把 state 转变成下一个 state。
 *
 * state 的形式取决于你，可以是基本类型、数组、对象、
 * 甚至是 Immutable.js 生成的数据结构。惟一的要点是
 * 当 state 变化时需要返回全新的对象，而不是修改传入的参数。
 *
 * 下面例子使用 `switch` 语句和字符串来做判断，但你可以写帮助类(helper)
 * 根据不同的约定（如方法映射）来判断，只要适用你的项目即可。
 */
 // reducer对state进行处理并返回一个新的state放入store
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

// Adds a change listener. 
// It will be called any time an action is dispatched, and some part of the state tree may potentially have changed. 
// You may then call getState() to read the current state tree inside the callback.
// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() =>
    console.log("action dispatch or state tree changed",store.getState())
)

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

    // render() {
    //     console.log("[Me] render " + location.hash)        
    //     return (
    //         <div>
    //             <span>{store.getState()}</span>
    //             <button className="inc" type="button" onClick={() => {
    //                 // 组件通过dispatch发出action
    //                 // 改变内部 state 惟一方法是 dispatch 一个 action。
    //                 // action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
    //                 store.dispatch({ type: 'INCREMENT' })
    //             }}> Increment </button>
    //             <button className="dec" type="button" onClick={() => {
    //                 store.dispatch({ type: 'DECREMENT' })
    //             }}> Decrement </button>
    //         </div>
    //     )
    // }
    componentDidMount() {
        this.fetchData()
        DancelMask()
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