## 静态资源加速之CDN技术

### CDN技术

 CDN 的全称是 (Content Delivery Network/Content Distribution Network)，即内容分发网络。CDN解决的问题是在网络中增加一层CACHE（缓存）层，将源站的资源分发到距离用户最近的网络"边缘"节点上，使用户就近访问内容，提高网站响应速度，避免网络拥塞，保证了用户访问资源的速度和体验。 

###  CDN 工作原理

![作为一名程序员，你真正了解CDN技术吗？](https://p1-tt.byteimg.com/origin/pgc-image/9bcbd073e8e043b6b6364957b4093be9?from=pc)

上述这张图解决了两个问题：

- 访问域名如何映射到 CDN 地址的
- 如何找到离用户最近的 CDN 节点

接下来，我们根据上面两个问题，结合图示来详解下这个流程。

**1. 访问域名如何映射到CDN地址**

当你通过浏览器访问 static.example.com 域名时，假设这就是个静态域名，并且做了 CDN 静态资源加速。

1）首先会经过本地 DNS 解析器，查看下本机 /etc/hosts 文件是否存在域名对应的IP，如果找到，直接使用该 IP 发起请求。否则，执行步骤2）。

2）由于本地 DNS 服务器解析，如果在本地 DNS 缓存中找到域名对一个IP，则直接用该 IP 访问。否则，继续步骤3）。

3）本地 DNS 服务器会向根域名服务器发起请求，根域名服务器返回顶级 DNS 域名服务器地址，让你去它那里查找。

4）本地 DNS 服务器会向顶级 DNS 域名服务器发起请求，.com 顶级域名服务器返回权威 DNS 域名服务器地址，让你去它那里查找。

5）本地 DNS 服务器继续向 example.com 权威 DNS 域名服务器发起请求，权威 DNS 域名服务器一看这个域名我能解析，发现是有做过CDN加速域名配置，它会 CNAME 到
static.xxx.example.cdn.com 域名。

到此，其实我们通过访问静态域名 static.example.com 经过一番波折，终于找到了 CDN 域名地址。

如果你不需要找离用户最近的节点，通过
static.xxx.example.cdn.com 域名就可以找到正确的 IP 地址了。

**2. 如何找到离用户最近的 CDN 节点**

结合上图，继续解析如果找到距离用户最近的 CDN 节点。

1）本地 DNS 服务器会将
static.xxx.example.cdn.com 会向第一层 GSLB 全局负载均衡发起请求，第一层全局负载均衡会根据用户所在运营商网络分析，比如移动运营商，返回 CNAME 到如 static.yd.example.cdn.com 域名地址。

2）本地 DNS 服务器会继续向第二层 GSLB 全局负载均衡发起请求，第二层全局负载均衡依据 DNS 地理位置判断，返回 SLB CDN 负载均衡地址。

3）本地 DNS 服务器从返回的多个 CDN 节点 IP 中，可以通过本地简单轮询的方式去选择一个 CDN IP 访问。

此时，最终通过 GSLB 全局负载均衡找到的这些 CDN 节点，就是离用户最近的 CDN 节点了。

**什么是 GSLB？**

GSLB（Global Server Load Balance），即全局负载均衡，它的含义是对于部署在不同地域的服务器之间做负载均衡。一方面可以让流量均衡负载到它下面的服务器上，另一方面能根据地理位置判断，找到离用户最近的服务器。

找到了离用户最近的 CDN 节点，并不一定能直接从该 CDN 节点上获取对应的资源，如果资源不存在，会继续从上级区域或中心 CDN 节点查找，如果都不存在，最终就会回源到源站获取资源，然后设置 CDN 缓存失效时间。

一般对于一些小的静态资源文件，存储在源站，由 CDN 节点主动拉取方式来访问的。

对于大的音视频流媒体文件，可以通过 CDN 厂商提供的接口提前将资源写入到 CDN 某一个节点上，再由 CDN 内部机制将资源分发到其他 CDN 节点上。

但是，即使主动同步资源，也是存在延时的，最终可能会导致回源，而回源带宽成本又是很大的。所以，我们在使用 CDN 的时候就有必要关注 CDN 命中率和源站带宽情况。

**4、解析过程中的名词解释**

**CNAME( Canonical Name )：**

它可以将一个域名解析到另外一个域名。

举个例子：

当你使用 docs.example.com 去访问一些资源时，希望通过 docs-xyz.example.com 也能访问相同的这些资源，你可以在 DNS 解析服务商添加一条 CNAME 记录，将 docs-xyz.example.com 指向 docs.example.com，添加后，所有访问 docs-xyz.example.com 的请求都会被转发到 docs.example.com 域名。

**CNAME 域名：**

接入 CDN 时，在 CDN 厂商控制台添加完加速域名后，会得到一个 CDN 给你分配的 CNAME 域名， 需要在你的 DNS 解析服务商添加 CNAME 记录，将自己的加速域名指向这个 CNAME域名，这样该域名所有的请求才会都将转向 CDN 的节点，达到加速效果。

**DNS (Domain Name System)**：

域名解析服务。

将域名解析为网络上可识别的IP地址。服务器之间认识的都是IP，但用户习惯记忆的都是域名，所以域名与IP地址之间关系是一对一的。它们之间的转换工作，就称为域名解析，由专门的解析器来完成域名解析，可参见上述图中的 DNS 解析过程。

参考文章：[作为一名程序员，你真正了解CDN技术吗](https://www.toutiao.com/i6759737271164862984/?in_ogs=1&traffic_source=CS1114&utm_source=HW&source=search_tab&utm_medium=wap_search&prevent_activate=1&original_source=1&in_tfs=HW&channel=)

