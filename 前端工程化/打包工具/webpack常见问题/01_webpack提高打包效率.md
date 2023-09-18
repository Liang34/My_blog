# webpack 性能优化

注意：

- 以下知识点不再一行一行演示
- 面试的时候也不会问到很细节
- 但不要死记硬背一个概念，一定要知道它的基本原理和配置方式

---

## 打包效率

### 优化 babel-loader

- babel-loader cache 未修改的不重新编译
- babel-loader include 明确范围

```js
{
    test: /\.js$/,
    use: ['babel-loader?cacheDirectory'], // 开启缓存
    include: path.resolve(__dirname, 'src'), // 明确范围
    // // 排除范围，include 和 exclude 两者选一个即可
    // exclude: path.resolve(__dirname, 'node_modules')
},
```

### IgnorePlugin 避免引入哪些模块

以常用的 moment 为例。安装 `npm i moment -d` 并且 `import moment from 'moment'` 之后，monent 默认将所有语言的 js 都加载进来，使得打包文件过大。可以通过 ignorePlugin 插件忽略 locale 下的语言文件，不打包进来。

```js
plugins: [
    // 忽略 moment 下的 /locale 目录
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
]
```

```js
import moment from 'moment'
import 'moment/locale/zh-cn' // 手动引入中文语言包
moment.locale('zh-cn')
```

### noParse 避免重复打包

`module.noParse` 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。 原因是一些库，例如 jQuery 、ChartJS， 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

```js
module.exports = {
  module: {
    // 独完整的 `react.min.js` 文件就没有采用模块化
    // 忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/],
  },
};
```

两者对比一下：

- `IgnorePlugin` 直接不引入，代码中不存在
- `noParse` 引入，但不再打包编译

### happyPack 多进程打包

【注意】大型项目，构建速度明显变慢时，作用才能明显。否则，反而会有副作用。

webpack 是基于 nodejs 运行，nodejs 是**单线程**的，happyPack 可以开启多个**进程**来进行构建，发挥多核 CPU 的优势。

```js
const path = require('path')
const HappyPack = require('happypack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        exclude: path.resolve(__dirname, 'node_modules')
      }
    ]
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // ... 其它配置项
    })
  ]
}
```

### ParallelUglifyPlugin 多进程压缩 js

webpack 默认用内置的 uglifyJS 压缩 js 代码。
大型项目压缩 js 代码时，也可能会慢。可以开启多进程压缩，和 happyPack 同理。

```js
const path = require('path')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
      uglifyJS: {
        output: {
          beautify: false, // 最紧凑的输出
          comments: false, // 删除所有的注释
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        }
      },
    }),
  ],
};
```

### 自动刷新

watch 默认关闭。但 webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。

先验证下 webpack 是否能默认自动刷新页面 ？？？

```js
module.export = {
  watch: true, // 开启监听，默认为 false
  // 注意，开启监听之后，webpack-dev-server 会自动开启刷新浏览器！！！

  // 监听配置
  watchOptions: {
    ignored: /node_modules/, // 忽略哪些
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  }
}
```

### 热更新

上文的自动刷新，会刷新整个网页。

- 速度更慢
- 网页当前的状态会丢失，如 input 输入的文字，图片要重新加载，vuex 和 redux 中的数据

操作步骤

- 把现有的 watch 注释掉
- 增加以下代码
- 修改 css less 实验 —— 热替换生效
- 修改 js 实验 —— 热替换**不生效**

```js
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = {
  entry:{
    // 为每个入口都注入代理客户端
    index:[
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/dev-server',
        path.join(srcPath, 'index.js')
    ],
    // other 先不改了
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,
  }  
};
```

js 热替换不生效，是因为我们要自己增加代码逻辑。

```js
// 增加，开启热更新之后的代码逻辑
if (module.hot) {
    module.hot.accept(['./math'], () => {
        const sumRes = sum(10, 20)
        console.log('sumRes in hot', sumRes)
    })
}
```

最后，热替换切勿用于 prod 环境！！！

### DllPlugin

Dll 动态链接库，其中可以包含给其他模块调用的函数和数据。

要给 Web 项目构建接入动态链接库的思想，需要完成以下事情：

- 把网页依赖的基础模块抽离出来，打包到一个个单独的动态链接库中去。一个动态链接库中可以包含多个模块。
- 当需要导入的模块存在于某个动态链接库中时，这个模块不能被再次被打包，而是去动态链接库中获取。
- 页面依赖的所有动态链接库需要被加载。

为什么给 Web 项目构建接入动态链接库的思想后，会大大提升构建速度呢？

- 前端依赖于第三方库 `vue` `react` 等
- 其特点是：体积大，构建速度慢，版本升级慢
- 同一个版本，只需要编译一次，之后直接引用即可 —— 不用每次重复构建，提高构建速度

Webpack 已经内置了对动态链接库的支持，需要通过2个内置的插件接入，它们分别是：

- DllPlugin 插件：打包出 dll 文件
- DllReferencePlugin 插件：使用 dll 文件

打包出 dll 的过程

- 增加 webpack.dll.js
- 修改 package.json scripts `"dll": "webpack --config build/webpack.dll.js"`
- `npm run dll` 并查看输出结果

使用 dll

- 引入 `DllReferencePlugin`
- babel-loader 中排除 `node_modules`
- 配置 `new DllReferencePlugin({...})`
- index.html 中引入 `react.dll.js`
- 运行 dev

### 总结 - 提高构建效率的方法

哪些可用于线上，哪些用于线下

- 优化 babel-loader（可用于线上）
- IgnorePlugin 避免引入哪些模块（可用于线上）
- noParse 避免重复打包（可用于线上）
- happyPack 多进程打包（可用于线上）
- ParallelUglifyPlugin 多进程压缩 js（可用于线上）
- 自动刷新（仅开发环境）
- 热更新（仅开发环境）
- DllPlugin（仅开发环境）
