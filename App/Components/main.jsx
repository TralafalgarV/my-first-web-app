import React from 'react'
import {render} from 'react-dom'
import {Link} from 'react-router'
// import pureRender from "pure-render-decorator"  // render 性能优化模块
import { is } from 'immutable'
// import ReactPerfTool from 'react-perf-tool' // 性能检测模块
// import Perf from 'react-addons-perf'        // 性能检测模块
import '../Static/CSS/articleDetail.less'
// Import styles if they don't get loaded already
// import 'react-perf-tool/lib/styles.css'

// [优化] 对象字面量会导致 render 触发重新渲染
const navStyle = {
    position: "relative",
    height: "3rem",
    width: "100%",
    top: "0px",
    zIndex: '2001'
}

// Link组件用于取代<a>元素，生成一个链接，允许用户点击后跳转到另一个路由
// Link的to属性值，需要加‘/’，否则会触发两次route跳转
// activeClassName 属性是 Link 被点击时，显示的样式
let nav = () => {
    console.log("[App] nav display")
    return (
        <nav className="bar bar-tab">
            <div className="tab-item">
                <img id="logo" src={require("../Static/logo/1.svg")} alt="Logo" onClick={() => {
                    document.querySelector(".gitUrl").click()
                }}/>
                <a href="https://github.com/TralafalgarV/MyWebApp" target="_blank" className="gitUrl" style={{height:"0", width:"0", zIndex: "-1", position: "absolute", left:"0"}}></a>
            </div>
            <Link className="tab-item" activeClassName="active" to="/indexlist">
                <span className="tab-label">首页</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="/create">
                <span className="tab-label">撰写</span>
            </Link>
            <Link className="tab-item" activeClassName="active" to="/music">
                <span className="tab-label">音乐</span>
            </Link>
            {/* <Link className="tab-item" activeClassName="active" to="/weather">
                <span className="tab-label">天气</span>
            </Link>              */}
            <Link className="tab-item" activeClassName="active" to="/me">
                <span className="tab-label">我</span>
                {/* <div className="multi-drop-menu"><span>Me</span>
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
                </div> */}                                 
            </Link>                                
        </nav>
    )
}

//  上面代码中，App组件的this.props.children属性就是子组件
/**
App
 +--- IndexList(优先加载页面)---ArticleList
 +--- Create
 +--- Music
 +--- Me
 */
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    shouldComponentUpdate(nextProps={}, nextState={}) {
        console.log("[App] shouldComponentUpdate...")

        const thisProps = this.props || {}
        const thisState = this.state || {}

        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true
        }

        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                console.log("[App] shouldComponentUpdate: nextProps update")                
                return true 
            }
        }

        for (const key in nextState) {
            if (!is(thisState[key], nextState[key])) {
                console.log("[App] shouldComponentUpdate: nextState update")                
                return true 
            }
        }
        console.log("[App] shouldComponentUpdate: false")
        return false
    }

    render() {
        console.log("[App] render " + location.hash)
        return (
            <div data-log="one">
                <div style={navStyle}>{nav()}</div>                
                <div data-log="two">
                    {this.props.children}
                </div>
                {/* <ReactPerfTool perf={Perf} /> */}
            </div>
        )
    }
}
export default App