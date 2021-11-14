# AST抽象语法树

### 抽象语法树的作用

在浏览器中是无法认识`vue`的模板语法的，他只认识`html`语法。`vue`在编译过程中先将模板语法转化为抽象语法树`AST`,然后再将抽象语法树`AST`转化为正常的`HTML`语法。转化为抽象语法树是为了通过抽象语法树进行过渡让编译工作变得简单。

### 抽象语法树是什么

抽象语法树实际是一个`js`对象，通过`js`对象将模板语法中的标签名、属性孩子节点等描述出来。

![ast](C:\Users\梁建辉\Desktop\ast.png)

### AST与VDOM的区别

注意他们是编译过程中的两个阶段，`vue`在编译过程：

模板语法-->抽象语法树-->渲染函数(h函数)-->虚拟节点(`vDOM`)-->界面

也就是说`ast`的终点是渲染函数，我们平时所说的`diff`是在`vDOM`上的

### 深入了解`AST`需要的算法储备

#### part1指针思想：

试寻找字符串中，**连续重复次数**最多的字符。

```txt
aaaabbbbbcccccccccccccdddddd
```

思路：用双指针的思想

- 如果`i`和`j`指向的字一样。那么`i`不动，j后移
- 如果`i`和`j`指向的字不一样，此时说明他们之间的字都是连续相同的，让`i`追上`j`，`j`后移

代码实现：

```js
function repeatMost(str) {
  let i = 0
  let j = 1
  // 默认第一个是最多的
  let ans = str[0]
  // 当前最多的个数
  let temp = 1
  while (j < str.length) {
    if (str[i] !== str[j]) {
      if ((j - i) > temp) {
        temp = j - i
        ans = str[i]
      }
      i = j
    }
    j++
  }
  return ans
}
```

#### part2:递归思想

在这里就不过多赘述斐波那契数列了，我们来看一下下面这个题：

```js
//转换数组的形式[1, 2, 3, [4, 5]]要变为这样的对象：
{
  chidren: [{
      value: 1
    },
    {
      value: 2
    },
    {
      value: 3
    },
    {
      children: [{
        {
          value: 4
        },
        {
          value: 5
        }
      }]
    }
  ]
}
```

递归的小技巧：只要出现了'规则复现'就要想到用递归

```js
function transform(arr){
    let res = {
        childern:[]
    }
    for(let i = 0; i < arr.length; i++){
        if(Array.isArray(arr[i])){
            // 如果遍历到的这项是数组，那么就递归
            res.children.push(transform(arr[i]))
        }else {
            // 遍历到的是number直接放进去即可
            res.childres.push({value: arr[i]})
        }
    }
    return res
}
// 测试数组
var arr = [1, 2, 3, [4, 5], [[[6], 7, 8], 9], 10];
console.log(transform(arr))
```

这里有一个更妙的思路：

转换函数写法2，参数不是`arr`这个词语，而是item，意味着现在item可能是数组，也可能是数字
即，写法1的递归次数要大大小于写法2。因为写法2中，遇见什么东西都要递归一下。

```js
function convert(item) {
  if (typeof item == 'number') {
    // 如果传进来的参数是数字
    return {
      value: item
    };
  } else if (Array.isArray(item)) {
    // 如果传进来的参数是数组
    return {
      children: item.map(_item => convert(_item))
    };
  }
}
```

#### part3:栈的思想

```
试编写“智能重复”smartRepeat函数，实现：
将3[abc]变为abcabcabc
将3[2[a]2[b]]变为aabbaabbaabb  
将2[1[a]3[b]2[3[c]4[d]]]变为abbbcccddddcccddddabbbcccddddcccdddd
```

栈的应用场景：在词法分析的时候，经常要用到栈这个数据结构

正则储备：这里仅仅介绍正则在该算法的应用

```js
// 1、match:可以匹配全部想要匹配的字符e.g.:
'abc666def123mnp'.match(/\d/g)
['6','6','6','1','2','3']
// test:判断字符串是否符合规则
/^\d/.test('abc')--->false
// 通过()来进行捕获
let a = '34[abc]'.match(/^(\d+)\[/)// 表示匹配数字并且带[的字符串，捕获结果是数字
a[1] --- >34// 捕获结果在下标为1的项上
```

