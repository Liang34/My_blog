## vite 运行原理

#### 为啥vite运行时快？

* `vite` 不需要做全量的打包，这是比 `webpack` 要快的最主要的原因；
* `vite` 在解析模块依赖关系时，利用了 `esbuild`，更快（esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍）；
* `按需加载`；模块之间的依赖关系的解析由浏览器实现。Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。
* `充分利用缓存`；Vite 利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

##### **去掉打包步骤**

打包的概念是开发者利用打包工具将应用各个模块集合在一起形成 bundle，以一定规则读取模块的代码——以便在不支持模块化的浏览器里使用。

为了在浏览器里加载各模块，打包工具会借助胶水代码用来组装各模块，比如 webpack 使用 `map` 存放模块 id 和路径，使用 `__webpack_require__` 方法获取模块导出。

vite 利用浏览器原生支持模块化导入这一特性，省略了对模块的组装，也就不需要生成 bundle，所以打包这一步就可以省略了。

vite运行时快是应为借助了ES Module。

打开运行中的 vite 项目，访问 view-source 可以发现 html 里有段这样的代码：

```typescript
<script type="module">
    import { createApp } from '/@modules/vue'
    import App from '/App.vue'
    createApp(App).mount('#app')
</script>

```

##### **实现按需打包**

前面说到，webpack 之类的打包工具会将各模块提前打包进 bundle 里，但打包的过程是静态的——不管某个模块的代码是否执行到，这个模块都要打包到 bundle 里，这样的坏处就是随着项目越来越大打包后的 bundle 也越来越大。

开发者为了减少 bundle 大小，会使用动态引入 `import()` 的方式异步的加载模块（ 被引入模块依然需要提前打包)，又或者使用 tree shaking 等方式尽力的去掉未引用的模块，然而这些方式都不如 vite 的优雅，vite 可以只在需要某个模块的时候动态（借助 `import()` ）的引入它，而不需要提前打包，虽然只能用在开发环境，不过这就够了。

### **vite 如何处理 ESM**

既然 vite 使用 ESM 在浏览器里使用模块，那么这一步究竟是怎么做的？

上文提到过，在浏览器里使用 ES module 是使用 http 请求拿到模块，所以 vite 必须提供一个 web server 去代理这些模块，上文中提到的 `koa` 就是负责这个事情，vite 通过对请求路径的劫持获取资源的内容返回给浏览器，不过 vite 对于模块导入做了特殊处理。

##### **@modules 是什么？**

通过工程下的 index.html 和开发环境下的 html 源文件对比，发现 script 标签里的内容发生了改变，由

```typescript
<script type="module">
    import { createApp } from 'vue'
    import App from '/App.vue'
    createApp(App).mount('#app')
</script>

```

变成了

```typescript
<script type="module">
    import { createApp } from '/@modules/vue'
    import App from '/App.vue'
    createApp(App).mount('#app')
</script>
import

```

这中间发生了什么？：

* 在 koa 中间件里获取请求 body
* 通过 es-module-lexer 解析资源 ast 拿到 import 的内容
* 判断 import 的资源是否是绝对路径，绝对视为 npm 模块
* 返回处理后的资源路径：`"vue" => "/@modules/vue"`

这部分代码在 serverPluginModuleRewrite 这个 plugin 中

##### **为什么需要 @modules？**

如果我们在模块里写下以下代码的时候，浏览器中的 esm 是不可能获取到导入的模块内容的：

```typescript
import vue from 'vue'

```

因为 `vue` 这个模块安装在 node_modules 里，以往使用 webpack，webpack遇到上面的代码，会帮我们做以下几件事：

* 获取这段代码的内容
* 解析成 AST
* 遍历 AST 拿到 `import` 语句中的包的名称
* 使用 enhanced-resolve 拿到包的实际地址进行打包，

但是浏览器中 ESM 无法直接访问项目下的 node_modules，所以 vite 对所有 import 都做了处理，用带有 **@modules** 的前缀重写它们。

从另外一个角度来看这是非常比较巧妙的做法，把文件路径的 rewrite 都写在同一个 plugin 里，这样后续如果加入更多逻辑，改动起来不会影响其他 plugin，其他 plugin 拿到资源路径都是  **@modules** ，比如说后续可能加入 alias 的配置：就像 webpack alias 一样：可以将项目里的本地文件配置成绝对路径的引用。

##### **怎么返回模块内容**

在下一个 koa middleware 中，用正则匹配到路径上带有 **@modules** 的资源，再通过 `require('xxx')` 拿到 包的导出返回给浏览器。

以往使用 webpack 之类的打包工具，它们除了将模块组装到一起形成 bundle，还可以让使用了不同模块规范的包互相引用，比如：

* ES module (esm) 导入 cjs
* CommonJS (cjs) 导入 esm
* dynamic import 导入 esm
* dynamic import 导入 cjs

关于 es module 的坑可以看这篇文章([zhuanlan.zhihu.com/p/40733281](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F40733281 "https://zhuanlan.zhihu.com/p/40733281"))。

起初在 vite 还只是为 vue3.x 设计的时候，对 vue esm 包是经过特殊处理的，比如：需要 `@vue/runtime-dom` 这个包的内容，不能直接通过 `require('@vue/runtime-dom'`）得到，而需要通过 `require('@vue/runtime-dom/dist/runtime-dom.esm-bundler.js'` 的方式，这样可以使得 vite 拿到符合 esm 模块标准的 vue 包。

目前社区中大部分模块都没有设置默认导出 esm，而是导出了 cjs 的包，既然 vue3.0 需要额外处理才能拿到 esm 的包内容，那么其他日常使用的 npm 包是不是也同样需要支持？答案是肯定的，目前在 vite 项目里直接使用 lodash 还是会报错的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/326238f1f8c7487cb416fd3b739ed522~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

不过 vite 在最近的更新中，加入了 `optimize`命令，这个命令专门为解决模块引用的坑而开发，例如我们要在 vite 中使用 lodash，只需要在 **vite.config.js** （vite 配置文件）中，配置 `optimizeDeps`对象，在 `include`数组中添加 lodash。

这样 vite 在执行 runOptimize 的时候中会使用 roolup 对 lodash 包重新编译，将编译成符合 esm 模块规范的新的包放入 node_modules 下的 .**vite_opt_cache** 中，然后配合 resolver 对 `lodash` 的导入进行处理：使用编译后的包内容代替原来 lodash 的包的内容，这样就解决了 vite 中不能使用 cjs 包的问题，这部分代码在 depOptimizer.ts 里。

不过这里还有个问题，由于在 depOptimizer.ts 中，vite 只会处理在项目下 package.json 里的 `dependencies` 里声明好的包进行处理，所以无法在项目里使用

```typescript
import pick from 'lodash/pick'

```

的方式单使用 pick 方法，而要使用

```typescript
import lodash from 'lodash'

lodash.pick()

```

的方式，这可能在生产环境下使用某些包的时候对 bundle 的体积有影响。

返回模块的内容的代码在：serverPluginModuleResolve.ts 这个 plugin 中。
