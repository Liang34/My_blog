## jsonp

#### 1）JSONP 原理：

利用 script 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。

#### 2）JSONP 和 AJAX 对比：

JSONP 和 AJAX 相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但 AJAX 属于同源策略，JSONP 属于非同源策略（跨域请求）

#### 3）JSONP 优缺点：

JSONP 优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。**缺点是仅支持 get 方法具有局限性,不安全可能会遭受 CSRF攻击。**

#### 4）JSONP 的实现流程

- 声明一个回调函数，其函数名(如 show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的 data)。
- 创建一个script标签，把那个跨域的 API 数据接口地址，赋值给 script 的 src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。
- 服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是 show，它准备好的数据是show('我不爱你')。
- 最后服务器把准备的数据通过 HTTP 协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。

在开发中可能会遇到多个 JSONP 请求的回调函数名是相同的，这时候就需要自己封装一个 JSONP 函数。

```js
function jsonp({url, params, callback}) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        window[callback] = function (data) {
            resolve(data)
            document.body.removeChild(script)
        }
        params = {
            ...params,
            callback
        } // wd=b&callback=show
        let arrs = []
        for (let key in params) {
            arrs.push(`${key}=${params[key]}`)
        }
        script.src = `${url}?${arrs.join('&')}`
        document.body.appendChild(script)
    })
}
jsonp({
    url: 'http://localhost:3000/say',
    params: {
        wd: 'Iloveyou'
    },
    callback: 'show'
}).then(data => {
    console.log(data)
})
```

上面这段代码相当于向http://localhost:3000/say?wd=Iloveyou&callback=show这个地址请求数据，然后后台返回show('我不爱你')，最后会运行 show()这个函数，打印出'我不爱你'

```JS
let express = require('express')
let app = express()
app.get('/say', function (req, res) {
    let {
        wd,
        callback
    } = req.query
    console.log(wd) // Iloveyou
    console.log(callback) // show
    res.end(`${callback}('我不爱你')`)
})
app.listen(3000)
```

#### 5)JSONP的问题：

**jsonp劫持**

jsonp是一个非官方的协议，利用script元素的开放策略，网页可以得到从其他来源动态产生的json数据，因此可以用来实现跨域。

web程序如果通过这种方式跨域之后，攻击者完全可以在自己的虚假页面中发起恶意的jsonp请求，这就引来了安全问题。比如：

```js
​```function` `useUserInfo(v){`` ``alert(v.username);``}`````"http://www.test.com/userinfo?callback=useUserInfo"``>`
```

如果服务器端的userinfo接口支持jsonp，那就会使虚假页面成功执行useUserInfo函数，从而导致安全问题。

**解决方法**

其实json劫持和jsonp劫持属于CSRF（ Cross-site request forgery 跨站请求伪造）的攻击范畴，所以解决的方法和解决csrf的方法一样。

1、验证 HTTP Referer 头信息；

```
HTTP Referer是header的一部分，当浏览器向web服务器发送请求的时候，一般会带上Referer，告诉服务器该网页是从哪个页面链接过来的，服务器因此可以获得一些信息用于处理。
```

2、在请求中添加 csrfToken 并在后端进行验证；