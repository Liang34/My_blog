// // 找出ab或ba
// const arr = [
//   ["b", "r", "a","g"],
//   ["#", "b", "a","a"],
//   ["c", "d", "b","b"],
//   ["a", "c", "a","b"]
// ]
// function computed(arr) {
//   let count = 0
//   const n = arr.length
//   const m = arr[0].length
//   const findCount = function(char, i, j, level) {
//     if(i < 0 || i >= n || j < 0 || j >= m) return
//     if(level === 0) return
    
//     findCount(char, i - 1, j, level--)
//     findCount(char, i + 1, j)
//     findCount(char, i, j - 1)
//     findCount(char, i, j + 1)
//     if(arr[i][j] === char)  {
//       count++
//       arr[i][j] = '#'
//       return
//     }
//   }
//   for(let i = 0; i < n; i++) {
//     for(let j = 0; j < m; j++) {
//       if(arr[i][j] === 'b', i, j) {
//         findCount('a', i, j)
//       }
//       if(arr[i][j] === 'a') {
//         findCount('b', i, j)
//       }
//     }
//   }
//   return count
// }
// console.log(computed(arr))
//数组去除重复的项，即[‘1’,‘2’,'1',1,‘3’]——>[‘1’,‘2’,1,‘3’]
// const removeDuplicates = (arr) => {
//   const obj = {};
//   const result = [];

//   for (let i = 0; i < arr.length; i++) {
//     const item = arr[i];
//     if (!obj[Symbol(item)]) {
//       obj[Symbol(item)] = true;
//       result.push(item);
//     }
//   }

//   return result;
// };

// console.log(removeDuplicates(["1", "2", "1", 1, "3"])); // 输出: ["1", "2", 1, "3"]
// {“a_b”:1}——>{“aB”:1} 

// function Person(name) {
//   this.name = name;
// }
// var p1 = new Person('小米');
// Person.prototype = {
//   constructor: Person
// };

// console.log(p1.constructor === p1.__proto__.constructor);// true
// console.log(p1.__proto__.constructor === Person.prototype);// false
// console.log(p1.constructor === Person);// true
// console.log(p1.__proto__ === Person.prototype)// false
// callcall() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
// 实现


function sum (...args) {
  const currentArg = [...args]
  const count = (...args1) => {
    currentArg.push(...args1)
    return count
  }
  count.sumOf = () =>{
    return currentArg.reduce((a, b) => a + b, 0)
  }
  return count
}
console.log(
  sum(1, 2, 3).sumOf(), //6
sum(2, 3)(2).sumOf(), //7
sum(1)(2)(3)(4).sumOf(), //10
sum(2)(4, 1)(2).sumOf(), //9
)