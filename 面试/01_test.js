// 用 JS 写一个函数，将扁平化的数据转化为树形结构的数据
// 输入：（顺序不定，id 是个随机值，下面的例子是为了方便展示）
[ 
  { id: 'R1', parentId: null }, 
  { id: 'R2', parentId: null }, 
  { id: 'R1-1', parentId: 'R1' }, 
  { id: 'R1-2', parentId: 'R1' }, 
  { id: 'R1-3', parentId: 'R1' }, 
  { id: 'R2-1', parentId: 'R2' }, 
  { id: 'R2-2', parentId: 'R2' }, 
  { id: 'R1-1-1', parentId: 'R1-3' } 
] 
// 输出： 
[ 
  { 
    id: 'R1', 
    parentId: null, 
    children: [ 
      { id: 'R1-1', parentId: 'R1' }, 
      { id: 'R1-2', parentId: 'R1' }, 
      { 
        id: 'R1-3', 
        parentId: 'R1', 
        children: [ 
          { id: 'R1-1-1', parentId: 'R1-3' } 
        ] 
      } 
    ] 
  }, 
  { 
    id: 'R2', 
    parentId: null, 
    children: [ 
      { id: 'R2-1', parentId: 'R2' }, 
      { id: 'R2-2', parentId: 'R2' } 
    ] 
  } 
] 

function toTree(data) {
  const recursion = (resData, pid) => {
      for(const item of data) {
          if(item.parentId === pid) {
              const newItem = {...item, children: []}
              resData.push(newItem)
              recursion(newItem.children, item.id)
          }
      }
  }
  const resData = []
  recursion(resData, null)
  return resData
} 
// 假设有以下三个函数
// a()
// b()
// c()

// 实现 compose 函数，使得
// compose([a, b, c])(args) = a(b(c(args)))
// const compose = (....fns) => {
//   return function (args) {
//      return  fns.reverse().reduce( async (prev, cur)=> {
//          return await cur(prev)
//      }, args)
//   }
// }