使用 setTimeout 实现 setInterval 的根本原因是：setTimeout 不管上次异步任务是否完成，它都会将当前异步任务推入队列（很容易理解，setTimeout本身就是一次调用一次执行），而 setInterval 则会在任务推入异步队列时判断上次异步任务是否被执行。
这就导致 setInterval 在做定时轮训时，出现耗时操作，或者调用的异步操作耗时会导致异步任务不按照期待的时间间隔执行。
setTimeout 保证调用的时间间隔是一致的，setInterval的设定的间隔时间包括了执行回调的时间。

使用 setTimeout 实现 setInterval

```js
let timer = null;
function interval(func, delay){
    let interFunc = function(){
        func.call(null);
        timer = setTimeout(interFunc, delay) // 递归调用
    }
    timer = setTimeout(interFunc, delay) // 触发递归
}
// 调用
interval(() => console.log("long"), 1000)
// 清除定时器
window.clearTimeout(timer)
```

```
注：期望在不引入全局变量timer的情况下停止定时器 // TODO。
interval 函数中两处使用delay参数，这两处是可以存在差异的，也就是第一次执行的间隔和后面代码执行的间隔可以不一样。

```