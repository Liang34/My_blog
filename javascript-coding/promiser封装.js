
// 假如现在本地无法实现加法功能，现有其他团队提供的api
// await asyncAdd = (a, b, (err, res) => {
//     // 利用网络请求实现a+b，成功结果返回res
// })
// 现需要改进该api，利用其实现一个add方法，使其能够实现多个数相加（写主要思路即可）
// （时间复杂度为logn）
// function add(a,b,c...) {
//     //Todo
// }
const asyncAdd = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve(a + b)
        }, 1000)
    })
}
function add(...args) {
   const promiseArr = []
   for(let i = 0; i < args.length; i+=2) {
    promiseArr.push(asyncAdd(args[i], args[i+1]))
   }
   Promise.all(promiseArr).then(nextArr => {
       if(nextArr.length === 1) {
           
       }
   })
}