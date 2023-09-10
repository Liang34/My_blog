## JS函数式编程

### 纯函数：

- 确定的输入，一定会产生确定的输出；
- 函数在执行过程中，不能产生副作用；（表示在**执行一个函数**时，除了返回值数值之外，还**对调用函数产生了附加的影响**，比如**修改了全局变量，修改参数**或者**改变外部的存储**）

#### 案例：

`slice`: 返回一个新生成的数组，没有操作原数组，是一个纯函数；

`splice`:截取数组，会返回一个新数组，会修改原数组，不是一个纯函数；

#### 纯函数的优势：

纯函数保证了开发者可以**安心的编写**（只需实现自己的业务，不需关心传入的内容是如何获得的或者依赖其他的外部变量是否已经发生了修改）和**安心的使用**（在用的时候，确定自己输入的内容不会被任意篡改，并且确定的输入会有确定的输出）

### JS柯里化：

只传递给函数一部分参数来调用它，让它返回一个函数去处理剩余的参数，这个过程就叫做柯里化。

```js
// 未柯里化的函数
function add(x, y, z) {
    return x+y+z
}
// 柯里化处理的函数
function addCur(x){
    return function(y) {
        return function(z) {
            return x+y+z
        }
    }
}
// 也可以写为
const addCur = x => y => z => x + y + z
```

#### 柯里化的作用：

- 复用参数逻辑

  - ```js
    function makeAdder(num) {
        return function(count) {
            return num + count
        }
    }
    var add5 = makeAdder(5)
    add5(10)
    add5(100)
    var add10 = makeAdder(10)
    add10(10)
    add10(100)
    ```

- 打印日志柯里化

  - ```js
    // 柯里化前
    function log(date, type, message) {
      console.log(`[${date.getHours()}:${date.getMinutes()}][${type}]: [${message}]`)
    }
    log(new Date(), "DEBUG", "查找到轮播图的bug")
    log(new Date(), "DEBUG", "查询菜单的bug")
    log(new Date(), "DEBUG", "查询数据的bug")
    // 柯里化
    var log = date => type => message => {
      console.log(`[${date.getHours()}:${date.getMinutes()}][${type}]: [${message}]`)
    }
    // 如果我现在打印的都是当前时间
    var nowLog = log(new Date())
    nowLog("DEBUG")("查找到轮播图的bug")
    nowLog("FETURE")("新增了添加用户的功能")
    ```

#### 柯里化函数的实现：

怎样将一个非柯里化函数转化为柯里化函数：

```js
function currying(fn) {
    return function curried(...args) {
        // 当已经传入的参数 大于等于 需要的参数时, 就执行函数
        if(args.length >= fn.length) {
            return fn.apply(this, args)
        } else {
            // 没有达到个数时, 需要返回一个新的函数, 继续来接收的参数
      		return function curried2(...args2) {
            	return function curry(...args2) {
                	// 接收到参数后, 需要递归调用curried来检查函数的个数是否达到
                	curried.apply(this, args.concat(args2))
            	}
        }
    }
}
```

### 组合函数

组合（Compose）函数是在`JavaScript`开发过程中一种对函数的使用技巧、模式：

比如对**某一个数据**进行**函数的调用**，执行两个函数`fn1`和`fn2`,这两个函数是依次执行的；如果每次都需要进行两个函数的调用，操作上就会显得重复，那么就可以将这两个函数组合起来，自动依次调用；这个过程就称为组合函数；

```js
// Compose前
function double(num) {
  return num * 2
}
function square(num) {
  return num ** 2
}
var count = 10
var result = square(double(count))
console.log(result)
// Compose:简单版
function ComposeFn(fn1, fn2) {
    return function(count) {// count: 某一数据
        return fn2(fn1(count))
    }
}
var newFn = composeFn(double, square)
concole.log(newFn(10))
```

组合函数的实现：

```js
function myCompose(...fns) {
  var length = fns.length
  for (var i = 0; i < length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError("Expected arguments are functions")
    }
  }
  function compose(...args) {
    var index = 0
    var result = length ? fns[index].apply(this, args): args
    while(++index < length) {
      result = fns[index].call(this, result)
    }
    return result
  }
  return compose
}
// 也可以用reduce来实现
function myCompose(...fns) {
  var length = fns.length
  // 验证参数
  for (var i = 0; i < length; i++) {
    if (typeof fns[i] !== 'function') {
      throw new TypeError("Expected arguments are functions")
    }
  }
  return function(...args) {
      return fns.reduce((prev, item) => {
          return item.call(this, prev)
      }, args)
  }
}
```



