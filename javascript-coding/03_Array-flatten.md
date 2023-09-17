### 实现数组的扁平化

写一个函数，实现 Array flatten 扁平化，只减少一个嵌套层级 `<br>`
例如输入 `[1, 2, [3, 4, [100, 200], 5], 6]` 返回 `[1, 2, 3, 4, [100, 200], 5, 6]`

实现思路：

```js
const arr = [1, 2, [3, 4, [100, 200], 5], 6]
function flatArray(arr) {
  const res = []
  for(let key in arr) {
    if(Array.isArray(arr[key])) {
      res.push(...flatArray(arr[key]))
    } else {
      res.push(arr[key])
    }
  }
  return res
}
console.log(flatArray(arr))
```
