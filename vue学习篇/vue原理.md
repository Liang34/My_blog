#### 1、对于MVVM的理解

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311215944997.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDkyMDg2Mw==,size_16,color_FFFFFF,t_70)

-  传统的 MVC 指的是,用户操作会请求服务端路由，路由会调用对应的控制器来处理,控制器会获取数 据。将结果返回给前端,页面重新渲染 
- MVVM :传统的前端会将数据手动渲染到页面上, MVVM 模式不需要用户收到操作 dom 元素,将数据绑 定到 viewModel 层上，会自动将数据渲染到页面中，视图变化会通知 viewModel层 更新数据。 ViewModel 就是我们 MVVM 模式中的桥梁.  

在MVC里，View是可以直接访问Model的。从而，View里会包含Model信息，不可避免的还要包括一些业务逻辑。 

MVC模型关注的是Model的不变，所以，在MVC模型里，Model不依赖于View，但是 View是依赖于Model的。

不仅如此，因为有一些业务逻辑在View里实现了，导致要更改View也是比较困难的，至少那些业务逻辑是无法重用的。

MVVM在概念上是真正将页面与数据逻辑分离的模式，它把数据绑定工作放到一个JS里去实现，而这个JS文件的主要功能是完成数据的绑定，即把model绑定到UI的元素上。

使用Angular（MVVM）代替Backbone（MVC）来开发，代码可以减少一半。

此外，MVVM另一个重要特性，双向绑定。它更方便你同时维护页面上都依赖于某个字段的N个区域，而不用手动更新它们。

#### 2、请说一下响应式数据的原理？

- 对象内部通过defineReactive方法，使用Object.definePrototype将属性进行劫持(只会劫持已经存在的属性)，多层对象是通过递归来实现劫持，数组则是通过重写数组方法来实现(如果用defineProperty性能会非常差)。


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

- Vue如何检测数组变化


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

#### 3、为何Vue采用异步渲染?  

-  因为如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染.所以为了性能考虑。 Vue 会在本轮数据更新后，再去异步更新视图!  
- 原理：
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311220009524.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDkyMDg2Mw==,size_16,color_FFFFFF,t_70)

```js
update() {
    /* istanbul ignore else */
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        this.run()
    } else {
        queueWatcher(this); // 当数据发生变化时会将watcher放到一个队列中批量更新
    }
}
export function queueWatcher(watcher: Watcher) {
    const id = watcher.id // 会对相同的watcher进行过滤
    if (has[id] == null) {
        has[id] = true
        if (!flushing) {
            queue.push(watcher)
        } else {
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
                i--
            }
            queue.splice(i + 1, 0, watcher)
        }
        // queue the flush
        if (!waiting) {
            waiting = true
            if (process.env.NODE_ENV !== 'production' && !config.async) {
                flushSchedulerQueue()
                return
            }
            nextTick(flushSchedulerQueue) // 调用nextTick方法 批量的进行更新
        }
    }
}
```

#### 4、nextTick实现原理

 理解:(宏任务和微任务) 异步方法 

nextTick 方法主要是使用了**宏任务**和**微任务**,定义了一个异步方法.多次调用 nextTick 会将方法存入 队列中，通过这个异步方法清空当前队列。 所以这个 nextTick 方法就是异步方法  

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311220027205.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDkyMDg2Mw==,size_16,color_FFFFFF,t_70)

```js
let timerFunc // 会定义一个异步方法
if (typeof Promise !== 'undefined' && isNative(Promise)) { // promise
    const p = Promise.resolve()
    timerFunc = () => {
        p.then(flushCallbacks)
        if (isIOS) setTimeout(noop)
    }
    isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && ( // MutationObserver
        isNative(MutationObserver) ||
        MutationObserver.toString() === '[object MutationObserverConstructor]'
    )) {
    let counter = 1
    const observer = new MutationObserver(flushCallbacks)
    const textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        counter = (counter + 1) % 2
        textNode.data = String(counter)
    }
    isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined') { // setImmediate
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => { // setTimeout
        setTimeout(flushCallbacks, 0)
    }
}
// nextTick实现
export function nextTick(cb ? : Function, ctx ? : Object) {
    let _resolve
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx)
            } catch (e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })
    if (!pending) {
        pending = true
        timerFunc()
    }
}
```

