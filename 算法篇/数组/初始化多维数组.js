// // 满足任意维的 多维数组的初始化。
// // 如
console.log(multiArray(null, 1)) // [ null ]
console.log(multiArray('x', 2, 2)) // [ [ 'x', 'x' ], [ 'x', 'x' ] ]
console.log(multiArray('o', 3, 3, 3))
// [
//   [ [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ] ],
//   [ [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ] ],
//   [ [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ] ]
// ]
function multiArray(initValue, ...args) {
  if (args.length === 0) {
    return initValue
  }
  initValue = new Array(args.shift()).fill(initValue)
  return multiArray(initValue, ...args)
}