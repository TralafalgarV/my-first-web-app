利用下班时间自学前端完成的一个小demo。非常感谢它顺利帮我从嵌入式转型到前端。虽然从三年后视角看这个项目是那么的糟糕，但是从里面学到的基础知识，一直伴随我成长。

### 技术栈 : React + React-Router + Redux + webpack + babel + Node + express + mongodb 等

#### 前端UI:React + Redux  
#### 后端:Node + mongodb
#### 交互: fetch + ajax
#### 打包工具: webpack
#### 转译工具: babel
#### 数据流控制: redux
#### 服务器： 阿里云 + nginx

## 访问IP
1. 网站正在备案阶段，目前还无法通过域名访问（~~https://www.coderfreedom.cn~~）。目前已经不再续费了！
2. 由于生成SSL数字证书需要域名，所以现在通过https访问网站，会出现证书不受信任的情况

## 下载
```
git clone https://github.com/TralafalgarV/my-first-web-app.git
cd MyWebApp
npm install 
```

## 运行
```
npm run dev
```
## 项目目录
```
|-- build                       //打包文件
|-- App                         //主目录 
|   |--Component                //组件目录
|      |--ArticleDetail         //文章详情
|      |--Create                //发表文章
|      |--IndexList             //文章列表
|      |--Login                 //登录注册
|      |--Markdown              //Markdown组件
|      |--Me                    //个人页面
|      |--Music                 //音乐界面
|      |--Reducer               //Reducer
|      |--Store                 //Store
|      |--main.jsx              //主文件
|   |--Model                    //数据交互模型
|      |--dataModel.js			
|   |--Config                   //路由配置
|      |--route-config.js       //配置文件  两种（按需加载和非按需加载）
|   |--Server                   //Node文件跟目录	
|   |  |--db                    //数据库配置	
|   |     |--index.js
|   |  |--routes                //express路由
|   |     |--article.js         //管理文章的路由部分 
|   |     |--music.js           //管理音乐的路由部分 
|   |     |--user.js            //管理用户的路由部分
|   |  |--upload                //上传的图片
|   |  |--server.js             //node主文件
|   |  |--settings.js           //连接数据库配置文件
|   |--Static                   //静态文件目录
|      |--avatar                //头像图片
|      |--cover                 //唱片封面
|      |--create-icon           //撰写页面的功能图标
|      |--music-icon            //音乐页面的功能图标
|      |--CSS                   //css文件
|      |--logo                  //logo图标
|   |--Tools                    //工具函数模块
|      |--index.js              //时间转换、权限读取、去除遮罩、跨浏览器事件封装等
|   |--app.js                   //react主文件
|   |--index.html               //html模板
|-- .babelrc                    //babel解析配置
|-- .gitignore                  //git上传忽视配置
|-- package.json			
|-- webpack.config.js           //webpack 普通版本配置文件
|-- wepack-production.config.js //生产环境打包配置
```

## 页面展示

    由于图片大小与帧数的取舍，导致部分gif图会有些卡顿

**1. 加载页面**

![加载](https://github.com/TralafalgarV/MyWebApp/blob/master/READMEIMG/loading.gif)

**2. 撰写页面**

![撰写](https://github.com/TralafalgarV/MyWebApp/blob/master/READMEIMG/zhuanxie.gif)

**3. 音乐界面**

![Music](https://github.com/TralafalgarV/MyWebApp/blob/master/READMEIMG/Music.gif)

**4. Me + 登录界面**

![Me+Login](https://github.com/TralafalgarV/MyWebApp/blob/master/READMEIMG/melogin.gif)