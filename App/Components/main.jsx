import React from 'react'
import {render} from 'react-dom'
import {Link} from 'react-router'
import '../static/CSS/articleDetail.css'

// Link组件用于取代<a>元素，生成一个链接，允许用户点击后跳转到另一个路由
// Link的to属性值，需要加‘/’，否则会触发两次route跳转
// activeClassName 属性是 Link 被点击时，显示的样式
let nav = () => {
    console.log("main.js: nav loading")
    return (
        <nav className="bar bar-tab">
            <Link className="tab-item" activeClassName="active" to="/indexlist">
                <span className="tab-label">Index</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="/create">
                <span className="tab-label">Create</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="/music">
                <span className="tab-label">Music</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="/game">
                <div className="multi-drop-menu"><span>Game</span>
                    <ul>
                        <li><Link to="/login">Logout</Link></li>
                        <li><a href="#">二级菜单：2</a></li>
                        <li><a href="#">二级菜单：3</a></li>
                        <li><a href="#">二级菜单：4</a>
                            <ul>
                                <li><a href="#">三级菜单：1</a></li>
                                <li><a href="#">三级菜单：2</a></li>
                                <li><a href="#">三级菜单：3</a></li>
                                <li><a href="#">三级菜单：4</a></li>
                            </ul>                            
                        </li>
                    </ul>                        
                </div>                                
            </Link>                        
        </nav>
    )
}

//  上面代码中，App组件的this.props.children属性就是子组件
/**
App
 +--- IndexList 优先加载页面
 +--- IndexList
 +--- Create
 +--- Game
 +--- ArticleDetail
 */
class App extends React.Component {
    render() {
        console.log("[App] render " + location.hash)
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
