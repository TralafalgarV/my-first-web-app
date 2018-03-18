// 文章列表组件

import React from 'react'
import { render } from 'react-dom'
import {
    Router,
    Route,
    hashHistory,
    Link,
    IndexRoute,
    Redirect,
    browserHistory
} from 'react-router'
import ArticleDetail from '../ArticleDetail'
import '../../Static/CSS/indexList.css'
import { ArticleModel, UserModel } from '../../Model/dataModel'
import { DateDiff, GetAuthority, DancelMask, EventUtil } from '../../Tools'
import AVATARPATH from '../../Static/avatar/eg_cute.gif'
import showdown from 'showdown'

let Styles = {
    pStyle:{
        margin:"0.2rem 0",
        fontSize:"0.9rem"
    },
    listBlock:{
        margin:0,
    },
    userTitle:{
        dispaly:'inline-blcok',
    }
}

/*下拉刷新*/
class Slider {
    constructor(container, offset, callback) {
        this.touchStartY = 0
        this.touchEndY = 0        
        this.stateLock = "init" 
        this.diff = 0
        this.dom = document.querySelector(container)
        this.firstChild = this.dom.firstChild
        this.offset = offset
        this.callback = callback
    }

    //消除滑块动画时间
    setTransition(time) {
        this.firstChild.style.webkitTransition = 'all '+ time + 's'
        this.firstChild.style.transition = 'all '+ time + 's'
    }

    // 下拉操作
    sliderPull() {
        if (this.firstChild.scrollTop <= 0) {
            if (this.diff > 0) {
                // e.preventDefault() 
                this.firstChild.style.height = this.diff / 2 + "px"
            }
        }
    }

    // 回到初始状态
    sliderBack(offset) {
        this.firstChild.style.height = offset + "px"
    }

}

