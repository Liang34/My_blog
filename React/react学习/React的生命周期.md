### React15的生命周期

在React15的生命周期中,主要有以下几个生命周期：

```js
constructor()
componentWillReceiveProps()
shouldComponentUpdate()
componentWillMount()
componentWillUpdate()
componentDidUpdate()
componentDidMount()
render()
componentWillUnmount()
```

生命周期的调用流程：

<img src="https://s0.lgstatic.com/i/image/M00/5E/31/Ciqc1F-GZbGAGNcBAAE775qohj8453.png" alt="1.png" data-nodeid="1591">

#### Mounting 阶段：组件的初始化渲染（挂载）

首先我们来看 constructor 方法，该方法仅仅在挂载的时候被调用一次，我们可以在该方法中对` this.state` 进行初始化：

```js
constructor(props) {
  console.log("进入constructor");
  super(props);
  // state 可以在 constructor 里初始化
  this.state = { text: "子组件的文本" };
}
```

`componentWillMount`、`componentDidMount `方法同样只会在挂载阶段被调用一次。其中 `componentWillMount `会在执行 render 方法前被触发，一些同学习惯在这个方法里做一些初始化的操作，但这些操作往往会伴随一些风险或者说不必要性（这一点大家先建立认知，具体原因将在“03 课时”展开讲解）。

接下来 render 方法被触发。注意 render 在执行过程中并不会去操作真实 DOM（也就是说不会渲染），它的职能是把需要渲染的内容返回出来。真实 DOM 的渲染工作，在挂载阶段是由` ReactDOM.render `来承接的。

`componentDidMount `方法在渲染结束后被触发，此时因为真实 DOM 已经挂载到了页面上，我们可以在这个生命周期里执行真实 DOM 相关的操作。此外，类似于异步请求、数据初始化这样的操作也大可以放在这个生命周期来做（侧面印证了` componentWillMount `真的很鸡肋）。

#### Updating 阶段：组件的更新

组件的更新分为两种：一种是由父组件更新触发的更新；另一种是组件自身调用自己的 setState 触发的更新。

`componentWillReceiProps` 到底是由什么触发的？

`componentReceiveProps `并不是由 props 的变化触发的，而是由父组件的更新触发的。


`componentWillUpdate` 会在 render 前被触发，它和` componentWillMount`类似，允许你在里面做一些不涉及真实 DOM 操作的准备工作；而` componentDidUpdate `则在组件更新完毕后被触发，和 `componentDidMount` 类似，这个生命周期也经常被用来处理 DOM 操作。此外，我们也常常将 `componentDidUpdate`的执行作为子组件更新完毕的标志通知到父组件。

#### render 与性能：初识 shouldComponentUpdate

这里需要重点提一下 shouldComponentUpdate 这个生命周期方法，它的调用形式如下所示：
`shouldComponentUpdate(nextProps, nextState)`

render 方法由于伴随着对虚拟 DOM 的构建和对比，过程可以说相当耗时。而在 React 当中，很多时候我们会不经意间就频繁地调用了 render。为了避免不必要的 render 操作带来的性能开销，React 为我们提供了 shouldComponentUpdate 这个口子。
React 组件会根据 shouldComponentUpdate 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行re-render（重渲染）。shouldComponentUpdate 的默认值为 true，也就是说“无条件 re-render”。在实际的开发中，我们往往通过手动往 shouldComponentUpdate 中填充判定逻辑，或者直接在项目中引入 PureComponent 等最佳实践，来实现“有条件的 re-render”。
关于 shouldComponentUpdate 及 PureComponent 对 React 的优化，我们会在后续的性能小节中详细展开。这里你只需要认识到 shouldComponentUpdate 的基本使用及其与 React 性能之间的关联关系即可。

#### Unmounting 阶段：组件的卸载

这个生命周期本身不难理解，我们重点说说怎么触发它。组件销毁的常见原因有以下两个。

- 
  组件在父组件中被移除了：这种情况相对比较直观，对应的就是我们上图描述的这个过程。


- 
  组件中设置了 key 属性，父组件在 render 的过程中，发现 key 值和上一次不一致，那么这个组件就会被干掉。

### React16的生命周期

react16.3的生命周期图：

<img src="https://s0.lgstatic.com/i/image/M00/5D/D9/CgqCHl-FVVeAaMJvAAKXOyLlUwM592.png" alt="Drawing 0.png" data-nodeid="13944">

### Mounting 阶段：组件的初始化渲染（挂载）

消失的 componentWillMount，新增的 getDerivedStateFromProps
从上图中不难看出，React 15 生命周期和 React 16.3 生命周期在挂载阶段的主要差异在于，废弃了 componentWillMount，新增了 getDerivedStateFromProps.

getDerivedStateFromProps 不是 componentWillMount 的替代品.getDerivedStateFromProps 这个 API，其设计的初衷不是试图替换掉 componentWillMount，而是试图替换掉 componentWillReceiveProps，因此它有且仅有一个用途：**使用 props 来派生/更新 state**

