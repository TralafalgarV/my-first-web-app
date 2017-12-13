import React, {Component} from 'react'
import {render} from 'react-dom'
import {
    Router,
    Route,
    hashHistory,
    Link,
    IndexRoute,
    Redirect,
    browserHistory
} from 'react-router'
import {
    IndexList,
    Create,
    Music,
    Game,
    ArticleDetail,
    Login,
    MusicPlayer
} from './Config/route-config'
import '../App/Static/CSS/base.css'

// 引入适配模块(适配移动端和IE)
import '../App/Adaptation'

// Route组件定义了URL路径与组件的对应关系。你可以同时使用多个Route组件 rootRoute 定义了 组件结构
/**
App
 +---> IndexList 作为首页进行加载
 |     +---> ArticleDetail 显示详情
 +---> Create
 +---> Game
 +---> ArticleDetail
 */
const rootRoute = {
    // 此时访问App时，不会显示任何子组件，this.prop.children为undefined
    component: require('./Components/main').default,
    childRoutes: [
        {
            path: '/', // 根路由；对应于上面的App组件
            indexRoute: { // 由于App页面没有内容，所以需要一个根路由的子组件
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {
                        cb(null, require('./Components/IndexList'))
                    })
                }
            },
            childRoutes: [
                IndexList,
                Create,
                Music,
                Game,
                ArticleDetail,
                Login,
                MusicPlayer
            ]
        }
    ]
}

// Router组件本身只是一个容器，真正的路由要通过Route组件定义
let root = document.getElementById('app')
// 你可能还注意到，Router组件有一个参数history，它的值hashHistory表示，路由的切换由URL的hash变化决定，
// 即URL的#部分发生变化。举例来说，用户访问http://www.example.com/，实际会看到的是http://www.example.com/#/
render(
    <Router routes={rootRoute} history={hashHistory}/>, root)

/**
 * 补充：每个路由都有onEnter和onLeave 事件钩子函数，用户进入或离开该路由时触发。
 */