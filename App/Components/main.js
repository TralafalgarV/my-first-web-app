import React from 'react'
import {render} from 'react-dom'
import {Link} from 'react-router'
import RouteConfig from '../Config/route-config'

// 延迟800毫秒，用于加载数据
 const create = () => {
    console.log("main.js: create be clicked")
    setTimeout(()=> {
      window.location.hash = 'create'
    }, 800)
 }

let nav = () => {
    console.log("main.js: nav loading")
    return (
        <nav className="bar bar-tab">
            <Link className="tab-item" activeClassName="active" to="indexlist">
                <span className="tab-label">Index</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="create">
                <span className="tab-label">Create</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="music">
                <span className="tab-label">Music</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="game">
                <span className="tab-label">Game</span>
            </Link>                        
        </nav>
    )
}

class App extends React.Component {
    render() {
        console.log("main.js: App render " + location.hash)
        return (
            <div data-log="one">
                <div style={{position:"relative",height:"50px",width:"100%",top:"0px",zIndex:'2001'}}>{nav()}</div>                
                <div data-log="two">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default App;
