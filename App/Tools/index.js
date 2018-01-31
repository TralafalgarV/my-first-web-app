import { UserModel } from '../Model/dataModel'

// 计算时间差
let DateDiff = function (hisTime) {
    var now = new Date().getTime(),
        diffValue = now - hisTime,
        result = '',
        minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24,
        halfamonth = day * 15,
        month = day * 30,
        year = month * 12,
        _year = diffValue / year,
        _month = diffValue / month,
        _week = diffValue / (7 * day),
        _day = diffValue / day,
        _hour = diffValue / hour,
        _min = diffValue / minute;
    if (_year >= 1) 
        result = parseInt(_year) + "年前";
    else if (_month >= 1) 
        result = parseInt(_month) + "个月前";
    else if (_week >= 1) 
        result = parseInt(_week) + "周前";
    else if (_day >= 1) 
        result = parseInt(_day) + "天前";
    else if (_hour >= 1) 
        result = parseInt(_hour) + "个小时前";
    else if (_min >= 1) 
        result = parseInt(_min) + "分钟前";
    else 
        result = "刚刚";
    return result;
}

// classList 操作函数
const ClassOperation = {
    AddClass: (ele, newClass) => {
        document
            .querySelector(ele)
            .classList
            .add(newClass)
    },
    RemoveClass: (ele, newClass) => {
        document
            .querySelector(ele)
            .classList
            .remove(newClass)
    },
    ToggleClass: (ele, newClass) => {
        document
            .querySelector(ele)
            .classList
            .toggle(newClass)
    },
    ContainClass: (ele, newClass) => {
        return document
            .querySelector(ele)
            .classList
            .contain(newClass)
    }
}

// 获取当前用户的权限
const GetAuthority = function() {
    let userinfo = UserModel.fetchLogin()
    let authority = (userinfo) ? JSON.parse(userinfo).authority : {createArticle: false, delArticle: false, delComment: false}

    if (!userinfo) {
        console.log("UserInfo is null, return defined")
    } else {
        console.log("UserInfo: ", authority)
    }
    return authority        
}

// 获取音乐专辑封面
const GetMusicAlbumUrl = function(albumId) {
    if (!albumId) {
        console.log("albumId error", albumId)
    }
    return `http://imgcache.qq.com/music/photo/album_300/${albumId%100}/300_albumpic_${albumId}_0.jpg` 
}

// const Tools = {
//     DateDiff: dateDiff,
//     ClassOperation: ClassOperation,
//     GetAuthority: GetAuthority,
// }

// 取消mask效果
const DancelMask = function() {
    let mask = document.querySelector(".loader")
    mask.style.transition = "0.5s"
    mask.style.opacity = "0"
    mask.style.display = "none"   
    document.querySelector(".spans").classList.add("hidden")
    document.querySelector(".loader").classList.add("hidden") 
}

// 跨浏览器事件处理
const EventUtil = {
    addHandler: function(element, event, handler) {
        if (element.addEventListener) {  // DOM2 级事件
            element.addEventListener(event, handler, false)
        } else if (element.attachEvent) { // IE8以下
            element.attachEvent("on" + event, handler)
        } else {  // DOM0 级事件
            element["on" + event] = handler
        }
    },

    removeHandler: function(element, event, handler) {
        if (element.addEventListener) {
            element.removeEventListener(event, handler, false)
        } else if (element.attachEvent) {
            element.detachEvent("on" + event, handler)
        } else {
            element["on" + event] = null
        }        
    }
}

// cookie 处理
function setCookie(key, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = key + '=' + value + ';expires=' + oDate;

}
function removeCookie(key) {
    setCookie(key, '', -1);//这里只需要把Cookie保质期退回一天便可以删除
}
function getCookie(key) {
    var cookieArr = document.cookie.split('; ');
    for(var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split('=');
        if(arr[0] === key) {
            return arr[1];
        }
    }
    return false;
}

const CookieFunc = {
    setCookie,
    removeCookie,
    getCookie
}

export {DateDiff, ClassOperation, GetAuthority, GetMusicAlbumUrl, DancelMask, EventUtil, CookieFunc}