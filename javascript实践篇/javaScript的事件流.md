## DOM事件流

1.什么是事件流？

事件流所描述的是从页面中接受事件的顺序

2.DOM事件流的三个阶段？

事件流包括三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段

3.DOM事件流三个阶段的执行顺序？

首先发生的事件捕获，为截取事件提供机会，然后是目标接受事件，最后是事件冒泡阶段，所以可以在最后一个阶段对事件作出响应。见下图更直观：

![图片描述](https://segmentfault.com/img/bVbdX6K?w=902&h=378)

在dom事件流中，事件的目标在捕获阶段不会接受到事件，这意味着在捕获阶段，事件从 document 到 div 后就停止了。下一个阶段是目标阶段，于是事件在 div 上发生，并在事件处理中被看成是冒泡阶段的一部分， 然后，冒泡阶段发生，事件又传回document。 

## 事件冒泡

1.什么是事件冒泡？
当事件发生后，这个事件就要开始传播（从里向外或者从外向里）

## 阻止冒泡

1.为什么要阻止冒泡？

例如：document上有A事件，div有B事件，div里面的span有C事件，如果不给span和div加阻止事件冒泡的话，点击span时就会触发到div的B事件、document的A事件，当点击span时不想触发div和document的事件就要加上阻止事件冒泡，div也是一样的道理，如果我们不想让点击某个事件时父级受到影响，这时就应阻止冒泡。

2.阻止冒泡的方法。

①`event.stopPropagation()`方法 

这是阻止事件的冒泡方法，不让事件向`documen`上蔓延，但是默认事件仍然会执行，当你调用这个方法的时候，如果点击一个连接，这个连接仍然会被打开，

②`event.preventDefault()`方法

这是阻止默认事件的方法，调用此方法是，连接不会被打开，但是会发生冒泡，冒泡会传递到上一层的父元素；

③ return false

这个方法比较暴力，他会同时阻止事件冒泡也会阻止默认事件；写上此代码，连接不会被打开，事件也不会传递到上一层的父元素；可以理解为return false就等于同时调用了`event.stopPropagation()`和`event.preventDefault()`

## 事件委托

1.事件委托原理

> 事件委托是利用事件的冒泡原理来实现的，何为事件冒泡呢？就是事件从最深的节点开始，然后逐步向上传播事件，举个例子：页面上有这么一个节点树，div>ul>li>a;比如给最里面的a加一个click点击事件，那么这个事件就会一层一层的往外执行，执行顺序a>li>ul>div，有这样一个机制，那么我们给最外面的div加点击事件，那么里面的ul，li，a做点击事件的时候，都会冒泡到最外层的div上，所以都会触发，这就是事件委托，委托它们父级代为执行事件。

2.实现

```js
<ul id="father">
 <li id="Li1">Monday</li>
 <li id="li2">Tuesday</li>
 <li id="li3">Wednesday</li>
 <li id="li4">Thursday</li>
 <li id="li5">Friday</li>
 <li id="li6">Saturday</li>
 <li id="li7">Sunday</li>
</ul>
function ull(){
    var id=event.target.id;
    if(id=="li1")alert(li1.innerText);
    else if(id=="li2")alert(li2.innerText);
    else if(id=="li3")alert(li3.innerText);
    else if(id=="li4")alert(li4.innerText);
    else if(id=="li5")alert(li5.innerText);
    else if(id=="li6")alert(li6.innerText);
    else alert(li7.innerText);
}
father.addEventListener("click",ull);
```

面试题：

自定义一个事件，在任何地方都ss可以触发

```js
// 创建事件
let myEvent = new CustomEvent("pingan", {
	detail: { name: "wangpingan" }
});
// 添加适当的事件监听器
window.addEventListener("pingan", e => {
	alert(`pingan事件触发，是 ${e.detail.name} 触发。`);
});
document.getElementById("box3").addEventListener(
  "click", function () {
    // 派发事件
	window.dispatchEvent(myEvent);
  }
)
```

