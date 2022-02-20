给出以下数据：

```js
const data = [
  {
    "id": "1",
    "sub": [
      {
        "id": "2",
        "sub": [
          {
            "id": "3",
            "sub": null
          },
          {
            "id": "4",
            "sub": [
              {
                "id": "6",
                "sub": null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "7",
    "sub": [
      {
        "id": "8",
        "sub": [
          {
            "id": "9",
            "sub": null
          }
        ]
      }
    ]
  },
  {
    "id": "10",
    "sub": null
  }
]
```

要求实现一个函数可以：

```js
// 现在给定一个id，要求实现一个函数
// 返回给定id在 data 里的路径
// findPath(data, "1")  => ["1"]
// findPath(data, "9") => ["7", "8", "9"]
// findPath(data, "100") => []
```

分析：树的查找往往离不开递归，再看exp2中查找9，需要把7， 8 也保存下来，所以递归过程需要保存path，

```js
function findPath(data, id) {
    const res = []
    const dfs = (path, curData) => {// path保存遍历的id， curData是当前要遍历的对象
        if(curData) {
            for(const item of curData) { // 遍历当前对象
                path.push(item.id)
                if(item.id === id) {
                    res.push(...path)
                    return
                } else {
                    dfs(path, item.sub)// 遍历sub
                    path.pop()// 回溯
                }
            }
        }
    }
    dfs([], data)
    return res
}
```



