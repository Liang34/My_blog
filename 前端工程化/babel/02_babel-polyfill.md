## babel

- babel-polyfill —— **7.4 之后弃用，推荐直接使用 corejs 和 regenerator ？？**
- babel-runtime

## 使用 polyfill

什么是 babel-polyfill

- 什么是 polyfill ？—— 即一个补丁，引入以兼容新 API（注意**不是新语法**，如箭头函数），如搜索“Object.keys polyfill” 和 “Promise polyfill”
- core-js 集合了所有新 API 的 polyfill 。https://github.com/zloirock/core-js
- regenerator 是 generator 的 polyfill 。 https://github.com/facebook/regenerator
- babel-polyfill 即 core-js 和 regenerator 的集合，它只做了一层封装而已。

基本使用

- `src/index.js` 中写一个 Promise，打包看结果
- `npm install --save @babel/polyfill` 【注意】要 `--save`
- 然后引入 `import '@babel/polyfill'`
- 再打包，看结果
  - 解释：babel 仅仅是处理 ES6 语法，并不关心模模块化的事情。模块化归 webpack 管理
  - 全部引入 polyfill ，体积很大

按需加载

- 新增 `"useBuiltIns": "usage"` （注意要改写 preset 的 json 结构）
- 删掉入口的 `import '@babel/polyfill'`
- 再打包，看结果
  - 提示选择 core-js 的版本，增加 `"corejs": 3`
  - 只引入了 promise 的 polyfill

## 使用 runtime

babel-polyfill 的问题 —— 会污染全局变量

- 如果是一个网站或者系统，无碍
- 如果是做一个第三方工具，给其他系统使用，则会有问题
- 不能保证其他系统会用 Promise 和 includes 做什么，即便他们用错了，那你也不能偷偷的给更改了

```js
// 源代码
Promise.resolve(100).then(data => data);
[10, 20, 30].includes(20);

// 结果 —— 可以看到，Promise 和 includes 都未改动，因为以注入全局变量了
"use strict";
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");

Promise.resolve(100).then(function (data) {
  return data;
});
[10, 20, 30].includes(20);
```

使用 babel-runtime

- `npm install --save-dev @babel/plugin-transform-runtime`
- `npm install --save @babel/runtime`，注意是 `--save`
- 配置 `"plugins": ["@babel/plugin-transform-runtime"]`
  - 其中 `"corejs": 3,` v3 支持 API 如数组 includes ，v2.x 不支持
- 删掉 `"useBuiltIns": "usage"`
- 运行代码

## 总结

- babel-polyfill 是什么，core-js 是什么
- babel-polyfill 按需加载的配置
- babel-polyfill 和 babel-runtime 的不同应用场景