实现思路：

遍历每一个字符 :保存两个栈，一个存放数字，一个存放字母

• 如果这个字符是数字，那么就把数字压栈，把空字符串压栈 

• 如果这个字符是字母，那么此时就把栈顶这项改为这个字母

 • 如果这个字符是]，那么就将数字弹栈，就把字符串栈的栈顶 的元素重复刚刚的这个次数，弹栈，拼接到新栈顶上  

实现代码：

```js
function smartRepeat(templateStr) {
  // 指针
  var index = 0
  // 栈1，存放数字
  var stack1 = []
  // 栈2，存放临时字符串
  var stack2 = []
  // 剩余部分
  var rest = templateStr

  while (index < templateStr.length - 1) {
    // 剩余部分
    rest = templateStr.substring(index)

    // 看当前剩余部分是不是以数字和[开头
    if (/^\d+\[/.test(rest)) {
      // 得到这个数字
      let times = Number(rest.match(/^(\d+)\[/)[1])
      // 就把数字压栈，把空字符串压栈
      stack1.push(times)
      stack2.push('')
      // 让指针后移，times这个数字是多少位就后移多少位加1位。
      // 为什么要加1呢？加的1位是[。
      index += times.toString().length + 1
    } else if (/^\w+\]/.test(rest)) {
      // 如果这个字符是字母，那么此时就把栈顶这项改为这个字母
      let word = rest.match(/^(\w+)\]/)[1]
      stack2[stack2.length - 1] = word
      // 让指针后移，word这个词语是多少位就后移多少位
      index += word.length
    } else if (rest[0] === ']') {
      // 如果这个字符是]，那么就①将stack1弹栈，②stack2弹栈，③把字符串栈的新栈顶的元素重复刚刚弹出的那个字符串指定次数拼接到新栈顶上。
      let times = stack1.pop()
      let word = stack2.pop()
      // repeat是ES6的方法，比如'a'.repeat(3)得到'aaa'
      stack2[stack2.length - 1] += word.repeat(times)
      index++
    }

    console.log(index, stack1, stack2)
  }

  // while结束之后，stack1和stack2中肯定还剩余1项。返回栈2中剩下的这一项，重复栈1中剩下的这1项次数，组成的这个字符串。
  return stack2[0].repeat(stack1[0])
}

var result = smartRepeat('3[2[3[a]1[b]]4[d]]')
console.log(result)
```

### 手写`ast`

`vue-loader`在编译模板过程中是以字符串的视角来对模板进行编译的，那么我们这里的目标就是将类似这种模板

```js
var templateString = `<div>
    <h3 class="aa bb cc" data-n="7" id="mybox">你好</h3>
    <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
    </ul>
</div>`;
```

转化为：

![ast1](C:\Users\梁建辉\Desktop\ast1.png)

```js
/**
 * 思路：和之前栈的算法题一样，每次有标签进栈如div，另一个栈就进一个空数组，
 * 遇到文本内容就直接拼接到stack2的栈顶即可，与到结束标签就把stack2.pop()在与其最后一个进行拼接，这样就能形成一个树的结构
 */
```

起步：

- 匹配开始标签：

```js
/^\<[a-z]+\>/.test(templateString)// 匹配
templateString.match(/^\<([a-z]+)\>/)// 捕获标签里面的内容
// 上面只能捕获纯英文的标签，不能捕获数字的标签如h3，那么
/^\<[a-z]+[1-6]\>/.test(templateString)
templateString.match(/^\<([a-z]+[1-6]?)\>/)
```

- 结束标签：

```js
/^\<\/([a-z]+[1-6]?)\>/
```

- 文字的收集：

```js
// 只解决开始标签与结束标签之间的文字，没解决结束到开始之间的文字
/^([^\<]+)\<\/[a-z]+[1-6]?\>/
```

