要想实现 `new`关键字，我们首先应当知道 `new`的过程中干了哪些事情，首先看代码：

```js
function Person (name, age) {
    this.name = name;
    this.age = age;
    this.habit = 'Games';
}

Person.prototype.strength = 60;

Person.prototype.sayName = function () {
    console.log('I am ' + this.name);
}

var person = new Person('Kevin', '18');

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60

person.sayName(); // I am Kevin
```

从这个例子中，我们可看到：

在函数中，创建了一个对象

`person`不仅可以访问 `Person`构造函数的属性，还可以访问到 `Person.prototype`中的属性。

并且在调用 `sayName`时，`this`是指向 `person`的

### new时干了什么：

我们可以用以下四点概括：

(1) 创建一个新对象；
(2) 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象） ；
(3) 执行构造函数中的代码（为这个新对象添加属性） ；
(4) 返回新对象。

这里我们直接以函数的方式来模拟：

```js
const newFactory = function () {
    let obj = Object.create({}) // 创建一个对象
    Constructor = [].shift.call(arguments) // 取出第一个参数，作为构造对象
    obj.__proto__ = Constructor.prototype // 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
    Constructor.apply(obj, arguments) // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
    return obj;
}
```

这里我们还要注意一下构造函数有返回值的情况：

```js
function Otaku (name, age) {
    this.strength = 60;
    this.age = age;
    return {
        name: name,
        habit: 'Games'
    }
}
var person = new Otaku('Kevin', '18');
console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // undefined
console.log(person.age) // undefined
```

由代码可以看出，当构造函数存在返回值时，实例只能访问返回对象中的属性。

所以在调用构造函数时，我们还要判断返回值是否为一个对象，如果是一个对象我们就返回这个对象，如果没有，就返回新创建的对象。

```js
function newFactory() {
    var obj = Object.create({}),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
};
```

### Object.create 和 {} 的区别

`Object.create` 可以指定原型，创建一个空对象。
`{}` 就相当于 `Object.create(Object.prototype)` ，即根据 `Object` 原型的空对象
