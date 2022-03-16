// const data = [
//   {p1: '天气111', p2: 34},
//   {p1: '天气222', p2: 56},
//   {p1: '天气333', p2: 20},
//   {p1: '天气444', p2: 70},
// ]
// // const arr = data.sort((a,b) => { return a.p2 - b.p2})
// // 冒泡
// // const sort = function (data) {
// //   for(let i = 0; i < data.length; i++) {
// //     for(let j = 0; j < data.length-1-i; j++) {
// //       if(data[j].p2 > data[j+1].p2) {
// //         [data[j], data[j+1]] = [data[j+1], data[j]]
// //       }
// //     }
// //   }
// //   return data
// // }
// // 快排
// const sort = function(data) {
//   const partition = (data, left, right) => {
//     const pivot = data[left]
//     while(left < right) {
//       while(left < right && pivot.p2 < data[right].p2) right--
//       data[left] = data[right]
//       while(left < right && pivot.p2 > data[left].p2) left++
//       data[right] = data[left]
//     }
//     data[left] = pivot
//     return left
//   }
//   const quickSort = (data, left, right) => {
//     if(left < right) {
//       const index = partition(data, left, right)
//       quickSort(data, left, index - 1)
//       quickSort(data, index + 1, right)
//     }
//   }
//   quickSort(data, 0, data.length-1)
//   return data
// }
// console.log(sort(data))
// // console.log(arr)
// debugger;
// var sortArray = function(nums) {
//   const partition = (nums, left, right) => {
//     const pivot = nums[left]
//     while(left < right) {
//       while(left < right && nums[right] >= pivot)  right--
//       nums[left] = nums[right]
//       while(left < right && nums[left] < pivot) left++
//       nums[right] = nums[left]
//     }
//     nums[left] = pivot
//     return left
//   }
//   const quickSort = (nums, left, right) => {
//     if(left < right) {
//       const index = partition(nums, left, right)
//       quickSort(nums, left, index - 1)
//       quickSort(nums, index + 1, right)
//     }
//   }
//   quickSort(nums, 0, nums.length-1)
//   return nums
// };
// console.log(sortArray([5,1,1,2,0,0]))


// console.log('xxx_love_study_1xxx.mp4'.replace(/(?=xxx)/, '❤️')) // ❤️xxx_love_study_1.mp4
// console.log('123443524323423'.replace(/(?!^)(?=(\d{3})+$)/g, ','))
// // let price = '123456789'
// // let priceReg = /(?=\d{3}$)/ /(?=(\d{3})+$)/g

// // console.log(price.replace(priceReg, ',')) // 123456,789
// // 将手机号18379836654转化为183-7983-6654

// console.log('18379836654'.replace(/(?=(\d{4})+$)/g, '-'))
const torrate = function (fn, time) {
  let timeout = null
  return function () {
    if(timeout) return
    timeout = setTimeout(() => {
      timeout = null
      fn()
    }, time)
  }
}
function throttle2(func, wait) {
  let context, args, timeout
  return function(){
      context = this
      args = arguments
      if(!timeout) {
          timeout = setTimeout(function(){
              timeout = null
              func.apply(context, args)
          }, wait)
      }
  }
}