### 实现函数：

```js
// parse函数，主函数
export default function (templateString) {
    // 指针
    var index = 0;
    // 剩余部分
    var rest = '';
    // 开始标记
    var startRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
    // 结束标记
    var endRegExp = /^\<\/([a-z]+[1-6]?)\>/;
    // 抓取结束标记前的文字
    var wordRegExp = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
    // 准备两个栈
    var stack1 = [];
    var stack2 = [{ 'children': [] }];

    while (index < templateString.length - 1) {
        rest = templateString.substring(index);
        // console.log(templateString[index]);
        if (startRegExp.test(rest)) {
            // 识别遍历到的这个字符，是不是一个开始标签
            let tag = rest.match(startRegExp)[1];
            let attrsString = rest.match(startRegExp)[2];
            // console.log('检测到开始标记', tag);
            // 将开始标记推入栈1中
            stack1.push(tag);
            // 将空数组推入栈2中
            stack2.push({ 'tag': tag, 'children': [], 'attrs': parseAttrsString(attrsString) });
            // 得到attrs字符串的长度
            const attrsStringLength = attrsString != null ? attrsString.length : 0;
            // 指针移动标签的长度加2再加attrString的长度，为什么要加2呢？因为<>也占两位
            index += tag.length + 2 + attrsStringLength;
        } else if (endRegExp.test(rest)) {
            // 识别遍历到的这个字符，是不是一个结束标签
            let tag = rest.match(endRegExp)[1];
            // console.log('检测到结束标记', tag);
            let pop_tag = stack1.pop();
            // 此时，tag一定是和栈1顶部的是相同的
            if (tag == pop_tag) {
                let pop_arr = stack2.pop();
                if (stack2.length > 0) {
                    stack2[stack2.length - 1].children.push(pop_arr);
                }
            } else {
                throw new Error(pop_tag + '标签没有封闭！！');
            }
            // 指针移动标签的长度加3，为什么要加2呢？因为</>也占3位
            index += tag.length + 3;
        } else if (wordRegExp.test(rest)) {
            // 识别遍历到的这个字符，是不是文字，并别不能是全空
            let word = rest.match(wordRegExp)[1];
            // 看word是不是全是空
            if (!/^\s+$/.test(word)) {
                // 不是全是空 
                // console.log('检测到文字', word);
                // 改变此时stack2栈顶元素中
                stack2[stack2.length - 1].children.push({ 'text': word, 'type': 3 });
            }
            // 指针移动标签的长度加3，为什么要加2呢？因为</>也占3位
            index += word.length;
        } else {
            index++;
        }
    }

    // 此时stack2就是我们之前默认放置的一项了，此时要返回这一项的children即可
    return stack2[0].children[0];
};
```

识别属性：

```js
// 把attrsString变为数组返回
export default function (attrsString) {
    if (attrsString == undefined) return [];
    console.log(attrsString);
    // 当前是否在引号内
    var isYinhao = false
    // 断点
    var point = 0;
    // 结果数组
    var result = [];

    // 遍历attrsString，而不是你想的用split()这种暴力方法
    // split并不能解决class='box aa vv'这种情况
    for (let i = 0; i < attrsString.length; i++) {
        let char = attrsString[i];
        if (char == '"') {
            isYinhao = !isYinhao;
        } else if (char == ' ' && !isYinhao) {
            // 遇见了空格，并且不在引号中
            console.log(i);
            if (!/^\s*$/.test(attrsString.substring(point, i))) {
                result.push(attrsString.substring(point, i).trim());
                point = i;
            }
        }
    }
    // 循环结束之后，最后还剩一个属性k="v"
    result.push(attrsString.substring(point).trim());

    // 下面的代码功能是，将["k=v","k=v","k=v"]变为[{name:k, value:v}, {name:k, value:v}, {name:k,value:v}];
    result = result.map(item => {
        // 根据等号拆分
        const o = item.match(/^(.+)="(.+)"$/);
        return {
            name: o[1],
            value: o[2]
        };
    });

    return result;
}
```



