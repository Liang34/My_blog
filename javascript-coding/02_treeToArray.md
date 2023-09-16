## 数组转树

定义一个 `convert` 函数，将以下数组转换为树结构。

```js
const arr = [
    { id: 1, name: '部门A', parentId: 0 }, // 0 代表顶级节点，无父节点
    { id: 2, name: '部门B', parentId: 1 },
    { id: 3, name: '部门C', parentId: 1 },
    { id: 4, name: '部门D', parentId: 2 },
    { id: 5, name: '部门E', parentId: 2 },
    { id: 6, name: '部门F', parentId: 3 },
]
```

实现思路：直接递归找pId，如果当前元素的parentId等于pId时则push进数组并递归

```js
function arrToTree(arr){
  const res = []
  const dfs = (newArr, pId) => {
    for(let v of arr) {
      if(v.parentId === pId) {
        const children = []
        newArr.push({...v, children})
        dfs(children, v.id)
      }
    }
  }
  dfs(res, 0)
  return res
}
```

## 树转数组

定义一个 `convert` 函数，将以下对象转换为数组

```js
const obj = {
    id: 1,
    name: '部门A',
    children: [
        {
            id: 2,
            name: '部门B',
            children: [
                { id: 4, name: '部门D' },
                { id: 5, name: '部门E' }
            ]
        },
        {
            id: 3,
            name: '部门C',
            children: [{ id: 6, name: '部门F' }]
        }
    ]
}
```

```js
[
    { id: 1, name: '部门A', parentId: 0 }, // 0 代表顶级节点，无父节点
    { id: 2, name: '部门B', parentId: 1 },
    { id: 3, name: '部门C', parentId: 1 },
    { id: 4, name: '部门D', parentId: 2 },
    { id: 5, name: '部门E', parentId: 2 },
    { id: 6, name: '部门F', parentId: 3 },
]
```

实现思路：

需要**广度优先**遍历树

要快速获取 `parentId` 需要存储 `nodeToParent` map 结构。

```js
function convert(obj) {
  const queue = [obj]
  const map = new Map()
  const res = []
  while(queue.length) {
    const node = queue.shift()
    if(node.children) {
      for(let i = 0; i < node.children.length; i++) {
        map.set(node.children[i].id, node.id)
        queue.push(node.children[i])
      }
    }
    res.push({id: node.id, name: node.name, parentId: map.get(node.id) || 0})
  }
  return res
}
```