React 团队为了确保 getDerivedStateFromProps 这个生命周期的纯洁性，直接从命名层面约束了它的用途（getDerivedStateFromProps 直译过来就是“从 Props 里派生 State”）。所以，如果你不是出于这个目的来使用 getDerivedStateFromProps，原则上来说都是不符合规范的。
值得一提的是，getDerivedStateFromProps 在更新和挂载两个阶段都会“出镜”（这点不同于仅在更新阶段出现的 componentWillReceiveProps）。这是因为“派生 state”这种诉求不仅在 props 更新时存在，在 props 初始化的时候也是存在的。React 16 以提供特定生命周期的形式，对这类诉求提供了更直接的支持。
由此看来，挂载阶段的生命周期改变，并不是一个简单的“替换”逻辑，而是一个雄心勃勃的“进化”逻辑。
认识 getDerivedStateFromProps
这个新生命周期方法的调用规则如下：
static getDerivedStateFromProps(props, state)

在使用层面，你需要把握三个重点。

1. getDerivedStateFromProps 是一个**静态方法**。静态方法不依赖组件实例而存在，因此你在这个方法内部是访问不到 this 的。若你偏要尝试这样做，必定报错.
2. 该方法可以接收两个参数：props 和 state，它们分别代表当前组件接收到的来自父组件的 props 和当前组件自身的 state。
3. getDerivedStateFromProps 需要一个对象格式的返回值。如果你没有指定这个返回值，那么大概率会被 React 警告一番.

**getDerivedStateFromProps 的返回值之所以不可或缺，是因为 React 需要用这个返回值来更新（派生）组件的 state。**因此当你确实不存在“使用 props 派生 state ”这个需求的时候，最好是直接省略掉这个生命周期方法的编写，否则一定记得给它 return 一个 null。

注意，getDerivedStateFromProps 方法对 state 的更新动作并非“覆盖”式的更新，而是针对某个属性的定向更新。比如这里我们在 getDerivedStateFromProps 里返回的是这样一个对象，对象里面有一个 fatherText 属性用于表示“父组件赋予的文本”：

```js
{
  fatherText: props.text
}
```

该对象并不会替换掉组件原始的这个 state：

```js
this.state = { text: "子组件的文本" };
```

而是仅仅针对 fatherText 这个属性作更新（这里原有的 state 里没有 fatherText，因此直接新增）。更新后，原有属性与新属性是共存的.

### Updating 阶段：组件的更新

eact 16.4 的挂载和卸载流程都是与 React 16.3 保持一致的，差异在于更新流程上：

- 
  在 React 16.4 中，任何因素触发的组件更新流程（包括由 this.setState 和 forceUpdate 触发的更新流程）都会触发 getDerivedStateFromProps；


- 而在 v 16.3 版本时，只有父组件的更新会触发该生命周期。

对于 getDerivedStateFromProps 这个 API，React 官方曾经给出过这样的描述：

```与 componentDidUpdate 一起，这个新的生命周期涵盖过时componentWillReceiveProps 的所有用例。``

这句话里蕴含了下面两个关键信息：

- 
  getDerivedStateFromProps 是作为一个试图代替 componentWillReceiveProps 的 API 而出现的；


- getDerivedStateFromProps不能完全和 componentWillReceiveProps 画等号，其特性决定了我们曾经在 componentWillReceiveProps 里面做的事情，不能够百分百迁移到getDerivedStateFromProps 里。

接下来我们就展开说说这两点。

- 
  关于 getDerivedStateFromProps 是如何代替componentWillReceiveProps 的，在“挂载”环节已经讨论过：getDerivedStateFromProps 可以代替 componentWillReceiveProps 实现基于 props 派生 state。


- 至于它为何不能完全和 componentWillReceiveProps 画等号，则是因为它过于“专注”了。这一点，单单从getDerivedStateFromProps 这个 API 名字上也能够略窥一二。原则上来说，它能做且只能做这一件事。

因此，getDerivedStateFromProps 生命周期替代 componentWillReceiveProps 的背后，是 React 16 在强制推行“只用 getDerivedStateFromProps 来完成 props 到 state 的映射”这一最佳实践。意在确保生命周期函数的行为更加可控可预测，从根源上帮开发者避免不合理的编程方式，避免生命周期的滥用；同时，也是在为新的 Fiber 架构铺路。

#### 消失的 componentWillUpdate 与新增的 getSnapshotBeforeUpdate

```js
getSnapshotBeforeUpdate(prevProps, prevState) {
  // ...
}
```

这个方法和 getDerivedStateFromProps 颇有几分神似，它们都强调了“我需要一个返回值”这回事。区别在于 getSnapshotBeforeUpdate 的返回值会作为第三个参数给到 componentDidUpdate。它的执行时机是在 render 方法之后，真实 DOM 更新之前。在这个阶段里，我们可以**同时获取到更新前的真实 DOM 和更新前后的 state&props 信息。**

