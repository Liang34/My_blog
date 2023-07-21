// let a = [1,3,5,7,11,15]
// let b = [1,4,5,8,11,17]
// // 交集
// const foo1 = function (a, b) {
//   const map = new Set()
//   const res = []
//   for(const item of a) {
//     map.add(item)
//   }
//   for(const item of b) {
//     if(map.has(item)) {
//       res.push(item)
//     }
//   }
//   return res
// }
// // 并集
// const foo2 = function(a,b) {
//   return Array.from(new Set(a.concat(b)))
// }
// console.log(foo1(a, b))
// console.log(foo2(a, b))
// const regx = /ab{2,5}c/g
// const str = 'abc abbc abbbc abbbbc abbbbbc abbbbbbc'
// console.log(str.match(regx))
const regx = /a[1,2,3]b/g
const str = "a0b a1b a2b a3b a4b"
console.log(str.match(regx))// ['a1b', 'a2b', 'a3b']
debugger

