const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

// 创建 WebSocket 服务器 监听在 3000 端口
const wss = new WebSocketServer({port: 3004});
let wsList = []

//如果有WebSocket请求接入，wss对象可以响应connection事件来处理这个WebSocket：
wss.on('connection', (ws, request, client) => { // 在connection事件中，回调函数会传入一个WebSocket的实例，表示这个WebSocket连接
  // 接收客户端信息并把信息返回发送
  ws.on('message', (message) => {
    const result = JSON.parse(message.toString());
    console.log(result);
    if(result.message === 'start') {
      wsList.push({
        name: result.name,
        ws: ws
      })
    }else{
      const ws = wsList.find(item => item.name === result.toName)?.ws;
      // send 方法的第二个参数是一个错误回调函数
      ws?.send(JSON.stringify({message: result.message, toName: result.toName, fromName: result.fromName}), (err) => { 
        if (err) {
          console.log(`[SERVER] error: ${err}`);
        }
      })
    }
  });

  ws.on('close', () => {
    let newWsList = []
    for(let i=0; i<wsList.length;i++) {
      if(wsList[i].ws.readyState === 1) {
        newWsList.push(wsList[i])
      }
    }
    wsList = newWsList
  })
})
