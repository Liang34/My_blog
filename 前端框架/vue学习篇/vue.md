## Vue常考知识点（基础）

#### 生命周期钩子函数

- 在 `beforeCreate` 钩子函数调用的时候，是获取不到 `props` 或者 `data` 中的数据的，因为这些数据的初始化都在 `initState` 中。
- 然后会执行 `created` 钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的。可以在该函数**进行异步请求**操作。
- 接下来会先执行 `beforeMount` 钩子函数，开始创建 VDOM，最后执行 `mounted` 钩子，并将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。
- 接下来是数据更新时会调用的钩子函数 `beforeUpdate` 和 `updated`，分别在数据更新前和更新后会调用。
- 另外还有 `keep-alive` 独有的生命周期，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `actived` 钩子函数。
- 最后就是销毁组件的钩子函数 `beforeDestroy` 和 `destroyed`。前者适合**移除事件、定时器**等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 `destroyed` 钩子函数。

#### 组件通信

- 父子通信

  - 父组件通过 `props` 传递数据给子组件，子组件通过 `emit` 发送事件传递数据给父组件，这两种方式是最常用的父子通信实现办法。

- 兄弟组件通信

  - 对于这种情况可以通过查找父组件中的子组件实现，也就是 `this.$parent.$children`，在 `$children` 中可以通过组件 `name` 查询到需要的组件实例，然后进行通信。

- 跨多层次组件通信

  - 可以使用 Vue 2.2 新增的 API `provide / inject`，虽然文档中不推荐直接使用在业务中，但是如果用得好的话还是很有用的。

  假设有父组件 A，然后有一个跨多层级的子组件 B

  ```js
  // 父组件 A
  export default {
    provide: {
      data: 1
    }
  }
  // 子组件 B
  export default {
    inject: ['data'],
    mounted() {
      // 无论跨几层都能获得父组件的 data 属性
      console.log(this.data) // => 1
    }
  }
  ```

- 任意组件

  - vuex

  - Event Bus: **这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级**。 

    ```js
    var Event=new Vue();
    Event.$emit(事件名,数据);
    Event.$on(事件名,data => {});
    ```

#### mixin 和 mixins 区别

 mixin就是全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。例如给全部文件添加一些公用的实例（如方法、过滤器等）
插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用。 

`mixins` 应该是我们最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 `mixins` 混入代码，比如上拉下拉加载数据这种逻辑等等。

