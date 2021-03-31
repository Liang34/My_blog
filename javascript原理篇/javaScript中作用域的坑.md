1、

```js
var a, b
(function () {
 alert(a);
 alert(b);
var a = (b = 3);
  alert(a);
 alert(b);   
})()
alert(a);
alert(b);
// undefined undefined 3 3 undefined 3
```

