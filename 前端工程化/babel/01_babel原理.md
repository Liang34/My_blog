### Babel的原理

Babel 是  **JavaScript 编译器** ：他能让开发者在开发过程中，直接使用各类方言（如 TS、Flow、JSX）或新的语法特性，而不需要考虑运行环境，因为 Babel 可以做到按需转换为低版本支持的代码；Babel 内部原理是将 JS 代码转换为  **AST** ，对 AST 应用各种插件进行处理，最终输出编译后的 JS 代码。

Babel的编译流程

### 三大步骤：

* 解析阶段：Babel默认使用@babel/parser将代码转换为AST，解析一般分为两个阶段：词法分析（token）与语法分析（AST）
  * **词法分析**：对输入的字符序列做标记化(tokenization)操作。
  * **语法分析** ：处理标记与标记之间的关系，最终形成一颗完整的 AST 结构
* 转换阶段：Babel 使用 **@babel/traverse** 提供的方法对 AST 进行深度优先遍历，调用插件对关注节点的处理函数，按需对 AST 节点进行增删改操作。
* **生成阶段** ：Babel 默认使用 **@babel/generator** 将上一阶段处理后的 AST 转换为代码字符串。

### Babel 插件系统


Babel 的核心模块 @babel/core，@babel/parser，@babel/traverse 和 @babel/generator 提供了完整的编译流程。而具体的转换逻辑需要插件来完成。

在使用 Babel 时，我们可通过配置文件指定 plugin 和 preset。而 preset 可以是 plugin 和 preset 以及其他配置的集合。Babel 会递归读取 preset，最终获取一个大的 plugins 数组，用于后续使用。


#### 常见 presets

* @babel/preset-env
* @babel/preset-typescript
* @babel/preset-react
* @babel/preset-flow

最常见的 @babel/preset-env 预设，包含了一组最新浏览器已支持的 ES 语法特性，并且可以通过配置目标运行环境范围，自动按需引入插件。

#### 编写 Babel 插件

Babel 插件的写法是借助 **访问者模式** （Visitor Pattern）对关注的节点定义处理函数。参考一个简单 Babel 插件例子：

```js
module.exports = function () {
  return {
    pre() {},
    // 在 visitor 下挂载各种感兴趣的节点类型的监听方法
    visitor: {
      /**
       * 对 Identify 类型的节点进行处理
       * @param {NodePath} path
       */
      Identifier(path) {
        path.node.name = path.node.name.toUpperCase();
      },
    },
    post() {},
  };
};

```

使用该 Babel 插件的效果如下：

```js
// input

// index.js
function hzfe() {}

// .babelrc
{
  "plugins": ["babel-plugin-yourpluginname"]
}
// output
function HZFE() {}

```

### 深入 Babel 转换阶段

在转换阶段，Babel 的相关方法会获得一个插件数组变量，用于后续的操作。插件结构可参考以下接口。

```js
interface Plugin {
  key: string | undefined | null;
  post: Function | void;
  pre: Function | void;
  visitor: Object;
  parserOverride: Function | void;
  generatorOverride: Function | void;
  // ...
}

```


 **转换阶段** ，Babel 会按以下顺序执行。详细逻辑可查看源码：

1. 执行所有插件的 pre 方法。
2. 按需执行 visitor 中的方法。
3. 执行所有插件的 post 方法。

一般来说，写 Babel 插件主要使用到的是 visitor 对象，这个 visitor 对象中会书写对于关注的 AST 节点的处理逻辑。而上面执行顺序中的第二步所指的 visitor 对象，是整合自各插件的 visitor，最终形成一个大的 visitor 对象，大致的数据结构可参考以下接口：

```js
// 书写插件时的 visitor 结构
interface VisitorInPlugin {
  [ASTNodeTypeName: string]:
    | Function
    | {
        enter?: Function;
        exit?: Function;
      };
}

// babel 最终整合的 visitor 结构
interface VisitorInTransform {
  [ASTNodeTypeName: string]: {
    // 不同插件对相同节点的处理会合并为数组
    enter?: Function[];
    exit?: Function[];
  };
}

```


在对 AST 进行**深度优先遍历**的过程中，会创建 TraversalContext 对象来把控对 NodePath 节点的访问，访问时调用对节点所定义的处理方法，从而实现按需执行 visitor 中的方法。详细实现请看 babel-traverse 中的源码。

## 参考资
