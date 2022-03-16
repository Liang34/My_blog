// 给定一个数组A[0....N-1]，找到从1开始，第一个不在数组中的正整数。

// 题目描述
// 例如 [3,5,7,1,6,-3,2]，结果是 4。
function findNumber(arr) {
  const tag = []
  tag[0] = 0
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] >= 1) {
      tag[arr[i]] = arr[i]
    }
  }
  for(let item = 1; item < arr.length; item++) {
    if(tag[item] === undefined) return item
  }
}
console.log(findNumber([3,5,7,1,6,-3,2]))