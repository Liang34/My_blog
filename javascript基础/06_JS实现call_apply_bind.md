## Call

#### 定义：

>  call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。 

#### 实现原理：

其实就是将被调用的函数添加到对象中去调用，在调用结束后获取结果再将该函数删掉即可。

#### 实现代码：

```js
Function.prototype.myCall = function(context) {
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    context.fn = this // this即被调用的函数
    const res = eval('context.fn(' + args +')'); // 此时this指向context对象
    delete context.fn
    return res
}
```

## Apply

#### 定义：

> 与Call的作用差不多，只不过除对象外必须传一个数组

#### 实现原理：

> 实现思路与Call大体一致，如果第二个参数为空直接调用，不为空则直接按Call的方式处理即可。

#### 实现代码：

```js
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

## bind:

#### 定义：

>  bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数 

#### 实现原理：

> 关于this的指向我们可以用call或者apply来实现。注意传参数的问题，在bind返回的函数中也可以保存参数，我们可以用argument来处理即可。

#### 实现代码：

```js
Function.prototype.bind2 = function (context) {
    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(context, args.concat(bindArgs));
    }
}
```



