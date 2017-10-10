// 音乐列表

import React from 'react'
import {render} from 'react-dom'
import '../../static/CSS/music.css'

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
            <main>
                <ul>
                    <li>
                        <a href=""><div>a</div></a>
                    </li>
                    <li>
                        <a href=""><div>b</div></a>
                    </li>
                    <li>
                        <a href=""><div>c</div></a>
                    </li>
                    <li>
                        <a href=""><div>d</div></a>
                    </li>                                                            
                </ul>
            </main>
        )
    }
}

module.exports = Music