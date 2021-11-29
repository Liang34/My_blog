const http = require('http')

module.exports = function createApplication() {
  // 匹配不到路由的回调
  const _handler = (req, res) => {
    res.end(`Cannot ${req.method} ${req.url}`)
  };
  const router = [{path:'*', method: '*', handler: _handler}];
  return {
    // 每次调用path为传递路径, handler为回调函数
    get (path, handler) {
      router.push({path: path, method: 'get', handler: handler})
    },
    listen() {
      const server = http.createServer()
      server.on('request', (req, res) => {
        // 从前往后遍历查找匹配的路由
        router.forEach(item => {
          const requestPath = req.url;
          const requestMethods = req.method.toLocaleLowerCase();
          if(item.path === requestPath && item.method === requestMethods) {
            item.handler(req, res)
          }
        })
        router[0].handler(req, res)
      })
      server.listen(...arguments)
    }
  }
}