这篇性能优化主要从初始阶段（加载优化）和运行阶段（渲染优化）来讲解常见的性能优化。

### 初始阶段->加载优化

- 首页加载慢的优化
- 优化图片的做法
- 实现`Webpack`打包优化
- 实现`CDN`加速

### 运行阶段->渲染优化

- 渲染十万条数据如何不造成卡顿

### 加载优化：

1、对于图片我们可以通过**懒加载**的方式来减少**首屏图片**的加载量

原理：看看[懒加载的库](https://www.andreaverlicchi.eu/lazyload/demos/dynamic_content.html)

```js
<img alt="A lazy image" data-src="lazy.jpg">
<------ 滚动到特定位置的时候 ------>
<img alt="A lazy image" src="lazy.jpg" data-src="lazy.jpg">
```

懒加载原理就是监听滚动条事件，如果（滚动条距离浏览器顶部的高度 === 图片距离顶部的高度），那么就将 `data-src` 的值赋值到 `src` 上。

2、对于纯色系**小图标**可以使用 [iconfont](https://www.iconfont.cn/help/detail?&helptype=code) 来解决，设置 `font-family` 的 CSS 属性；对于一些彩色的**小图片**可以使用雪碧图，把所有小图片拼接到一张大图片上，并使用 `background-position` 的 CSS 属性来修改图片坐标

3、通过减少资源的请求量。

- 通过 [nginx 服务器](https://tengine.taobao.org/download/nginx@taobao.pdf) （可用来做 CDN，**用来处理静态资源**）来做**资源文件合并** [combo](https://github.com/alibaba/nginx-http-concat) -- **将多个JavaScript、CSS文件合并成一个**
- 通过打包工具`（Webpack）`来做资源文件的**物理打包**（相对没有第一种灵活）

4、除了从资源层面来解决问题，还可以从我们自己写的代码本身来考虑

- 对于引入的一些比较大型的第三方库，比如 组件库（[antd](https://ant.design/docs/react/getting-started-cn#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD)，[element-ui](https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru)），函数库（[lodash](https://github.com/lodash/babel-plugin-lodash)）等，**务必设定按需加载**。Tips: 一般都是用 Babel 插件来实现的

- 可以通过**前端**路由懒加载的方式（只限于 [SPA 应用](https://preview.pro.ant.design/dashboard/analysis)），使用 [React lazy](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy) 进行动态路由的加载（React 16.6 以上版本才可以使用 React lazy）

  - 路由懒加载原理：

    - ```js
      // 1. 引入 react lazy, 并且使用 import 动态导入组件
      import { lazy } from 'react'; // 静态导入
      
      
      lazy(() => import('./Home')); // 动态导入
      
      // 2. 引入 Suspense 组件，并使用 Suspense 将根组件包裹起来，并使用 fallback props 传入 loading 组件
      import { Suspense } from 'react';
      
      // 注意：使用 lazy 加载的组件，必须是 Suspense 子组件，或者孙组件
      <Suspense fallback={<div>Loading...</div>}>
      	<OtherComponent />
      </Suspense>
      ```

    - 动态导入([dynamic import](https://zh-hans.reactjs.org/docs/code-splitting.html#import))：当代码运行 import 的时候，再导入组件

    - ```js
      import("./math").then(math => {
        console.log(math.add(16, 26));
      });
      
      // 类似于 fetch，都是返回一个 Promise
      
      fetch("./math").then(math => {
        console.log(math.add(16, 26));
      });
      ```

  - `import('xxx')` 返回的是一个` Promise `

  - `Webpack` 只要遇到了 import('xxx')，就会把括号里引入的内容单独打一个包

  - 首先 React lazy 是使用了 dynamic import 的标准，`webpack` 只要遇到了 dynamic import， 就会把里面引入的内容单独打一个包。

    由于 dynamic import 返回的是一个 Promise，所以可以使用 Promise 的状态来做**渲染的流程控制**。

    如果当前 Promise 是 pending 状态，那么就渲染 Loading 组件，如果 Promise 是 resolve 状态那么就渲染动态导入的组件。

5、CSS 和 JS 可以通过 `Webpack` 来进行[混淆和压缩](https://tool.chinaz.com/tools/jscodeconfusion.aspx) 

- 混淆：将 JS 代码进行字符串加密（最大层度减少代码，比如将长变量名变成单个字母等等）
- 压缩：去除注释空行以及 console.log 等调试代码

6、图片也可以进行压缩

- 可以通过自动化工具来压缩图片,	[熊猫站](https://tinypng.com/)：智能压缩 PNG 和 JPG 的一个网站
- 对图片进行转码 -> [base64 格式](https://c.runoob.com/front-end/59)
  - 可以使用 `Webpack `的 [url-loader](https://www.webpackjs.com/loaders/url-loader/) 进行图片策略配置，将**小图**转换成 base64 格式，因为 **base64 格式的图片的作用是减少资源的数量，但是 base64  格式的图片会增大原有图片的体积**

- 使用` WebP` 格式

7、通过开启 `gzip` 进行**全部资源**压缩

- `gzip`: 是一种压缩文件格式，可以对任何文件进行压缩（类比于文件压缩）
- 可以通过 `nginx` 服务器的配置项进行开启

8、`Webpack`打包优化

- 减**少**包数量-> 使用 `Webpack` 进行物理打包。
- 减**小**包体积->使用 `Webpack` 进行混淆和压缩，所有与 `Webpack `优化相关的配置都是在 [optimization](https://webpack.docschina.org/configuration/optimization/) 这个配置项里管理。

```
从 webpack 4 开始，会根据你选择的 [mode](https://webpack.docschina.org/concepts/mode/) 来执行不同的优化，不过所有的优化还是可以手动配置和重写。
development：不混淆，不压缩，不优化
production：混淆 + 压缩，自动内置优化
结论：只需要将 mode 改成 production 即可
```

**注意打包策略**

我们通常会把包，分为两类

第三方包（`node_modules` 里面的）

自己实现的代码（`src` 目录里面的）

所以我们可以把第三方包打一个包，公共的代码打一个包，非公共的代码打一个包。

第三方包：改动频率 -- 小

公共代码包：改动频率 -- 中

非公共代码包：改动频率 -- 高

所以可以将 **打包策略** 结合 **网络缓存** 来做优化

对于不需要经常变动的资源（第三方包），可以使用 `Cache-Control: max-age=31536000`（缓存一年） 并配合协商缓存 `ETag` 使用（一旦文件名变动才会下载新的文件）

对于需要频繁变动的资源（代码包），可以使用 `Cache-Control: no-cache` 并配合 `ETag` 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。

9、实现`CDN`加速

什么叫做 CDN（内容分发网络），用来放静态资源的服务器，可以用来**加速**静态资源的下载

为什么 CDN 可以实现加速，CDN 之所以能够加速，是因为会在很多地方都部署 CDN 服务器，如果用户需要下载静态资源，会自动选择最近的节点下载。

同时由于 CDN 服务器的地址一般都跟主服务器的地址不同，所以可以破除浏览器对同一个域名发送请求的限制

Http1.1 请求：**对于同一个协议、域名、端口，浏览器允许同时打开最多 6个 TCP 连接（最多同时发送 6个请求）**

```javascript
主站     Request URL: https://www.taobao.com/

JS&CSS  Request URL: https://g.alicdn.com/??kg/home-2017/1.4.17/lib/style/lazy.css

图片     Request URL: https://img.alicdn.com/tfs/TB1_uT8a5ERMeJjSspiXXbZLFXa-143-59.png

字体     Request URL: https://at.alicdn.com/t/font_403341_n8tj33yn5peng66r.woff
```

扩展：[Http2.0](https://http2.akamai.com/demo)： 引入了**多路复用**的机制，可以最大化发送请求数量。

### 渲染优化：

为什么渲染很多条数据会造成浏览器卡顿

1. 无论是浏览器中的 DOM 和 BOM，还是 NodeJS，它们都是基于 JavaScript 引擎之上开发出来的
2. DOM 和 BOM 的处理最终都是要被转换成 JavaScript 引擎能够处理的数据
3. 这个转换的过程很耗时
4. **所以在浏览器中最消耗性能的就是操作 DOM**

假如有一个需求，我们要在一个页面中 `ul` 标签里渲染 **十万** 个 li 标签。

```js
// 插入十万条数据
const total = 100000;
let ul = document.querySelector('ul'); // 拿到 ul

// 懒加载的思路 -- 分段渲染
// 1. 一次渲染一屏的量
const once = 20;
// 2. 全部渲染完需要多少次，循环的时候要用
const loopCount = total / once;
// 3. 已经渲染了多少次
let countHasRender = 0;

function add() {
  // 创建虚拟节点，（使用 createDocumentFragment 不会触发渲染）
  const fragment = document.createDocumentFragment();
  // 循环 20 次
  for (let i = 0; i < once; i++) {
    const li = document.createElement('li');
    li.innerText = Math.floor(Math.random() * total);
    fragment.appendChild(li);
  }
  // 最后把虚拟节点 append 到 ul 上
  ul.appendChild(fragment);
  // 4. 已渲染的次数 + 1
  countHasRender += 1;
  loop();
}

// 最重要的部分来了
function loop() {
  // 5. 如果还没渲染完，那么就使用 requestAnimationFrame 来继续渲染
  if (countHasRender < loopCount) {
    // requestAnimationFrame 叫做逐帧渲染
    // 类似于 setTimeout(add, 16);
    // 帧：一秒钟播放多少张图片，一秒钟播放的图片越多，动画就约流畅
    // 1000/60 = 16
    window.requestAnimationFrame(add);
  }
}
loop();
```

1. 可以使用 `document.createDocumentFragment `创建虚拟节点，从而避免引起没有必要的渲染
2. 当所有的 li 都创建完毕后，一次性把虚拟节点里的 li 标签全部渲染出来
3. 可以采取分段渲染的方式，比如一次只渲染一屏的数据
4. 最后使用` window.requestAnimationFrame `来逐帧渲染



