TypeScript入门

## 类型

### 基础类型

```ts
-number
let val1:number = 3;
-boolean
let val2:boolean = true;
-string
let val3:string = '123';
```

### 数组与元组类型

```ts
<!--数组-->
let arr1: Array<number> = [1, 3, 5]; // 只能存数字
let arr2: stringp[] = ['a', 'b', 'c']; // 只能放字符串
// 联合类型
let arr3: (number | string)[] = [1, 'a']; // 数字，字符串都可
// 任意类型
let arr4: any[] = [1, 'a', false]
// 元组类型
let arr6: [string, number, boolean] = ['123', 12, true]
```

### 枚举类型

```tsx
枚举类型是TS为JS扩展的一种类型, 在原生的JS中是没有枚举类型的枚举用于表示固定的几个取值.
例如: 一年只有四季、人的性别只能是男或者女.
enum Gender{ // 定义了一个名称叫做Gender的枚举类型, 这个枚举类型的取值有两个, 分别是Male和Femal
    Male,
    Femal
}
let val:Gender; // 定义了一个名称叫做val的变量, 这个变量中只能保存Male或者Femal
val = Gender.Male;
val = Gender.Femal;
// 我们可以通过枚举值拿到它对应的数字
console.log(Gender.Male); // 0
// 我们还可以通过它对应的数据拿到它的枚举值
console.log(Gender[0]); // Male
// 实现原理
var Gender;
(function (Gender) {
    // Gender[key] = value;
    Gender[Gender['Male'] = 0] = 'Male';
    Gender[Gender['Femal'] = 1] = 'Fmael';
})(Gender || (Gender = {}))
let Gender = {}
Gender["Male"] = 0;
Gender[0] = "Male";
Gender["Femal"] = 1;
Gender[1] = "Femal";
```

### any与void类型

```ts
any类型
// any表示任意类型, 当我们不清楚某个值的具体类型的时候我们就可以使用any
// 一般用于定义一些通用性比较强的变量, 或者用于保存从其它框架中获取的不确定类型的值
// 在TS中任何数据类型的值都可以负责给any类型
let value:any; // 定义了一个可以保存任意类型数据的变量
void类型
// void与any正好相反, 表示没有任何类型, 一般用于函数返回值
// 在TS中只有null和undefined可以赋值给void类型
function test():void {
    console.log("hello world");
}
```

### Never类型和Object类型

```ts
// Never类型
// 表示的是那些永不存在的值的类型
// 一般用于抛出异常或根本不可能有返回值的函数
function demo():never {
    throw new Error('报错了');
}
demo();
// Object类型
let obj:object; // 定义了一个只能保存对象的变量
obj = {name:'lnj', age:33};
```

### 类型断言

TS中的类型断言和其它编程语言的类型转换很像, 可以将一种类型强制转换成另外一种类型,类型断言就是告诉编译器, 你不要帮我们检查了, 相信我，我知道自己在干什么。

例如: 我们拿到了一个any类型的变量, 但是我们明确的知道这个变量中保存的是字符串类型, 此时我们就可以通过类型断言告诉编译器, 这个变量是一个字符串类型,此时我们就可以通过类型断言将any类型转换成string类型, 使用字符串类型中相关的方法了.

```js
let str:any = 'it666';
// 方式一
let len = (<string>str).length;
// 方式二
// 企业开发中推荐使用as来进行类型转换(类型断言)
// 因为第一种方式有兼容性问题, 在使用到了JSX的时候兼容性不是很好
let len = (str as string).length;
```

### 联合类型：

联合类型就是将多种数据类型通过|连接起来, 我们可以把枚举类型当做一个联合类型来使用

```js
let value:(number | string); // (number | string)联合类型
value = 1;
value = "123";
```

交叉类型：

交叉类型是将多个类型合并为一个类型,通过&

```js
```



## 接口

### 接口类型

和number,string,boolean,enum这些数据类型一样,接口也是一种类型, 也是用来约束使用者的.

