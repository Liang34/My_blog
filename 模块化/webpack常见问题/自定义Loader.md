## 自定义Loader

### loader是什么：

- Loader本质上是一个导出为函数的`JavaScript`模块
- `loader runner`库会调用这个函数，然后将上一个loader产生的结果或者资源文件传入进去

### 编写一个loader：

```js
// hy-loader01
// NormalLoader
// content:资源文件的内容
// map：sourcemap相关的数据(不常用)
// mata: 一些元数据（不常用）
module.exports = function(content) {
    return content
}
// PitchLoader
module.exports.pitch = function() {
    console.log('loader01 pitch')
}
```

配置：

```js
module: {
    rules: [
      {
        test: /\.js$/i,
        use:"hy-loader01",
      }
    ]
  },
// 加载自己的loader文件夹
resolveLoader: {
    modules: ["node_modules", "./hy-loaders"]
}
```

### Loader的执行顺序：（两种类型）

- `NormalLoader`（常用）：
  - 顺序：从后向前，从左向右。
- `PitchLoader`:
  - 顺序：从前往后

### enforce改变执行顺序：

- run-loader先优先执行`PitchLoader`，在执行`PitchLoader`时进行`loaderIndex++`

- run-loader之后会执行`NormalLoader`，在执行`NormalLoader`时进行`loaderIndex--`

- enforce一共有四种方式：默认是normal，如果是行内设置的loader是inline，另外还可以设置pre与post来改变执行顺序。

- 在`Pitching`和`Normal`他们的执行顺序分别是：

  - `pitching`: post	inline	normal	pre
  - `Normal`: pre     normal    inline    post

- 设置方式：

  - ```js
    {
       test: /\.js$/i,
       use: "hy-loader02",
       enforce: "pre"
    }
    ```

### 同步Loader与异步Loader

同步Loader：

- 默认创建的loader就是同步loader
- 这个loader必须通过`retrun`或者`this.callback`来返回结果，交给下一个loader来处理。
- 通常有错误的情况下，我们会使用`this.callback`

```js
module.exports = function(content) {
  // 同步的loader, 两种方法返回数据
  // return content;
  // 第一个参数必须是null或者error
  this.callback(null, content);
}
```

异步loader:

```js
module.exports = function(content) {
  // 设置为异步的loader
  const callback = this.async();
  setTimeout(() => {
    callback(null, content);
  }, 2000);
}
```

### loader获取参数：

![loaderOptions](D:./img/loaderOptions.png)

### 参数校验：

![scam](D:./img/scam.png)

### 编写一个Loader(转化md格式为html格式）：

```js
// 解析md
const marked = require('marked');
const hljs = require('highlight.js');
// md ---->html
module.exports = function(content) {
  console.log('md')
  // 代码处理高亮
  marked.setOptions({
    highlight: function(code, lang) {
      return hljs.highlight(lang, code).value;
    }
  })
  const htmlContent = marked(content);// 返回的是普通的字符串
  // 要返回js语法的字符串或者Buffer
  const innerContent = "`" + htmlContent + "`";
  // 模块化代码
  const moduleCode = `var code=${innerContent}; export default code;`
  return moduleCode;
} 
```

配置：

```js
{
   test: /\.md$/i,
   use: [
     "hymd-loader"
   ]
}
```

