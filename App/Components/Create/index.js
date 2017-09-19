// 发表文章

import React from 'react'
import {render} from 'react-dom'
import {ArticleModel} from '../../Model/dataModel'

class Create extends React.Component {
    constructor(props) {
        super(props)
        // 检查是否已经登录
        var signedIn = true
        if (!signedIn) {
            location.hash = '/signin'
        }
        this.state = {
            signedIn: signedIn,
            title: '',
            content: '',
            author: '',
            pageTitle: '发表文章'
        }
    }


    render() {
        return (
            <div style={{}}>
                Create
            </div>
        )
    }
}

module.exports = Create