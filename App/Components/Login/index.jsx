import React, { Component } from 'react'
import { UserModel } from '../../Model/dataModel'
import { GetAuthority, DancelMask } from '../../Tools'
import '../../Static/CSS/login'
// 登录组件
class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            email: '',
            password: '',
            rpassword: '',
        }

        this.tabContentHandler = this.tabContentHandler.bind(this)
        this.tabGroupHandler = this.tabGroupHandler.bind(this)
        this.userLogin = this.userLogin.bind(this)
        this.userRegister = this.userRegister.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }

    componentDidMount() {
        console.log('[Login] componentDidMount: clear localStorage')
        // 一旦login组件被渲染，则删除本地登录信息
        localStorage.clear()

        // 取消加载mask
        DancelMask()
    }

    // tab-content 元素事件处理
    tabContentHandler(e) {
        let ele = e || window.event
        let target = ele.target || ele.srcElement
        // 获取同一父元素下，位于前面的子元素
        let bortherLabel = target.offsetParent.childNodes[0]

        if (target.nodeName.toLowerCase() == "input") {
            // 此处应为
            if (ele.type === "keyup") {
                console.log()
                if (target.value == "") {
                    bortherLabel.classList.remove("active")
                } else {
                    bortherLabel.classList.add("active")
                }
            } else if (ele.type === "blur") {
                console.log("blur")
                if (target.value == "") {
                    bortherLabel.classList.remove("active")                    
                } else {
                    
                }
            } else if (ele.type === "focus") {
                console.log("focus")                
                if (target.value == "") {
                    bortherLabel.classList.remove("highlight")                    
                } else {
                    bortherLabel.classList.add("highlight")                    
                }
            }
        }
    }

    // tab-group 元素事件处理
    tabGroupHandler(e) {
        let ele = e || window.event
        let target = ele.target || ele.srcElement
        let signupContent = this.tabContentDom.children[0]
        let loginContent = this.tabContentDom.children[1]
        let signupGroupDom = this.tabGroupDom.children[0]
        let loginGroupDom = this.tabGroupDom.children[1]
        
        function setOpacity(ele, opacity) {  
            if (ele.style.opacity != undefined) {  
                ///兼容FF和GG和新版本IE  
                ele.style.opacity = opacity / 100;  
          
            } else {  
                ///兼容老版本ie  
                ele.style.filter = "alpha(opacity=" + opacity + ")";  
            }  
        }  

        function fadein(ele, opacity, speed) {  
            if (ele) {  
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;  
                v < 1 && (v = v * 100);  
                var count = speed / 1000;  
                var avg = count < 2 ? (opacity / count) : (opacity / count - 1);  
                var timer = null;  
                timer = setInterval(function() {  
                    if (v < opacity) {  
                        v += avg;  
                        setOpacity(ele, v);  
                    } else {  
                        clearInterval(timer);  
                    }  
                }, 500);  
            }  
        } 

        e.preventDefault()

        if (target.classList.contains("login")) {            
            loginGroupDom.classList.add("active")
            signupGroupDom.classList.remove("active")
            // login
            console.log(loginContent)
            signupContent.style.display = "none"
            loginContent.style.display = "block"
            // fadein(loginContent, 100, 1000)
        } else if (target.classList.contains("signup")) {
            signupGroupDom.classList.add("active")
            loginGroupDom.classList.remove("active")
            // signup
            console.log(signupContent)
            loginContent.style.display = "none"
            signupContent.style.display = "block"
            // fadein(signupContent, 100, 1000)            
        } else {
            console.log("ERROR")
        }

    }

    userRegister() {
        let reg = /^\s+$/;
        let input = this.state;
        switch ('') {
            case input.username:
                alert('用户名不能为空')
                return
            case input.email:
                alert('邮箱不能为空')
                return
            case input.password:
                alert('密码不能为空')
                return
            case input.rpassword:
                alert('两次密码不一致')
                return
        }
        if (!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email))) {
            alert('邮箱格式不正确')
            return
        }
        if (input.password != input.rpassword) {
            alert('两次密码不一致')
            return
        }
        if (input.password.length < 6) {
            alert('密码不得少于6位数')
            return
        }
        if (reg.test(input.username)) {
            alert('用户名不能为空')
            return
        }

        let userInfo = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        }

        // console.log(userInfo);
        UserModel.register(userInfo, (data) => {
            if (data.registerState == true) {
                console.log("注册成功")
                UserModel.storeLogin(JSON.stringify({
                    content: data.content,
                    username: data.username,
                    authority: data.authority
                }))
                location.hash = "/indexList";
            } else if (data.registerState == false) {
                console.log("注册失败", data)
                alert(data.content)
            } else {
                alert(data.content)
            }
        }, (err) => {
            console.log("register fail: ", err)
        })
    }

    changeHandler(e, key) {
        let val = e.target.value
        switch(key) {
            case 'username':
                this.setState({username: val})
                break
            case 'email':
                this.setState({email: val})
                break
            case 'password':
                this.setState({password: val})
                break
            case 'rpassword':
                this.setState({rpassword: val})
                break
        }
    }

    userLogin() {
        let username = this.state.username
        let password = this.state.password
        let userInfo = {
            username,
            password
        }
        UserModel.login(userInfo, (data) => {
            console.log("[Login] userLogin return data: ", data)
            // 判断是否登录成功
            if (data.resState == 'success') {
                console.log(data.content)
                // 记录server返回数据，username用于create页面
                UserModel.storeLogin(JSON.stringify({
                    content: data.content,
                    username: data.username,
                    authority: data.authority
                }))
                location.hash = "/create"
            } else if (data.resState == 'error') {
                alert(data.content)
                location.hash = "/login"
            }
            // location.hash = '/create'
            // this.context.router.push('/me');
        }, (error) => {
            alert('登录失败');
        })
    }

    formReset() {
        this.setState({
            username:'',
            email:'',
            password:'',
            rpassword:''
        })
    }

    render() {
        console.log("[Login] render " + location.hash)
        return (
            <div className="form">
                <ul className="tab-group" ref={(ele) => {this.tabGroupDom = ele}} onClick={(e) => {this.tabGroupHandler(e)}}>
                    <li className="tab active"><a className="signup" href="#signup">Sign Up</a></li>
                    <li className="tab"><a className="login" href="#login">Log In</a></li>
                </ul>

                <div className="tab-content" ref={(ele) => {this.tabContentDom = ele}} onKeyUp={(e) => this.tabContentHandler(e)}>
                    <div className="signup">
                        <h1>注册</h1>

                        <form action="" onClick={(e)=>{e.preventDefault()} /* 取消表单默认submit */}>

                            <div className="top-row">
                                <div className="field-wrap">
                                    <label htmlFor="">
                                        用户名<span className="req">*</span>
                                    </label>
                                    <input type="text" name="1" id="1" onChange={(e) => {this.changeHandler(e, "username")}} autoComplete="off" required/>
                                </div>
                            </div>

                            <div className="field-wrap">
                                <label htmlFor="">
                                    邮箱<span className="req">*</span>
                                </label>
                                <input type="email" name="2" id="2" onChange={(e) => {this.changeHandler(e, "email")}} autoComplete="off" required/>
                            </div>

                            <div className="field-wrap">
                                <label htmlFor="">
                                    密码<span className="req">*</span>
                                </label>
                                <input type="password" name="3" id="3" onChange={(e) => {this.changeHandler(e, "password")}} autoComplete="off" required/>
                            </div>

                            <div className="field-wrap">
                                <label htmlFor="">
                                    确认密码<span className="req">*</span>
                                </label>
                                <input type="password" name="6" id="6" onChange={(e) => {this.changeHandler(e, "rpassword")}} autoComplete="off" required/>
                            </div>                                                       

                            <button type="submit" className="button button-block" onClick={()=>{this.userRegister()}}>Get Started</button>
                        </form>
                        
                    </div> {/* <div id="signup"> */}

                    <div className="login">
                        <h1>欢迎回来</h1>

                        <form action="" onClick={(e)=>{e.preventDefault()}/* 取消表单默认submit */}>

                            <div className="field-wrap">
                                <label htmlFor="">
                                    用户名<span className="req">*</span>
                                </label>
                                <input type="text" name="4" id="4" onChange={(e) => {this.changeHandler(e, "username")}} autoComplete="off" required/>
                            </div>

                            <div className="field-wrap">
                                <label htmlFor="">
                                    密码<span className="req">*</span>
                                </label>
                                <input type="password" name="5" id="5" onChange={(e) => {this.changeHandler(e, "password")}} autoComplete="off" required/>
                            </div>

                            <p className="forgot"><a href="#">忘记密码?</a></p>

                            <button className="button button-block" onClick={()=>{this.userLogin()}}>Log In</button>

                        </form>
                    </div>{/* <div className="login"> */}
                </div>{/* <div className="tab-content"> */}
            </div>
        )
    }
}

module.exports = Login