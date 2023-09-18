# webpack 性能优化

## 产出代码优化

### 使用 production

- 开启压缩代码
- 开启 tree shaking（必须是 ES6 Module 语法才行）

ES6 Module 和 commonjs 的区别

- ES6 Module 是静态引入，编译时引入
- commonjs 是动态引入，执行时引入

```js
// commonjs
let apiList = require('../config/api.js')
if (isDev) {
    // 可以动态引入，执行时引入
    apiList = require('../config/api_dev.js')
}
```

```js
import apiList from '../config/api.js'
if (isDev) {
    // 编译时报错，只能静态引入
    import apiList from '../config/api_dev.js'
}
```

### 小图片 base64 编码

### bundle 加 hash

### 使用 CDN

配置 publicPath

### 提取公共改代码

### 懒加载

### scope hosting 将 module 合并到一个函数中

使用前后的对比，使用的好处

配置如下

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')

module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
  ]
}
```

同时，考虑到 Scope Hoisting 依赖源码需采用 ES6 模块化语法，还需要配置 `mainFields`。因为大部分 Npm 中的第三方库采用了 CommonJS 语法，但部分库会同时提供 ES6 模块化的代码，为了充分发挥 Scope Hoisting 的作用。
