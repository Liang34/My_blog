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
const addRemote = (a, b) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(a + b), 1000);
    });
  };
  const splitArgs = (arr) => {
    const newArr = [];
    let rest = arr.length % 2 !== 0 ?  Promise.resolve(arr[arr.length - 1]) : undefined;
    for(let i = 0; i < arr.length; i+=2) {
        newArr.push(addRemote(arr[i], arr[i+1]));
    }
    if(rest) newArr.push(rest)
    return newArr
  };
  const add = (...args) => {
    if(args.length <= 1) return args[0]
    const newArr = splitArgs(args);
    return Promise.all(newArr).then(res => add(...res));
  };
  (async () => {
    add(1, 2).then(res => console.log(res));
    add(1,2,3,4).then(res => console.log(res))
  })();
