## Koa2基础

### 介绍：

`koa1.x`使用`generator`实现异步，相对于`express`的回调简单了不少，但是`generator`的本意并不是异步，而Koa2基于ES7开发，与koa1相比，koa2完全使用Promise并配合`async`来实现异步.

##### Express、Koa1.x、Koa2.x区别

- 最大的区别就是内部实现异步的方式不同

  - Express使用回调函数实现异步, 容易出现回调地狱问题, 但是语法更老兼容性更好
  - Koa1.x使用generator实现异步, 解决了回调地域问题, 但是generator的本意并不是异步
  - Koa2.x使用Promise并配合async来实现异步, 解决了回调地域问题, 但是语法太新兼容性不好
- 第二大的区别就是重量级不同

  - Express中内置了很多封装好的功能, 而Koa中将这些功能都封装到了独立的模块中
- 想要使用这些功能必须先安装对应的模块才能使用, 所以Koa比Express更轻量级

### 使用：

##### 基本使用

初始化node项目，安装koa即可。

```js
// 1.导入Koa
const Koa = require('koa');
// 2.创建服务端实例对象
const app = new Koa();
// response
app.use(ctx => {
    ctx.body = 'Hello Koa';
});
// 3.指定监听的端口
app.listen(3000);
```

##### 处理静态资源

```js
// 1.导入Koa
const Koa = require('koa');
const serve = require('koa-static'); // 导入处理静态资源的模块
// 2.创建服务端实例对象
const koa = new Koa();

koa.use(serve('public')); // 注册处理静态资源的中间件
// response
koa.use(ctx => {
    ctx.body = 'Hello Koa';
});

// 3.指定监听的端口
koa.listen(4000);
```

##### 处理动态资源

```js
// 1.导入Koa
const Koa = require('koa');
const views = require('koa-views'); // 导入处理动态资源的模块
// 2.创建服务端实例对象
const koa = new Koa();
koa.use(views('views', {extension: 'ejs'}));// views是当前app.js下对应的文件夹
// response
// koa中的ctx就是express中的req,res的结合体
koa.use( async (ctx, next) => {
    // ctx.body = 'Hello Koa';
    await ctx.render('index', {msg: 'com.it666.www'});
});
// 3.指定监听的端口
koa.listen(4000);
```

##### 处理路由：

```js
// 1.导入Koa
const Koa = require('koa');
const Router = require('koa-router'); // 导入处理路由的模块
const router = new Router(); // 创建路由对象

// 2.创建服务端实例对象
const app = new Koa();
// 处理路由
router.get('/api/user/login', (ctx, next)=>{
    ctx.body = {
        method: 'get',
        name: 'lnj',
        age: 66
    }
});
router.post('/api/goods/detail', (ctx, next)=>{
    ctx.body = 'post /api/goods/detail';
});
app
    .use(router.routes()) // 启动路由功能
    .use(router.allowedMethods()); // 自动设置响应头

// 3.指定监听的端口
app.listen(4000);
```

##### 处理get参数

- 处理传统get参数

  ```js
  // request: user?a=1&b=2
  router.get('/user', (ctx, next)=>{
      let request = ctx.request;
      console.log(request.query); // 获取转换成对象之后的get请求参数  [Object: null prototype] { a: '1', b: '2' }
      console.log(request.querystring); // 获取字符串形式的get请求参数 a=1&b=2
  })
  ```

- 处理动态路由形式get参数

  ```js
  // request: /login/2/19
  router.get('/login/:name/:age', (ctx, next)=>{
      console.log(ctx.params);// { name: '2', age: '19' }
  })
  ```
  

##### 处理post请求

- 借助koa-bodyparser中间件
- koa-bodyparser中间件会将post请求参数转换成对象之后放到请求对象的body中

```js
// 1.导入Koa
const Koa = require('koa');
const Router = require('koa-router'); // 导入处理路由的模块
const router = new Router(); // 创建路由对象
const bodyParser = require('koa-bodyparser'); // 导入处理post请求参数的模块
// 2.创建服务端实例对象
const app = new Koa();
app.use(bodyParser()); // 注册处理post请求参数的中间件
// 处理路由
router.post('/user', (ctx, next)=>{
    let request = ctx.request;
    console.log(request.body);
});
app
    .use(router.routes()) // 启动路由功能
    .use(router.allowedMethods()); // 自动设置响应头
// 3.指定监听的端口
app.listen(4000);
```

##### 处理cookie

Koa中处理cookie不需要引入其他模块, 只要拿到ctx对象就可以操作cookie

```js
router.get('/setCookie', (ctx, next)=>{
    // 注意点: 在koa中不能给cookie设置中文的值
    let value = new Buffer.from('张三').toString('base64');
    ctx.cookies.set('userName', value, {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
});
router.get('/getCookie', (ctx, next)=>{
    let value = ctx.cookies.get('userName');
    let res = new Buffer.from(value, 'base64').toString();
    console.log(res);
});
```

##### 处理错误

- 使用koa-onerror模块

https://www.npmjs.com/package/koa-onerror

```js
const onerror = require('koa-onerror'); // 导入处理错误的模块
// 2.创建服务端实例对象
const app = new Koa();
onerror(app); // 告诉koa-onerror我们需要捕获所有服务端实例对象的错误
// 处理错误
app.use((err, ctx) => {
    console.log(err.status, err.message);
    ctx.body = err.message;
});
```

