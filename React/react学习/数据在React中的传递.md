### 基于props的单向数据流：

组件，从概念上类似于JavaScript函数。它接受任意的入参（即"props")并返回用于描述页面展示内容的React元素。

既然 props 是组件的入参，那么组件之间通过修改对方的入参来完成数据通信就是天经地义的事情了。不过，这个“修改”也是有原则的——你必须确保所有操作都在“单向数据流”这个前提下。
所谓单向数据流，指的就是当前组件的 state 以 props 的形式流动时，只能流向组件树中比自己层级更低的组件。 比如在父-子组件这种嵌套关系中，只能由父组件传 props 给子组件，而不能反过来。
听上去虽然限制重重，但用起来却是相当的灵活。基于 props 传参这种形式，我们可以轻松实现父-子通信、子-父通信和兄弟组件通信。

#### 父-子组件通信

原理讲解：

这是最常见、也是最好解决的一个通信场景。React 的数据流是单向的，父组件可以直接将 this.props 传入子组件，实现父-子间的通信。

#### 子-父组件通信

原理详解：

考虑到 props 是单向的，子组件并不能直接将自己的数据塞给父组件，但 props 的形式也可以是多样的。假如父组件传递给子组件的是一个绑定了自身上下文的函数，那么子组件在调用该函数时，就可以将想要交给父组件的数据以函数入参的形式给出去，以此来间接地实现数据从子组件到父组件的流动。

#### 兄弟组件通信

兄弟组件之间共享了同一个父组件，如下图所示，这是一个非常重要的先决条件。

这个先决条件使得我们可以继续利用父子组件这一层关系，将“兄弟 1 → 兄弟 2”之间的通信，转化为“兄弟 1 → 父组件”（子-父通信）、“父组件 → 兄弟 2”（父-子）通信两个步骤，如下图所示，这样一来就能够巧妙地把“兄弟”之间的新问题化解为“父子”之间的旧问题。

### 利用“发布-订阅”模式驱动数据流

“发布-订阅”模式可谓是解决通信类问题的“万金油”，在前端世界的应用非常广泛，比如：

- 
  前两年爆火的 socket.io 模块，它就是一个典型的跨端发布-订阅模式的实现；


- 
  在 Node.js 中，许多原生模块也是以 EventEmitter 为基类实现的；


- 
  不过大家最为熟知的，应该还是 Vue.js 中作为常规操作被推而广之的“全局事件总线” EventBus。


这些应用之间虽然名字各不相同，但内核是一致的，也就是我们下面要讲到的“发布-订阅”模型。
理解事件的发布-订阅机制。

```js
target.addEventListener(type, listener, useCapture);
```

通过调用 addEventListener 方法，我们可以创建一个事件监听器，这个动作就是“订阅”。比如我可以监听 click（点击）事件.

```js
el.addEventListener("click", func, false);
```

这样一来，当 click 事件被触发时，事件会被“发布”出去，进而触发监听这个事件的 func 函数。这就是一个最简单的发布-订阅案例。
使用发布-订阅模式的优点在于，监听事件的位置和触发事件的位置是不受限的，就算相隔十万八千里，只要它们在同一个上下文里，就能够彼此感知。这个特性，太适合用来应对“任意组件通信”这种场景了。

##### 发布-订阅模型 API 设计思路

通过前面的讲解，不难看出发布-订阅模式中有两个关键的动作：事件的监听（订阅）和事件的触发（发布），这两个动作自然而然地对应着两个基本的 API 方法。


on()：负责注册事件的监听器，指定事件触发时的回调函数。


emit()：负责触发事件，可以通过传参使其在触发的时候携带数据 。


最后，只进不出总是不太合理的，我们还要考虑一个 off() 方法，必要的时候用它来删除用不到的监听器：


off()：负责监听器的删除。

##### 发布-订阅模型编码实现

接下来写出一个同时拥有 on、emit 和 off 的 EventEmitter。

写EventEmitter的三个问题：

- 事件和监听函数的对应关系如何处理

提到“对应关系”，应该联想到的是“映射”。在 JavaScript 中，处理“映射”我们大部分情况下都是用对象来做的。所以说在全局我们需要设置一个对象，来存储事件和监听函数之间的关系：

```js
constructor() {
  // eventMap 用来存储事件和监听函数之间的关系
  this.eventMap= {}
}
```

- 如何实现订阅

所谓“订阅”，也就是注册事件监听函数的过程。这是一个“写”操作，具体来说就是把事件和对应的监听函数写入到 eventMap 里面去：