####  5、Vue中Computed的特点  

-  默认 computed 也是一个 watcher 是具备缓存的，只要当依赖的属性发生变化时才会更新视图  

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311220041761.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDkyMDg2Mw==,size_16,color_FFFFFF,t_70)

```js
function initComputed(vm: Component, computed: Object) {
    const watchers = vm._computedWatchers = Object.create(null)
    const isSSR = isServerRendering()
    for (const key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        if (!isSSR) {
            // create internal watcher for the computed property.
            watchers[key] = new Watcher(
                vm,
                getter || noop,
                noop,
                computedWatcherOptions
            )
        }
        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
            defineComputed(vm, key, userDef)
        } else if (process.env.NODE_ENV !== 'production') {
            if (key in vm.$data) {
                warn(`The computed property "${key}" is already defined in data.`, vm)
            } else if (vm.$options.props && key in vm.$options.props) {
                warn(`The computed property "${key}" is already defined as a prop.`, vm)
            }
        }
    }
}

function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) { // 如果依赖的值没发生变化,就不会重新求值
                watcher.evaluate()
            }
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}
```

#### 6、 Watch中的deep:true 是如何实现的 

 当用户指定了 watch 中的deep属性为 true 时，如果当前监控的值是数组类型。会对对象中的每 一项进行求值，此时会将当前 watcher 存入到对应属性的依赖中，这样数组中对象发生变化时也 会通知数据更新 。

```js
get() {
    pushTarget(this) // 先将当前依赖放到 Dep.target上
    let value
    const vm = this.vm
    try {
        value = this.getter.call(vm, vm)
    } catch (e) {
        if (this.user) {
            handleError(e, vm, `getter for watcher "${this.expression}"`)
        } else {
            throw e
        }
    } finally {
        if (this.deep) { // 如果需要深度监控
            traverse(value) // 会对对象中的每一项取值,取值时会执行对应的get方法
        }
        popTarget()
    }
    return value
}

function _traverse(val: any, seen: SimpleSet) {
    let i, keys
    const isA = Array.isArray(val)
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
        return
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id
        if (seen.has(depId)) {
            return
        }
        seen.add(depId)
    }
    if (isA) {
        i = val.length
        while (i--) _traverse(val[i], seen)
    } else {
        keys = Object.keys(val)
        i = keys.length
        while (i--) _traverse(val[keys[i]], seen)
    }
}
```

#### 7、Vue的生命周期

- 在 `beforeCreate` 钩子函数调用的时候，是获取不到 `props` 或者 `data` 中的数据的，因为这些数据的初始化都在 `initState` 中。
- 然后会执行 `created` 钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的。可以在该函数**进行异步请求**操作。
- 接下来会先执行 `beforeMount` 钩子函数，开始创建 VDOM，最后执行 `mounted` 钩子，并将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。
- 接下来是数据更新时会调用的钩子函数 `beforeUpdate` 和 `updated`，分别在数据更新前和更新后会调用。
- 另外还有 `keep-alive` 独有的生命周期，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `actived` 钩子函数。
- 最后就是销毁组件的钩子函数 `beforeDestroy` 和 `destroyed`。前者适合**移除事件、定时器**、 **可能在当前页面中使用了 $on 方法，那需要在组件销毁前解绑。**  等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 `destroyed` 钩子函数。

#### 8、Vue中模板编译原理（该过程是将`template`转化成`render`函数)

