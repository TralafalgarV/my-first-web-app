import React, { Component } from 'react'
import showdown from 'showdown'

let converter = new showdown.Converter()

const Markdown = ({content}) => {
    // 初始化showdown实例
    
    console.log("[Markdown] ", converter)
    // 更新 article 内容
    var html = converter.makeHtml(content)
    console.log(html)
    // document.getElementById("wmd-preview").innerHTML = html


    // React默认会进行HTML的转义，避免XSS攻击，如果要不转义，可以这么写
    return(
        <div className="fmt" id="wmd-preview">
            <div dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
}

module.exports = Markdown