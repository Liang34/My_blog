原型与原型链的作用在于，方法的继承与属性的共享（因为`js`没有类的概念）,要彻底理解原型与原型链，首先我们来理解三个概念：

#### prototype:

每个函数都有一个 prototype 属性， 注意**对象是没有prototype属性，只有函数才有prototype属性。** 

```js
function Person() {}
var p = new Person();
//方法才有prototype,普通对象无prototype
console.log(Person.prototype); // Object{} 
console.log(p.prototype); // undifined
//任何对象都是有构造函数constructor，由构造函数创建的对象也可以获得构造函数的引用
//此处只是打印下列对象的构造函数是什么。
console.log(p.constructor); //function Person(){}  
console.log(Person.constructor); //function Function(){} 
console.log({}.constructor); // function Object(){}
console.log(Object.constructor); // function Function() {}
console.log([].constructor);  //function Array(){} 
```

#### `__proto__`:

这是每一个JavaScript对象(除了 null )都具有的一个属性，叫__proto__，这个属性会指向该对象的原型。

```js
function Person() {}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

#### constructor

每个原型都有一个 constructor 属性指向关联的构造函数。

```js
function Person() {
}
console.log(Person === Person.prototype.constructor); // true
```

原型链的关系可查看一下图：

![](https://img-blog.csdnimg.cn/20210313161251376.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NDkyMDg2Mw==,size_16,color_FFFFFF,t_70)

#### 与原型链相关的题目：

1、以下代码输出：

```js
function Person(name) {
    this.name = name;
}
var p1 = new Person('小米');
Person.prototype = {
    constructor: Person
};

console.log(p1.constructor === p1.__proto__.constructor);
console.log(p1.__proto__.constructor === Person.prototype);
console.log(p1.constructor === Person);
console.log(p1.__proto__ === Person.prototype)
```

解析：`true`、`false`、`true`、`false`

首先要注意在实例`p1`后`Person.prototype`修改了原型对象，此时`p1`的隐式原型与Person的显示原型不在指向同一个对象，所以第四个是`false`,一中均指向`Person`,二中等式左边指向`Person`，等式右边指向新赋值的对象。

三中均为`Person`.

