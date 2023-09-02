## composition API

### setup函数

用于代替`vue2`option API中的` methods、computed、watch、data、生命周期 `等等

函数的参数：

- props:  父组件传递过来的属性会被放到props对象中，我们在setup中如果需要使用，那么就可 以直接通过props参数获取,  对于props的定义还是和vue2一样，在template中直接使用即可，在setup函数中想要使用props不可使用this去获取（因为源码中对this作了绑定,this并不指向组件实例，  props有直接作为参数传递到setup函数中，所以我们可以直接通过参数来使用即可 。
- context： 包含三个属性
  - attrs：  所有的非prop的attribute； 
  - slots： 父组件传递过来的插槽（这个在以渲染函数返回时会有作用 ）
  -  emit：当我们组件内部需要发出事件时会用到emit 

函数的返回值：
- setup的返回值可以在模板template中被使用；
-  可以通过setup的返回值来替代data选项 , 也可以返回一个执行函数来代替在methods中定义的方法 
- 当在setup中定义的变量是非响应式的。

### Reactive API

在setup中定义响应式数据可以通过reactive函数：

```js
const state = reactive({
	name: 'vue',
    age: 3
})
```

### Ref API

reactive的传入对象必须是对象或者数组类型，而ref API可以传基本数据类型。

```js
const message = ref('vue3 ref')
```

-  在模板中引入ref的值时，Vue会自动帮助我们进行解包操作，所以我们并不需要在模板中通过 `ref.value` 的方式 来使用
-  在 setup 函数内部，它依然是一个 ref引用， 所以对其进行操作时，我们依然需要使用 `ref.value`的方式 

### readonly

 readonly会返回原生对象的只读代理（也就是它依然是一个Proxy，这是一个proxy的set方法被劫持，并且不 能对其进行修改)

