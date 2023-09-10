### 深入JS面向对象

#### 对象的定义：

JavaScript支持函数式编程和面向对象编程：

- JavaScript中的对象被设计成一组属性的无序集合，像一个哈希表，有`key`和`value`组成；
- `key`是一个标识符名称，`value`可以是任意类型，也可以是其他对象或者函数类型；
- 如果值是一个函数，就可以称为对象的方法；

创建对象的方法：

```js
// 1、创建一个空对象
var obj = new Object()
obj.neme = 'zhangsan'
obj.eating = function() {}
// 2、字面量形式创建对象
var obj2 = {
    name: 'zhangsan',
    eating: function() {}
}
```

#### 属性操作符：

对象的属性默认是可以获取、修改、删除的，如果我们想要对**一个属性进行比较精准的操作控制**，那么我们就可以使用属性描述符。通过属性描述符可以精准的添加或者修改对象的属性；属性描述符需要使用`object.defineProperty`来对属性进行添加或者修改；

`object.defineProperty()`方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

`args`:

- `obj`要定义属性的对象
- `prop`要定义或修改的属性名称或`Symobl`
- `descriptor`要定义或修改的属性描述符

##### 属性操作符的分类：

###### 数据描述操作符：

- Configurable: 表示属性是否可以通过delete删除属性，是否可以修改它的特性，或者是否可以将它修改为存取属性描述符；

- enumerable：表示属性是否可以通过`for-in`或者`Object.keys()`返回该属性。

- Writable：表示是否可以修改属性的值；

- value: 属性的value值，读取属性时会返回该值，修改属性时，会对其进行修改。

  ```js
  Object.defineProperty(obj, "address", {
    // 很多配置
    value: "北京市", // 默认值undefined
    // 该特殊不可删除/也不可以重新定义属性描述符
    configurable: false, // 默认值false
    // 该特殊是配置对应的属性(address)是否是可以枚举
    enumerable: true, // 默认值false
    // 该特性是属性是否是可以赋值(写入值) 
    writable: false // 默认值f\alse
  })
  ```

###### 存储属性操作符：

- Configurable：与数据描述符的一致

- enumerable：与数据描述符的一致

- get:  获取属性时会执行的函数.

- set:  设置属性时会执行的函数.

  ```js
  Object.defineProperty(obj, "address", {
    enumerable: true,
    configurable: true,
    get: function() {
      foo()
      return this._address
    },
    set: function(value) {
      bar()
      this._address = value
    }
  })
  ```

##### 定义多个属性描述符：

```js
Object.defineProperties(obj, {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "why"
  },
  age: {
    configurable: true,
    enumerable: true,
    get: function() {
      return this._age
    },
    set: function(value) {
      this._age = value
    }
  }
})
```

##### 获取属性描述符：

`Object.getOwnPropertyDescriptor()`:获取某个值的属性描述符

`Object.getOwnPropertyDescriptors()`：获取所有属性的属性描述符

#### 对对象的限制：

`preventExtensions`: 禁止对象扩展新属性，给对象添加新的属性会报错；

```js
var obj = {
  name: 'why',
  age: 18
}
// 1.禁止对象继续添加新的属性
Object.preventExtensions(obj)
obj.height = 1.88
obj.address = "广州市"
console.log(obj)
```

seal:密封对象，不允许配置和删除属性。

实际是调用`preventExtensions`，并将现有属性的`configurable:false`

```js
var obj = {
  name: 'why',
  age: 18
}
Object.seal(obj)
delete obj.name
console.log(obj.name)// why
```

freeze: 冻结对象，不允许修改现有属性

实际上是调用seal，并将现有属性的`writable：false`

```js
var obj = {
  name: 'why',
  age: 18
}
Object.freeze(obj)
obj.name = "kobe"
console.log(obj.name)// why
```

#### 批量创建对象之——工厂函数

```js
// 工厂模式: 工厂函数
function createPerson(name, age, height, address) {
  var p = {}
  p.name = name
  p.age = age
  p.height = height;
  p.address = address

  p.eating = function() {
    console.log(this.name + "在吃东西~")
  }

  p.running = function() {
    console.log(this.name + "在跑步~")
  }

  return p
}
var p1 = createPerson("张三", 18, 1.88, "广州市")
var p2 = createPerson("李四", 20, 1.98, "上海市")
var p3 = createPerson("王五", 30, 1.78, "北京市")
// 工厂模式的缺点(获取不到对象最真实的类型)
console.log(p1, p2, p3)
```

