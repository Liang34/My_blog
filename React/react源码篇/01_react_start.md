react源码探秘

1、git clone https://github.com/facebook/react.git

`react`及`react-dom`核心api：

```js
const React = {
    createElement,// 创建虚拟DOM
    Component// 实现自定义组件
}
const ReactDOM = {
    render // 创建正是DOM
}
```



createElement实现：

- 使用：

  ```js
  React.createElement(type, [props],[...children])
  // type 可以为：文本节点、HTML标签节点、function组件、class组件、Fragment、其他如portal等节点
  
  ```

  



