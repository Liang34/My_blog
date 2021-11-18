在`VueJs`内部，一个组件想要真正的渲染生成DOM，还需要经历

```创建vnode-渲染vnode-生成vnode```

`vnode`:所谓的`vnode`就是用JS来描述元素的对象。

应用程序初始化：3.0和2.x差别并不大，本质都是把App组件挂载到id为app的DOM节点上。

```js
// vue2.x
import Vue from 'vue'
import App from './App'
const app = new Vue({
    render: h => h(App)
})
app.$mount('#app');
// vue3.0
import {createApp} from 'vue'
import App from './App'
const app = createApp(App)
app.mount('#app')
```

与vue2不同的是vue3导入了一个`createApp`，其实这是个入口函数，可以看齐内部实现。它主要是创建app和重写`app.mount`方法。

`createApp`在源码目录下的`runtime-dom/src/index.js`下

```js
onst createApp = ((...args) => {
  // 1.创建app对象
  // ensureRenderer() ，和渲染相关的代码都在这里
  const app = ensureRenderer().createApp(...args)
  // 2.这里取出了app中的mount方法，因为待会儿要进行重写
  const { mount } = app
  // 3.重写mount方法
  // 这里重写的目的是考虑到跨平台(app.mount里面只包含和平台无关的代码)
  // 这些重写的代码都是一些和web关系比较大的代码(比如其他平台也可以进行类似的重写)
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // normalizeContainer方法就是在web端获取我们的元素，比如div#app
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    // 先清空container中的原本内容
    container.innerHTML = ''
    // 调用真正的mount函数, 进行挂载
    const proxy = mount(container, false, container instanceof SVGElement)
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }
  // 3.返回app
  return app
})
// 创建渲染器的函数,延时创建渲染器，当用户只依赖响应式包的时候，
// 可以通过tree-shaking移除核心渲染逻辑相关代码
function ensureRenderer() {
  // 如果已经有渲染器直接返回
  // 如果没有渲染器, 那么调用createRenderer创建渲染器
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}
```

在整个app对象创建过程中，`Vue.js`利用闭包和函数柯里化的技巧，很好地实现了参数保留。比如，在执行app.mount的时候，并不需要传入渲染器render，这是因为在执行 createAppAPI 的时候渲染器 render 参数已经被保留下来了。

核心渲染流程：创建vnode和渲染vnode

1、创建vnode

vnode 本质上是用来描述 DOM 的 JavaScript 对象，它在 Vue.js 中可以描述不同类型的节点，比如普通元素节点、组件节点等。
什么是普通元素节点呢？举个例子，在 HTML 中我们使用 <button> 标签来写一个按钮：

```html
<button class="btn" style="width:100px;height:50px">click me</button>
```

我们可以用 vnode 这样表示<button>标签

```js
const vnode = {
  type: 'button',
  props: { 
    'class': 'btn',
     style: {
      width: '100px',
      height: '50px'
    }
  },
  children: 'click me'
}
```

其中，type 属性表示 DOM 的标签类型，props 属性表示 DOM 的一些附加信息，比如 style 、class 等，children 属性表示 DOM 的子节点，它也可以是一个 vnode 数组，只不过 vnode 可以用字符串表示简单的文本 。

其实vnode的类型还有：组件vnode、纯文本vnode、注释vnode等等

- 创建`vnode`: createVNode函数

```js

```

通过上述代码可以看到，其实 createVNode 做的事情很简单，就是：对 props 做标准化处理、对 vnode 的类型信息编码、创建 vnode 对象，标准化子节点 children 。

- 渲染vnode，通过render函数实现

  ```js
  render(vnode, rootContainer)
  const render = (vnode, container) => {
    if (vnode == null) {
      // 销毁组件
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      // 创建或者更新组件
      patch(container._vnode || null, vnode, container)
    }
    // 缓存 vnode 节点，表示已经渲染
    container._vnode = vnode
  }
  ```

  这个渲染函数 render 的实现很简单，如果它的第一个参数 vnode 为空，则执行销毁组件的逻辑，否则执行创建或者更新组件的逻辑。

  接下来我们接着看一下上面渲染 vnode 的代码中涉及的 patch 函数的实现：

  ```js
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
    // 如果存在新旧节点, 且新旧节点类型不同，则销毁旧节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1)
      unmount(n1, parentComponent, parentSuspense, true)
      n1 = null
    }
    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        // 处理文本节点
        break
      case Comment:
        // 处理注释节点
        break
      case Static:
        // 处理静态节点
        break
      case Fragment:
        // 处理 Fragment 元素
        break
      default:
        if (shapeFlag & 1 /* ELEMENT */) {
          // 处理普通 DOM 元素
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
        }
        else if (shapeFlag & 6 /* COMPONENT */) {
          // 处理组件
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
        }
        else if (shapeFlag & 64 /* TELEPORT */) {
          // 处理 TELEPORT
        }
        else if (shapeFlag & 128 /* SUSPENSE */) {
          // 处理 SUSPENSE
        }
    }
  }
  ```

  patch 本意是打补丁的意思，这个函数有两个功能，一个是根据 vnode 挂载 DOM，一个是根据新旧 vnode 更新 DOM。
  在创建的过程中，patch 函数接受多个参数：


  第一个参数 n1 表示旧的 vnode，当 n1 为 null 的时候，表示是一次挂载的过程；


  第二个参数 n2 表示新的 vnode 节点，后续会根据这个 vnode 类型执行不同的处理逻辑；


  第三个参数 container 表示 DOM 容器，也就是 vnode 渲染生成 DOM 后，会挂载到 container 下面。


  对于渲染的节点，我们这里重点关注两种类型节点的渲染逻辑：对组件的处理和对普通 DOM 元素的处理。

