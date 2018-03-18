import React from 'react'
import '../../Static/Indicator/musicPlayIndicator.less'

// Stateless Functional Component 不支持Refs
const PlayIndicator = ({option}) => {
    console.log("Indicator State: ", option)
    return (
        option === "Start" ? 
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

PlayIndicator.propTypes = {
    option: React.PropTypes.string.isRequired
}

module.exports = PlayIndicator