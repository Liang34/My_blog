## Map 和 Object 的不同

##### key不同

Object的key都会转化为字符串，Map的key可以是基础类型或者是引用类型

##### Map是有序结构

Object key 不能按照既定顺序输出

```js
// Object keys 是无序的
const data1 = {'1':'aaa','2':'bbb','3':'ccc','测试':'000'}
Object.keys(data1) // ["1", "2", "3", "测试"]

const data2 = {'测试':'000','1':'aaa','3':'ccc','2':'bbb'};
Object.keys(data2); // ["1", "2", "3", "测试"]
```

## WeakMap

WeakMap 也是弱引用。但是，**WeakMap 弱引用的只是键名 key ，而不是键值 value**。

```js
// 函数执行完，obj 会被销毁，因为外面的 WeakMap 是“弱引用”，不算在内
const wMap = new WeakMap()
function fn() {
    const obj = {
        name: 'zhangsan'
    }
    // 注意，WeakMap 专门做弱引用的，因此 WeakMap 只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。其他的无意义
    wMap.set(obj, 100) 
}
fn()
// 代码执行完毕之后，obj 会被销毁，wMap 中也不再存在。但我们无法第一时间看到效果。因为：
// 内存的垃圾回收机制，不是实时的，而且是 JS 代码控制不了的，因此这里不一定能直接看到效果。
```

另外，WeakMap 没有 `forEach` 和 `size` ，只能 `add` `delete` `has` 。因为弱引用，其中的 key 说不定啥时候就被销毁了，不能遍历。

WeakMap 可以做两个对象的关联关系，而不至于循环引用，例如：

## Set与数组

##### set的元素不能重复，数组可以

##### set是无顺序的，数组是有序的

## WeakSet

WeekSet 和 Set 类似，区别在于 —— 它不会对元素进行引用计数，更不容易造成内存泄漏。

【注意】内存的垃圾回收机制，不是实时的，而且是 JS 代码控制不了的，因此这里不一定能直接看到效果。
WeekSet 没有 `forEach` 和 `size`，只能 `add` `delete` 和 `has`。因为垃圾回收机制不可控（js 引擎看时机做垃圾回收），那其中的成员也就不可控。
