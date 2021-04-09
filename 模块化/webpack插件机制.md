## webpack-插件机制

### 前言

`Webpack` 工程相当庞大，但 `Webpack` 本质上是一种事件流机制。通过事件流将各种插件串联起来，最终完成 `Webpack` 的全流程，而实现事件流机制的核心是 `Tapable `模块。`Webpack `负责编译的` Compiler `和创建 `Bundle` 的 `Compilation `都是继承自 `Tapable`。

### Tapable

`tapable `是一个类似于`nodejs` 的`EventEmitter `的库, 主要是控制钩子函数的发布与订阅。当然，`tapable`提供的hook机制比较全面，分为同步和异步两个大类(异步中又区分异步并行和异步串行)，而根据事件执行的终止条件的不同，由衍生出 Bail/Waterfall/Loop 类型。

`tapable`的执行流程可以分为以下四步：

- 使用`tap*`对事件进行注册绑定。根据类型不同，提供三种绑定的方式：`tap、tapPromise、tapAsync`，其中`tapPromise、tapAsync`为异步类`Hook`的绑定方法。
- 使用`call*`对事件进行触发，根据类型不同，也提供了三种触发方式：`call、promise、callAsync`;
- 生成对应类型的代码片段（要执行的代码实际是拼字符串拼出来的）
- 生成第三步生成的代码片段；

### compile

> compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用 compiler 来访问 webpack 的主环境。

也就是说，compile是webpack的整体环境。

#### compile的内部实现：

```js
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      /** @type {SyncBailHook<Compilation>} */
      shouldEmit: new SyncBailHook(["compilation"]),
      /** @type {AsyncSeriesHook<Stats>} */
      done: new AsyncSeriesHook(["stats"]),
      /** @type {AsyncSeriesHook<>} */
      additionalPass: new AsyncSeriesHook([]),
      /** @type {AsyncSeriesHook<Compiler>} */
      ......
      ......
      some code
    };
    ......
    ......
    some code
}
```

 可以看到， Compier继承了Tapable, 并且在实例上绑定了一个hook对象， 使得Compier的实例compier可以像这样使用 

````js
compiler.hooks.compile.tapAsync(
  'afterCompile',
  (compilation, callback) => {
    console.log('This is an example plugin!');
    console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

    // 使用 webpack 提供的 plugin API 操作构建结果
    compilation.addModule(/* ... */);

    callback();
  }
);
````

### compilation

> compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

#### compilation的实现

```
class Compilation extends Tapable {
	/**
	 * Creates an instance of Compilation.
	 * @param {Compiler} compiler the compiler which created the compilation
	 */
	constructor(compiler) {
		super();
		this.hooks = {
			/** @type {SyncHook<Module>} */
			buildModule: new SyncHook(["module"]),
			/** @type {SyncHook<Module>} */
			rebuildModule: new SyncHook(["module"]),
			/** @type {SyncHook<Module, Error>} */
			failedModule: new SyncHook(["module", "error"]),
			/** @type {SyncHook<Module>} */
			succeedModule: new SyncHook(["module"]),

			/** @type {SyncHook<Dependency, string>} */
			addEntry: new SyncHook(["entry", "name"]),
			/** @type {SyncHook<Dependency, string, Error>} */
		}
	}
}
```

编写一个插件：

 了解到tapable\compiler\compilation之后， 再来看插件的实现就不再一头雾水了
以下代码源自[官方文档](https://webpack.docschina.org/contribute/writing-a-plugin/) 

```js
class MyExampleWebpackPlugin {
  // 定义 `apply` 方法
  apply(compiler) {
    // 指定要追加的事件钩子函数
    compiler.hooks.compile.tapAsync(
      'afterCompile',
      (compilation, callback) => {
        console.log('This is an example plugin!');
        console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

        // 使用 webpack 提供的 plugin API 操作构建结果
        compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}
```

 可以看到其实就是在apply中传入一个Compiler实例， 然后基于该实例注册事件， compilation同理， 最后webpack会在各流程执行call方法。 

## compiler和compilation一些比较重要的事件钩子

### [compier](https://webpack.docschina.org/api/compiler-hooks/#failed)

| 事件钩子      | 触发时机                                            | 参数        | 类型              |
| ------------- | --------------------------------------------------- | ----------- | ----------------- |
| entry-option  | 初始化 option                                       | -           | SyncBailHook      |
| run           | 开始编译                                            | compiler    | AsyncSeriesHook   |
| compile       | 真正开始的编译，在创建 compilation 对象之前         | compilation | SyncHook          |
| compilation   | 生成好了 compilation 对象，可以操作这个对象啦       | compilation | SyncHook          |
| make          | 从 entry 开始递归分析依赖，准备对每个模块进行 build | compilation | AsyncParallelHook |
| after-compile | 编译 build 过程结束                                 | compilation | AsyncSeriesHook   |
| emit          | 在将内存中 assets 内容写到磁盘文件夹之前            | compilation | AsyncSeriesHook   |
| after-emit    | 在将内存中 assets 内容写到磁盘文件夹之后            | compilation | AsyncSeriesHook   |
| done          | 完成所有的编译过程                                  | stats       | AsyncSeriesHook   |
| failed        | 编译失败的时候                                      | error       | SyncHook          |

### [compilation](https://webpack.docschina.org/api/compilation-hooks/)

| 事件钩子              | 触发时机                                                     | 参数                 | 类型            |
| --------------------- | ------------------------------------------------------------ | -------------------- | --------------- |
| normal-module-loader  | 普通模块 loader，真正（一个接一个地）加载模块图(graph)中所有模块的函数。 | loaderContext module | SyncHook        |
| seal                  | 编译(compilation)停止接收新模块时触发。                      | -                    | SyncHook        |
| optimize              | 优化阶段开始时触发。                                         | -                    | SyncHook        |
| optimize-modules      | 模块的优化                                                   | modules              | SyncBailHook    |
| optimize-chunks       | 优化 chunk                                                   | chunks               | SyncBailHook    |
| additional-assets     | 为编译(compilation)创建附加资源(asset)。                     | -                    | AsyncSeriesHook |
| optimize-chunk-assets | 优化所有 chunk 资源(asset)。                                 | chunks               | AsyncSeriesHook |
| optimize-assets       | 优化存储在 compilation.assets 中的所有资源(asset)            | assets               | AsyncSeriesHook |

### 总结

插件机制并不复杂，webpack也不复杂，复杂的是插件本身..
 另外， 本应该先写流程的， 流程只能后面补上了。

原文：[webpack-插件机制杂记](https://juejin.cn/post/6844903789804126222#heading-8)