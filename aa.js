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
// class Event {
//   constructor() {
//     this.events = {}
//   }
//   // 监听
//   on(type, callback) {
//     (this.events[type] || (this.events[type] = [])).push({ listener: callback });
//   }
//   // 发布
//   emit(type, args) {
//     this.events[type].forEach(element => {
//       element.listener(args)
//       if(element.once) {
//         this.off(type, element.listener)
//       }
//     });
//   }
//   once(type, callback) {
//     (this.events[type] || (this.events[type] = [])).push({ listener: callback, once: true });
//   }
//   off(type, callback) {
//     if(this.e)
//   }
// }
// const e = new Event()

// e.on('click', x => console.log('aaa', x))
// e.on('click', x => console.log('aaa1', x))
// e.on('click2', x => console.log('aaa1', x))
// e.emit('click2', {i: 1})
// const arr = [1, [2, [3], 4], 5]

// const flatten = (arr) => {
//   let res = []
//   for(const val of arr) {
//     if(Array.isArray(val)) {
//       res = res.concat(flatten(val))
//     } else {
//       res.push(val)
//     }
//   }
//   return res
// }
// console.log(flatten(arr))
function mySetInterVal(fn, a, b) {
  let timeout = null;
  let time = a;
  const startFn = () => {
    timeout = setTimeout(() => {
      fn()
      startFn()
    }, time);
    time += b;
    fn();
  };
  startFn()
  return () => {
    clearTimeout(timeout);
  };
}
const a = mySetInterVal(() => {
  console.log('hello world')
}, 10, 20)

setTimeout(() => {
  a()
}, 10000)