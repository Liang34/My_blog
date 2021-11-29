## expressd的简单实现

express的本质就是对原生NodeJS的http模块进行封装

express的匹配路由次序是按照书写的顺序从上至下的匹配，哪个匹配就执行哪个后面的回调函数，要是没匹配到对应的路由则会返回`Cannot 请求方法 请求地址`

实现目录结构参考当前文件下的`express基本实现原理`

#### 01-实现基本功能

```js
// express的基本实现原理/01-实现基本功能/jh-express/lib/express.js
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
```