另外需要注意的是 `mixins` 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并，具体可以阅读 [文档](https://cn.vuejs.org/v2/guide/mixins.html)。

https://www.imooc.com/article/303667

#### computed 和 watch 区别

`computed` 是计算属性，依赖其他属性计算值，并且 `computed` 的值有缓存，只有当计算值变化才会返回内容。

`watch` 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

所以一般来说需要依赖别的属性来动态获得值的时候可以使用 `computed`，对于监听到值的变化需要做一些复杂业务逻辑的情况可以使用 `watch`。

另外 `computed` 和 `watch` 还都支持对象的写法，这种方式知道的人并不多。

```js
vm.$watch('obj', {
    // 深度遍历
    deep: true,
    // 立即触发
    immediate: true,
    // 执行的函数
    handler: function(val, oldVal) {}
})
var vm = new Vue({
  data: { a: 1 },
  computed: {
    aPlus: {
      // this.aPlus 时触发
      get: function () {
        return this.a + 1
      },
      // this.aPlus = 1 时触发
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
```

#### keep-alive 组件有什么作用

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 `keep-alive` 组件包裹需要保存的组件。

对于 `keep-alive` 组件来说，它拥有两个独有的生命周期钩子函数，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `actived` 钩子函数。

#### v-show 与 v-if 区别

`v-show` 只是在 `display: none` 和 `display: block` 之间切换。无论初始条件是什么都会被渲染出来，后面只需要切换 CSS，DOM 还是一直保留着的。所以总的来说 `v-show` 在初始渲染时有更高的开销，但是切换开销很小，更适合于频繁切换的场景。

`v-if` 的话就得说到 Vue 底层的编译了。当属性初始为 `false` 时，组件就不会被渲染，直到条件为 `true`，并且切换条件时会触发销毁/挂载组件，所以总的来说在切换时开销更高，更适合不经常切换的场景。

并且基于 `v-if` 的这种惰性渲染机制，可以在必要的时候才去渲染组件，减少整个页面的初始渲染开销。

#### 组件中 data 什么时候可以使用对象

组件复用时所有组件实例都会共享 `data`，如果 `data` 是对象的话，就会造成一个组件修改 `data` 以后会影响到其他所有组件，所以需要将 `data` 写成函数，每次用到就调用一次函数获得新的数据。

当我们使用 `new Vue()` 的方式的时候，无论我们将 `data` 设置为对象还是函数都是可以的，因为 `new Vue()` 的方式是生成一个根组件，该组件不会复用，也就不存在共享 `data` 的情况了。

#### 为什么列表渲染建议设置属性key

key这个特殊属性主要作用在虚拟DOM算法中，在对比新旧虚拟节点时识虚拟节点。在更新节点时，需要从旧虚拟节点列表中查找新虚拟节点相同的节点进行更新。如果这个查找过程设置了属性key，那么查找速度会快很多。

示例：

```js
<div v-for = "item in items" :key="item.id"></div>
```

对于MVVM的理解

Model代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑。
View 代表UI 组件，它负责将数据模型转化成UI 展现出来。
ViewModel 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步View 和 Model的对象，连接Model和View。
在MVVM架构下，View 和 Model 之间并没有直接的联系，而是通过ViewModel进行交互，Model 和 ViewModel 之间的交互是双向的， 因此View 数据的变化会同步到Model中，而Model 数据的变化也会立即反应到View 上。
ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而View 和 Model 之间的同步工作完全是自动的，无需人为干涉，因此开发者只需关注业务逻辑，不需要手动操作DOM, 不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。 

## Vue常考的知识点（进阶篇）

### 对于响应式数据的理解？

数组和对象类型当值变化时如何劫持到，对象内部通过defineReactive方法，使用Object.definePrototype将属性进行劫持(只会劫持已经存在的属性)，多层对象是通过递归来实现劫持，数组则是通过重写数组方法来实现(如果用defineProperty性能会非常差)。

```js
<div id="app"></div>
<script>
    let state = {count : 1}
    let active
    const defineReactive = (obj) => {
      for(let key in obj) {
          let value = obj[key] // 对象对应的值
          let dep = []
          Object.defineProperty(obj, key, {
              get() {
                if(active) {
                    dep.push(active) // 依赖收集
                }
                return value
              },
              set(newValue) { // 触发更新
                value = newValue
                // 通知更新
                dep.forEach(watcher => watcher())
              } 
          })
      }
    }
    defineReactive(state)
    // 插入到页面的功能，需要保存起来
    const watcher = (fn)=>{
        active = fn
        fn() // 调用函数
        active = null // 后续不在watcher中取值，不触发收集依赖
    }
    watcher(()=>{
        document.getElementById('app').innerHTML = state.count // 取值
    })
    watcher(() => {
        console.log(state.count)
    })
    state.count = 2 // 会直接调用watcher
</script>
```

补充：

内部依赖收集实现：每个属性都有自己的dep属性，存放他所依赖的watcher，当属性变化后会通知自己对应的watcher去更新。

引出性能优化相关：

（1）对象层级过深，性能就会差

（2）不需要响应数据的内容不要放到data中

（3）Object。freeze()可以冻结数据

缺陷：

getter/setter只能追踪一个数据是否被修改，无法追踪新增属性和删除属性，为了解决这个问题`Vue.js`提供了两个API——vm.$set 与 vm.$delete

Vue如何检测数组变化

数组考虑性能原因没有用defineProperty对数组的每一项进行拦截，而是选择重写数组(push、shift、pop、splice、unshift、sort、reverse)方法进行重写。

在Vue中修改数组的索引和长度是无法监控到的，需要通过以上7种变异方法才会触发数组对应的watcher进行更新，数组中如果是对象数据类型也会进行递归劫持。

```
如果想更改索引更新数据可以通过Vue.$set()来进行处理=>核心内部用的是splice方法
```

```js
<div id="app"></div>
<script>
    let state = [1, 2, 3] // 变成响应式的数据
    let originalArray = Array.prototype // 数组原来的方法
    // 不是深拷贝
    let arrayMethods = Object.create(originalArray)
    const defineReactive = (obj) => {
      // 函数劫持
      arrayMethods.push = function(...args) {
          originalArray.push.call(this, ...args)
          render()
      }
      obj.__proto__ = arrayMethods // 不行可以循环赋值
    }
    defineReactive(state)
    // 插入到页面的功能，需要保存起来
    const render = ()=>{
        document.getElementById('app').innerHTML = state
    }
    render()
    setTimeout(()=>{
        state.push(4) // 自动更新视图
    }, 1000)
</script>
```





#### 响应式原理

Vue 内部使用了 `Object.defineProperty()` 来实现数据响应式，通过这个函数可以监听到 `set` 和 `get` 的事件。

```js
var data = { name: 'LiHUa' }
observe(data)
let name = data.name // -> get value
data.name = 'yyy' // -> change value

function observe(obj) {
  // 判断类型
  if (!obj || typeof obj !== 'object') {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: true,// 可配置
    // 自定义函数
    get: function reactiveGetter() {
      console.log('get value')
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
    }
  })
}
```

以上代码简单的实现了如何监听数据的 `set` 和 `get` 的事件，但是仅仅如此是不够的，因为自定义的函数一开始是不会执行的。只有先执行了依赖收集，才能在属性更新的时候派发更新，所以接下来我们需要先触发依赖收集。

```html
<div>
    {{name}}
</div>
```

在解析如上模板代码时，遇到 `{{name}}` 就会进行依赖收集。

接下来我们先来实现一个 `Dep` 类，用于解耦属性的依赖收集和派发更新操作。

```js
// 通过 Dep 解耦属性的依赖和更新操作
class Dep {
  constructor() {
    this.subs = []
  }
  // 添加依赖
  addSub(sub) {
    this.subs.push(sub)
  }
  // 更新
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null
```

以上的代码实现很简单，当需要依赖收集的时候调用 `addSub`，当需要派发更新的时候调用 `notify`。

接下来我们先来简单的了解下 Vue 组件挂载时添加响应式的过程。在组件挂载时，会先对所有需要的属性调用 `Object.defineProperty()`，然后实例化 `Watcher`，传入组件更新的回调。在实例化过程中，会对模板中的属性进行求值，触发依赖收集。

因为这一小节主要目的是学习响应式原理的细节，所以接下来的代码会简略的表达触发依赖收集时的操作。

```
class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
    // 调用 update 方法更新 Dom
    this.cb(this.value)
  }
}
```

以上就是 `Watcher` 的简单实现，在执行构造函数的时候将 `Dep.target` 指向自身，从而使得收集到了对应的 `Watcher`，在派发更新的时候取出对应的 `Watcher` 然后执行 `update` 函数。

接下来，需要对 `defineReactive` 函数进行改造，在自定义函数中添加依赖收集和派发更新相关的代码。

```js
function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  let dp = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target)
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
      // 执行 watcher 的 update 方法
      dp.notify()
    }
  })
}
```

以上所有代码实现了一个简易的数据响应式，核心思路就是手动触发一次属性的 getter 来实现依赖收集。

现在我们就来测试下代码的效果，只需要把所有的代码复制到浏览器中执行，就会发现页面的内容全部被替换了。

```js
var data = { name: 'yck' }
observe(data)
function update(value) {
  document.querySelector('div').innerText = value
}
// 模拟解析到 `{{name}}` 触发的操作
new Watcher(data, 'name', update)
// update Dom innerText
data.name = 'yyy' 
```



