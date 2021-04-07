先上代码：

```js
const fs = require('fs');
fs.readFile('./index.json', () => {
  setTimeout(() => {
    console.log('fs =》timeout');
  });
  setImmediate(() => {
    console.log('fs =》setImmediate');
  });
});
setImmediate(function () {
    console.log('setImmediate延迟执行'); 
});
setTimeout(function () {
    console.log('setTimeout延迟执行'); 
});
process.nextTick(function () { 
    console.log('nextTick延迟执行');
});
console.log('正常执行');
```

正确的结果：

```txt
正常执行
nextTick延迟执行
setTimeout延迟执行
setImmediate延迟执行
fs =》setImmediate
fs =》timeout
```

why?

执行计时器的顺序将根据调用它们的上下文而异。如果二者都从主模块内调用，则计时将受进程性能的约束（这可能会受到计算机上运行的其它应用程序的影响）。

例如，如果运行的是不属于 I/O 周期（即主模块）的以下脚本，则执行两个计时器的顺序是非确定性的，因为它受进程性能的约束

`结论`

```
在文件I/O 、 网络I/O中setImmediate会 先于 settimeout 
否则一般情况下 setTimeout  会先于 setImmediate
```

