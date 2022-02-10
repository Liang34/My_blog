初始数据：

```js
let arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]
```

将上面数据转换为树形结构：

```js
[
  {
      "id": 1,
      "name": "部门1",
      "pid": 0,
      "children": [
          {
              "id": 2,
              "name": "部门2",
              "pid": 1,
              "children": []
          },
          {
              "id": 3,
              "name": "部门3",
              "pid": 1,
              "children": [
                  // 结果 ,,,
              ]
          }
      ]
  }
]
```

- 递归

首先想到的是递归，只要先遍历数组的每一项，根据`pid`找出其父亲并push到其父亲的`children`中，在递归找`id`等于`pid`的项即可。

```js
const flatToTree = (arr, res, pid) => {
  for(let item of arr) {
      if(item.pid === pid) {
          const newItem = {...item, children: []}
          res.push(newItem)
          flatToTree(arr, newItem.children, item.id)// 递归找自己的孩子
      }
  }
}
// 验证
const res = []
flatToTree(arr, res, 0)
console.log(res)
```

时间复杂度：O(n^2)

- 使用迭代+map

```js
const flatToTree = (arr) => {
  const result = []
  const mapItem = {}
  // 先转成map存储
  for(const item of arr) {
    mapItem[item.id] = {...item, children: []}
  }
  for(const item of arr) {
    const id = item.id
    const pid = item.pid
    const treeItem = mapItem[id]
    if(pid === 0) {
      result.push(treeItem)
    } else {
      if(!mapItem[pid]) {
        mapItem[pid] = {
          children: []
        }
      }
      mapItem[pid].children.push(treeItem)
    }
  }
  return result
}
```

时间复杂度O(2n),空间复杂度O(n)

- 合并两次遍历

```js
function arrayToTree(items) {
  const result = [];   // 存放结果集
  const itemMap = {};  // 
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children']
    }

    const treeItem =  itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}
```

时间复杂度O(n)，空间复杂度O(n)