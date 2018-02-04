// 导入websocket组件(详见廖雪峰教程)
var WebSocketServer = require('ws').Server
// 实例化:
const wss = new WebSocketServer({
    port: 3000
})
// connection 响应 WebSocket 请求接入，并取得websocket
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`)
    // message 响应 client 发过来的消息
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`)
        // 给客户端发送消息
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`)
            } else {
                boardcast(ws)
            }
        })
    })
})
/**
url：http://tj.nineton.cn/Heart/index/future24h/
拼接参数：
    city：城市
language：语言
     key：秘钥，固定值 78928e706123c1a8f1766f062bc8676b。可不填。也可省略该参数
     例： 北京
     http://tj.nineton.cn/Heart/index/future24h/?city=CHSH000000&language=zh-chs&key=36bdd59658111bc23ff2bf9aaf6e345c
 */
const boardcast = function(ws) {
    setInterval(() => {
        ws.send("weather Data")
    }, 5000)
}