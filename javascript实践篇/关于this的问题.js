var name = 'window'
const obj = {
    name: 'obj',
    sayName:function() {
        console.log(this.name)
    },
}
obj.sayMyName = () => {
    console.log(this.name)
}
const fn1 = obj.sayName
const fn2 = obj.sayMyName
fn1() // window
obj.sayName() // obj
fn2() // window
obj.sayMyName() // window
// 分析：
// 1、sayName是普通函数this会随调用者默认绑定，fn1的执行环境是全局所以是window
// 2、obj.sayName中sayName是普通函数，调用者是obj，所以this默认绑定到obj上
// 3、obj.sayMyName是一个箭头函数，而箭头函数是不绑定this,this由外层环境决定，所以应当是window
// 4、和3同理
// 箭头函数本身没有this，但是它在声明时可以捕获其所在上下文的this供自己使用。