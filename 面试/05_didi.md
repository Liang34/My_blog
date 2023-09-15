* 数组转树

```js
const convert = (arr) => {
    const res = []
    const dfs = (newArr, pId) => {
        for(let v of arr) {
            if(v.parentId === pId) {
                const children = []
                newArr.push({...v, children})
                dfs(children, v.id)
            }
        }
    }
    dfs(res, 0)
    return res
}
```

* 数字转文字

// 输入：1001,1001

// 输入：一千零一万一千零一 , 10位数

```js
function numberToChinese(num) {
  // 映射
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  // 位数
  const chineseUnits = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];
 
  if (num === 0) {
    return chineseNums[0];
  }
 
  let chineseStr = '';
  let unitIndex = 0;
 
  while (num > 0) {
    // 取最后一位
    const digit = num % 10;
    if (digit !== 0) {
      // 处理非零数字
      chineseStr = chineseNums[digit] + chineseUnits[unitIndex] + chineseStr;
    } else if (chineseStr.charAt(0) !== chineseNums[0]) {
      // 处理连续的零，只保留一个零
      chineseStr = chineseNums[0] + chineseStr;
    }
    // 去掉最后一位
    num = Math.floor(num / 10);
    // 位数增加
    unitIndex++;
  }
 
  return chineseStr;
}
console.log(numberToChinese(10011001))
```
