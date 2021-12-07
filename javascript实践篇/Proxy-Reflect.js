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
console.log(obj.name)
