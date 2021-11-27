const http = require('http');
// 2.通过http模块创建服务对象
const server = http.createServer();
// 3.通过服务对象监听用户请求
server.on('request', (req, res)=>{
  console.log('接收到请求');
  // 1.获取请求类型
  let method = req.method.toLowerCase();
  // 2.获取请求路径
  let url = req.url;
  let path = url.split('?')[0];
  // 3.处理请求
  if(method === 'get'){
    // 3.处理路由
    // if(path === '/login'){
    // }
  }
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8;'
  });
  res.end('it666.com');
});
// 4.指定监听的端口号
server.listen(3000);