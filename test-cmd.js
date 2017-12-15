import { port } from "_debugger";
import { ObjectId } from "../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bson";

// 数据库调试命令：
// 1. 评论添加
db.articles.update({'title': '暴走大事件'}, {$set:{'comments': [{
    author: "wangwei",
    content: "什么鬼",
    createTime: "911105"
}]}}, {multi:true})

// 2. 修改musics数据库内容
db.musics.insert({"artistName" : "陈一发", "albumTitle" : "童话镇", "songTitle" : "童话镇", "musicUrl" : "http://ws.stream.qqmusic.qq.com/108756031.m4a?fromtag=46", "albumId": 1632238})
db.musics.insert({"artistName" : "双笙", "albumTitle" : "我的一个道姑朋友", "songTitle" : "我的一个道姑朋友", "musicUrl" : "http://ws.stream.qqmusic.qq.com/200138786.m4a?fromtag=46", "albumId": 2118582})
db.musics.insert({"artistName" : "鹿先森乐队", "albumTitle" : "所有的酒，都不如你", "songTitle" : "春风十里", "musicUrl" : "http://ws.stream.qqmusic.qq.com/105393664.m4a?fromtag=46", "albumId": 1258581})
db.musics.insert({"artistName" : "陈鸿宇", "albumTitle" : "浓烟下的诗歌电台", "songTitle" : "理想三旬", "musicUrl" : "http://ws.stream.qqmusic.qq.com/102696799.m4a?fromtag=46", "albumId": 1022956})

// 3. 修改articles数据库内容
db.articles.insert({"title" : "女流66", "content" : "石悦，清华本科，北大硕士。游戏视频作者，斗鱼人气主播", "author" : "11", "createTime" : "Mon, 09 Oct 2017 13:54:49 GMT", "comments" : [ { "_id" : ObjectId("59db7fbd34172e552bbc23b0"), "createTime" : "2017-10-09T13:55:09.316Z", "content" : "女神", "author" : "11" }, { "_id" : ObjectId("59db7fdd34172e552bbc23b1"), "createTime" : "2017-10-09T13:55:41.113Z", "content" : "啦啦啦啦啦", "author" : "akg" }, { "_id" : ObjectId("59db800034172e552bbc23b2"), "createTime" : "2017-10-09T13:56:16.887Z", "content" : "科目二5次", "author" : "11" } ], "__v" : 0 })
db.articles.insert({"title" : "SEO", "content" : "SEO是由英文Search Engine Optimization缩写而来， 中文意译为“搜索引擎优化”。SEO是指通过对网站进行站内优化和修复(网站Web结构调整、网站内容建设、网站代码优化和编码等)和站外优化，从而提高网站的网站关键词排名以及公司产品的曝光度。通过搜索引擎查找信息是当今网民们寻找网上信息和资源的主要手段。而SEM，搜索引擎营销，就是根据用户使用搜索引擎的方式，利用用户检索信息的机会尽可能将营销信息传递给目标用户。在目前企业网站营销中，SOM（SEO+SEM）模式越来越显重要。", "author" : "11", "createTime" : "Mon, 09 Oct 2017 13:54:49 GMT", "comments" : [], "__v" : 0 })

//3. QQ 音乐查询 song_id API
http://soso.music.qq.com/fcgi-bin/fcg_search_xmldata.fcg?source=0&w=The%20Phoenix&type=qry_song&out=json&p=1&perpage=2&ie=utf-8
&w=[参数] //修改此参数来查询歌曲信息 
&perpage=[参数] //显示的信息个数

// 删除评论
db.articles.deleteOne( { "_id": ObjectId("5a24baaef9589506a57c24e3") } )
/************linux 常用命令 ************/
1. 创建dir 
mkdir [dir]

2. 创建文件
vi [文件名]

3. 查看所有进程
ps -ef/-al

4. 重命名
mv old new

5. 移动文件
mv srcPath desPath

/*********** mongodb 在子进程中运行配置 ********/
1. 将程序在子进程中执行
processName -fork

2. 设置程序的port号
processName -port

3. 设置程序的数据库位置
processName -dbpath

4. 设置程序的log输出位置
processName -logpath [path]/[*].log -logappend  # 使用追加的方式写日志

/***************** git命令 ***************/
// 修改文件名
git mv old new  
// 4 git commit 删除
git reset --hard HEAD  (回到当前版本)
git reset --hard HEAD^ (回到上一个版本)
git reset --hard 7c7e1c86 (回到特定版本前8位hash码)

/******************nginx 命令*******************/
配置后重启：
sudo nginx -t
sudo service nginx reload

/******************** npm常用命令 *********************/
sudo npm update -g npm  # 更新 npm

/******************* pm2 *****************/
1. 启动任务
pm2 start [procName]

2. 停止任务
pm2 start [procName]

3. 查看pm启动任务的log
pm2 logs [procName] [--lines numbers]

/******************* 2017 流行色 潘通******************/
#91B54D   // 草木绿
#C46215   // Autumn Maple
#4F84C4   // Marina
#C68F65   // Butterum
#8E918F   // Neutral Gray


