## webSocket协议详解及报文分析

### webSock协议概述

WebSocket是web浏览器和服务器之间的一种全双工通信协议，一旦Web客户端与服务器建立连接，之后的全部数据都通过这个连接进行。通信过程中，可互相发送`JSON`、`XML`、`HTML`或者图片等任意格式。

### WS相比于HTTP：

- 相同点
  - 都是基于TCP协议
  - 都使用Request/Response模型进行连接的建立
  - 在连接的建立过程中对错误的处理方式相同，在这个阶段WS可能返回和HTTP相同的状态码
  - 都可以在网络中传输数据
- 不同点
  - WS使用HTTP来建立连接，但是定义了一系列新的header域，这些域在HTTP中并不会使用；
  - WS的连接不能通过中间人来转发，它必须是一个直接连接；
  - WS连接建立之后，通信双方都可以在任何时刻向另一方发送数据；
  - WS连接建立之后，数据的传输使用帧来传递，不再需要Request消息；
  - WS的数据帧有序。

### WS的握手过程

- 首先客户端向服务器发起一个特殊的HTTP请求，消息头如下：

  - ````http
    GET /chat HTTP/1.1  // 请求行
    Host: server.example.com
    Upgrade: websocket  // required
    Connection: Upgrade // required
    Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ== // required
    Origin: http://example.com  // 用于防止未认证的跨域脚本使用浏览器 websocket api 与服务端进行通信
    Sec-WebSocket-Protocol: chat, superchat  // optional, 子协议协商字段
    Sec-WebSocket-Version: 13
    ````

- 如果服务器支持该版本的WS，会返回101状态码，响应头如下：

  - ```http
    HTTP/1.1 101 Switching Protocols  // 状态行
    Upgrade: websocket   // required
    Connection: Upgrade  // required
    Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo= // required，加密后的 Sec-WebSocket-Key
    Sec-WebSocket-Protocol: chat // 表明选择的子协议
    ```

- 握手完成后，接下来的TCP数据包就都是WS协议的帧了。
-  可以看到，这里的握手不是 TCP 的握手，而是在 TCP 连接内部，从 HTTP/1.1 upgrade 到 WebSocket 的握手。 
-  WebSocket 提供两种协议：不加密的 `ws://` 和 加密的 `wss://`. 因为是用 HTTP 握手，它和 HTTP 使用同样的端口：ws 是 80（HTTP），wss 是 443（HTTPS） 

参考文章[：websocket协议详解及报文分析](https://blog.csdn.net/LL845876425/article/details/106393358)