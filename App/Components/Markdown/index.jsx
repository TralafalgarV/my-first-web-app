import React, { Component } from 'react'
import showdown from 'showdown'

class Markdown extends React.Component{
    constructor(props){
        super(props)

        // 初始化showdown实例
        this.converter = new showdown.Converter()
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps: ", nextProps)
        // 更新 article 内容
        var html = this.converter.makeHtml(nextProps.content)
        document.getElementById("wmd-preview").innerHTML = html        
    }

    render(){
        return(
            <div className="fmt" id="wmd-preview"></div>
        )
    }
}

module.exports = Markdown