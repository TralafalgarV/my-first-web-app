// 游戏

import React from 'react'
import {render} from 'react-dom'
import '../../static/css/indexlist.css'

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            defaultTop: null,
        }
    }
    render() {
        console.log("[Game] render " + location.hash)        
        return (
            <div>
                Game
            </div>
        )
    }
}

module.exports = Game