class IndexList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            defaultTop: null
        }
        this.slider = null
        this.pattern = /<[^>]*>/g
        // 初始化markdown模块
        this.converter = new showdown.Converter()
        this.delArticle = this.delArticle.bind(this)
    }

    componentWillMount() {
        this._isMounted = true

        // 更新文章数据
        this.fetchData()
}
    componentWillUnmount() {
            this._isMounted = false
    }

    componentDidMount() {
        let _this = this
        let indexListSlider = document.querySelector(".indexList")
        indexListSlider.style.transform = "translateZ(0)"
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            // 绑定移动端下拉事件
            EventUtil.addHandler(indexListSlider, "touchstart", function(e) {
                _this.touchStart(e)
            })
            EventUtil.addHandler(indexListSlider, "touchmove", function(e) {
                _this.touchMove(e)
            })
            EventUtil.addHandler(indexListSlider, "touchend", function(e) {
                _this.touchEnd(e)
            })                                   
        } else {
            // 绑定PC端下拉事件
            indexListSlider.addEventListener("mousedown", function(e) {
            }, false)
            indexListSlider.addEventListener("mousemove", function(e) {
            }, true)        
            indexListSlider.addEventListener("mouseup", function(e) {
            }, false)               
        }
           
        // 初始化slider  
        let indexListComponent = this
        this.slider = new Slider(".indexList", 60, function() {
            let _this = this
            this.timer = setTimeout(function() {
                // 更新完数据后，将slider高度设为0
                _this.sliderBack(0)
                // 调用indexList组件的fetchData()方法更新文章数据
                indexListComponent.fetchData()
                console.log("setTimeout")           
            }, 1500)
        })     
    }

    // 从服务器获取文章列表数据, 并且去掉mask
    fetchData() {
        ArticleModel.fetchList("", (data) => {
            console.log("[IndexList] fetch from Server：", data)

            // React异步请求数据出现setState(...): Can only update a mounted or mounting component...
            // Just set a _isMounted property to true in componentDidMount and set it to false in componentWillUnmount, and use this variable to check your component's status.
            if (this._isMounted) {
                this.setState({list : data}, function() {
                    DancelMask()
                })
            }
        }, (err) => {
            console.log(err)
        })        
    }

    // 限制文章显示字数
    wordControl(word) {
        if(word.length > 30){
           word = word.substring(0, 30) + '...'
        }
        return word
    }

    // 设备类型判断
    getDevice() {
        var check = false;
        (function(a) {
            if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
            check = true
        })( navigator.userAgent||navigator.vendor||window.opera )
        return check;
    }

    // 删除操作
    delArticle(e, item) {
        let _this = this
        let options = {
            dataType: "article",  //删除文章
            atricleId:item._id,
            commentId: null
        }        
        let articleList = this.state.list
        if (articleList) {
            articleList.forEach(function(ele, index) {
                if (ele._id == item._id) {
                    let articleDel = articleList.splice(index, 1)
                    console.log("The article id", articleDel._id, "has been deleted from state arr")                    
                    _this.setState({
                        list: articleList
                    })
                }
            })
        }

        e.stopPropagation() 

        ArticleModel.delCommet(options, function(data) {
            console.log("The article id", data._id, "has been deleted")
            // 删除后刷新list
            // _this.fetchData()

        }, function(err) {
            if (err) {
                console.log("Delete: ", err)
            }
        })
    }

    // 文章列表
    indexList() {
        let _this = this        
        let list = this.state.list

        return list.map(function(item, index) {
            // 剥离html标签，显示value内容
            let html = _this.converter.makeHtml(item.content)
            let str = html.replace(_this.pattern, "")

            let date = new Date()
            // 获取当前登录用户的权限
            let authority = GetAuthority()
            // 获取当前用户登录信息
            let usrInfo = JSON.parse(UserModel.fetchLogin())
            if (!usrInfo) {
                console.log("登录信息为空")
            }            
            return (
                <li className="" key={index}>
                    <Link to={'/indexList/'+item._id} style={{display:'block'}}>                    
                        <div className="list">
                            <div className=""><h4>{item.title}</h4></div>
                            <div className="" style={{marginTop:'5px', position: "relative"}}>
                                <div style={{display:'inline-block', verticalAlign:'top', height:'1.2rem'}}>
                                    <img src={AVATARPATH} style={{marginRight:'0.3rem', height:'1rem', display:'inline-block'}}  alt="图片"/>
                                </div>
                                <div style={{display:'inline-block', verticalAlign:'top', height:'1.2rem'}}>
                                    <div style={{display:'inline-block', fontSize:'0.8rem', fontWeight:600, marginRight:'0.3rem'}}>{item.author}</div>
                                    <div style={{display:'inline-block', fontSize:'0.6rem', marginRight:"3px"}}><span className="icon icon-clock"></span>{DateDiff(item.createTime)}</div>
                                </div>
                            </div>
                            <div className=""><p style={Styles.pStyle}>{_this.wordControl(str)}</p></div>
                        </div>
                    </Link>
                    {
                        authority.delArticle == true && usrInfo.username == item.author ? 
                        <button className="delButton button"
                        style={{
                            position: "absolute",
                            marginRight: "0.5rem",
                            right: "0",
                            top: "50%",
                            display: "inline-block",
                            zIndex: "3000",
                            transform: "translateY(-50%)",
                        }}
                        onClick={(e) => {
                            _this.delArticle(e, item)
                        }}>DEL</button> : null 
                    }
                </li>
            )
        })
    }
    
    // 下拉开始记录Y值
    touchStart(e) {
        // this.slider.stateLock = "touchStart"
        this.slider.setTransition(0)

        this.slider.touchStartY = e.touches[0].pageY
        this.slider.firstChild.firstChild.innerHTML = '下拉加载更多数据'
        
        console.log("[IndexList Silder]: touchStartY=", this.slider.touchStartY)            
    }

    // 下拉移动中
    touchMove(e) {
        console.log("Move:")
        // 下拉过程中清空定时器
        if (!this.slider.timer) {
            clearInterval(this.slider.timer)
        }

        this.slider.setTransition(0)        
        this.slider.touchEndY = e.touches[0].pageY
        // 计算下拉距离
        this.slider.diff = this.slider.touchEndY - this.slider.touchStartY
        // this.slider.stateLock = "touchMove"
        // 下拉刷新
        this.slider.sliderPull()
    }

    // 下拉结束
    touchEnd() {
        console.log("End: ")
        // this.slider.stateLock = "touchEnd"
        this.slider.setTransition(1)
        
        if (this.slider.diff > this.slider.offset) {
            this.slider.firstChild.firstChild.innerHTML = '正在刷新数据'
            // 下拉触发刷新后，回到显示位置
            this.slider.sliderBack(30)
            this.slider.callback()
        } else {
            this.slider.sliderBack(0)                
        }
    }

    render() {
        console.log("[IndexList] render " + location.hash)        
        return (
            <div className="indexList">
                <div id="scroller" className="scroller">
                    <div className="loading">
                        松手加载更多内容
                    </div>
                </div>
                <ul>
                    {this.indexList()}
                </ul>                
            </div>
        )
    }
}

module.exports = IndexList