```js
// 定义一个接口类型
interface FullName{
    firstName:string
    lastName:string
}
let obj = {
    firstName:'Jonathan',
    lastName:'Lee'
    // lastName:18
};
// 需求: 要求定义一个函数输出一个人完整的姓名, 这个人的姓必须是字符串, 这个人的名也必须是一个字符
function say({firstName, lastName}:FullName):void {
    console.log(`我的姓名是:${firstName}_${lastName}`);
}
say(obj);
```

### 可选属性

```ts
// 定义一个接口
interface FullName{
    firstName:string
    lastName:string
    middleName?:string // ?表示可传可不传
    [propName:string]:any
}
function say({firstName, lastName, middleName}:FullName):void {
    // console.log(`我的姓名是:${firstName}_${lastName}`);
    if(middleName){
        console.log(`我的姓名是:${firstName}_${middleName}_${lastName}`);
    }else{
        console.log(`我的姓名是:${firstName}_${lastName}`);
    }
}
```

### 索引签名

索引签名用于描述那些“通过索引得到”的类型，比如arr[10]或obj["key"]

```ts
interface FullName {
    [propName:string]:string
}
let obj:FullName = {
    // 注意点: 只要key和value满足索引签名的限定即可, 无论有多少个都无所谓
    firstName:'Jonathan',
    lastName:'Lee',
    // middleName:false // 报错
    // false: '666' // 无论key是什么类型最终都会自动转换成字符串类型, 所以没有报错
}
```

### 只读属性

让对象属性只能在对象刚刚创建的时候修改其值

```ts
interface FullName {
    firstName:string
    readonly lastName:string
}
let myName:FullName1 = {
    firstName: 'Jonathan',
    lastName: 'Lee'
};
// myName.lastName = 'Wang';报错
let arr2:ReadonlyArray<string> = ['a', 'b', 'c'];
// arr2[0] = '666';// 报错
```

### 函数接口

我们除了可以通过接口来限定对象以外, 我们还可以使用接口来限定函数

```ts
interface SumInterface {
    (a: number, b: number) :number
}
let sum: SumInterface = function (x:number, y:number): number {
    return x+y;
}
```

### 混合类型接口

```ts
interface CountInterface {
    (): void
    count: number
}
let getCounter = (function (): CountInterface {
    /*
    CountInterface接口要求数据既要是一个没有参数没有返回值的函数
                              又要是一个拥有count属性的对象
    fn作为函数的时候符合接口中函数接口的限定 ():void
    fn作为对象的时候符合接口中对象属性的限定  count:number
    * */
    let fn = <CountInterface>function () {
        fn.count++;
        console.log(fn.count);
    }
    fn.count = 0;
    return fn;
})();
getCounter();
getCounter();
getCounter();
```

接口的继承

```ts
interface LengthInterface {
    length:number
}
interface WidthInterface {
    width:number
}
interface HeightInterface {
    height:number
}
interface RectInterface extends LengthInterface,WidthInterface,HeightInterface {
    color:string
}
let rect:RectInterface = {
    length:10,
    width:20,
    height:30,
    color:'red'
}

```

## 函数

### 函数声明

```ts
// 在TS中函数的完整格式应该是由函数的定义和实现两个部分组成的
// 定义一个函数
let AddFun:(a:number, b:number)=>number;
// 根据定义实现函数
AddFun = function (x:number, y:number):number {
    return x + y;
};
// 一步到位写法
let AddFun:(a:number, b:number)=>number =
function (x:number, y:number):number {
    return x + y;
};
// 根据函数的定义自动推导对应的数据类型
let AddFun:(a:number, b:number)=>number =
    function (x, y) {
        return x + y;
    };
let res = AddFun(20, 20);
```

### 函数重载

函数的重载就是同名的函数可以根据不同的参数实现不同的功能

```ts
// 定义函数的重载
function getArray(x:number):number[];
function getArray(str:string):string[];
// 实现函数的重载
function getArray(value:any):any[] {
    if(typeof value === 'string'){
        return value.split('');
    }else{
        let arr = [];
        for(let i = 0; i <= value; i++){
            arr.push(i);
        }
        return arr;
    }
}
```

可选参数