#### 批量创建函数之——构造函数

```js
// 规范: 构造函数的首字母一般是大写
function Person(name, age, height, address) {
  this.name = name
  this.age = age
  this.height = height
  this.address = address

  this.eating = function() {
    console.log(this.name + "在吃东西~")
  }

  this.running = function() {
    console.log(this.name + "在跑步")
  }
}

var p1 = new Person("张三", 18, 1.88, "广州市")
var p2 = new Person("李四", 20, 1.98, "北京市")
// 缺点：比如eating和running的函数执行逻辑是差不多的，但是每次在new时都会创建新的函数，p1.eating !== p2.eating, 这样是浪费性能的。可以通过原型链的方式来优化。
```

#### 批量创建函数之——原型和原型链

```js
function Person(name, age, height, address) {
  this.name = name
  this.age = age
  this.height = height
  this.address = address
}
Person.prototype.eating = function() {
  console.log(this.name + "在吃东西~")
}
Person.prototype.running = function() {
  console.log(this.name + "在跑步~")
}
var p1 = new Person("why", 18, 1.88, "北京市")
var p2 = new Person("kobe", 20, 1.98, "洛杉矶市")
p1.eating === p2.eating

```

#### 继承

JS常见的6种继承方式：

##### 一、原型链的继承：让子构造函数的原型指向`new`的父构造函数。

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

##### 二、构造函数继承（借助call）: 既然new不会主动调用原型链上父方法，那么我们可以在子函数中使用call来调用从而获取分配的内存。

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

##### 三、组合继承（前两种方式组合)

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

##### 四、原型链式继承(Object.create)

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

##### 五、寄生式继承

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

 从最后的输出结果中可以看到，person5通过 clone 的方法，增加了 `getFriends` 的方法，从而使 person5 这个普通对象在继承过程中又增加了一个方法，这样的继承方式就是寄生式继承。 

##### 六、寄生组合式继承（相对最优）

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

##### ES6 的 extends 关键字实现逻辑

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

#### Class

###### 类的方法：

```js
var names = ["abc", "cba", "nba"]

class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  // 普通的实例方法
  // 创建出来的对象进行访问
  // var p = new Person()
  // p.eating()
  eating() {
    console.log(this.name + " eating~")
  }
  // 类的静态方法(类方法)
  // Person.createPerson()
  static randomPerson() {
    var nameIndex = Math.floor(Math.random() * names.length)
    var name = names[nameIndex]
    var age = Math.floor(Math.random() * 100)
    return new Person(name, age)
  }
}

var p = new Person("why", 18)
p.eating()
Person.randomPerson()
```

###### 类的访问器方法

```js
class Person {
  constructor(name) {
      this._name = name
  }
  set name(newName) {
      console.log(`调用了name的setter方法${newName}`)
      this._name = newName
  }
  get name() {
      console.log("调用了name的getter方法")
      return this._name
  }
}
const p = new Person('zhangsan')
console.log(p.name)
p.name = 'lisi'
```

###### 混入效果：

在JS中类只能有一个父类：单继承，要想实现多继承只能用混入。

```js

function mixinRunner(BaseClass) {
  class NewClass extends BaseClass {
    running() {
      console.log("running~")
    }
  }
  return NewClass
}

function mixinEater(BaseClass) {
  return class NewClass extends BaseClass {
    eating() {
      console.log("eating~")
    }
  }
}
class Student extends Person {

}
var NewStudent = mixinEater(mixinRunner(Student))
var ns = new NewStudent()
ns.running()
ns.eating()
```

原型的相关内容补充：

```js
var obj = {
  name: "why",
  age: 18
}
var info = Object.create(obj, {
  address: {
    value: "北京市",
    enumerable: true
  }
})
// hasOwnProperty方法判断, 只有当前对象有该属性才返回true
console.log(info.hasOwnProperty("address"))
console.log(info.hasOwnProperty("name"))
// in 操作符: 不管在当前对象还是原型中返回的都是true
console.log("address" in info)
console.log("name" in info)
```







