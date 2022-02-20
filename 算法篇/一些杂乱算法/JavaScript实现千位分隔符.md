```js
function numFormat(num){
  const intNum = num.toString().split('.')[0]
  const flNum = num.toString().split('.')[1]
  let resStr = ''
  let count = 0
  for(let i = intNum.length - 1; i >= 0; i--) {
    count++
    resStr = intNum[i] + resStr
    if(count === 3) {
      count= 0
      resStr = ',' + resStr
    }
  }
  return resStr+'.'+ flNum
}
console.log(numFormat(19351235.891)) // 19,351,235.891
```

