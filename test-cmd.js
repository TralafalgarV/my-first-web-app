// 数据库调试命令：
// 1. 评论添加
db.articles.update({'title': '暴走大事件'}, {$set:{'comments': [{
    author: "wangwei",
    content: "什么鬼",
    createTime: "911105"
}]}}, {multi:true})

// 2. 修改文章数据库内容
{"title" : "暴走大事件", "content" : "王尼玛", "author" : "11", "createTime" : "Mon, 09 Oct 2017 13:54:49 GMT", "comments" : [ { "_id" : ObjectId("59db7fbd34172e552bbc23b0"), "createTime" : "2017-10-09T13:55:09.316Z", "content" : "大头死变态", "author" : "11" }, { "_id" : ObjectId("59db7fdd34172e552bbc23b1"), "createTime" : "2017-10-09T13:55:41.113Z", "content" : "啦啦啦啦啦", "author" : "11" }, { "_id" : ObjectId("59db800034172e552bbc23b2"), "createTime" : "2017-10-09T13:56:16.887Z", "content" : "死肥宅", "author" : "11" } ], "__v" : 0 }

db.musics.insert({"artistName" : "陈一发", "albumTitle" : "不知道", "songTitle" : "童话镇", "musicUrl" : "http://ws.stream.qqmusic.qq.com/108756031.m4a?fromtag=46"})
db.musics.insert({"artistName" : "菠萝赛东", "albumTitle" : "不知道", "songTitle" : "我的一个道姑朋友", "musicUrl" : "http://ws.stream.qqmusic.qq.com/200138786.m4a?fromtag=46"})
