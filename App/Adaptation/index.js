import Promise from 'pinkie-promise'  // 部分浏览器不支持 Promise，特引入此模块替代Promise功能
// 判断当前系统是否支持 Promise
if (window.Promise == undefined) {
    console.log("The borwser doesn`t support Promise, Add pinkie-promise")
    window.Promise = Promise
}  else {
    console.log("The borwser supports Promise")
}