BFS使用场景：



BFS实现方式就是用队列

单队列

双队列

DummyNode:

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
 // DummyNode
var levelOrder = function (root) {
  if (!root) return []
  const queue = [root, null]
  const res = []
  let level = []
  while(queue.length) {
    const node = queue.shift()
    if(node === null) {
      res.push(level)
      level = []
      if(queue.length) {
        queue.push(null)
      }
      continue
    }
    level.push(node.val)
    if(node.left) queue.push(node.left)
    if(node.right) queue.push(node.right)
  }
  return res
};
```

