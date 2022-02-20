// // 实现一个js中的多维数组初始化方法
// function multiArray (initValue, ...args) {
//   // if(args.length === 1) {
//   //   const arr = new Array(args[0]).fill(initValue)
//   //   return arr
//   // }
//   // your code here
//   // return args.reduce((prev, item) => {
//   //   const arr = new Array(item).fill(initValue)
//   //   prev.push(arr)
//   //   return prev
//   // }, [])
//   const temp = args.shift()
//   let arr = new Array(temp).fill(initValue)
//   if(!args.length){
//     return arr
//   }
//   for(let i = 0; i < args.length; i++) {
//     const temp = new Array(args[i]).fill(arr)
//     arr = temp
//     // for(let j = 0; j < args[i]; j++){
//     //   res.push(arr)
//     // }
//   }
//   return arr
// }
// // 满足任意维的 多维数组的初始化。
// // 如
// // console.log(multiArray(null, 1)) // [ null ]
// // console.log(multiArray('x', 2, 2)) // [ [ 'x', 'x' ], [ 'x', 'x' ] ]
// console.log(multiArray('o', 4, 4, 4))
// console.log(multiArray('o', 3, 3, 3))
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
// 数据扁平化

// result
// [
//   {
//       "id": 1,
//       "name": "部门1",
//       "pid": 0,
//       "children": [
//           {
//               "id": 2,
//               "name": "部门2",
//               "pid": 1,
//               "children": []
//           },
//           {
//               "id": 3,
//               "name": "部门3",
//               "pid": 1,
//               "children": [
//                   // 结果 ,,,
//               ]
//           }
//       ]
//   }
// ]
// const flatToTree = (arr, res, pid) => {
//   for(let item of arr) {
//       if(item.pid === pid) {
//           const newItem = {...item, children: []}
//           res.push(newItem)
//           flatToTree(arr, newItem.children, item.id)// 递归找自己的孩子
//       }
//   }
// }
// // 验证
// const res = []
// flatToTree(arr, res, 0)
// console.log(res)
// 递归
// const flatToTree = (arr, res, pid) => {
//   for(let item of arr) {
//     if(item.pid === pid) {
//       const newItem = {...item, children: []}
//       res.push(newItem)
//       flatToTree(arr, newItem.children, item.id) 
//     }
//   }
// }
// const flatToTree = (arr) => {
//   const result = []
//   const mapItem = {}
//   for(const item of arr) {
//     mapItem[item.id] = {...item, children: []}
//   }
//   for(const item of arr) {
//     const id = item.id
//     const pid = item.pid
//     const treeItem = mapItem[id]
//     if(pid === 0) {
//       result.push(treeItem)
//     } else {
//       if(!mapItem[pid]) {
//         mapItem[pid] = {
//           children: []
//         }
//       }
//       mapItem[pid].children.push(treeItem)
//     }
//   }
//   return result
// }
// // const res = []
// // flatToTree(arr, res, 0)
// let res = flatToTree(arr)
// console.log(res)
// 19351235.890
// [['a', 'b'], ['n', 'm'], ['0', '1']] => 
// ["an0", "an1", "am0", "am1", "bn0", "bn1", "bm0", "bm1"]

// 实现一个函数，把一个字符串数组
// （['zm', 'za', 'b', 'lm', 'ln', 'k']）
// 格式化成一个对象 
// { 'b': ['b'], 'k': ['k'], 'l': ['lm', 'ln'], 'z': ['za', 'zm'] }
// 给定一个升序整形数组[0,1,2,4,5,7,13,15,16]，
// 找出其中连续出现的数字区间，然后以下列方式进行重组：
// ["0->2", "4->5", "7", "13", "15->16"]
// 双指针+flag
function reBuild(arr) {
  const res = []
  let left = 0, right = 0
  count = 0
  let str = ''
  while(right <= arr.length) {
    if(arr[right] === arr[left] + count || arr[right] === arr[left] + 1) {
      if(count === 0) {
        str = ''+arr[left]
      }
      count++
    } else {
      if(str !== '') {
        str = str + '->' + arr[right - 1]
      } else {
        str = arr[right - 1]
      }
      res.push(str)
      str = ''
      count = 0
      left = right
    }
    right++
  }
  return res
}
reBuild([0,1,2,4,5,7,13,15,16])



