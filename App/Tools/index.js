import { UserModel } from '../Model/dataModel'

let dateDiff = function (hisTime) {
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
const getAuthority = function() {
    let userinfo = UserModel.fetchLogin()
    let authority = {createArticle: true, delArticle: false, delComment: false}
    if (userinfo == null) {
        console.log("UserInfo is null")
    } else {
        console.log("UserInfo: ", JSON.parse(userinfo).authority)
        authority = JSON.parse(userinfo).authority
    }
    return authority        
}

// 获取音乐专辑封面
const getMusicAlbumUrl = function(albumId) {
    if (!albumId) {
        console.log("albumId error", albumId)
    }
    return `http://imgcache.qq.com/music/photo/album_300/${albumId%100}/300_albumpic_${albumId}_0.jpg` 
}

// const Tools = {
//     dateDiff: dateDiff,
//     ClassOperation: ClassOperation,
//     getAuthority: getAuthority,
// }
export {dateDiff, ClassOperation, getAuthority, getMusicAlbumUrl}