# 记录
2017.9.17 -- 页面的粒子线条效果
* 利用 canvas 进行绘制
* 圆圈的 x、y坐标，水平和垂直方向速度，需要随机生成
* 在原点距离小于500的两圆之间进行连线
* 飞出边界的圆圈，直接删除重新绘制
* 利用requestAnimationFrame和clearRect，进行逐帧绘制

React-Router
* 使用 Link 路由Component之后，需要在render函数中加载 this.props.children 

2017.9.19--node server
* 使用node.js完成基本服务器中间件的搭建，client到server的链路已调通
* 【待】session登录检测中间件待完成
* 【待】数据暂时通过，server读写文件进行存储，后面引入MongoDB

2017.9.20--Create页面
* input的value值，如果设置成与state挂钩，那么直接在页面元素中是无法输入的；因为指定了value是受控组件，需要配合onChange事件，来重新渲染组件
* create页面通过publish上传数据给server，目前client发送数据没有问题，但是server收数据出现问题。req.body为空 => 原因：fetch的headers属性拼写错误，导致server收到的数据出现异常

2017.9.24--引入MongoDB
* server端的数据不再存储在file里面，现在引入MongoDB，用来管理数据

2017.10.11--Music页面
* 开写Music组件
* react批量引入图片方法
* 专辑封面轮转效果
* React修改dom的css方式
* react 动画 ReactCSSTransitionGroup

2017.10.16--Music页面
* 完成专辑展示轮播图
* 制作播放器页面
* 播放器动画效果添加
* 学习transform、translate、filter、animation、translation等属性

2017.10.20--indexList slider
* 技术难点：1. 判断设备类型 2. 绑定touchStart、touchMove、touchEnd事件 3. 在绑定事件处理函数中，处理下拉距离对slider的影响
* 将slider进行封装，使用了ES6的class语法