**设计哲学：**

* **单向数据流（数据页面绑定、单向渲染----->UI=f(x)**
* **虚拟DOM（学习快照思想）**
* **组件化（一致性、方便协作）**

**设计思想：**

**变换**

**抽象**

**组合**

**状态**

**代数效应**

**React16---> React17**

**React17是目前主流版本。**

**breakChange:**

**靠拢原生浏览器：**

**删除事件池**

**useEffect清理操作改为异步（过去是同步，性能差）**

**JSX不再允许返回undefined**

**移除RN不需要的内部组件**

**React18**

**新功能：**

**并发渲染（全自动）**

**新Suspense组件**

**新特性：**

**startTransition：早于setTimeout（提升性能）**

**React 18** 已经放弃对 **IE 11** 的支持，有兼容 IE 的需求需要继续使用 **React 17**。

**createRoot**

**React 18** 提供了两个根 API，我们称之为 **Legacy Root API** 和 **New Root API**。

* **Legacy root API**： 即 **ReactDOM.render**。这将创建一个以“遗留”模式运行的 **root**，其工作方式与 **React 17** 完全相同。使用此 API 会有一个警告，表明它已被弃用并切换到 **New Root API**。
* **New Root API**： 即 **createRoot**。 这将创建一个在 **React 18** 中运行的 **root**，它添加了 **React 18** 的所有改进并允许使用并发功能。
