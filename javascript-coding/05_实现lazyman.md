### 题目

手写 LazyMan ，实现 `sleep` 和 `eat` 两个方法，支持链式调用。

```js
const me = new LazyMan('李白')
me.eat('苹果').eat('香蕉').sleep(5).eat('葡萄') // 打印结果如下：

// '李白 eat 苹果'
// '李白 eat 香蕉'
// （等待 5s）
// '李白 eat 葡萄'
```

实现：

```js
class LazyMan {
  constructor(name) {
    this.name = name;
    this.tasks = [];
    setTimeout(() => {
      this.next(); // 触发第一个task
    });
  }
  next() {
    const task = this.tasks.shift(); // 取出当前 tasks 的第一个任务
    if (task) task();
  }
  eat(x) {
    // 打印 eat 行为
    const task = () => {
      console.log(`${this.name}吃${x}`);
      this.next(); // 执行下一个任务
    };
    this.tasks.push(task);
    return this; // 支持链式调用
  }
  sleep(seconds) {
    // 等待 10s 的处理逻辑
    const task = () => {
      console.info(`${this.name} 开始睡觉`);
      setTimeout(() => {
        console.info(`${this.name} 已经睡完了 ${seconds}s，开始执行下一个任务`);
        this.next(); // xx 秒之后再执行下一个任务
      }, seconds * 1000);
    };
    this.tasks.push(task)
    return this; // 支持链式调用
  }
}
const me = new LazyMan("李白");
me.eat('苹果').eat('香蕉').sleep(5).eat('葡萄');
```
