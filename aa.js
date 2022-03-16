// 找出ab或ba
const arr = [
  ["b", "r", "a","g"],
  ["#", "b", "a","a"],
  ["c", "d", "b","b"],
  ["a", "c", "a","b"]
]
function computed(arr) {
  let count = 0
  const n = arr.length
  const m = arr[0].length
  const findCount = function(char, i, j, level) {
    if(i < 0 || i >= n || j < 0 || j >= m) return
    if(level === 0) return
    
    findCount(char, i - 1, j, level--)
    findCount(char, i + 1, j)
    findCount(char, i, j - 1)
    findCount(char, i, j + 1)
    if(arr[i][j] === char)  {
      count++
      arr[i][j] = '#'
      return
    }
  }
  for(let i = 0; i < n; i++) {
    for(let j = 0; j < m; j++) {
      if(arr[i][j] === 'b', i, j) {
        findCount('a', i, j)
      }
      if(arr[i][j] === 'a') {
        findCount('b', i, j)
      }
    }
  }
  return count
}
console.log(computed(arr))