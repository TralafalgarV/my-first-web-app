//文章详细列表

import React from 'react'
import {ArticleModel} from '../../Model/dataModel'

let Style = {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: "2002"
}

class ArticleDetail extends React.Component{
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

module.exports = ArticleDetail