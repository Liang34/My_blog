
// 假设有以下三个函数
// a()
// b()
// c()

// 实现 compose 函数，使得
// compose([a, b, c])(args) = a(b(c(args)))




const add = (...args) => {
  if(args.length === 3) {
    return args.reduce((a,b) => a+b , 0)
  } else {
    return function fn1(...newArgs) {
      args = args.concat(newArgs)
      if(args.length === 3) return args.reduce((a,b) => a+b , 0)
      return fn1
    }
  }

}
console.log(add(1, 2, 3)); // 6
console.log(add(1, 2)(3));// 6
console.log(add(1)(2, 3)); // 6