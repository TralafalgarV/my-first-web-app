import React, { Component } from 'react'
import { UserModel } from '../../Model/dataModel'
// import md5 from 'md5'

let Styles = {
    header:{
        lineHeight: "2.2rem",
        position: "relative"
    },
    floatLeft:{
        float: "left"
    },
    floatRight:{
        float: "right"
    }
}

// 登录组件
class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loginFlag: true,
            username: '',
            email: '',
            password: '',
            rpassword: '',
        }
    }

    changeLoginFlag(e){
        e.stopPropagation();
        this.setState({
            loginFlag: true
        })
    }
    changeRegisterFlag(e){
        e.stopPropagation();
        this.setState({
            loginFlag: false
        })
    }    

    userRegister(){
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
        if(!(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email))){
            alert('邮箱格式不正确')
            return
        }
        if(input.password!=input.rpassword){
            alert('两次密码不一致')
            return
        }
        if(input.password.length<6){
            alert('密码不得少于6位数')
            return
        }
        if(reg.test(input.username)){
            alert('用户名不能为空')
            return
        }

        let userInfo = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }

        // console.log(userInfo);
        UserModel.register(userInfo, (data) => {
            if(data.id == '1'){
                alert("注册成功")
                UserModel.storeLogin(data.content)
                location.hash = "/indexList";
            }else if(data.id == '2') {
                alert(data.content)
            }else if(data.id == '3') {
                alert(data.content)
            }
        }, (err) => {
            console.log(err)
        })
    }

    handleChangeVal(e, key){
        let val = e.target.value
        switch(key) {
            case 'username':
                this.setState({username: val})
                break;
            case 'email':
                this.setState({email: val})
                break;
            case 'password':
                this.setState({password: val})
                break;
            case 'rpassword':
                this.setState({rpassword: val})
                break;
        }
    }

    userLogin() {
        let username = this.username.value
        let password = this.password.value
        let userInfo = {
            username: username,
            password: password
        }
        console.log("userInfo", userInfo);
        UserModel.login(userInfo, (data) => {
            console.log("[Login] userLogin return data: ", data)
            UserModel.storeLogin(data.content)
            // 判断是否登录成功
            if(data.id == '1'){
                console.log("登录成功")
                UserModel.storeLogin(data.content)
                location.hash = "/create"
            } else if(data.id == '0') {
                alert("登录失败")
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
        let loginTemplate = this.state.loginFlag ? (
            <div className="content" style={{position: "relative"}}>
                <div className="list-block">
                    <ul>
                        <li>
                            <div className="item-content">
                                <div className="item-media"><i className="icon icon-form-name"></i></div>
                                <div className="item-inner">
                                    <div className="item-title label">用户名</div>
                                    <div className="item-input">
                                        <input type="text" ref={(e) => {this.username = e}} placeholder="Your name" />
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="item-content">
                                <div className="item-media"><i className="icon icon-form-password"></i></div>
                                <div className="item-inner">
                                    <div className="item-title label">密码</div>
                                    <div className="item-input">
                                        <input type="password" ref={(e) => {this.password = e}} placeholder="Password" className="" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                </div>
                <div className="content-block">
                    <div className="row">
                        <div className="col-100"><a onClick={()=>{this.userLogin()}} className="button button-big button-fill button-success">登录</a></div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="content" style={{position: "relative"}}>
                <form action="" onClick={(e)=>{e.stopPropagation()}}>
                <div className="list-block">
                        <ul>
                            <li>
                                <div className="item-content">
                                    <div className="item-media"><i className="icon icon-form-name"></i></div>
                                    <div className="item-inner">
                                        <div className="item-title label">用户名</div>
                                        <div className="item-input">
                                            <input type="text" name="username" value={this.state.username} onChange={(e)=>{this.handleChangeVal(e,'username')}} ref="username" placeholder="Your name" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="item-content">
                                    <div className="item-media"><i className="icon icon-form-email"></i></div>
                                    <div className="item-inner">
                                        <div className="item-title label">邮箱</div>
                                        <div className="item-input">
                                            <input type="email" name="email" ref="email" value={this.state.email} onChange={(e)=>{this.handleChangeVal(e,'email')}} placeholder="E-mail" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="item-content">
                                    <div className="item-media"><i className="icon icon-form-password"></i></div>
                                    <div className="item-inner">
                                        <div className="item-title label">密码</div>
                                        <div className="item-input">
                                            <input type="password" ref="password" name="password" placeholder="Password" value={this.state.password} onChange={(e)=>{this.handleChangeVal(e,'password')}} className="" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="item-content">
                                    <div className="item-media"><i className="icon icon-form-password"></i></div>
                                    <div className="item-inner">
                                        <div className="item-title label">确认密码</div>
                                        <div className="item-input">
                                            <input type="password" ref="rpassword" name="rpassword" placeholder="Password" value={this.state.rpassword} onChange={(e)=>{this.handleChangeVal(e,'rpassword')}} className="" />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                </div>
                <div className="content-block">
                    <div className="row">
                        <div className="col-50"><a onClick={()=>{this.formReset()}} className="button button-big button-fill button-danger">重置</a></div>
                        <div className="col-50"><a onClick={()=>{this.userRegister()}} className="button button-big button-fill button-success" type="submit">注册</a></div>
                    </div>
                </div>
                </form>

            </div>
        )
        return (
            <main>
                <header className="bar bar-nav row" style={Styles.header} >
                        {/*事件用箭头函数和用bind  写法不同,结果不同*/}
                        <a className="col-50" id="login" ref="login" onClick={(e)=>this.changeLoginFlag(e)}>
                            <span className="tab-label">登录</span>
                        </a>

                        <a className="col-50" id="register" ref="register" onClick={(e)=>this.changeRegisterFlag(e)}>
                            <span className="tab-label"  style={Styles.floatRight}>注册</span>
                        </a>
                </header>
                {loginTemplate}
            </main>
        )
    }
}

module.exports = Login