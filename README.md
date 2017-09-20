# 记录
2017.9.17--
页面的粒子线条效果
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
 