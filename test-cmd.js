// 数据库调试命令：
// 1. 评论添加
db.articles.update({'title': '暴走大事件'}, {$set:{'comments': [{
    author: "wangwei",
    content: "什么鬼",
    createTime: "911105"
}]}}, {multi:true})