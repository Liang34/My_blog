自我介绍

react与vue的区别

1. 共同点
   1. 数据驱动视图
   2. 组件化
   3. 都使用Virtual DOM
2. 不同点
   1. diff算法不同
   2. 响应式原理不同(双向绑定)

讲下fiber

react18的并发模式

LRU实现：

```typescript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map()
    }

    get(key) {
        if(this.cache.has(key)) {
            const val = this.cache.get(key)
            this.cache.delete(key)
            this.cache.set(key, val)
            return this.cache.get(key) 
        }
        return -1
    }

    put(key, value) {
        this.cache.set(key, value)
        while(this.cache.size > this.capacity) {
            const lastKey = this.cache.keys().next().value
            this.cache.delete(lastKey)
        }
        return
    }
}

const cache = new LRUCache( 2 /* 缓存容量 */ );

console.log(cache.put(1, 1))
console.log(cache.put(2, 2))
console.log(cache.get(1))       // 返回  1
console.log(cache.put(3, 3))    // 该操作会使得密钥 2 作废
console.log(cache.get(2))       // 返回 -1 (未找到)
console.log(cache.put(4, 4))    // 该操作会使得密钥 1 作废
console.log(cache.get(1))       // 返回 -1 (未找到)
console.log(cache.get(3))       // 返回  3
console.log(cache.get(4))       // 返回  4
```

实现 TS 内置的 Pick，但不可以使用它。

从类型 T 中选择出属性 K，构造成一个新的类型。

```javascript
type MyPick<T, K extends keyof T> = {
    [P in K ]: T[P]
 }
```

实现洋葱模型


```typescript
// 问题：实现一个run方法，使得run(fucArr)能顺序输出1、2、3
const fucArr= [
  next=> { setTimeout(() => { console.log(1); next() }, 300)},
  next=> { setTimeout(() => { console.log(2); next() }, 200)},
  next=> { setTimeout(() => { console.log(3); next() }, 100)}
]
// 实现
const run = (arr) => {
  let i = 0
    const next = () => {
        const task = arr[i++]
        if(!task) {
            return
        }
        task(next)
    }
    next()
}
```