```js
function baseCompile(
  template: string,
  options: CompilerOptions
) {
  const ast = parse(template.trim(), options) // 1.将模板转化成ast语法树
  if (options.optimize !== false) {           // 2.优化树（静态节点优化）
    optimize(ast, options)
  }
  const code = generate(ast, options)         // 3.生成树
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

模板变成`render`函数的过程：

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
let root;
let currentParent;
let stack = []

function createASTElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1,
        children: [],
        attrs,
        parent: null
    }
}

function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs);
    if (!root) {
        root = element;
    }
    currentParent = element;
    stack.push(element);
}

function chars(text) {
    currentParent.children.push({
        type: 3,
        text
    })
}

function end(tagName) {
    const element = stack[stack.length - 1];
    stack.length--;
    currentParent = stack[stack.length - 1];
    if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element)
    }
}

function parseHTML(html) {
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1])
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }

    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);
            let attr, end
            while (!(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3]
                })
            }
            if (end) {
                advance(end[0].length);
                return match
            }
        }
    }
}
// 生成语法树
parseHTML(`<div id="container"><p>hello<span>zf</span></p></div>`);
function gen(node) {
    if (node.type == 1) {
        return generate(node);
    } else {
        return `_v(${JSON.stringify(node.text)})`
    }
}

function genChildren(el) {
    const children = el.children;
    if (el.children) {
        return `[${children.map(c=>gen(c)).join(',')}]`
    } else {
        return false;
    }
}

function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        str += `${attr.name}:${attr.value},`;
    }
    return `{attrs:{${str.slice(0,-1)}}}`
}

function generate(el) {
    let children = genChildren(el);
    let code = `_c('${el.tag}'${
el.attrs.length? `,${genProps(el.attrs)}`:''
}${
children? `,${children}`:''
})`;
    return code;
}
// 根据语法树生成新的代码
let code = generate(root);
let render = `with(this){return ${code}}`;
// 包装成函数
let renderFn = new Function(render);// 模板引擎的实现原理
console.log(renderFn.toString());
```

虚拟DOM与AST的区别：

- 虚拟DOM是描述真实节点的

- AST是用对象描述HTML或者JS语法的，表示不了DOM结构，只能表示HTML语法（VNode+data)

####  9.Vue中v-if和v-show的区别  

-  v-if 如果条件不成立不会渲染当前指令所在节点的 dom 元素 
- v-show 只是切换当前 dom 的显示或者隐藏  

```js
const VueTemplateCompiler = require('vue-template-compiler');
let r1 = VueTemplateCompiler.compile(`<div v-if="true"><span v-for="i in 3">hello</span></div>`);

with(this) {
    return (true) ? _c('div', _l((3), function (i) {
        return _c('span', [_v("hello")])
    }), 0) : _e() // _e():表示直接创建一个空节点
}
```

v-show会编译成一个指令,代码：

```js
const VueTemplateCompiler = require('vue-template-compiler');
let r2 = VueTemplateCompiler.compile(`<div v-show="true"></div>`);
with(this) {
    return _c('div', {
        directives: [{
            name: "show",
            rawName: "v-show",
            value: (true),
            expression: "true"
        }]
    })
}
// v-show 操作的是样式 定义在platforms/web/runtime/directives/show.js
bind(el: any, {
    value
}: VNodeDirective, vnode: VNodeWithData) {
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    const originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display
    if (value && transition) {
        vnode.data.show = true
        enter(vnode, () => {
            el.style.display = originalDisplay
        })
    } else {
        el.style.display = value ? originalDisplay : 'none'
    }
}
```

####  10.为什么V-for和v-if不能连用 

```js
const VueTemplateCompiler = require('vue-template-compiler');
let r1 = VueTemplateCompiler.compile(`<div v-if="false" v-for="i in 3">hello</div>`);
with(this) {
    return _l((3), function (i) { // 先循环三次后判断条件
        return (false) ? _c('div', [_v("hello")]) : _e()
    })
}
console.log(r1.render);
```

v-for 会比 v-if 的优先级高一些,如果连用的话会把 v-if 给每个元素都添加一下,会造成性能问题 。

