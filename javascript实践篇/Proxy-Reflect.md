## 监听对象之Proxy

 *Proxy* 对象可以拦截目标对象的任意属性 :

##### 常见的get与set捕获器:

 set函数有四个参数： 

- target：目标对象（侦听的对象）

- property：将被设置的属性key

- value：新属性值

- receiver：调用的代理对象

get函数有三个参数 

-  target：目标对象（侦听的对象） 
-  property：被获取的属性key 
-  receiver：调用的代理对象

```js
const obj = {
  name: 'Ljh',
  age: 18
}
const objProxy = new Proxy(obj, {
  // 获取值值时的捕获器
  get: function(target, key) {
    console.log(`监听到${key}属性被访问了`, target)
    return target[key]
  },
  // 设置值时的捕获器
  set: function(target, key, newValue) {
    console.log(`监听到对象的${key}属性被设置值`, target)
    target[key] = newValue
  }
})
console.log(objProxy.name)// 触发get方法
objProxy.name = 'lm' // 触发set方法
```

##### 其他捕获器：

```js
const obj = {
  name: 'Ljh',
  age: 18
}
const objProxy = new Proxy(obj, {
  // 监听in的捕获器
  has: function(target, key) {
    console.log(`监听到对象的${key}属性in操作`, target)
    return key in target
  },

  // 监听delete的捕获器
  deleteProperty: function(target, key) {
    console.log(`监听到对象的${key}属性delete操作`, target)
    delete target[key]
  }
})
// in操作符
console.log("name" in objProxy)
// delete操作
delete objProxy.name
```

##### Proxy对函数的监听：

```js
function foo() {

}
const fooProxy = new Proxy(foo, {
  apply: function(target, thisArg, argArray) {
    console.log("对foo函数进行了apply调用")
    return target.apply(thisArg, argArray)
  },
  construct: function(target, argArray, newTarget) {
    console.log("对foo函数进行了new调用")
    return new target(...argArray)
  }
})
fooProxy.apply({}, ['abc', 'adc'])
new fooProxy("abc", "cba")
```

## Reflect

 Reflect也是ES6新增的一个API ，它主要提供了很多操作JavaScript对象的方法，有点像Object中操作对象的方法 

```js
Reflect.getPrototypeOf(target)类似于 Object.getPrototypeOf()；
Reflect.defineProperty(target, propertyKey, attributes)类似于Object.defineProperty() 
```

为什么需要Reflect

-  早期的ECMA规范中没有考虑到这种对 对象本身 的操作如何设计会更加规范，所以将这些API放到了Object上面 。
-  Object作为一个构造函数，这些操作实际上放到它身上并不合适 
-  另外还包含一些类似于 in、delete操作符，让JS看起来是会有一些奇怪的
-  所以在ES6中新增了Reflect，让我们这些操作都集中到了Reflect对象上；

[Object与Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)

Reflect中有常见的方法,它和Proxy是一一对应的，也是13个

reflect的使用：

```js

```

