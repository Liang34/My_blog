## 实现一个 sleep 函数

实现一个 sleep 函数，比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现。

#### 一、Promise

````js
const sleep = time => {
 retrun new Promise(resolve => setTimeout(resolve, time))
}
sleep(1000).then(()=>{
 console.log(1)
})
````

#### 二、Generator

```js
//Generator
function* sleepGenerator(time) {
  yield new Promise(function(resolve,reject){
    setTimeout(resolve,time);
  })
}
sleepGenerator(1000).next().value.then(()=>{console.log(1)})
```

#### 三、async/await

```js
//async
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve,time))
}
async function output() {
  let out = await sleep(1000);
  console.log(1);
  return out;
}
output();
```

#### 四、ES5

```js
function sleep(callback,time) {
  if(typeof callback === 'function')
    setTimeout(callback,time)
}

function output(){
  console.log(1);
}
sleep(output,1000);
```

