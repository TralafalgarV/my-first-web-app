import React from 'react'
import {render} from 'react-dom'
import { connect } from 'react-redux'
import {Link} from 'react-router'
// import pureRender from "pure-render-decorator"  // render 性能优化模块
import { is } from 'immutable'
// import ReactPerfTool from 'react-perf-tool' // 性能检测模块
// import Perf from 'react-addons-perf'        // 性能检测模块
import '../Static/CSS/articleDetail.less'
// import 'react-perf-tool/lib/styles.css'
// [优化] 对象字面量会导致 render 触发重新渲染
const navStyle = {
    position: "relative",
    height: "3rem",
    width: "100%",
    top: "0px",
    zIndex: '2001'
}

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

/**
App
 +--- IndexList(优先加载页面)---ArticleList
 +--- Create
 +--- Music
 +--- Me
 */
class PureApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            curMusicUrl: ""
        }
    }

    // Called to determine whether the change in props and state should trigger a re-render.
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

    // Called immediately after a compoment is mounted. Setting state here will trigger re-rendering.
    componentDidMount() {
    }

    // Called immediately after updating occurs. Not called for the initial render.
    componentDidUpdate(preProps, preState) {
        console.log("Music preProps: ", preProps.fuck.musicPlayerReducer.option)
        console.log("Music newProps: ", this.props.fuck.musicPlayerReducer.option)
        let option = this.props.fuck.musicPlayerReducer.option
        let audio = document.querySelector("#player")

        if (option === "Start") {
            audio.play()
        } else if(option === "Stop") {
            audio.pause()
        }
    }

    // 1. 即使props未变化，React依然会调用这个方法；2. 可以在函数中调用setState，不会trigger这个方法
    componentWillReceiveProps(nextProps) {
        let curMusicUrl = nextProps.fuck.musicPlayerReducer.curMusicUrl
        let option = nextProps.fuck.musicPlayerReducer.option

        // 通过判断option类型，决定是否更新 music 数据
        if (option === "forward" || option === "back" || option === "init") {
            this.setState({
                curMusicUrl: curMusicUrl
            }, function() {
                let audio = document.querySelector("#player")
                audio.load()  // 这个很重要                
                console.log("Reload music", audio)
            })   
        } 
    }

    render() {
        console.log("[App] render " + location.hash)
        return (
            <div data-log="one">
                <div style={navStyle}>{nav()}</div>
                <audio id="player">
                    <source id="playerSource" src={`${this.state.curMusicUrl}`} type="audio/mpeg" />
                </audio>
                <div data-log="two">
                    {this.props.children}
                </div>
                {/* <ReactPerfTool perf={Perf} /> */}
            </div>
        )
    }
}

// mapStateToProps：简单来说，就是把 store 的 state 绑定到组件的 props 当中。
// 定义的state对象有哪些属性，在我们组件的 props 都可以查阅和获取
function mapStateToProps(state) {
    return {
        fuck: state,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        initAudio: (audio) => {
            dispatch({
                type: "initAudio",
                audio: audio
            })
        }
    }
}

const App = connect(mapStateToProps)(PureApp)

export default App