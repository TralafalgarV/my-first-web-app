// 音乐列表

import React from 'react'
import {render} from 'react-dom'
import '../../static/css/indexlist.css'

class Music extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            defaultTop: null,
        }
    }
    render() {
        return (
            <div>
                Music
            </div>
        )
    }
}

module.exports = Music