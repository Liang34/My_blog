## vite 是什么

vite —— 一个由 vue 作者尤雨溪开发的 web 开发工具，它具有以下特点：

1. 快速的冷启动
2. 即时的模块热更新
3. 真正的按需编译

从作者在微博上的发言：

> Vite，一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。

中可以看出 vite 主要特点是基于浏览器 native 的 ES module ([developer.mozilla.org/en-US/docs/…](https://link.juejin.cn?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%253A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FStatements%2Fimport "https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import")) 来开发，省略打包这个步骤，因为需要什么资源直接在浏览器里引入即可。

基于浏览器 ES module 来开发 web 应用也不是什么新鲜事，snowpack 也基于此，不过目前此项目社区中并没有流行起来，vite 的出现也许会让这种开发方式再火一阵子。


## vite 启动链路

**命令解析**

这部分代码在 src/node/cli.ts 里，主要内容是借助 minimist —— 一个轻量级的命令解析工具解析 npm scripts，解析的函数是 `resolveOptions` ，精简后的代码片段如下。

```js
function resolveOptions() {
    // command 可以是 dev/build/optimize
    if (argv._[0]) {
        argv.command = argv._[0];
    }
    return argv;
}

```

拿到 options 后，会根据 `options.command` 的值判断是执行在开发环境需要的 runServe 命令或生产环境需要的 runBuild 命令。

```js
if (!options.command || options.command === 'serve') {
    runServe(options)
 } else if (options.command === 'build') {
    runBuild(options)
 } else if (options.command === 'optimize') {
    runOptimize(options)
 }

```

在 `runServe` 方法中，执行 server 模块的创建开发服务器方法，同样在 `runBuild` 中执行 build 模块的构建方法。

最新的版本中还增加了 optimize 命令的支持，关于 optimize 做了什么，我们下文再说。

### **server**

这部分代码在 src/node/server/index.ts 里，主要暴露一个 `createServer` 方法。

vite 使用 koa 作 web server，使用 clmloader 创建了一个监听文件改动的 watcher，同时实现了一个插件机制，将 koa-app 和 watcher 以及其他必要工具组合成一个 context 对象注入到每个 plugin 中。

plugin 依次从 context 里获取上面这些组成部分，有的 plugin 在 koa 实例添加了几个 middleware，有的借助 watcher 实现对文件的改动监听，这种插件机制带来的好处是整个应用结构清晰，同时每个插件处理不同的事情，职责更分明，

### **plugin**

上文我们说到 plugin，那么有哪些 plugin 呢？它们分别是：

* 用户注入的 plugins —— 自定义 plugin
* hmrPlugin —— 处理 hmr
* htmlRewritePlugin —— 重写 html 内的 script 内容
* moduleRewritePlugin —— 重写模块中的 import 导入
* moduleResolvePlugin ——获取模块内容
* vuePlugin —— 处理 vue 单文件组件
* esbuildPlugin —— 使用 esbuild 处理资源
* assetPathPlugin —— 处理静态资源
* serveStaticPlugin —— 托管静态资源
* cssPlugin —— 处理 css/less/sass 等引用
* ...

我们来看 plugin 的实现方式，开发一个用来拦截 json 文件 plugin 可以这么实现：

```typescript
interface ServerPluginContext {
  root: string
  app: Koa
  server: Server
  watcher: HMRWatcher
  resolver: InternalResolver
  config: ServerConfig
}

type ServerPlugin = （ctx:ServerPluginContext）=> void;

const JsonInterceptPlugin:ServerPlugin = ({app})=>{
    app.use(async (ctx, next) => {
      await next()
      if (ctx.path.endsWith('.json') && ctx.body) {
        ctx.type = 'js'
        ctx.body = `export default json`
      }
  })
}

```

vite 背后的原理都在 plugin 里，这里不再一一解释每个 plugin 的作用，会放在下文背后的原理中一并讨论。

### **build**

这部分代码在 node/build/index.ts 中，build 目录的结构虽然与 server 相似，同样导出一个 build 方法，同样也有许多 plugin，不过这些 plugin 与 server 中的用途不一样，因为 build 使用了 rollup ，所以这些 plugin 也是为 rollup 打包的 plugin ，本文就不再多提。
