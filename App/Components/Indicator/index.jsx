import React from 'react'
import '../../Static/Indicator/musicPlayIndicator.less'

class PlayIndicator extends React.Component{
    constructor(props) {
        super(props)
    }

    render() {
        console.log("Indicator State: ", this.props.option)
        return (
            this.props.option === "Start" ? 
            ( 
                <div className="music-Indicator">
                    <div className="music-playing">
                        <div className="bar bar1" style={{height: "15%"}}></div>
                        <div className="bar bar2" style={{height: "75%"}}></div>
                        <div className="bar bar3" style={{height: "25%"}}></div>
                        <div className="bar bar4" style={{height: "90%"}}></div>
                    </div>
                </div> 
            )
            : (
                <div className="music-Indicator">
                    <div className="music-playing">
                        <div className="bar" style={{height: "15%", left: "0%"}}></div>
                        <div className="bar" style={{height: "75%", left: "28.3333%"}}></div>
                        <div className="bar" style={{height: "25%", left: "56.6666%"}}></div>
                        <div className="bar" style={{height: "90%", left: "85%"}}></div>
                    </div>
                </div>
            )
        )
    }
}

module.exports = PlayIndicator