# Fiber

## Fiber 是什么

`Fiber` 是 `React` 中一种用于实现虚拟 `DOM` 和组件协调的新的架构。 是一种基于协程的实现，用于实现异步渲染和任务优先级调度。每个 Fiber 可以被看作是一个执行单元，表示了组件树中的一个小部分，负责管理自身对应的组件和其渲染过程。通过引入协程的概念，`React Fiber` 实现了任务的切片和中断与恢复，使得 `React` 能够更高效地处理渲染任务和异步任务，从而提高应用的性能和用户体验。

> 协程：是一种计算机程序组件，可以在单个线程中实现多个执行流。与线程相比，协程更轻量级，更高效，更灵活，更易于使用。协程可以用于实现异步编程、并发编程、协作式多任务等场景。
>
> 通俗地讲：协程是一种比线程更加轻量级、高效、灵活的程序组件。它可以让程序在单个线程中实现多个执行流，每个执行流都有自己的上下文和堆栈。协程可以在任意时刻暂停和恢复执行，而不需要像线程那样频繁地进行上下文切换。这使得协程可以更加高效地利用计算资源，同时也更加灵活，可以用于实现异步编程、并发编程、协作式多任务等场景。

`Fiber` 还可以理解为是一种数据结构，`React Fiber` 就是采用链表实现的。每个 `Virtual DOM` 都可以表示为一个 `fiber`。

## 为什么需要Fiber

React 16 之前的版本比对更新 VirtualDOM 的过程是采用循环加递归实现的，这种比对方式有一个问题，就是一旦任务开始进行就无法中断，如果应用中组件数量庞大，主线程被长期占用，直到整棵 VirtualDOM 树比对更新完成之后主线程才能被释放，主线程才能执行其他任务。这就会导致一些用户交互，动画等任务无法立即得到执行，页面就会产生卡顿, 非常的影响用户体验。

核心问题：递归无法中断，执行重任务耗时长。 JavaScript 又是单线程，无法同时执行其他任务，导致任务延迟页面卡顿，用户体验差。

## Fiber的含义：

`Fiber`包含三层含义：

1. 作为架构来说，之前 `React15`的 `Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为 `stack Reconciler`。`React16`的 `Reconciler`基于 `Fiber节点`实现，被称为 `Fiber Reconciler`。
2. 作为静态的数据结构来说，每个 `Fiber节点`对应一个组件，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的工作单元来说，每个 `Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

## Fiber的结构

主要分为三类：

```typescript

function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag; // Fiber对应组件的类型 Function/Class/Host...
  this.key = key;
  //  大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
  this.elementType = null;
  // 对于 FunctionComponent，指函数本身，对于ClassCompoent，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  // 存放真实的DOM节点
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  // 指向父级Fiber节点
  this.return = null;
  // 指向第一个孩子节点
  this.child = null;
  // 指向右边第一个兄弟节点
  this.sibling = null;

  // 作为动态的工作单元的属性
  // 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps; 
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;
  // 保存本次更新会造成的DOM操作
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```
