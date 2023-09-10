> Vite plugins extends Rollup's well-designed plugin interface with a few extra Vite-specific options. As a result, you can write a Vite plugin once and have it work for both dev and build.

> **It is recommended to go through [Rollup&#39;s plugin documentation](https://rollupjs.org/guide/en/#plugin-development) first before reading the sections below.**

上文的大致意思是要想开发vite的插件，建议先去了解Rollup的插件开发

### Vite插件初探

我们需要了解 `Vite`插件的编写方式。`Vite`插件是一个 `JavaScript`模块，它导出一个函数，这个函数接受一个参数，这个参数是一个Vite插件API对象。通过查阅 `rollup`的插件开发文档，我们发现 `generateBundle` 钩子是用于在生成最终包的阶段进行额外的处理。该钩子可以获取到以下信息：

* `outputOptions`：输出选项对象，包含了输出文件的路径、格式等信息。
* `bundle`：打包生成的代码对象，包含了多个模块的信息，可以用来进一步分析和处理代码。
* `isWrite`: 一个布尔值，用于判断当前是否是写入文件的操作，若为 `false` 则表示只是在生成代码而不是写入文件。

```typescript
export default function visualizer() {
  return {
    name: 'visualizer',
    async generateBundle(outputOptions, bundle) {
      fs.writeFileSync(path.join("./", 'bundle.txt'), bundle);
    },
  };
}
```

在这个示例中，我们编写了一个名为 `visualizer`的插件，让它在生成打包产物时输出 `bundle`的内容，并把内容通过 `Node.js`中的一个文件系统模块，用于同步地将数据写入文件 `bundle.txt`输出到项目根目录下。

在返回的对象中可以在vite打包的各个阶段处理资源。

[vite插件的hooks](https://v3.vitejs.dev/guide/api-plugin.html#universal-hooks)

### Universal Hooks[#](https://v3.vitejs.dev/guide/api-plugin.html#universal-hooks)

During dev, the Vite dev server creates a plugin container that invokes [Rollup Build Hooks](https://rollupjs.org/guide/en/#build-hooks) the same way Rollup does it.

The following hooks are called once on server start:

* [options](https://rollupjs.org/guide/en/#options)
* [buildStart](https://rollupjs.org/guide/en/#buildstart)

The following hooks are called on each incoming module request:

* [resolveId](https://rollupjs.org/guide/en/#resolveid)
* [load](https://rollupjs.org/guide/en/#load)
* [transform](https://rollupjs.org/guide/en/#transform)

The following hooks are called when the server is closed:

* [buildEnd](https://rollupjs.org/guide/en/#buildend)
* [closeBundle](https://rollupjs.org/guide/en/#closebundle)

Note that the [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) hook is **not** called during dev, because Vite avoids full AST parses for better performance.

### Vite Specific Hooks

* `config`： 可用于修改 `vite config`，用户可以通过这个 `hook` 修改 `config`；例如 `vite-aliases` 这个插件可以帮助我们自动生成别名。它利用的就是这个钩子。
* `configResolved`： 在解析 Vite 配置后调用，用于获取解析完毕的 `config`，在这个 `hook` 中不建议修改 `config`。
* `configureServer`： 用于给 `dev server` 添加自定义 `middleware`；例如 `vite-plugin-mock` 插件就是在这个生命周期调用的
* `configurePreviewServer`：与 [`configureServer`](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fapi-plugin.html%23configureserver "https://cn.vitejs.dev/guide/api-plugin.html#configureserver") 相同但是作为预览服务器。`vite preview`插件就是利用这个钩子。
* `transformIndexHtml`：注入变量，用来转换 `HTML` 的内容。`vite-plugin-html` 插件可以帮助我们在html里注入变量，就是利用这个钩子
* `handleHotUpdate`：执行自定义 HMR 更新处理

### 如何指定 vite 插件 的执行顺序？

可以使用 `enforce` 修饰符来强制插件的位置:

* `pre`：在 Vite 核心插件之前调用该插件
* 默认：在 Vite 核心插件之后调用该插件
* `post`：在 Vite 构建插件之后调用该插件
