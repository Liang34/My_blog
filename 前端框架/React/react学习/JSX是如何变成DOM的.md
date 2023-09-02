```js
/**
 101. React的创建元素方法
 */
export function createElement(type, config, children) {
  // propName 变量用于储存后面需要用到的元素属性
  let propName;
  // props 变量用于储存元素属性的键值对集合
  const props = {};
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  // config 对象中存储的是元素的属性
  if (config != null) {
    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = '' + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
  // childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度
  const childrenLength = arguments.length - 2;
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了
  if (childrenLength === 1) {
    // 直接把这个参数的值赋给props.children
    props.children = children;
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) {
    // 声明一个子元素数组
    const childArray = Array(childrenLength);
    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray;
  }

  // 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

上面是对源码细节的初步展示，接下来我会带你逐步提取源码中的关键知识点和核心思想。

我们先来看看方法的入参：

```js
export function (type, config, children)
// createElement 有 3 个入参，这 3 个入参囊括了 React 创建一个元素所需要知道的全部信息。
// type：用于标识节点的类型。它可以是类似“h1”“div”这样的标准 HTML 标签字符串，也可以是 React 组件类型或 React fragment 类型。
// config：以对象形式传入，组件所有的属性都会以键值对的形式存储在 config 对象中。
// children：以对象形式传入，它记录的是组件标签之间嵌套的内容，也就是所谓的“子节点”“子元素”。
```

调用示例

```js
React.createElement("ul", {
    // 传入属性键值对
     className: "list"
},
// 从第三个入参开始往后，传入的参数都是 children
React.createElement("li", {key: "1"}), 
React.createElement("li", {key: "2"}),
)
// 对应的DOM结构为
<ul className="list">
  <li key="1">1</li>
  <li key="2">2</li>
</ul>
```

`createElement `的函数逻辑。

`createElement` 函数体拆解流程图：

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BeuGAepNsAACqreYXrj0410.png" alt="Drawing 3.png" data-nodeid="1313">

createElement 中并没有十分复杂的涉及算法或真实 DOM 的逻辑，它的每一个步骤几乎都是在格式化数据.说得更直白点，createElement 就像是开发者和 ReactElement 调用之间的一个转换器、一个数据处理层。它可以从开发者处接受相对简单的参数，然后将这些参数按照 ReactElement 的预期做一层格式化，最终通过调用 ReactElement 来实现元素的创建。整个过程如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BevGANuu4AACN5mBDMlg569.png" alt="Drawing 5.png" data-nodeid="1338">

现在看来，createElement 原来只是个“参数中介”。此时我们的注意力自然而然地就聚焦在了 ReactElement 上，接下来我们就乘胜追击，一起去挖一挖 ReactElement 的源码吧！

面已经分析过，createElement 执行到最后会 return 一个针对 ReactElement 的调用。这里关于 ReactElement，我依然先给出源码 + 注释形式的解析:

```js
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };
  // 
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }
  return element;
};
```

ReactElement 的代码出乎意料的简短，从逻辑上我们可以看出，ReactElement 其实只做了一件事情，那就是创建，说得更精确一点，是组装：ReactElement 把传入的参数按照一定的规范，“组装”进了 element 对象里，并把它返回给了 React.createElement，最终 React.createElement 又把它交回到了开发者手中。整个过程如下图所示：

<img src="https://s0.lgstatic.com/i/image/M00/5C/74/CgqCHl-Bex6AM5rhAACJMrix5bk913.png" alt="Drawing 7.png" data-nodeid="1355">

如果你想要验证这一点，可以尝试输出我们示例中 App 组件的 JSX 部分：

```js
const AppJSX = (<div className="App">
  <h1 className="title">I am the title</h1>
  <p className="content">I am the content</p>
</div>)
console.log(AppJSX)
```

你会发现它确实是一个标准的 ReactElement 对象实例，如下图（生产环境下的输出结果）所示：

<img src="https://s0.lgstatic.com/i/image/M00/5C/69/Ciqc1F-BezKAW4rXAAIUYQW6Lk0911.png" alt="Drawing 8.png" data-nodeid="1360">

这个 ReactElement 对象实例，本质上是JavaScript 对象形式存在的对 DOM 的描述，也就是老生常谈的“虚拟 DOM”准确地说，是虚拟 DOM 中的一个节点。关于虚拟 DOM， 我们将在专栏的“模块二：核心原理”中花大量的篇幅来研究它，此处你只需要能够结合源码，形成初步认知即可）既然是“虚拟 DOM”，那就意味着和渲染到页面上的真实 DOM 之间还有一些距离，这个“距离”，就是由大家喜闻乐见的ReactDOM.render方法来填补的。在每一个 React 项目的入口文件中，都少不了对 React.render 函数的调用。下面我简单介绍下 ReactDOM.render 方法的入参规则：

```js
ReactDOM.render(
    // 需要渲染的元素（ReactElement）
    element, 
    // 元素挂载的目标容器（一个真实DOM）
    container,
    // 回调函数，可选参数，可以用来处理渲染结束后的逻辑
    [callback]
)
```

`ReactDOM.render `方法可以接收 3 个参数，其中第二个参数就是一个真实的 DOM 节点，这个真实的 DOM 节点充当“容器”的角色，React 元素最终会被渲染到这个“容器”里面去。比如，示例中的 App 组件，它对应的 render 调用是这样的：
`const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);`

注意，这个真实 DOM 一定是确实存在的。比如，在 App 组件对应的 index.html 中，已经提前预置 了 id 为 root 的根节点：

```js<body>
    <div id="root"></div>
</body>
```