```js
// type 这里就代表事件的名称
on(type, handler) {
  // hanlder 必须是一个函数，如果不是直接报错
  if(!(handler instanceof Function)) {
    throw new Error("哥 你错了 请传一个函数")
  }
  // 判断 type 事件对应的队列是否存在
  if(!this.eventMap[type]) {
   // 若不存在，新建该队列
    this.eventMap[type] = []
  }
  // 若存在，直接往队列里推入 handler
  this.eventMap[type].push(handler)
}
```

- 如何实现发布

订阅操作是一个“写”操作，相应的，发布操作就是一个“读”操作。发布的本质是触发安装在某个事件上的监听函数，我们需要做的就是找到这个事件对应的监听函数队列，将队列中的 handler 依次执行出队：

```js
// 别忘了我们前面说过触发时是可以携带数据的，params 就是数据的载体
emit(type, params) {
  // 假设该事件是有订阅的（对应的事件队列存在）
  if(this.eventMap[type]) {
    // 将事件队列里的 handler 依次执行出队
    this.eventMap[type].forEach((handler, index)=> {
      // 注意别忘了读取 params
      handler(params)
    })
  }
}
```

到这里，最最关键的 on 方法和 emit 方法就实现完毕了。最后我们补充一个 off 方法：

```js
off(type, handler) {
    if(this.eventMap[type]) {
        this.eventMap[type].splice(this.eventMap[type].indexOf(handle), 1)
    }
}
```

接着把这些代码片段拼接进一个 class 里面，一个核心功能完备的 EventEmitter 就完成啦：

```js
class myEventEmitter {
  constructor() {
    // eventMap 用来存储事件和监听函数之间的关系
    this.eventMap = {};
  }
  // type 这里就代表事件的名称
  on(type, handler) {
    // hanlder 必须是一个函数，如果不是直接报错
    if (!(handler instanceof Function)) {
      throw new Error("哥 你错了 请传一个函数");
    }
    // 判断 type 事件对应的队列是否存在
    if (!this.eventMap[type]) {
      // 若不存在，新建该队列
      this.eventMap[type] = [];
    }
    // 若存在，直接往队列里推入 handler
    this.eventMap[type].push(handler);
  }
  // 别忘了我们前面说过触发时是可以携带数据的，params 就是数据的载体
  emit(type, params) {
    // 假设该事件是有订阅的（对应的事件队列存在）
    if (this.eventMap[type]) {
      // 将事件队列里的 handler 依次执行出队
      this.eventMap[type].forEach((handler, index) => {
        // 注意别忘了读取 params
        handler(params);
      });
    }
  }
  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
    }
  }
}
```

测试：

```js
// 实例化 myEventEmitter
const myEvent = new myEventEmitter();
// 编写一个简单的 handler
const testHandler = function (params) {
  console.log(`test事件被触发了，testHandler 接收到的入参是${params}`);
};
// 监听 test 事件
myEvent.on("test", testHandler);
// 在触发 test 事件的同时，传入希望 testHandler 感知的参数
myEvent.emit("test", "newState");
```

由此可以看出，EventEmitter 的实例已经具备发布-订阅的能力，执行结果符合预期。
现在你可以试想一下，对于任意的两个组件 A 和 B，假如我希望实现双方之间的通信，借助 EventEmitter 来做就很简单了，以数据从 A 流向 B 为例。
我们可以在 B 中编写一个handler（记得将这个 handler 的 this 绑到 B 身上），在这个 handler 中进行以 B 为上下文的 this.setState 操作，然后将这个 handler 作为监听器与某个事件关联起来。比如这样：

```js
// 注意这个 myEvent 是提前实例化并挂载到全局的，此处不再重复示范实例化过程
const globalEvent = window.myEvent
class B extends React.Component {
  // 这里省略掉其他业务逻辑
  state = {
    newParams: ""
  };
  handler = (params) => {
    this.setState({
      newParams: params
    });
  };
  bindHandler = () => {
    globalEvent.on("someEvent", this.handler);
  };
  render() {
    return (
      <div>
        <button onClick={this.bindHandler}>点我监听A的动作</button>
        <div>A传入的内容是[{this.state.newParams}]</div>
      </div>
    );
  }
}
```

接下来在 A 组件中，只需要直接触发对应的事件，然后将希望携带给 B 的数据作为入参传递给 emit 方法即可。代码如下：

```js
class A extends React.Component {
  // 这里省略掉其他业务逻辑
  state = {
    infoToB: "哈哈哈哈我来自A"
  };
  reportToB = () => {
    // 这里的 infoToB 表示 A 自身状态中需要让 B 感知的那部分数据
    globalEvent.emit("someEvent", this.state.infoToB);
  };
  render() {
    return <button onClick={this.reportToB}>点我把state传递给B</button>;
  }
}
```

React 数据流管理方案中的前两个大方向：

1. 使用基于 Props 的单向数据流串联父子、兄弟组件；
2. 利用“发布-订阅”模式驱动 React 数据在任意组件间流动。

