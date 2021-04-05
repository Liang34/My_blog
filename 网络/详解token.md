## Token的原理：

### 1、出现背景：

 因为HTTP请求是无状态的，所以想出的办法就是给大家发一个会话标识(session id) ，但是客户端只需要保存自身的session id，而服务器端则要保存所有客户端的session id ，这对服务器说是一个巨大的开销 ， 严重的限制了服务器扩展能力；Token的出现解决了这个问题，因为服务端不需要存储Token的信息，而是通过CPU的计算 + 数据的加密解密再核对Token的方式来验证用户是否合法（即HTTP请求信息有没有被篡改），让服务器内存得到释放；基于`session`的验证是有状态的，基于`token`的验证是无状态的。

### 2.为什么`Token`能防御`CSRF`的攻击

1. 用户访问某个表单页面。 

2. 服务端生成一个Token，放在用户的Session中，或者浏览器的Cookie中。 

3. 在页面表单附带上Token参数。 

4. 用户提交请求后， 服务端验证表单中的Token是否与用户Session（或Cookies）中的Token一致，一致为合法请求，不是则非法请求。 

这个Token的值必须是随机的，不可预测的。由于Token的存在，攻击者无法再构造一个带有合法Token的请求实施CSRF攻击。另外使用Token时应注意Token的保密性，尽量把敏感操作由GET改为POST，以form或AJAX形式提交，避免Token泄露。 

注意： 

 CSRF的Token仅仅用于对抗CSRF攻击。当网站同时存在XSS漏洞时候，那这个方案也是空谈。所以XSS带来的问题，应该使用XSS的防御方案予以解决。  

参考：[web安全之token和CSRF攻击](https://blog.csdn.net/qq_15096707/article/details/51307024?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control)

### 3.`token`存在哪里

一般来说`token`存在客户端中，可以选择`Cookie、localStorage、SessionStorage`的地方。`cookie`可以设置有效期。

### 4.基于`Token`与基于`Session`的比较

- session id可以被伪造，没有采取加密的方法，一旦攻击者通过session id伪造攻击，就会给服务器带来压力甚至击垮服务器。


- Token是通过加密算法（如：HMAC-SHA256算法）来实现session对象验证的，这样使得攻击者无法伪造token来达到攻击或者其他对服务器不利的行为。

### [5.nodejs基于token认证](https://blog.csdn.net/qq_37261367/article/details/81387107)

