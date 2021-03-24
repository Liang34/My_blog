## express中间件的原理：

express的中间件机制类似一个漏斗装置，一个请求到达服务端后，这个请求会被抽象成一个`req`对象，这个对象会一次进入中间件，在中间件中分别被处理，最后被路由处理函数分发。 

```js
var http = require('http');

function express() {
    var funcs = []; // 待执行的函数数组
    var app = function (req, res) {
        var i = 0;
        function next() {
            var task = funcs[i++];  // 取出函数数组里的下一个函数
            if (!task) {    // 如果函数不存在,return
                return;
            }
            task(req, res, next);   // 否则,执行下一个函数
        }
        next();
    }
    app.use = function (task) {
        funcs.push(task);
    }
    return app;    // 返回实例
}

var app = express();

function middlewareA(req, res, next) {
    console.log('中间件1');
    next();
}

function middlewareB(req, res, next) {
    console.log('中间件2');
    next();
}

function middlewareC(req, res, next) {
    console.log('中间件3');
    next();
}
app.use(middlewareA);
app.use(middlewareB);
app.use(middlewareC);

http.createServer(app).listen('3000', function () {
    console.log('listening 3000....');
});
```

以上代码便是express实现中间件机制的核心代码。

简单来说，有如下几点：

1. express函数调用返回一个app实例
2. 在express函数内部定义一个数组来存储中间件函数
3. 在express函数内部定义一个app函数
4. 在app函数的内部定义一个变量i保存执行的中间件的位置。
5. 在app函数中定义一个next方法，这个方法通过i值自增调用中间件
6. 在app函数内部调用next
7. 在app函数上定义一个use方法，这个方法可以将中间件函数push进中间件数组中。

中间件越多嵌套的层级越多。

以上便是express中间件的简单实现与原理。希望大家跟着文章中的代码敲一遍，有问题或者其他想法可以留言。

https://cloud.tencent.com/developer/article/1467265