```ts
function add(x:number, y:number, z?:number):number {
    return x + y + (z ? z : 0);
}
// 可选参数可以配置函数重载一起使用, 这样可以让函数重载变得更加强大
function add(x:number, y:number):number;
function add(x:number, y:number, z:number):number;
function add(x:number, y:number, z?:number) {
    return x + y + (z ? z : 0);
}
let res = add(10, 20, 30);
```

默认参数

```ts
function add(x:number, y:number=10):number {
    return x + y;
}
// let res = add(10);
let res = add(10, 30);
console.log(res);
```

剩余参数

```ts
function add(x:number, ...ags:number[]) {
    console.log(x);
    console.log(ags);
}
add(10, 20, 30, 40, 50)
```

## 泛型：

- 在编写代码的时候我们既要考虑代码的健壮性, 又要考虑代码的灵活性和可重用性，通过TS的静态检测能让我们编写的代码变得更加健壮, 但是在变得健壮的同时却丢失了灵活性和可重用性，所以为了解决这个问题TS推出了泛型的概念
- 通过泛型不仅可以让我们的代码变得更加健壮, 还能让我们的代码在变得健壮的同时保持灵活性和可重用性

```ts
// 需求: 定义一个创建数组的方法, 可以创建出指定长度的数组, 并且可以用任意指定的内容填充这个数组
let getArray = (value:any, items:number = 5):any[]=>{
    return new Array(items).fill(value);
};
// let arr = getArray("abc", 3);
let arr = getArray(6, 3);
let res = arr.map(item=>item.length); // ['abc', 'abc', 'abc'] => [3, 3, 3]
// 当前存储的问题:
// 1.编写代码没有提示, 因为TS的静态检测不知道具体是什么类型
// 2.哪怕代码写错了也不会报错, 因为TS的静态检测不知道具体是什么类型
// 需求:要有代码提示, 如果写错了要在编译的时候报错
let getArray1 = <T>(value:T, items:number = 5):T[]=>{
    return new Array(items).fill(value);
};
// let arr = getArray<string>('abc');
// let arr = getArray<number>(6);
// 注意点: 泛型具体的类型可以不指定
//         如果没有指定, 那么就会根据我们传递的泛型参数自动推导出来
let arr = getArray1('abc');
// let arr = getArray(6); // 接下来读取length会报错
let res = arr.map(item=>item.length);
console.log(res);
```

### 泛型约束

默认情况下我们可以指定泛型为任意类型,但是有些情况下我们需要指定的类型满足某些条件后才能指定,那么这个时候我们就可以使用泛型约束.

```ts
// 需求: 要求指定的泛型类型必须有Length属性才可以
interface LengthInterface{
    length:number
}
let getArray = <T extends LengthInterface>(value:T, items:number = 5):T[]=>{
    return new Array(items).fill(value);
};
let arr = getArray<string>('abc');
// let arr = getArray<number>(6);
let res = arr.map(item=>item.length);
```

## 类

```ts
class Person {
    name:string; // 和ES6区别, 需要先定义实例属性, 才能够使用实例属性
    age:number;
    constructor(name:string, age:number){
        this.name = name;
        this.age = age;
    }
    say():void{
        console.log(`我的名称叫${this.name}, 我的年龄是${this.age}`);
    }
    static food:string; // 静态属性
    static eat():void{ // 静态方法
        console.log(`我正在吃${this.food}`);
    }
}
let p = new Person('lnj', 34);
p.say();
Person.food = '蛋挞';
Person.eat();
class Student extends Person{
    book:string;
    constructor(name:string, age:number, book:string){
        super(name, age);
        this.book = book;
    }
    say():void{
        console.log(`我是重写之后的say-${this.name}${this.age}${this.book}`);
    }
    static eat():void{
        console.log(`我是重写之后的eat-${this.food}`);
    }
}
let stu = new Student('zs', 18, '从零玩转');
stu.say();
Student.food = '冰淇淋';
Student.eat();
```

### 类属性修饰符

public(公开的) : 如果使用public来修饰属性, 那么表示这个属性是公开的,可以在类的内部使用, 也可以在子类中使用, 也可以在外部使用.

protected(受保护的) :如果使用protected来修饰属性, 那么表示这个属性是受保护的,可以在类的内部使用, 也可以在子类中使用.

