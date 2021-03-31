## BFC是什么：

**具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。**

## 怎么触发BFC：

只要元素满足下面任一条件即可触发 BFC 特性：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

## BFC特性的应用：

 **1. 同一个 BFC 下外边距会发生折叠** 

 **如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。** 在父元素中添加`overflow:hidden`

注意是父元素，同级元素之间加没有作用，因为同级相加后他们仍然在一个`BFC`中。

```html
div {
    overflow: hidden;
}
p {
    margin: 100px;
    background-color: blue;
    width: 100px;
    height: 100px;
}
<div><p></p></div>
<div><p></p></div>
```

 **2. BFC 可以包含浮动的元素（清除浮动）** 

 我们都知道，浮动的元素会脱离普通文档流，来看下下面一个例子 

```
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

这样会导致高度塌陷。

方案：

```html
<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

 **3. BFC 可以阻止元素被浮动元素覆盖** 

```html
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
```

 这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 **overflow: hidden**即可。

参考文章：[10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

