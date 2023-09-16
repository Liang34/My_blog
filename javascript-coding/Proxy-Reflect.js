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
  },
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
// console.log(objProxy.name)// 触发get方法
// objProxy.name = 'lm' // 触发set方法
// console.log('name' in objProxy)// 触发has
// delete objProxy.name
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
// fooProxy.apply({}, ['abc', 'adc'])
// new fooProxy("abc", "cba")
const obj1 = {
  name: "ljh",
  age: 18
}

const objProxy1 = new Proxy(obj1, {
  get: function(target, key, receiver) {
    return Reflect.get(target, key)
  },
  set: function(target, key, newValue, receiver) {
    target[key] = newValue
    const result = Reflect.set(target, key, newValue)// result == 'kobe'
  }
})

objProxy1.name = "kobe"
console.log(objProxy1.name)


