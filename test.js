// 实现一个js中的多维数组初始化方法
function multiArray (initValue, ...args) {
  // if(args.length === 1) {
  //   const arr = new Array(args[0]).fill(initValue)
  //   return arr
  // }
  // your code here
  // return args.reduce((prev, item) => {
  //   const arr = new Array(item).fill(initValue)
  //   prev.push(arr)
  //   return prev
  // }, [])
  const temp = args.shift()
  let arr = new Array(temp).fill(initValue)
  if(!args.length){
    return arr
  }
  for(let i = 0; i < args.length; i++) {
    const temp = new Array(args[i]).fill(arr)
    arr = temp
    // for(let j = 0; j < args[i]; j++){
    //   res.push(arr)
    // }
  }
  return arr
}
// 满足任意维的 多维数组的初始化。
// 如
// console.log(multiArray(null, 1)) // [ null ]
// console.log(multiArray('x', 2, 2)) // [ [ 'x', 'x' ], [ 'x', 'x' ] ]
console.log(multiArray('o', 4, 4, 4))
console.log(multiArray('o', 3, 3, 3))
// [
//   [ [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ] ],
//   [ [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ] ],
//   [ [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ], [ 'o', 'o', 'o' ] ]
// ]
// function multiArray (initValue, ...args) {
//   const temp = args.shift()
//   let arr = new Array(temp).fill(initValue)
//   if(!args.length){
//     return arr
//   }
//   for(let i = 0; i < args.length; i++) {
//     const temp = new Array(args[i]).fill(arr)
//     arr = temp
//   }
//   return arr
// }