private(私有的): 如果使用private来修饰属性, 那么表示这个属性是私有的,可以在类的内部使用

readonly(只读的) 

### 类方法修饰符

```ts
// 需求: 有一个基类, 所有的子类都需要继承于这个基类, 但是我们不希望别人能够通过基类来创建对象
class Person {
    name:string;
    age:number;
    gender:string;
    protected constructor(name:string, age:number, gender:string){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    say():void{
        console.log(`name=${this.name},age=${this.age},gender=${this.gender}`);
    }
}
class Student extends Person {
    constructor(name: string, age: number, gender: string) {
        super(name, age, gender);
    }
}
let p = new Person('lnj', 34, 'male');// 报错，类“Person”的构造函数是受保护的，仅可在类声明中访问。
let stu = new Student('zs', 18, 'female');
```

### 类可选参数

```ts
// 和接口中的可选属性一样, 可传可不传的属性
class Person {
    // 注意点: 在TS中如果定义了实例属性, 那么就必须在构造函数中使用, 否则就会报错
    name:string;
    age?:number; // 可选属性
    constructor(name:string, age?:number){
        this.name = name;
        this.age = age;
    }
    // setNameAndAge(name:string, age:number){
    //     this.name = name;
    //     this.age = age;
    // }
}
let p = new Person('lnj');
console.log(p);
```

### 类存储器

通过getters/setters来截取对对象成员的访问

```ts
class Person {
    private _age:number = 0;
    set age(val:number){
        console.log('进入了set age方法');
        if(val<0){
            throw new Error('人的年龄不能小于零');
        }
        this._age = val;
    }
    get age():number{
        console.log('进入了get age方法');
        return this._age;
    }
}
let p = new Person();
p.age = 34;
// p.age = -6; // p.age(-6);
console.log(p.age);
```

### 抽象类

1.什么是抽象类?

抽象类是专门用于定义哪些不希望被外界直接创建的类的，抽象类一般用于定义基类，抽象类和接口一样用于约束子类。

2.抽象类和接口区别?

接口中只能定义约束, 不能定义具体实现，而抽象类中既可以定义约束, 又可以定义具体实现。

```ts
abstract class Person {
    abstract name:string;
    abstract say():void;
    eat():void{
        console.log(`${this.name}正在吃东西`);
    }
}
// let p = new Person(); // 无法创建抽象类的实例。
class Student extends Person{
    name:string = 'lnj';
    say():void{
        console.log(`我的名字是${this.name}`);
    }
}
let stu = new Student();
stu.say();
stu.eat();
```

### 类与接口

```ts
// 类"实现"接口
interface PersonInterface {
    name:string;
    say():void;
}
// 只要实现的某一个接口, 那么就必须实现接口中所有的属性和方法
class Person implements PersonInterface{
    name:string = 'lnj';
    say():void{
        console.log(`我的名字叫:${this.name}`);
    }
}
// 接口"继承"类
class Person {
    // protected name:string = 'lnj';
    name:string = 'lnj';
    age:number = 34;
    protected say():void{
        console.log(`name = ${this.name}, age = ${this.age}`);
    }
}
// 注意点: 只要一个接口继承了某个类, 那么就会继承这个类中所有的属性和方法
//         但是只会继承属性和方法的声明, 不会继承属性和方法实现
// 注意点: 如果接口继承的类中包含了protected的属性和方法, 那么就只有这个类的子类才能实现这个接口
interface PersonInterface extends Person{
    gender:string;
}
class Student extends Person implements PersonInterface{
    gender:string = 'male';
    name:string = 'zs';
    age:number = 18;
    say():void{
        console.log(`name = ${this.name}, age = ${this.age}, gender = ${this.gender}`);
    }
}
let stu = new Student();
stu.say();
```

### 泛型类

```ts
// 泛型类
class Chache<T> {
    arr:T[] = [];
    add(value:T):T{
        this.arr.push(value);
        return value;
    }
    all():T[]{
        return this.arr;
    }
}
let chache = new Chache<number>();
chache.add(1);
chache.add(3);
chache.add(5);
console.log(chache.all());
```



