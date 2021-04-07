#### 使用vue渲染大量数据应该怎么优化

```js
1.如果需要响应式，考虑使用虚表（只渲染要显示的数据）；
2.如果不考虑响应式，变量在beforeCreated或created中声明（Object.freeze会导致列表无法增加数据）
```

