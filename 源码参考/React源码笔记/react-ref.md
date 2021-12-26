ref的三种使用方式：

```jsx
import React from 'react'
export default class Ref extends React.Component {
  constructor(){
    super()
      this.objRef = React.createRef()// {current: null}
    }
    componentDidMount () {
      setTimeout(() => {
          this.refs.stringRef.textContent = 'string ref got'
          this.methodRef.textContent = 'method ref got'
          this.objRef.current.textContent = 'obj ref got'
      }, 1000)
    }
    render() {
    return (
        <>
          <p ref = "stringRef">span1</p>{/* 已经废弃 */}
          <p ref = {ele => (this.methodRef = ele)}>span2</p> 
          <p ref = {this.objRef}>span3</p> 
        </>
      )
    }
}
```

可以看到，1秒后,span的更改：

![](./images/ref.png)

forwardRef使用：

```js
import React from 'react'
const TargetComp = React.forwardRef((props, ref) => {
  return (<input type='text' ref={ref} />)// function是不能直接拿到ref的
})
export default class ForwardRef extends React.Component {
  constructor(){
    super()
      this.ref = React.createRef()// {current: null}
    }
    componentDidMount () {
      this.ref.current.value = 'ref get input'
    }
    render() {
    return (
        <TargetComp ref={this.ref} />
      )
    }
}
```

![](./images/forwardRef.png)

Context:跨越多重组件取数据：

```jsx
import React from "react";

const { Provider, Consumer } = React.createContext('default')
export default class Parent extends React.Component {
  state = {
    childContext: 123
  }
  render () {
    return (
      <>
        <Provider value={this.state.childContext}><Child1/></Provider>
      </>
    )
  }
}
function Child1() {
  return <div>
    child1
    <Child2/>
  </div>
}
function Child2 () {
  return <Consumer>{value => <p>Context: {value}</p>}</Consumer>
}
```

ConcurrentMode:

meno:

创建更新的方式：

ReactDOM.render || hydrate

创建ReactRoot

## 创建FiberRoot和RootFiber

FiberRoot：

整个应用的起点

包含应用挂载的目标节点

记录整个应用更新过程的各种信息

Fiber:

每一个ReactElement对应一个Fiber对象

记录节点的各种状态

串联整个应用形成树结构

Update & UpdateQueue

Update

用于记录组件状态的改变

存放于UpdateQueue(Fiber数据结构当中)中

多个Update可以同时存在：通时调用三个`setState`



创建更新



setState

forceUpdate