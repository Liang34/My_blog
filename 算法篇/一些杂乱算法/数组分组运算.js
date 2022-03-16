// [5, [[4, 3], 2, 1]] ---> (5-((4-3)-2-1))
function calc(arr){
  return arr.reduce((prev, cur) => {
    if(Array.isArray(prev)){
      prev = calc(prev)
    }
    if(Array.isArray(cur)) {
      cur = calc(cur)
    }
    return prev - cur
  })
}
console.log(calc([5, [[4, 3], 2, 1]]))