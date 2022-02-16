JS常见的6种继承方式：

### 一、原型链的继承：让子构造函数的原型指向`new`的父构造函数。

```js
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}
function Son() {
  this.type = 'child'
}
Son.prototype = new Parent()
console.log(new Son())
```

问题：

```js
const s1 = new Son()
const s2 = new Son()
s1.play.push(4)
console.log(s1.play, s2.play)--->(4) [1, 2, 3, 4] (4) [1, 2, 3, 4]
```

原因： 在new对象时只是执行了构造函数，并不会执行原型链上的构造函数，故s1与s2两个实例使用的是同一个原型对象，他们内存是共享的。

### 二、构造函数继承（借助call）: 既然new不会主动调用原型链上父方法，那么我们可以在子函数中使用call来调用从而获取分配的内存。

```js
function Parent() {
  this.name = 'parent'
}
function Son() {
  Parent.call(this)
  this.type = 'child'
}
let child = new Son()
```

但显然这样还有问题，不能调用父函数上原型链的方法。

```js
Parent1.prototype.getName = function () {
 return this.name;
}
child.getName() // 报错
```

### 三、组合继承（前两种方式组合)

```js
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}
Parent.prototype.getName = function () {
  return this.name;
}
function Son() {
  // 第一次调用parent3()
  Parent.call(this)
  this.type = 'child'
}
// 第二次调用parent3()
Son.prototype = new Parent()
// 手动挂上构造器，指向自己的构造函数, 否则以后实例调用constructor不会指向Son
Son.prototype.constructor = Son;
var s3 = new Son();
var s4 = new Son();
s3.play.push(4);
console.log(s3.play, s4.play);  // 不互相影响
console.log(s3.getName()); // 正常输出'parent'
console.log(s4.getName()); // 正常输出'parent'
```

问题：两次调用Parent造成性能浪费。

### 四、原型链式继承(Object.create)

ES5 里面的 Object.create 方法，这个方法接收两个参数：一是用作新对象原型的对象、二是为新对象定义额外属性的对象（可选参数）。

```js
let parent = {
  name: "parent",
  friends: [1, 2, 3, 4],
  getName: function() {
    return this.name
  }
};
let person1 = Object.create(parent);
person1.name = "tom";
person1.friends.push(5);
let person2 = Object.create(parent);
person2.friends.push(6);
console.log(person1.name); // tom
console.log(person1.name === person1.getName());// true
console.log(person2.name);// parent
console.log(person1.friends);// [1,2, 3, 4, 5, 6]
console.log(person2.friends);// [1,2, 3, 4, 5, 6]
```

 这种继承方式的缺点也很明显，多个实例的引用类型属性指向相同的内存，存在篡改的可能，接下来我们看一下在这个继承基础上进行优化之后的另一种继承方式——寄生式继承。 

### 五、寄生式继承

使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法，这样的继承方式就叫作寄生式继承。

虽然其优缺点和原型式继承一样，但是对于普通对象的继承方式来说，寄生式继承相比于原型式继承，还是在父类基础上添加了更多的方法。

````js
let parent = {
  name: "parent",
  friends: ["p1", "p2", "p3"],
  getName: function() {
    return this.name;
  }
};
function clone(original) {
  let clone = Object.create(original);
  clone.getFriends = function() {
    return this.friends;
  };
  return clone;
}
let person = clone(parent);
console.log(person.getName());
console.log(person.getFriends());
````

 从最后的输出结果中可以看到，person5 通过 clone 的方法，增加了 `getFriends` 的方法，从而使 person5 这个普通对象在继承过程中又增加了一个方法，这样的继承方式就是寄生式继承。 

### 六、寄生组合式继承（相对最优）

```js
function clone (parent, child) {
  // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}
function Parent() {
  this.name = 'parent';
  this.play = [1, 2, 3];
}
 Parent.prototype.getName = function () {
  return this.name;
}
function Child() {
  Parent.call(this);
  this.friends = 'child';
}
clone(Parent, Child);
Child.prototype.getFriends = function () {
  return this.friends;
}
let person = new Child();
console.log(person);
console.log(person.getName());
console.log(person.getFriends());
```

### ES6 的 extends 关键字实现逻辑

我们可以利用 ES6 里的 extends 的语法糖，使用关键词很容易直接实现 JavaScript 的继承，但是如果想深入了解 extends 语法糖是怎么实现的，就得深入研究 extends 的底层逻辑。

我们先看下用利用 extends 如何直接实现继承，代码如下。

```js
class Person {
  constructor(name) {
    this.name = name
  }
  // 原型方法
  // 即 Person.prototype.getName = function() { }
  // 下面可以简写为 getName() {...}
  getName = function () {
    console.log('Person:', this.name)
  }
}
class Gamer extends Person {
  constructor(name, age) {
    // 子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    super(name)
    this.age = age
  }
}
const asuna = new Gamer('Asuna', 20)
asuna.getName() // 成功访问到父类的方法
```

因为浏览器的兼容性问题，如果遇到不支持 ES6 的浏览器，那么就得利用 babel 这个编译工具，将 ES6 的代码编译成 ES5，让一些不支持新语法的浏览器也能运行。

那么最后 extends 编译成了什么样子呢？我们看一下转译之后的代码片段。

```js
function _possibleConstructorReturn (self, call) { 
		// ...
		return call && (typeof call === 'object' || typeof call === 'function') ? call : self; 
}
function _inherits (subClass, superClass) { 
    // 这里可以看到
	subClass.prototype = Object.create(superClass && superClass.prototype, { 
		constructor: { 
			value: subClass, 
			enumerable: false, 
			writable: true, 
			configurable: true 
		} 
	}); 
	if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; 
}

var Parent = function Parent () {
	// 验证是否是 Parent 构造出来的 this
	_classCallCheck(this, Parent);
};
var Child = (function (_Parent) {
	_inherits(Child, _Parent);
	function Child () {
		_classCallCheck(this, Child);
		return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
}
	return Child;
}(Parent));
```

从上面编译完成的源码中可以看到，它采用的也是寄生组合继承方式，因此也证明了这种方式是较优的解决继承的方式。

