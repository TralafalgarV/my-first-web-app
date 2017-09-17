# 记录
页面的粒子线条效果
* 利用 canvas 进行绘制
* 圆圈的 x、y坐标，水平和垂直方向速度，需要随机生成
* 在原点距离小于500的两圆之间进行连线
* 飞出边界的圆圈，直接删除重新绘制
* 利用requestAnimationFrame和clearRect，进行逐帧绘制

React-Router
* this.props.children 与 Link 需要配合使用
 