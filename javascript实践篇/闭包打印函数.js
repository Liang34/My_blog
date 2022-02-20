function repeat(fn, time, count) {
  function reType () {
    setTimeout(() => {
      if(count) {
        fn()
        count--
        reType()
      }
    }, time)
  }
  return reType
}
// 用例，每隔3秒打印hello，一共打印5次
run = repeat(()=>console.log('hello'), 3000, 5)
run()