####  11.用vnode来描述一个DOM结构 

 虚拟节点就是用一个对象来描述真实的 dom 元素 

```js
function $createElement(tag, data, ...children) {
    let key = data.key;
    delete data.key;
    children = children.map(child => {
        if (typeof child === 'object') {
            return child
        } else {
            return vnode(undefined, undefined, undefined, undefined, child)
        }
    })
    return vnode(tag, props, key, children);
}
export function vnode(tag, data, key, children, text) {
    return {
        tag, // 表示的是当前的标签名
        data, // 表示的是当前标签上的属性
        key, // 唯一表示用户可能传递
        children,
        text
    }
}
```

Template =》 ast树 =》 代码生成 =》 render（）=》内部调用_c方法 =》虚拟DOM

####  12.diff算法的时间复杂度  

- 两个树的完全的 diff 算法是一个时间复杂度为 O(n3) , Vue 进行了优化·O(n3) 复杂度的问题转换成 O(n) 复杂度的问题(只比较同级不考虑跨级问题) 在前端当中， 你很少会跨越层级地移动Dom元素。 所 以 Virtual Dom只会对同一个层级的元素进行对比。  

####  13.简述Vue中diff算法原理 

1、先同级比价，在比较子节点

2、一方有子节点，另一方没有子节点

- 新的vnode有则直接插入
- 老的有，新的没有，直接把老的删掉

3、两个都有孩子的情况

4、递归比较子节点

vue的双指针优化：即新旧树均含有两个指针

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210311220110759.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDkyMDg2Mw==,size_16,color_FFFFFF,t_70)

第一种情况：只在结尾处新增一个节点

两个指针先指向新旧树的开头，如果相同则继续比较下去，到最后发现新增了一个节点则直接插入

第二种情况：在头处新增了一个节点

由于相比较头结点不相同，而尾结点相同，则尾结点向前移动，直到发现新节点E，把E插进旧节点

第三种情况：最后一个节点移到了头结点

此时头与头、尾与尾均不同，此时会将当前的头去与尾相比较，相同则把旧的D移到头部，旧的尾指针向前移动，新的头指针向后移动，然后头一直向下移动

第四种情况：头移到尾上去

此时和第三种情况差不多，结尾与开头相比即可。

第五种情况：依靠key来优化

代码：

 core/vdom/patch.js 

```js
const oldCh = oldVnode.children // 老的儿子
const ch = vnode.children // 新的儿子
if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
        // 比较孩子
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue,
            removeOnly)
    } else if (isDef(ch)) { // 新的儿子有 老的没有
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) { // 如果老的有新的没有 就删除
        removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) { // 老的有文本 新的没文本nodeOps.setTextContent(elm, '') // 将老的清空
    }
} else if (oldVnode.text !== vnode.text) { // 文本不相同替换
    nodeOps.setTextContent(elm, vnode.text)
}

function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue,
    removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm
    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly
    if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(newCh)
    }
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx]
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh,
                newStartIdx)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh,
                newEndIdx)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh,
                newEndIdx)
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm,
                nodeOps.nextSibling(oldEndVnode.elm))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh,
                newStartIdx)
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm,
                oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        } else {
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh,
                oldStartIdx, oldEndIdx)
            idxInOld = isDef(newStartVnode.key) ?
                oldKeyToIdx[newStartVnode.key] :
                findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
            if (isUndef(idxInOld)) { // New element
                createElm(newStartVnode, insertedVnodeQueue, parentElm,
                    oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
                vnodeToMove = oldCh[idxInOld]
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh,
                        newStartIdx)
                    oldCh[idxInOld] = undefined
                    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm,
                        oldStartVnode.elm)
                } else {
                    // same key but different element. treat as new element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm,
                        oldStartVnode.elm, false, newCh, newStartIdx)
                }
            }
            newStartVnode = newCh[++newStartIdx]
        }
    }
    if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx,
            insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
}
```



