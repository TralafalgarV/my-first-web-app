import React, {Component} from 'react'
import {render} from 'react-dom'
import {
    Route,
    Router,
    hashHistory,
    Link,
    IndexRoute,
    Redirect,
    browserHistory
} from 'react-router'

const IndexList = {
    path: 'indexlist',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            return cb(null, require('../Components/IndexList'))
        }, 'indexlist')
    }
}

const Create = {
    path: 'create',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            return cb(null, require('../Components/Create'))
        }, 'create')
    },
}

const Music = {
    path: 'music',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            return cb(null, require('../Components/Music'))
        }, 'music')
    },
}

const Game = {
    path: 'game',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            return cb(null, require('../Components/Game'))
        }, 'game')
    },
}

const ArticleDetail = {
    path: '/indexList/:id',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            return cb(null, require('../Components/ArticleDetail')) // 注意路径大小写
        }, 'articleDetail')
    }
}

const Login = {
    path: 'login',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            return cb(null, require('../Components/Login')) // 注意路径大小写
        }, 'login')
    }
}

module.exports = {
    IndexList: IndexList,
    Create: Create,
    Music: Music,
    Game: Game,
    ArticleDetail: ArticleDetail,
    Login: Login,
}