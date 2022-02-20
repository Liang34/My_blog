```js
// \w匹配字母、数字、下划线。等价于 [A-Za-z0-9_]
// +	匹配前面的子表达式一次或多次。要匹配 + 字符，请使用 \+。
function parse_url(_url) { //定义函数
  var pattern = /(\w+)=(\w+)/ig; //定义正则表达式
  var parames = {}; //定义数组
  url.replace(pattern, function (a, b, c) {
    // console.log(a)// name=elephant, 代表第n个括号匹配的字符串。
    // console.log('b', b)// name
    // console.log(c)// elephant
    parames[b] = c
  });
  return parames; //返回这个数组.
}

var url = "http://www.baidu.com?name=elephant&age=25&sex=male"
var params = parse_url(url); // {name: 'elephant', age: '25', sex: 'male'}
console.log(params)
```

